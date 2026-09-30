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

import {
  ALLOW_EXPORT_ATTRIBUTE,
  PLAN_ATTRIBUTE,
  SHOW_TODAY_ATTRIBUTE,
  configurationSchema,
  readBooleanAttribute,
  uiSchema,
} from "./configuration-schema";

const ALL_ATTRIBUTES = [PLAN_ATTRIBUTE, SHOW_TODAY_ATTRIBUTE, ALLOW_EXPORT_ATTRIBUTE];

describe("configurationSchema", () => {
  it("beschreibt die drei Attribute des Widgets", () => {
    expect(Object.keys(configurationSchema.properties ?? {})).toEqual(ALL_ATTRIBUTES);
  });

  it("führt keine Überschrift als Attribut — sie steht im Plan", () => {
    // `title` ist ein globales HTML-Attribut: am Element des Bausteins zeigte
    // der Browser es als Tooltip über dem ganzen Plan.
    expect(Object.keys(configurationSchema.properties ?? {})).not.toContain("title");
  });

  it("führt den Plan als Textfeld, leer vorbelegt", () => {
    const properties = configurationSchema.properties ?? {};
    expect(properties[PLAN_ATTRIBUTE]).toMatchObject({ type: "string", title: "Plan", default: "" });
  });

  it("bietet Heute-Linie und Export als Schalter an, beide vorab an", () => {
    // Echte Felder des Dialogs statt Teil des Plans: so bleiben sie bedienbar,
    // auch wenn der injizierte Editor einmal nicht greift.
    const properties = configurationSchema.properties ?? {};
    expect(properties[SHOW_TODAY_ATTRIBUTE]).toMatchObject({
      type: "boolean",
      title: "Heute-Linie zeigen",
      default: true,
    });
    expect(properties[ALLOW_EXPORT_ATTRIBUTE]).toMatchObject({
      type: "boolean",
      title: "Excel-Export anbieten",
      default: true,
    });
  });

  it("erklärt jedes Feld im Dialog", () => {
    for (const key of ALL_ATTRIBUTES) {
      expect(uiSchema[key]?.["ui:help"]).toEqual(expect.any(String));
    }
  });
});

describe("readBooleanAttribute", () => {
  it("liest die Zeichenketten, die im Attribut stehen", () => {
    expect(readBooleanAttribute("true", false)).toBe(true);
    expect(readBooleanAttribute("false", true)).toBe(false);
  });

  it("nimmt auch echte Wahrheitswerte, wie sie `parseAttributes` liefert", () => {
    expect(readBooleanAttribute(true, false)).toBe(true);
    expect(readBooleanAttribute(false, true)).toBe(false);
  });

  it("fällt ohne Attribut auf die Vorgabe zurück", () => {
    expect(readBooleanAttribute(undefined, true)).toBe(true);
    expect(readBooleanAttribute(undefined, false)).toBe(false);
  });

  it("fällt bei allem anderen auf die Vorgabe zurück, statt zu raten", () => {
    for (const raw of ["", "ja", "1", "TRUE ", 0, null]) {
      expect(readBooleanAttribute(raw, true)).toBe(true);
      expect(readBooleanAttribute(raw, false)).toBe(false);
    }
  });
});
