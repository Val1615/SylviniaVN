import { useEffect, useState } from "react";
import { detectAtlasDevice, type AtlasDeviceProfile } from "./atlas-ui";

function readDevice(): AtlasDeviceProfile {
  if (typeof window === "undefined") return "desktop";
  const viewport = window.visualViewport;
  return detectAtlasDevice({
    width: Math.round(viewport?.width || window.innerWidth),
    height: Math.round(viewport?.height || window.innerHeight),
    coarse: window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0,
    hoverNone: window.matchMedia("(hover: none)").matches,
  });
}

export function useAdaptiveLayout(enabled: boolean): AtlasDeviceProfile {
  // Plusieurs validateurs historiques appellent Home() directement, hors rendu React.
  if (typeof window === "undefined") return "desktop";
  const [device, setDevice] = useState<AtlasDeviceProfile>(() => readDevice());

  useEffect(() => {
    if (!enabled) {
      setDevice("desktop");
      return;
    }
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setDevice(readDevice()));
    };
    const viewport = window.visualViewport;
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    viewport?.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      viewport?.removeEventListener("resize", update);
    };
  }, [enabled]);

  return device;
}
