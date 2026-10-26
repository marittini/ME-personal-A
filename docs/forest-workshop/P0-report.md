# 숲결 공방(forest-workshop) P0 연결 증명 결과

2026-10-26 · 기준 문서: 숲속 공방 독립 에이전트 최종 개발계획서 v1.6 (§10 P0, §14)
이 기록은 실제로 실행해 확인한 것만 "확인"으로 적는다. 실행하지 않은 것은 **미검증**으로 표시한다.

## 1. 기준 커밋

| 저장소 | 계획서 기준 | 실제 작업 기준 | 차이 |
|---|---|---|---|
| marittini/ME-personal-A | `f9a05f7` | `f9a05f7` (main) | 없음 |
| marittini/ME-personal (엔진) | `1f1c2f3` · 2.5.1 | `7f341f9` · 2.5.1 | 오늘 머지된 #37(perf/memory-structure)까지 포함. 버전 문자열은 동일, Capability API 1.341 동일 |

작업 브랜치: `feat/forest-workshop` (ME-personal-A). main은 건드리지 않았다. 엔진 저장소는 읽기만 했고 수정하지 않았다.

### 포크 작업 정책 (계획서 §10)

- 이 패키지는 marittini 개인 포크에서만 개발·배포한다. Pasta-Devs 업스트림에 이슈·PR·리뷰 요청·메시지를 보내지 않는다.
- 기능 브랜치(`feat/forest-workshop`)에서 단계별로 검증 후 커밋·푸시하고 원격 SHA를 기록한다. main 병합·운영 카탈로그 전환·릴리스는 소유자가 요청할 때만 한다.
- 저장소의 업스트림 문서(CONTRIBUTING의 staging 대상 PR, SpicyMarinara 승인 등)는 이 포크 작업에 적용하지 않는다.

## 2. 구현한 것 (P0 범위만)

- `packages/forest-workshop` 0.1.0 — 게임 로직 없음. 홈 탭 선언과 연결 점검 화면, 아래 라우트만 있다.
- 라우트(`/api/forest-workshop` 하위, 엔진의 privileged gate 적용)
  - `GET /p0/status` 호스트 멤버 존재 여부 · `POST /p0/probe` 연결 점검 · `GET|POST /p0/image` 주민 그림 저장 점검
- 기존 빌드 파이프라인 통합: `scripts/build-feature-packages.mjs`에 feature 정의 추가. host client/server gate, private-import boundary(`engine-boundary.json`, 목록 비어 있음), strict typecheck(`scripts/typecheck-packages.mjs`의 STRICT_RUNS) 적용.
- 포크 배포 규칙: forest-workshop ID에 한해 artifact·커버·문서 URL을 `marittini/ME-personal-A`로 생성하고, `validate-catalog.mjs`도 그 ID에만 포크 URL을 인정한다. 공식 패키지 41개의 URL·해시 검사는 그대로다(카탈로그 diff는 forest-workshop 항목 추가뿐임을 확인).
- 회귀 테스트: `npm run test:forest-workshop` (입력 바이트 검사 13건 + 번들 금지 문자열/권한 검사).

### 계획서와 다르게 한 점

- **소스 경로**: 계획서 §4의 `src/server/*`, `src/client/*` 대신 `src/engine/packages/{server,client}/src/...` 엔진 트리 배치를 썼다. 계획서가 경로를 "제안"으로 표시했고, 기존 feature 빌더·typecheck·boundary 도구가 이 배치를 전제로 하므로 도구를 고치지 않고 재사용했다.
- **카탈로그 커버**: 검증기가 512×512 PNG 커버를 요구해 단순 도형으로 직접 그린 원본 그림(`artwork/agent-covers/forest-workshop.png`)을 넣었다. 제3자 에셋 아님. 최종 아트는 P5에서 교체 대상.
- **같은 버전 artifact 재생성**: 0.1.0 artifact를 브랜치 안에서 한 번 다시 만들었다(레이아웃 수정). main·공개 카탈로그에 나간 적이 없는 미발행 버전이라 버전을 올리지 않았다.

## 3. 실행 검증 결과

검증 환경: Linux 클라우드 샌드박스, Node 24.22.1, pnpm 10.34.5, ME-personal `7f341f9` 개발 서버(`scripts/dev.mjs`), Chromium(Playwright).

| P0 항목 | 결과 | 근거 |
|---|---|---|
| 빌드·gate·타입검사 | 확인 | feature 빌드 성공(client/server host gate 통과), strict typecheck 서버 5·클라이언트 2파일 오류 0, `npm run check` 종료 0, 기준 검증 4종 통과(`test-catalog-lanes`, `validate-package-locales`, `validate-catalog` 42개, `catalog-release-notes`) |
| 패키지 활성화 | 확인 | 엔진 로그 `Activated and verified capability package forest-workshop@0.1.0`, selfCheck 통과 |
| resources.listCharacters / listPersonas | 확인 | 캐릭터 1·페르소나 1 읽음. 점검 전후 `/api/characters`, `/api/characters/personas` 응답 sha256 동일 → 원본 미변경 |
| languageModels.resolve + fitContext | 확인 | 연결 없을 때 "사용 불가"로 정직하게 표시. 더미 연결(호출 안 됨) 추가 후 통과: 컨텍스트 32000, 추정 26→26 토큰. 생성 요청은 보내지 않음. **chatComplete 실제 호출은 미검증** |
| 문서 CAS | 확인 | revision 1→2, 오래된 expectedRevision 쓰기는 `null`, 내용 불변 |
| persistence.transaction rollback | 확인 | 트랜잭션 안의 생성·갱신 모두 실패 시 되돌려짐(새 문서 없음, revision 불변) |
| revision 확인 삭제 | 확인 | 오래된 revision 삭제 거절, 현재 revision 삭제 성공, 임시 문서 잔존 0 |
| PNG 업로드 → WebP95 → global-gallery 참조 | 확인 | 투명 PNG 600×900 106KiB → WebP 28KiB, 저장 파일 hasAlpha·최소 alpha 0(투명 유지). 문서에 `global-gallery:<id>` 저장 |
| 잘못된 입력 거절 | 확인 | SVG를 .png로 바꾼 파일, APNG, 애니메이션 WebP(실제 2프레임), 5000px 폭 PNG 모두 사유별 거절, 기존 그림 유지 |
| PNG 원본 미보관 | 확인 | 데이터 디렉터리 전체에 `.png` 0개. 갤러리에는 `.webp`만 존재 |
| 참조 보호 | 확인 | 현재·이력 그림을 갤러리에서 지우려 하면 엔진이 409 `global_gallery_image_in_use`로 거절 |
| 재전송 중복 방지 | 확인 | 같은 uploadKey 재전송 시 `duplicate: true`, 새 저장 없음 |
| 동시 저장 | 확인 | 4개 동시 업로드 → revision 6·7·8·9로 모두 순차 반영, 유실 없음 |
| 재시작 후 보존 | 확인 | 엔진 재시작 후 저장된 그림 참조 유지 |
| 주민 생성 API 미호출 | 확인 | 서버·클라이언트 번들에 `avatar-generation`, `images.save/stage`, `localhost`, `/api/chats` 없음(회귀 테스트로 고정). 갤러리 접근은 호출자 자신의 인증 헤더·원격 주소로 in-process 요청 |
| 포크 카탈로그 override 설치 | 확인 | 깨끗한 엔진에 `MARINARA_AGENT_CATALOG_URL`=커밋 고정 proof 카탈로그(`p0/install-proof-catalog.json`) 지정 → 카탈로그에 forest-workshop 노출, artifact URL이 공식 주소로 재작성되지 않음 → `POST /install`(expectedVersion·expectedArtifactSha256) 성공, 잘못된 해시는 거절 → 재시작 후 `active/ready`, 점검 통과 |
| 세로 화면 배치 | 확인(하네스) | 320×568, 390×844, 1280×860, 390×844+글자 200%에서 가로 넘침 0. 처음엔 320px·200%에서 10px 넘침 발견 → 수정 후 재확인 |

## 4. P0에서 발견한 엔진 부족분 — 홈 탭이 표시되지 않음

**사실**: ME-personal(`7f341f9`)에서 `HomeBrowserHub.tsx`는 파일만 남아 있고 어디서도 import되지 않는다. 홈은 `HomeCharacterLibrary`(나의 서재)로 바뀌었다. 그래서 `home-browser-tab`을 선언한 패키지는 설치·활성화돼도 **홈에 탭이 나타나지 않는다**. 옴니바(`use-omnibar-entity-rows.ts`)는 패키지 탭을 목록에 올리지만, 선택 시 `requestHome({kind:"tab"})`를 소비하던 곳이 `HomeBrowserHub`뿐이라 열리지 않는다.

계획서 §17("P0에서 API 부족이 확인되면 근거와 최소 엔진 변경을 제시하고 다른 기능으로 우회/삭제하지 않는다")에 따라 패키지 쪽에서 우회하지 않았다. 클라이언트 동작은 실제 엔진 페이지에 엘리먼트를 직접 붙이는 **테스트 하네스**로만 확인했다(위 스크린샷 `p0/harness-390-*.png`). 이것은 실제 탭 통합의 증거가 아니다.

**제안하는 최소 엔진 변경**(엔진 저장소 별도 브랜치, 사용자 결정 필요):
1. 현재 홈(`HomeCharacterLibrary` 또는 AppShell)에서 `selectHomeBrowserPackages()`로 받은 패키지를 진입점으로 보여 준다.
2. 선택 또는 `homeRequest.kind === "tab"` 수신 시 `<CapabilityElement packageId={id} view="browser" />`를 전체 화면으로 마운트하고 뒤로 가기를 제공한다(기존 `HomeBrowserHub`의 해당 부분과 동일한 계약).
3. 제거 대상 기능 목록(`REMOVED_FEATURE_IDS`)은 그대로 두어 가챠 포지 등은 계속 숨긴다.

## 5. 미검증 (실행하지 않음)

- 실제 홈 탭 진입(엔진 부족분 때문에 불가), Android 실기기
- `chatComplete` 실제 생성 호출, 사용자 환경의 실제 모델 연결
- 패키지 버전 업데이트·제거·롤백 경로, 백업/복원 시 갤러리 ID 재매핑(P1·P6 범위)
- 패키지 제거 후 갤러리 그림 처리, 이력 3개 초과로 빠진 그림의 정리(현재는 참조만 해제되고 갤러리 파일은 남음 — P1 저장 정리에서 처리)
- 사용자 서버에서의 동작, 운영 `MARINARA_AGENT_CATALOG_URL` 전환(계획서대로 검수 후 별도 적용)
- 다크/라이트 테마별 배지 색 대비 측정

## 6. 다음 단계

1. 위 §4 엔진 변경 진행 여부 결정 → 승인 시 ME-personal 별도 브랜치에서 최소 수정 후 실제 홈 탭 진입 재검증.
2. P1 저장 기반(model/store/commands/backup) 착수.
