# 숲결 공방 0.6.2 — 그림 묶음(82개) 연결 보고

기준: 인수인계 v1.7 `Forest_Workshop_Handoff_v1_7_82Assets_r2.zip`의 `packages/forest-workshop/assets/`(그림 82개 · `asset-manifest.json` · `asset-paths.json` · `CREDITS.md`), `ASSET_APPLY_GUIDE.ko.md`, 목업 보드 01·02·04.

## 구현한 것

| 영역 | 내용 | 위치 |
| --- | --- | --- |
| 파일 | ZIP의 82개 WebP를 그대로 저장소에 추가(SHA-256 전부 manifest·CHECKSUMS와 일치 확인, 수정 없음) | `packages/forest-workshop/assets/` |
| 빌드 | builder가 `asset-paths.json`을 읽어 패키지에 싣고(`assetPaths`), WebP 82개를 `contributions.assets.paths`로 선언 — Engine은 선언된 경로만 `/api/capability-packages/forest-workshop/assets/*`로 제공 | `scripts/build-feature-packages.mjs` |
| 매핑 | 아이템 58 · 시설 5 · 계절 배경 4×(base, scene) · 감정 6 · UI 5를 한 파일에서 관리, URL은 `assetUrl()` 하나 | `client/.../app/assets.ts` |
| 계절 | 설정 → 표시 → 계절(자동 · 봄 · 여름 · 가을 · 겨울), 보는 사람별 저장. 자동은 날짜(북반구 월). 그림만 바뀌고 서버 경제·일일 한도와 무관 | `app/season.ts`, `app/preferences.ts`, `screens/settings/settings-screen.ts` |
| 로딩 | 현재 계절 base 1장과 UI 패널 3장만 미리 확인(`probeAsset`)하고, 로드된 것만 셸 클래스(`art-*`)로 켬. 목록 그림은 `loading="lazy"`. 다른 계절 배경은 CSS 규칙이 맞지 않아 요청되지 않음 | `app/assets.ts`, `app/controller.ts`, `styles-art.ts` |
| 실패 처리 | 그림이 404·경로 오류·오프라인이면 그 자리에 기존 그린 아이콘/장면으로 교체하고 같은 세션에 다시 요청하지 않음. CSS 그림은 로드 확인 전엔 켜지지 않아 빈 상자가 생기지 않음 | `assetImage`, `probeAsset` |
| 화면 | 홈: 계절 장면이 화면 위를 채우고 간판·재화·날씨가 그 위(보드 01-1). 작업·시설·창고·납품·보고: 아이템/시설 그림(테두리 없이). 모든 화면 제목: 나무 간판(title-sign) 가운데 DOM 제목. 카드·시트·대화창: paper-panel nine-slice. 큰 청록 버튼: primary-button nine-slice(작은·보조 버튼은 기존 그림). 이야기: 계절 장면 무대, 감정 기호 6종, 질문은 curiosity 기호 | `styles-art.ts`, 각 screen |
| 감정 | 서버 장면 계약을 6종(joy, affection, curiosity, fluster, inspiration, annoyance)으로 바꾸고 프롬프트 v2. 이전에 쓰인 장면의 calm·surprise·worry·thinking·shy는 읽을 때 가까운 기호로 표시(저장 데이터 변경 없음) | `domain/model/story-document.ts`, `prompts/story-scene.ts`, `story-reader.ts` |

`ui/gift.webp`는 매핑만 되어 있고 선물 기능(다음 단계)에서 씁니다. `ui/wood-panel.webp`는 맞는 자리가 정해지지 않아 아직 불러오지 않습니다.

## 검증한 것

- `npm run test:forest-workshop` 8개 묶음 통과. 새 `tests/forest-workshop-assets.regression.ts`: 파일 82개의 크기·SHA·WebP 서명, 클라이언트 매핑 = manifest 매핑(아이템 58, 시설, 계절, UI, 감정 = 서버 감정 목록), 내용의 모든 아이템·시설에 그림, 빌드 결과가 82개를 싣고 제공 선언, URL 형태, 계절 판정, 계절별로 자기 배경만 요청.
- 실제 설치 ZIP(`artifacts/forest-workshop-0.6.2.zip`)을 Engine 데이터에 풀어 활성화 → `Activated and verified capability package forest-workshop@0.6.2`.
  - `items/apple.webp`, `backgrounds/workshop-base-winter.webp`, `ui/primary-button.webp`, `emotions/joy.webp`: 200 `image/webp`, `Cache-Control: private, no-cache, must-revalidate`, ETag. `asset-manifest.json`, `../manifest.json`, 없는 파일: 404.
- 실제 Engine 화면(Playwright, 모바일 세로 390×844 · 320×568, 페이지 오류 0):
  - 홈 장면 가을 그림(1536px) 표시, `art-*` 켜짐, 요청된 배경은 가을뿐.
  - 작업 화면 아이템·시설 그림 로드, `items/wood.webp`를 일부러 404로 만들면 그린 아이콘으로 대체.
  - 시설 화면 그림, 가로 넘침 없음(홈·작업·시설·설정).
  - 설정에서 겨울 선택 → 셸 `season-winter`, 이때 겨울 base가 처음 요청되고 봄·여름은 요청되지 않음, 홈 장면·배경 겨울로 바뀜, 새로고침 뒤에도 유지.
  - 이야기 흐름(P4 회귀 전체 통과) + 질문에 curiosity 기호, 무대에 계절 장면.
- 스크린샷: `docs/forest-workshop/art/`.

## 미검증 · 남은 것

- 글자 크기 확대(200%)와 키보드가 올라온 상태의 그림 배치: **미검증**.
- 데스크톱 폭, 실제 휴대폰 기기: **미검증**(헤드리스 Chromium 모바일 뷰포트만).
- 목업과의 차이 중 그림이 없어 남은 것: 하단 메뉴·분야 탭 아이콘은 묶음에 그림이 없어 기존 선 그림 그대로입니다. 주민은 각자 올린 그림만 씁니다.
- 320px에서 제목이 긴 화면(예: 시설과 창고)의 간판 글자는 약 13px로 작아집니다.
- 24개 신규 아이템/레시피, 선물 기능은 그림만 준비됨 — 기능은 다음 단계(미구현).
