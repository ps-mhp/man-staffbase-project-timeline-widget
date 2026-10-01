/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Der Plan im Vollbild.
 *
 * Erst die Fullscreen-API: sie zeigt das Widget wirklich bildschirmfüllend,
 * ohne Kopfleiste des Browsers, und Esc beendet es dort von selbst. Wo es sie
 * nicht gibt oder der Browser ablehnt (iPhone-Safari kennt sie für Elemente
 * nicht), legt sich das Widget als Ebene über die Seite — gerendert direkt in
 * `document.body`, weil ein Vorfahr mit `transform` eine `fixed`-Ebene sonst
 * auf seine eigene Box beschränkte (dieselbe Lage wie beim Konfigurationsdialog).
 */

import { RefObject, useCallback, useEffect, useState } from "react";

export type ExpandMode = "fullscreen" | "overlay" | null;

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

function fullscreenElement(): Element | null {
  const doc = document as FullscreenDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

export interface Expanded {
  mode: ExpandMode;
  toggle: () => void;
  exit: () => void;
}

export function useExpanded(root: RefObject<HTMLElement | null>): Expanded {
  const [mode, setMode] = useState<ExpandMode>(null);

  const exit = useCallback(() => {
    if (mode === "fullscreen" && fullscreenElement() !== null) {
      const doc = document as FullscreenDocument;
      const leave = doc.exitFullscreen ?? doc.webkitExitFullscreen;
      void Promise.resolve(leave?.call(doc)).catch(() => undefined);
    }
    setMode(null);
  }, [mode]);

  const toggle = useCallback(() => {
    if (mode !== null) {
      exit();
      return;
    }
    const element = root.current as FullscreenElement | null;
    const request = element?.requestFullscreen ?? element?.webkitRequestFullscreen;
    if (element === null || request === undefined) {
      setMode("overlay");
      return;
    }
    try {
      Promise.resolve(request.call(element)).then(
        () => setMode("fullscreen"),
        () => setMode("overlay"),
      );
    } catch {
      setMode("overlay");
    }
  }, [mode, exit, root]);

  // Beendet der Browser das Vollbild (Esc, Geste, Tab-Wechsel), folgt der Zustand.
  useEffect(() => {
    if (mode !== "fullscreen") return;
    const follow = () => {
      if (fullscreenElement() !== root.current) setMode(null);
    };
    document.addEventListener("fullscreenchange", follow);
    document.addEventListener("webkitfullscreenchange", follow);
    return () => {
      document.removeEventListener("fullscreenchange", follow);
      document.removeEventListener("webkitfullscreenchange", follow);
    };
  }, [mode, root]);

  // Als Ebene: die Seite dahinter rollt nicht mit.
  useEffect(() => {
    if (mode !== "overlay") return;
    const page = document.documentElement;
    const previous = page.style.overflow;
    page.style.overflow = "hidden";
    return () => {
      page.style.overflow = previous;
    };
  }, [mode]);

  return { mode, toggle, exit };
}
