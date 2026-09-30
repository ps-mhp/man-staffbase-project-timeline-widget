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
 * Ob der Bildschirm schmal ist.
 *
 * Nicht allein in CSS zu erledigen: auf schmalen Bildschirmen werden Teile
 * anders gebaut — die Details als Blatt statt als Popover, Ansicht und Export
 * im Menü „Mehr", die Kategorien im Filter-Menü.
 */

import { useEffect, useState } from "react";

/** Unter dieser Breite gilt „schmal"; deckungsgleich mit dem Umbruch im SCSS. */
export const NARROW_QUERY = "(max-width: 767px)";

export function useNarrowViewport(): boolean {
  const [narrow, setNarrow] = useState(() => globalThis.matchMedia?.(NARROW_QUERY).matches ?? false);

  useEffect(() => {
    const query = globalThis.matchMedia?.(NARROW_QUERY);
    if (query === undefined) return;
    const update = (event: MediaQueryListEvent) => setNarrow(event.matches);
    setNarrow(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return narrow;
}
