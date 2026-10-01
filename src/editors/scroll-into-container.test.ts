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

import { scrollIntoContainer } from "./scroll-into-container";

/** Ein Bereich von 100 px Höhe bei `scrollTop`, darin ein Element von 40 px bei `offset`. */
function setup(
  scrollTop: number,
  offset: number,
): { container: HTMLElement; element: HTMLElement } {
  const container = document.createElement("div");
  const element = document.createElement("div");
  container.appendChild(element);
  container.scrollTop = scrollTop;
  Object.defineProperty(container, "clientHeight", { value: 100 });
  container.getBoundingClientRect = () => ({ top: 50, height: 100 }) as DOMRect;
  element.getBoundingClientRect = () =>
    ({ top: 50 + offset - scrollTop, height: 40 }) as DOMRect;
  return { container, element };
}

describe("scrollIntoContainer", () => {
  it("rollt nach unten, bis das Element ganz zu sehen ist", () => {
    const { container, element } = setup(0, 300);
    scrollIntoContainer(container, element);
    expect(container.scrollTop).toBe(240);
  });

  it("rollt nach oben, wenn das Element darüber liegt", () => {
    const { container, element } = setup(200, 80);
    scrollIntoContainer(container, element);
    expect(container.scrollTop).toBe(80);
  });

  it("lässt den Bereich stehen, wenn das Element schon zu sehen ist", () => {
    const { container, element } = setup(100, 120);
    scrollIntoContainer(container, element);
    expect(container.scrollTop).toBe(100);
  });
});
