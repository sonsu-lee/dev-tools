import { expect, test } from '@playwright/test';

test('presents one focused local-only encoding workflow', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'URL component encoder', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByLabel('URL component encoder workspace').getByText('encodeURIComponent()'),
  ).toBeVisible();
  await expect(page.getByText('Input stays local', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Anonymous page views and performance metrics are sent to Vercel.', {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.getByText('URL encoding is reversible. It is not encryption.')).toBeVisible();
});

test('encodes a URL component and masks both values', async ({ page }) => {
  await page.goto('/');

  const original = page.getByLabel('Original value');
  const encoded = page.getByLabel('Encoded value');

  await expect(original).toHaveAttribute('type', 'password');
  await original.fill('p@ss:word');
  await expect(encoded).toHaveValue('p%40ss%3Aword');
  await expect(encoded).toHaveAttribute('type', 'password');
});

test('shows and hides both values with one control', async ({ page }) => {
  await page.goto('/');

  const original = page.getByLabel('Original value');
  const encoded = page.getByLabel('Encoded value');
  const showValues = page.getByRole('checkbox', { name: 'Show values' });

  await original.fill('secret value');
  await showValues.check();
  await expect(original).toHaveAttribute('type', 'text');
  await expect(encoded).toHaveAttribute('type', 'text');

  await showValues.uncheck();
  await expect(original).toHaveAttribute('type', 'password');
  await expect(encoded).toHaveAttribute('type', 'password');
});

test('clears both values and restores the safe view', async ({ page }) => {
  await page.goto('/');

  const original = page.getByLabel('Original value');
  const encoded = page.getByLabel('Encoded value');
  const showValues = page.getByRole('checkbox', { name: 'Show values' });

  await original.fill('secret value');
  await showValues.check();
  await page.getByRole('button', { name: 'Clear' }).click();

  await expect(original).toHaveValue('');
  await expect(encoded).toHaveValue('');
  await expect(showValues).not.toBeChecked();
  await expect(original).toBeFocused();
});

test('copies the encoded value and clears sensitive values', async ({ page }) => {
  await page.goto('/');

  const original = page.getByLabel('Original value');
  const encoded = page.getByLabel('Encoded value');

  await original.fill('p@ss:word');
  await page.getByRole('button', { name: 'Copy encoded value' }).click();

  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('p%40ss%3Aword');
  await expect(original).toHaveValue('');
  await expect(encoded).toHaveValue('');
  await expect(original).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('Copied and cleared.');
});

test('keeps values when clipboard access fails', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          Promise.reject(new DOMException('Clipboard access denied', 'NotAllowedError')),
      },
    });
  });
  await page.goto('/');

  const original = page.getByLabel('Original value');
  const encoded = page.getByLabel('Encoded value');

  await original.fill('secret value');
  await page.getByRole('button', { name: 'Copy encoded value' }).click();

  await expect(original).toHaveValue('secret value');
  await expect(encoded).toHaveValue('secret%20value');
  await expect(original).toHaveAttribute('type', 'text');
  await expect(encoded).toHaveAttribute('type', 'text');
  await expect(page.getByRole('status')).toHaveText('Copy failed. Your values were kept.');
});

test('reports invalid Unicode without exposing a stale result', async ({ page }) => {
  await page.goto('/');

  const original = page.getByLabel('Original value');
  const encoded = page.getByLabel('Encoded value');

  await original.evaluate((element) => {
    if (!(element instanceof HTMLInputElement)) {
      throw new TypeError('Expected the original field to be an input.');
    }

    const didSetValue = Reflect.set(HTMLInputElement.prototype, 'value', '\uD800', element);
    if (!didSetValue) {
      throw new TypeError('Expected to set the input value.');
    }

    element.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await expect(encoded).toHaveValue('');
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'This value contains an invalid Unicode sequence.' }),
  ).toHaveText('This value contains an invalid Unicode sequence.');
  await expect(page.getByRole('button', { name: 'Copy encoded value' })).toBeDisabled();
});
