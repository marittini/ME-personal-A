import type { AppState } from "../../app/controller";
import { normalizeWeatherEffects } from "../../app/preferences";
import { WEATHER_ART, assetImage } from "../../app/assets";
import { h } from "../../app/dom";

/** Decorative art is confined to the scene and never intercepts input. */
export function weatherLayer(state: Pick<AppState, "weatherEffects">) {
  const preference = normalizeWeatherEffects(state.weatherEffects);
  if (!preference.enabled) return null;
  const sprite = (key: keyof typeof WEATHER_ART, className: string) =>
    assetImage(WEATHER_ART[key], { className, fallback: () => h("span") });
  return h("div", { className: `weather-layer weather-${preference.kind}`, attrs: { "aria-hidden": "true" } }, [
    preference.kind === "clear" ? sprite("sun", "weather-sun") : sprite("cloud", "weather-cloud"),
    ...(preference.kind === "rain" || preference.kind === "snow"
      ? Array.from({ length: preference.kind === "rain" ? 10 : 8 }, (_, index) => {
          const particle = h("span", { className: "weather-particle" }, [
            sprite(preference.kind === "snow" ? "snow" : "rain", "weather-sprite"),
          ]);
          particle.style.cssText = `--weather-x:${5 + ((index * 37) % 90)}%;--weather-delay:${-index * 0.47}s;--weather-duration:${preference.kind === "snow" ? 7 + (index % 3) : 2 + (index % 3)}s;--weather-top:${12 + ((index * 19) % 72)}%;`;
          return particle;
        })
      : []),
  ]);
}
