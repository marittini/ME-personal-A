import assert from "node:assert/strict";
import {
  normalizeWeatherEffects,
  readWeatherEffects,
  writeWeatherEffects,
} from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/preferences";
assert.deepEqual(normalizeWeatherEffects(null), { enabled: true, kind: "clear" });
assert.deepEqual(normalizeWeatherEffects({ enabled: false, kind: "rain" }), { enabled: false, kind: "rain" });
assert.equal(normalizeWeatherEffects({ kind: "invalid" as never }).kind, "clear");
let stored: string | null = null;
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: () => stored,
    setItem: (_key: string, value: string) => {
      stored = value;
    },
  },
});
writeWeatherEffects({ enabled: false, kind: "snow" });
assert.deepEqual(readWeatherEffects(), { enabled: false, kind: "snow" });
stored = "broken-json";
assert.deepEqual(readWeatherEffects(), { enabled: true, kind: "clear" });
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  get: () => {
    throw new Error("blocked");
  },
});
assert.doesNotThrow(() => writeWeatherEffects({ enabled: true, kind: "rain" }));
assert.deepEqual(readWeatherEffects(), { enabled: true, kind: "clear" });
console.log("Weather preference validation, persistence and blocked storage: OK");
