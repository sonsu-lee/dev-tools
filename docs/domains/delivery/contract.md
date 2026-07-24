# 전달 계약

이 문서는 변경 사항이 검증되어 Vercel 운영 환경에 전달되는 기준을
정의한다. 워크플로 구현의 세부 단계보다 반드시 지켜야 하는 경계를
우선한다.

## 변경 전달 흐름

1. 모든 변경은 별도 브랜치의 Draft PR로 시작한다.
2. 로컬 검증과 리뷰를 통과하면 PR을 Ready 상태로 전환한다.
3. `Continuous Integration Gate`와 CodeRabbit 리뷰가 통과하고 Preview가
   정상일 때만 `main`에 병합한다.
4. `main` 병합은 Continuous Deployment를 시작한다.
5. 개발 환경 검증을 통과한 동일 커밋만 운영 환경으로 진행한다.

문서만 바뀌어 특정 수동 확인의 의미가 없는 경우에는 해당 확인을
생략할 수 있지만, 자동화된 필수 검사는 생략하지 않는다.

## Continuous Integration

`main` 대상 PR이 열리거나 다시 열리고, 새 커밋이 올라오거나 Ready
상태가 되면 실행한다.

검증 순서는 다음과 같다.

```text
Formatting
  → Linting
  → Type Checking
  → Application Build
    ├─ Browser Functional Tests
    └─ Security and Accessibility Tests
      → Vercel Preview Build
      → Preview Deployment
      → Preview Smoke Test
      → Continuous Integration Gate
```

각 단계는 앞 단계가 만든 짧은 수명의 아티팩트를 전달받는다. 따라서
대시보드에서 실패 위치를 구분하면서도 이후 단계가 이미 검증된 소스와
빌드를 사용한다. 포크에서 온 PR은 저장소 Secret을 받을 수 없으므로
Preview 단계만 건너뛰고 코드 검증 결과로 Gate를 판정한다.

`Continuous Integration Gate`가 브랜치 보호의 필수 상태 확인이다.

## Continuous Deployment

`main`에 커밋이 들어오면 다음 순서로 자동 실행한다.

```text
Release Source
  → Development Build
  → Development Deployment
  → Development Smoke Test
  → Production Build
  → Production Deployment
  → Production Verification
```

개발 환경은 Vercel Preview 설정으로 후보를 만들고 배포 응답과 보안
헤더를 확인한다. 이 검증이 실패하면 운영 빌드를 시작하지 않는다.

운영 환경은 Vercel Production 설정으로 다시 빌드한다. 최종 검증은
배포가 `READY`이고 Production 대상인지, 배포 메타데이터의
`githubCommitSha`가 워크플로의 `GITHUB_SHA`와 같은지, 실제 응답과
필수 보안 헤더가 정상인지 확인한다.

CD 실행은 중간에 취소하지 않는다. 새 커밋이 들어와도 현재 배포를
마친 뒤 다음 커밋을 처리해 운영 배포 순서가 뒤집히지 않게 한다.

## 환경과 자격 증명

GitHub Environment는 `dev`, `prod`만 사용한다.

- 저장소 변수 `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`는 대상 프로젝트를
  식별한다.
- 두 Environment 모두 Secret 이름은 `VERCEL_TOKEN`이지만 값은
  환경마다 다르다.
- 토큰은 환경별로 독립 회전하고 최소 권한과 만료 기간을 유지한다.
- 현재 Vercel 토큰 발급 API가 프로젝트 범위 토큰을 지원하지 않아 두
  토큰 모두 팀 범위다. 프로젝트 범위가 지원되면 권한을 더 줄인다.
- 토큰 값은 명령 인수, 로그, 아티팩트에 기록하지 않는다.

Preview와 개발 배포는 `dev` 토큰을 사용하고, 운영 빌드·배포·검증만
`prod` 토큰을 사용한다.

## 로컬 검증

PR을 Ready로 바꾸기 전에 아래 명령을 통과시킨다.

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

문서만 변경되어 애플리케이션 동작에 영향이 없더라도 포맷 검사는
실행한다. 나머지 검사는 변경 범위에 따라 로컬에서 생략할 수 있으나
PR의 자동 CI 결과는 반드시 확인한다.

## 실패 원칙

자동 전달은 실패한 단계에서 멈추고 새 커밋으로 처음부터 검증한다.

- 어느 단계든 실패하면 이후 환경으로 진행하지 않는다.
- 실패한 아티팩트를 재사용하거나 운영 배포를 수동으로 우회하지 않는다.
- 원인을 수정한 새 커밋으로 PR 검증부터 다시 시작한다.
- 배포 완료는 Vercel CLI의 출력만으로 판단하지 않고 최종 검증 Job의
  성공으로 판단한다.
