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
 * Ein Knopf mit aufklappendem Feld — für das Filter-Menü und „Mehr".
 *
 * Kein Modal: die Seite bleibt bedienbar, und was im Feld geändert wird, wirkt
 * sofort auf den Plan dahinter. Esc und ein Klick daneben schließen; nach Esc
 * kehrt der Fokus zum Knopf zurück.
 */

import React, { ReactElement, ReactNode, useEffect, useId, useRef, useState } from "react";

export interface DisclosureProps {
  label: ReactNode;
  /** Zugänglicher Name, wenn `label` allein nicht reicht (z. B. mit Zähler). */
  ariaLabel?: string;
  className?: string;
  panelClassName?: string;
  children: ReactNode | ((close: () => void) => ReactNode);
}

export function Disclosure({ label, ariaLabel, className, panelClassName, children }: DisclosureProps): ReactElement {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      // `composedPath` reicht durch den Shadow Root des Content Designers; `contains` täte das nicht.
      if (rootRef.current !== null && !event.composedPath().includes(rootRef.current)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div
      ref={rootRef}
      className={`man-pt__disclosure${className ? ` ${className}` : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`man-pt__button${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={ariaLabel}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
      </button>
      <div id={panelId} className={`man-pt__panel${panelClassName ? ` ${panelClassName}` : ""}`} hidden={!open}>
        {open && (typeof children === "function" ? children(close) : children)}
      </div>
    </div>
  );
}
