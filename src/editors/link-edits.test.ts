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

import { Attachment, LIMITS, LinkedContent } from "../plan-model";
import {
  addAttachment,
  moveAttachment,
  removeAttachment,
  setAttachmentLabel,
  setContent,
} from "./link-edits";
import { NOW, TODAY, basePlan, expectReadable, itemById } from "./plan-edits.fixture";

const PAGE: LinkedContent = { kind: "page", id: "6abe2602f70f4a552a0470c3", menuId: "6abe2602f70f4a552a0470c4", title: "Release 3.4" };
const NEWS: LinkedContent = { kind: "news", id: "6a7b213404bf7d770c9d579a" };

const file = (mediaId: string): Attachment => ({
  mediaId,
  url: `/api/media/secure/external/v2/raw/upload/${mediaId}.pdf`,
  fileName: `${mediaId}.pdf`,
  kind: "file",
});

const firstId = (): string => basePlan().items[0].id;

describe("setContent", () => {
  it("verknüpft einen Inhalt, stempelt das Datum und bleibt lesbar", () => {
    const plan = setContent(basePlan(), firstId(), PAGE, NOW);
    expect(itemById(plan, firstId())?.content).toEqual(PAGE);
    expect(plan.updatedAt).toBe(TODAY);
    expectReadable(plan);
  });

  it("ersetzt einen Inhalt und löst ihn mit undefined ganz", () => {
    const linked = setContent(basePlan(), firstId(), PAGE, NOW);
    expect(itemById(setContent(linked, firstId(), NEWS, NOW), firstId())?.content).toEqual(NEWS);
    expect(itemById(setContent(linked, firstId(), undefined, NOW), firstId())).not.toHaveProperty("content");
  });

  it("ändert nichts an anderen Einträgen und nichts am Original", () => {
    const original = basePlan();
    const plan = setContent(original, firstId(), PAGE, NOW);
    expect(original.items[0]).not.toHaveProperty("content");
    expect(plan.items.slice(1)).toEqual(original.items.slice(1));
  });

  it("gibt den Plan unverändert zurück, wenn es den Eintrag nicht gibt", () => {
    const plan = basePlan();
    expect(setContent(plan, "gibt-es-nicht", PAGE, NOW)).toBe(plan);
  });
});

describe("Anhänge", () => {
  const attachmentsOf = (plan: ReturnType<typeof basePlan>): string[] =>
    (itemById(plan, firstId())?.attachments ?? []).map((attachment) => attachment.mediaId);

  it("hängt an, in Reihenfolge, und bleibt lesbar", () => {
    const plan = addAttachment(addAttachment(basePlan(), firstId(), file("a"), NOW), firstId(), file("b"), NOW);
    expect(attachmentsOf(plan)).toEqual(["a", "b"]);
    expect(plan.updatedAt).toBe(TODAY);
    expectReadable(plan);
  });

  it("nimmt dasselbe Medium nicht zweimal und nichts über der Grenze", () => {
    let plan = basePlan();
    for (let index = 0; index < LIMITS.attachments; index += 1) plan = addAttachment(plan, firstId(), file(`m${index}`), NOW);
    expect(addAttachment(plan, firstId(), file("zu-viel"), NOW)).toBe(plan);
    expect(addAttachment(plan, firstId(), file("m0"), NOW)).toBe(plan);
  });

  it("beschriftet, und leer heißt: wieder der Dateiname", () => {
    const withFile = addAttachment(basePlan(), firstId(), file("a"), NOW);
    const labelled = setAttachmentLabel(withFile, firstId(), "a", "  Ablaufplan  ", NOW);
    expect(itemById(labelled, firstId())?.attachments?.[0].label).toBe("Ablaufplan");
    expect(itemById(setAttachmentLabel(labelled, firstId(), "a", "   ", NOW), firstId())?.attachments?.[0]).not.toHaveProperty("label");
  });

  it("verschiebt an eine Stelle und begrenzt die Stelle auf die Liste", () => {
    let plan = basePlan();
    for (const id of ["a", "b", "c"]) plan = addAttachment(plan, firstId(), file(id), NOW);
    expect(attachmentsOf(moveAttachment(plan, firstId(), "c", 0, NOW))).toEqual(["c", "a", "b"]);
    expect(attachmentsOf(moveAttachment(plan, firstId(), "a", 99, NOW))).toEqual(["b", "c", "a"]);
    expect(attachmentsOf(moveAttachment(plan, firstId(), "b", -5, NOW))).toEqual(["b", "a", "c"]);
  });

  it("entfernt und lässt die Liste ganz weg, wenn nichts bleibt", () => {
    const plan = addAttachment(basePlan(), firstId(), file("a"), NOW);
    expect(itemById(removeAttachment(plan, firstId(), "a", NOW), firstId())).not.toHaveProperty("attachments");
  });

  it("gibt den Plan unverändert zurück, wenn es Eintrag oder Anhang nicht gibt", () => {
    const plan = addAttachment(basePlan(), firstId(), file("a"), NOW);
    expect(removeAttachment(plan, firstId(), "x", NOW)).toBe(plan);
    expect(moveAttachment(plan, "gibt-es-nicht", "a", 0, NOW)).toBe(plan);
    expect(setAttachmentLabel(plan, firstId(), "x", "y", NOW)).toBe(plan);
  });
});
