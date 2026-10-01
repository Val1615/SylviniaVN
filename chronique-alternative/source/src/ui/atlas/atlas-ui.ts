export type UiStyle = "cinematic" | "balanced" | "compact" | "complete";
export type AccentTone = "imperial" | "crimson" | "violet" | "ice";
export type TouchNavigation = "auto" | "side" | "bottom";

export type AtlasUiSettings = {
  uiStyle: UiStyle;
  uiScale: number;
  panelOpacity: number;
  backgroundDim: number;
  accentTone: AccentTone;
  secondaryDetails: boolean;
  monumentalTitles: boolean;
  highContrastText: boolean;
  decorativeGrain: boolean;
  statusBar: boolean;
  adaptiveLayout: boolean;
  touchNavigation: TouchNavigation;
};

export type AtlasDeviceProfile =
  | "desktop"
  | "phone-portrait"
  | "phone-landscape"
  | "fold-portrait"
  | "fold-landscape"
  | "tablet-touch";

export type AtlasViewport = {
  width: number;
  height: number;
  coarse: boolean;
  hoverNone: boolean;
};

export const UI_STYLE_ORDER: UiStyle[] = ["cinematic", "balanced", "compact", "complete"];

export const UI_STYLE_META: Record<UiStyle, { glyph: string; label: string; detail: string }> = {
  cinematic: { glyph: "◌", label: "Cinématique", detail: "Décor prioritaire, HUD minimal." },
  balanced: { glyph: "◐", label: "Équilibré", detail: "Lecture claire et informations utiles." },
  compact: { glyph: "▦", label: "Compact", detail: "Densité accrue sans réduire les zones tactiles." },
  complete: { glyph: "≡", label: "Complet", detail: "Contexte, métadonnées et navigation nommée." },
};

export const DEFAULT_ATLAS_UI_SETTINGS: AtlasUiSettings = {
  uiStyle: "balanced",
  uiScale: 100,
  panelOpacity: 58,
  backgroundDim: 45,
  accentTone: "imperial",
  secondaryDetails: true,
  monumentalTitles: true,
  highContrastText: false,
  decorativeGrain: true,
  statusBar: true,
  adaptiveLayout: true,
  touchNavigation: "auto",
};

function clamp(value: unknown, minimum: number, maximum: number, fallback: number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(maximum, Math.max(minimum, numeric)) : fallback;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? value as T : fallback;
}

function booleanOr(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeAtlasUiSettings(raw: unknown): AtlasUiSettings {
  const source = raw && typeof raw === "object" ? raw as Partial<AtlasUiSettings> : {};
  return {
    uiStyle: oneOf(source.uiStyle, UI_STYLE_ORDER, DEFAULT_ATLAS_UI_SETTINGS.uiStyle),
    uiScale: clamp(source.uiScale, 78, 125, DEFAULT_ATLAS_UI_SETTINGS.uiScale),
    panelOpacity: clamp(source.panelOpacity, 18, 92, DEFAULT_ATLAS_UI_SETTINGS.panelOpacity),
    backgroundDim: clamp(source.backgroundDim, 0, 70, DEFAULT_ATLAS_UI_SETTINGS.backgroundDim),
    accentTone: oneOf(source.accentTone, ["imperial", "crimson", "violet", "ice"] as const, DEFAULT_ATLAS_UI_SETTINGS.accentTone),
    secondaryDetails: booleanOr(source.secondaryDetails, DEFAULT_ATLAS_UI_SETTINGS.secondaryDetails),
    monumentalTitles: booleanOr(source.monumentalTitles, DEFAULT_ATLAS_UI_SETTINGS.monumentalTitles),
    highContrastText: booleanOr(source.highContrastText, DEFAULT_ATLAS_UI_SETTINGS.highContrastText),
    decorativeGrain: booleanOr(source.decorativeGrain, DEFAULT_ATLAS_UI_SETTINGS.decorativeGrain),
    statusBar: booleanOr(source.statusBar, DEFAULT_ATLAS_UI_SETTINGS.statusBar),
    adaptiveLayout: booleanOr(source.adaptiveLayout, DEFAULT_ATLAS_UI_SETTINGS.adaptiveLayout),
    touchNavigation: oneOf(source.touchNavigation, ["auto", "side", "bottom"] as const, DEFAULT_ATLAS_UI_SETTINGS.touchNavigation),
  };
}

export function nextUiStyle(current: UiStyle): UiStyle {
  const index = UI_STYLE_ORDER.indexOf(current);
  return UI_STYLE_ORDER[(index + 1) % UI_STYLE_ORDER.length];
}

export function detectAtlasDevice(viewport: AtlasViewport): AtlasDeviceProfile {
  const width = Math.max(1, viewport.width);
  const height = Math.max(1, viewport.height);
  const landscape = width > height;
  const touchLike = viewport.coarse || viewport.hoverNone;

  if ((width < 600 || (landscape && height <= 520)) && landscape) return "phone-landscape";
  if (width < 600) return "phone-portrait";
  if (touchLike && landscape && (height < 720 || width <= 1100)) return "fold-landscape";
  if (touchLike && width <= 950) return "fold-portrait";
  if (touchLike) return "tablet-touch";
  return "desktop";
}

export function atlasCssVariables(settings: AtlasUiSettings): Record<string, string> {
  return {
    "--atlas-ui-scale": String(settings.uiScale / 100),
    "--atlas-font-scale": "1",
    "--atlas-panel-alpha": String(settings.panelOpacity / 100),
    "--atlas-scene-dim": String(settings.backgroundDim / 100),
  };
}
