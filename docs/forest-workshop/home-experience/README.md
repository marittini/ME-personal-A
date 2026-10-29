# Home experience checkpoint — 0.6.15

The first implementation batch preserves resident scene identity and CSS animation clocks across home refreshes. Resident travel and facing now share an 18-second cycle; body deformation accompanies travel. Touch pauses travel and shows a musical reaction with an explicit profile action. This is local visual feedback, not generated dialogue. Existing resident pictures remain unchanged.

The package requests fullscreen for its own custom element on pointerdown when supported. Browser user-activation restrictions remain; this does not establish automatic entry from the Engine banner, Android system-bar hiding, installed PWA behavior or fullscreen on unsupported platforms.

Validation: package build, 15 server/domain regression suites, strict server/client type checks, format/lint, catalog lanes, locales, release notes and ZIP hashes passed. The updated Chromium fixture checks five seconds of real-time no-touch motion, body deformation, touch feedback before profile navigation and reduced motion. Original complete mockup files were not found; design fidelity and actual Android motion remain unverified. Repository issues are disabled, so ownership and proof are recorded in this note and the PR.
