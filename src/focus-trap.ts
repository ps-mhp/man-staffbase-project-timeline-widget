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
 * Fokus in modalen Dialogen: drinnen halten, beim Schließen zurückgeben.
 *
 * Ein Dialog mit `aria-modal` verspricht Screenreadern, dass dahinter nichts
 * erreichbar ist; ohne Falle käme man mit Tab trotzdem hin. Und wer ihn
 * schließt, soll dort weitermachen, wo er ihn geöffnet hat, statt am Anfang
 * der Seite.
 */

import { KeyboardEvent, useEffect } from "react";

const FOCUSABLE = "button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])";

/** Das fokussierte Element — auch im Shadow Root des Content Designers. */
function activeElementOf(node: Node): Element | null {
  const root = node.getRootNode() as Document | ShadowRoot;
  return root.activeElement ?? null;
}

/** Hält Tab und Shift+Tab in `event.currentTarget`. */
export function trapTab(event: KeyboardEvent<HTMLElement>): void {
  if (event.key !== "Tab") return;
  const focusables = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = activeElementOf(event.currentTarget);
  if (event.shiftKey && (active === first || active === event.currentTarget)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Merkt sich beim Öffnen, wo der Fokus stand, und gibt ihn beim Schließen
 * dorthin zurück — sofern das Element noch da ist.
 */
export function useReturnFocus(active: boolean = true): void {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;
    // Im Content Designer ist `document.activeElement` nur der Shadow Host;
    // das eigentliche Element steckt eine Ebene tiefer.
    let opener: Element | null = document.activeElement;
    while (opener?.shadowRoot?.activeElement) opener = opener.shadowRoot.activeElement;
    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [active]);
}
