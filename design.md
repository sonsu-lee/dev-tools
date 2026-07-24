# Dev Tools 디자인

첫 화면은 문자열 하나를 JavaScript의 `encodeURIComponent()`로
변환하는 작은 개발자 도구다. 제품 동작의 규범적 기준은
[`docs/domains/url-encoder/contract.md`](docs/domains/url-encoder/contract.md)에
둔다.

## 제품 원칙

- 한 화면에서 입력, 확인, 복사, 초기화를 끝낸다.
- 입력값을 서버, URL, 브라우저 저장소, 로그로 보내지 않는다.
- URL 인코딩을 암호화라고 표현하지 않는다.
- 아직 만들지 않은 도구를 위한 탐색이나 대시보드를 만들지 않는다.

## 화면

```text
dev/tools                                      Local only

URL component encoder
Encode a string with JavaScript’s encodeURIComponent().

Original value
[ masked input ]

Encoded value
[ masked result ]

[ Show values ]                         [ Clear ] [ Copy ]

[ status ]

Your input is processed in this tab and is not sent to our server
or browser storage. Copying places the encoded value on your
system clipboard.

URL encoding is reversible. It is not encryption.
```

- 입력은 첫 버전에서 단일 행 문자열만 지원한다.
- 원문과 결과는 기본적으로 마스킹한다.
- `Show values` 하나가 원문과 결과를 함께 공개한다.
- Copy에는 공개가 필요하지 않다.
- 복사 성공 후 값을 지우고 입력으로 포커스를 돌린다.
- 복사 실패 시 값을 유지하고 수동 복사 방법을 알린다.
- 탭 전환만으로 값을 지우지 않는다.

## 시각 방향

Linear의 정밀한 다크 UI를 기본으로 하고 Apple Liquid Glass의 재질
원칙은 보조 표면에만 제한적으로 사용한다. Apple UI Kit 자산,
아이콘, 컴포넌트, San Francisco 폰트는 복사하지 않는다.

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| Void | `#08090A` | 페이지 배경 |
| Panel | `#101113` | 작업 패널 |
| Raised | `#17181B` | 입력과 결과 |
| Decorative line | `#292B2F` | 장식 구분선 |
| Control boundary | `#666970` | 컨트롤 경계 |
| Text | `#F7F8F8` | 기본 텍스트 |
| Muted | `#8A8F98` | 보조 텍스트 |
| Signal | `#C9F05A` | 포커스와 기본 액션 |
| Danger | `#F97066` | 오류 |
| Glass fill | `rgba(23, 24, 27, 0.72)` | 보조 표면 |

글래스는 `Local only`, Show values, Clear, 상태 표면에만 적용한다.
메인 패널, 입력, 결과, Copy 버튼, 포커스, 오류는 불투명하게
유지한다.

지원 환경에서는 다음 효과만 사용한다.

```css
backdrop-filter: blur(16px) saturate(115%);
```

블러가 없어도 의미, 대비, 포커스, 기능이 같아야 한다. 중첩된
backdrop filter, WebGL, Canvas, 센서, 커서 추적 반사광, JavaScript
굴절 효과는 사용하지 않는다.

## 접근성

목표는 WCAG 2.2 Level AA다.

- 일반 텍스트 대비는 `4.5:1` 이상이다.
- 컨트롤 경계와 포커스 대비는 `3:1` 이상이다.
- 포커스는 `2px` Signal 외곽선과 `2px` 간격으로 표시한다.
- 모든 버튼의 대상 크기는 최소 `44 × 44` CSS px다.
- 입력 레이블은 항상 표시한다.
- 결과는 공개 상태에서 선택할 수 있다.
- 성공과 실패는 `role="status"`로 알리고 색상에만 의존하지 않는다.
- `320` CSS px에서 가로 스크롤이 없어야 한다.
- `200%` 확대에서 내용과 기능이 잘리지 않아야 한다.

다음 사용자 설정에서는 불투명한 기본 표면을 사용한다.

- `prefers-reduced-transparency: reduce`
- `prefers-contrast: more`
- `forced-colors: active`
- `prefers-reduced-motion: reduce`

## 참고

- [Linear](https://linear.app/)
- [Raycast](https://www.raycast.com/)
- [1Password Password Generator](https://1password.com/password-generator)
- [Apple Human Interface Guidelines: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple Design Resources License](https://developer.apple.com/support/downloads/terms/apple-design-resources/Apple-Design-Resources-License-20230621-English.pdf)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/)
