# Dev Tools

브라우저에서 바로 사용하는 작은 개발자 도구 모음이다. 현재 제공하는
기능은 문자열을 JavaScript의 `encodeURIComponent()`와 같은 결과로
변환하는 URL 컴포넌트 인코더다.

URL 인코딩은 암호화가 아니며 결과에서 원문을 복원할 수 있다.

## URL 컴포넌트 인코더

- 입력값과 결과를 기본적으로 마스킹한다.
- 입력과 결과는 현재 탭의 메모리에서만 처리한다.
- URL, 쿠키, 브라우저 저장소, 애플리케이션 서버로 값을 보내지 않는다.
- 복사에 성공하면 화면의 값을 즉시 지운다.
- 복사에 실패하면 값을 유지하고 공개해 수동 복사할 수 있게 한다.
- `encodeURIComponent()`가 처리할 수 없는 Unicode 입력은 원문을
  유지한 채 오류로 표시한다.

시스템 클립보드에 복사된 값은 브라우저와 운영체제가 관리하므로
애플리케이션이 이후의 수명이나 삭제를 보장하지 않는다.

## 로컬 실행

요구 사항:

- Node.js `^20.19.0` 또는 `>=22.12.0`
- Corepack

```bash
corepack enable
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000)을 연다.

## 검증 명령

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

`pnpm test`는 프로덕션 빌드를 실행한 뒤 Chromium에서 기능,
클립보드 실패 처리, CSP와 보안 헤더, 브라우저 저장소와 네트워크 사용,
axe 접근성 검사, 320 CSS px 레이아웃을 확인한다.

## 구조

```text
src/
├── app/                  # 페이지, 레이아웃, 전역 스타일
├── features/url-encoder/ # URL 인코더 UI와 클라이언트 동작
└── proxy.ts              # 요청별 nonce와 Content Security Policy

docs/
├── domains/url-encoder/contract.md # 제품 동작과 보안 계약
└── frontend/state-management.md    # 프런트엔드 상태 관리 기준

tests/e2e/                # Playwright 기능·보안·접근성 테스트
```

URL 인코더는 소수의 독립적인 로컬 UI 상태만 필요하므로 React 상태를
사용하고, 인코딩 결과와 오류는 입력에서 즉시 파생한다. 다단계 상태 전이와
공유 워크플로가 구체적으로 필요해지면 XState를, 서버 데이터와 캐시·신선도
관리가 필요해지면 TanStack Query 도입을 검토한다. 두 패키지는 기본 의존성이
아니며 제품 요구가 있을 때만 설치한다. 상태 관리 기준은
[프런트엔드 상태 관리 문서](docs/frontend/state-management.md)에 정리했다.

## 보안 경계

프로덕션 페이지는 Next.js Proxy에서 요청마다 nonce를 만들고 strict
CSP를 적용한다. `connect-src 'self'`, `object-src 'none'`,
`frame-ancestors 'none'`을 유지하며 런타임 외부 자산과 서버 변환
API를 사용하지 않는다.

nonce 적용을 위해 페이지는 동적으로 렌더링된다. 최초 문서와 자체
호스팅된 정적 자산은 서버에서 받지만, 페이지가 준비된 뒤 입력·표시·
복사·초기화 과정에서 사용자 값으로 네트워크 요청을 만들지 않는다.
Vercel의 기본 Web Analytics와 Speed Insights 컴포넌트는 동일 출처로
페이지뷰와 성능 데이터를 전송하지만 입력값과 인코딩 결과는 전달하지
않는다.

세부 계약은 [URL 컴포넌트 인코더 계약](docs/domains/url-encoder/contract.md),
시각 기준은 [디자인 문서](design.md)를 따른다.

## Vercel 배포

GitHub Actions는 포맷, 린트, 타입 검사, 빌드, Playwright 테스트를
실행한다. Vercel Git integration은 PR마다 Preview 배포를 만들고, `main`에
병합된 뒤 Production 배포를 만든다. 따라서 이 저장소에는 Vercel CLI
배포 작업, 토큰, 아티팩트 전달이 필요하지 않다.
