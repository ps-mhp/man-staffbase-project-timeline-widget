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

import * as React from "react";
import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import type { MediaPickerProps, PickedMedia } from "@shared/media/media-picker";

import { Attachment, LIMITS, Plan } from "../plan-model";
import { AttachmentsField } from "./attachments-field";
import { basePlan } from "./plan-edits.fixture";

const PDF: PickedMedia = {
  id: "m-pdf",
  url: "/api/media/secure/external/v2/raw/upload/plan.pdf",
  fileName: "Plan.pdf",
  kind: "file",
  alt: "Plan.pdf",
  bytes: 2048,
};
const PNG: PickedMedia = {
  id: "m-png",
  url: "/api/media/secure/external/v2/image/upload/bild.png",
  fileName: "bild.png",
  kind: "image",
  alt: "bild.png",
  width: 800,
  height: 600,
};

let mockPickerProps: MediaPickerProps | null = null;
let mockNextPick: PickedMedia = PDF;

// Der echte Picker spricht mit der Medienbibliothek; hier zählt nur, wie er
// geöffnet wird und was er zurückgibt.
jest.mock("@shared/media/media-picker", () => ({
  MediaPicker: (props: MediaPickerProps) => {
    mockPickerProps = props;
    return (
      <div role="dialog" aria-label="Staffbase Medien">
        <button type="button" onClick={() => props.onSelect(mockNextPick)}>
          Wählen
        </button>
        <button type="button" onClick={props.onClose}>
          Schließen
        </button>
      </div>
    );
  },
}));

const file = (mediaId: string): Attachment => ({
  mediaId,
  url: `/api/media/secure/external/v2/raw/upload/${mediaId}.pdf`,
  fileName: `${mediaId}.pdf`,
  kind: "file",
});

function Harness({ attachments, onChange }: { attachments?: Attachment[]; onChange?: (plan: Plan) => void }) {
  const [plan, setPlan] = useState<Plan>(() => {
    const initial = basePlan();
    return attachments === undefined
      ? initial
      : { ...initial, items: initial.items.map((item, index) => (index === 0 ? { ...item, attachments } : item)) };
  });
  return (
    <AttachmentsField
      plan={plan}
      item={plan.items[0]}
      onPlanChange={(next) => {
        onChange?.(next);
        setPlan(next);
      }}
    />
  );
}

const lastAttachments = (onChange: jest.Mock): Attachment[] | undefined =>
  (onChange.mock.calls[onChange.mock.calls.length - 1][0] as Plan).items[0].attachments;

beforeEach(() => {
  mockPickerProps = null;
  mockNextPick = PDF;
});

describe("AttachmentsField", () => {
  it("sagt ohne Anhänge, dass es keine gibt, und bietet das Hinzufügen an", () => {
    render(<Harness />);
    expect(screen.getByText("Keine Anhänge.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Datei oder Bild hinzufügen …" })).toBeEnabled();
  });

  it("öffnet die Medienbibliothek für alle Dateien, ohne zu veröffentlichen", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Datei oder Bild hinzufügen …" }));
    expect(screen.getByRole("dialog", { name: "Staffbase Medien" })).toBeInTheDocument();
    expect(mockPickerProps).toEqual(expect.objectContaining({ accept: "all", publish: false }));
  });

  it("hängt die gewählte Datei an und schließt die Bibliothek", () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Datei oder Bild hinzufügen …" }));
    fireEvent.click(screen.getByRole("button", { name: "Wählen" }));

    expect(lastAttachments(onChange)).toEqual([
      { mediaId: "m-pdf", url: PDF.url, fileName: "Plan.pdf", kind: "file" },
    ]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Anhänge" })).toHaveTextContent("Plan.pdf");
  });

  it("übernimmt bei Bildern die Maße", () => {
    mockNextPick = PNG;
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Datei oder Bild hinzufügen …" }));
    fireEvent.click(screen.getByRole("button", { name: "Wählen" }));
    expect(lastAttachments(onChange)).toEqual([
      { mediaId: "m-png", url: PNG.url, fileName: "bild.png", kind: "image", width: 800, height: 600 },
    ]);
  });

  it("sagt, wenn die Datei schon anhängt, statt sie doppelt zu nehmen", () => {
    const onChange = jest.fn();
    render(<Harness attachments={[{ mediaId: "m-pdf", url: PDF.url, fileName: "Plan.pdf", kind: "file" }]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Datei oder Bild hinzufügen …" }));
    fireEvent.click(screen.getByRole("button", { name: "Wählen" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("„Plan.pdf“ hängt schon an.")).toBeInTheDocument();
  });

  it("beschriftet einen Anhang", () => {
    const onChange = jest.fn();
    render(<Harness attachments={[file("a")]} onChange={onChange} />);
    // Das Label ist nur für Screenreader da; sichtbar sagt der Platzhalter, wofür das Feld ist.
    expect(screen.getByLabelText("Beschriftung von „a.pdf“")).toHaveAttribute("placeholder", "Beschriftung (optional)");
    fireEvent.change(screen.getByLabelText("Beschriftung von „a.pdf“"), { target: { value: "Ablaufplan" } });
    expect(lastAttachments(onChange)?.[0].label).toBe("Ablaufplan");
  });

  it("verschiebt Anhänge — der erste nicht nach oben, der letzte nicht nach unten", () => {
    const onChange = jest.fn();
    render(<Harness attachments={[file("a"), file("b"), file("c")]} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "„a.pdf“ nach oben" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "„c.pdf“ nach unten" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "„a.pdf“ nach unten" }));
    expect(lastAttachments(onChange)?.map((entry) => entry.mediaId)).toEqual(["b", "a", "c"]);
    fireEvent.click(screen.getByRole("button", { name: "„c.pdf“ nach oben" }));
    expect(lastAttachments(onChange)?.map((entry) => entry.mediaId)).toEqual(["b", "c", "a"]);
  });

  it("entfernt einen Anhang", () => {
    const onChange = jest.fn();
    render(<Harness attachments={[file("a"), file("b")]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "„a.pdf“ entfernen" }));
    expect(lastAttachments(onChange)?.map((entry) => entry.mediaId)).toEqual(["b"]);
    expect(within(screen.getByRole("list", { name: "Anhänge" })).getAllByRole("listitem")).toHaveLength(1);
  });

  it("sperrt das Hinzufügen an der Grenze und sagt warum", () => {
    const full = Array.from({ length: LIMITS.attachments }, (_, index) => file(`m${index}`));
    render(<Harness attachments={full} />);
    expect(screen.getByRole("button", { name: "Datei oder Bild hinzufügen …" })).toBeDisabled();
    expect(screen.getByText(`Höchstens ${LIMITS.attachments} Anhänge je Eintrag.`)).toBeInTheDocument();
  });
});
