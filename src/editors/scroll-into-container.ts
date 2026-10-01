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
 * Holt ein Element in einem rollenden Bereich in Sicht — und nur dort.
 *
 * `scrollIntoView` rollte auch jeden Vorfahren, der rollen kann, einschließlich
 * der mit `overflow: hidden`: das Modal um den Editor verschöbe sich, und die
 * Kopfleiste wanderte aus dem Bild, ohne dass ein Mausrad sie zurückholte.
 * Hier bewegt sich nur `container`, und nur so weit wie nötig.
 */
export function scrollIntoContainer(
  container: HTMLElement,
  element: HTMLElement,
): void {
  const box = container.getBoundingClientRect();
  const target = element.getBoundingClientRect();
  const top = target.top - box.top + container.scrollTop;
  const bottom = top + target.height;
  if (top < container.scrollTop) {
    container.scrollTop = top;
  } else if (bottom > container.scrollTop + container.clientHeight) {
    container.scrollTop = bottom - container.clientHeight;
  }
}
