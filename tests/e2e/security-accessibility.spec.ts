import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('serves a nonce-based CSP and restrictive security headers', async ({ page }) => {
  const response = await page.goto('/');
  const headers = response?.headers();
  const csp = headers?.['content-security-policy'];

  expect(csp).toContain("default-src 'self'");
  expect(csp).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/u);
  expect(csp).toMatch(/style-src 'self' 'nonce-[^']+'/u);
  const connectSource = csp
    ?.split(';')
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith('connect-src '));
  expect(connectSource).toBe("connect-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).not.toContain("'unsafe-inline'");
  expect(csp).not.toContain("'unsafe-eval'");

  const noncePrefix = "script-src 'self' 'nonce-";
  const initialNonce = csp?.split(noncePrefix)[1]?.split("'")[0];
  const reloadedResponse = await page.reload();
  const reloadedCsp = reloadedResponse?.headers()['content-security-policy'];
  const reloadedNonce = reloadedCsp?.split(noncePrefix)[1]?.split("'")[0];

  expect(initialNonce).toBeTruthy();
  expect(reloadedNonce).toBeTruthy();
  expect(reloadedNonce).not.toBe(initialNonce);

  expect(headers?.['referrer-policy']).toBe('no-referrer');
  expect(headers?.['x-content-type-options']).toBe('nosniff');
  expect(headers?.['permissions-policy']).toContain('camera=()');
});

test('has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test('loads Vercel Speed Insights from the same origin', async ({ page }) => {
  await page.goto('/');

  const script = page.locator('script[data-sdkn="@vercel/speed-insights/next"]');
  const source = await script.getAttribute('src');

  expect(source).toBeTruthy();
  expect(new URL(source ?? '', page.url()).origin).toBe(new URL(page.url()).origin);
  expect(new URL(source ?? '', page.url()).pathname).toMatch(/\/script(?:\.debug)?\.js$/u);
});

test('does not send or persist input values while the tool is used', async ({ page }) => {
  const requests: Promise<{ body: string | null; headers: Record<string, string>; url: string }>[] =
    [];
  const webSocketTraffic: string[] = [];

  page.on('request', (request) =>
    requests.push(
      request.allHeaders().then((headers) => ({
        body: request.postData(),
        headers,
        url: request.url(),
      })),
    ),
  );
  page.on('websocket', (webSocket) => {
    webSocketTraffic.push(webSocket.url());
    webSocket.on('framesent', ({ payload }) => webSocketTraffic.push(payload.toString()));
    webSocket.on('framereceived', ({ payload }) => webSocketTraffic.push(payload.toString()));
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const originalValue = 'do not send:@';
  const encodedValue = 'do%20not%20send%3A%40';

  await page.getByLabel('Original value').fill(originalValue);
  await page.getByRole('checkbox', { name: 'Show values' }).check();
  await page.getByRole('button', { name: 'Copy encoded value' }).click();

  const networkTraffic = await Promise.all(requests);
  const serializedTraffic = JSON.stringify({
    cookies: await page.context().cookies(),
    networkTraffic,
    webSocketTraffic,
  });

  expect(serializedTraffic).not.toContain(originalValue);
  expect(serializedTraffic).not.toContain(encodedValue);
  expect(
    networkTraffic.every(({ url }) => new URL(url).origin === new URL(page.url()).origin),
  ).toBe(true);
  await expect(page).toHaveURL('/');
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const cacheNames = await caches.keys();
        const databases = await indexedDB.databases();

        return {
          cacheNames,
          indexedDatabaseNames: databases.map(({ name }) => name),
          localStorageLength: localStorage.length,
          sessionStorageLength: sessionStorage.length,
        };
      }),
    )
    .toEqual({
      cacheNames: [],
      indexedDatabaseNames: [],
      localStorageLength: 0,
      sessionStorageLength: 0,
    });
});

test('keeps the workflow usable at 320 CSS pixels', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'URL component encoder' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy encoded value' })).toBeVisible();

  const layout = await page.evaluate(() => ({
    clearHeight:
      document.querySelector<HTMLButtonElement>('button')?.getBoundingClientRect().height ?? 0,
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.innerWidth);
  expect(layout.clearHeight).toBeGreaterThanOrEqual(44);
});
