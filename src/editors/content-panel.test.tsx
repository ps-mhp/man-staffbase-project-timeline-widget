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

import { LinkedContent, Plan } from "../plan-model";
import { ContentPanel } from "./content-panel";
import { basePlan } from "./plan-edits.fixture";
import { resetStaffbaseCatalogs } from "./staffbase-catalog";

const P1 = "6abe2602f70f4a552a0470c3";
const M1 = "6abe2602f70f4a552a0470c4";
const P2 = "6abe2602f70f4a552a0470d3";
const M2 = "6abe2602f70f4a552a0470d4";
const C1 = "694286093b24954a255fc942";
const C2 = "6a6a1e3990b46e307b1d7112";
const N1 = "6a7b213404bf7d770c9d5791";
const N2 = "6a7b213404bf7d770c9d5792";
const N3 = "6a7b213404bf7d770c9d5793";

const json = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

function mockStaffbase(pages: unknown[] = [
  { id: P1, menuId: M1, localization: { de_DE: { title: "Release 3.4" } } },
  { id: P2, menuId: M2, localization: { de_DE: { title: "Messeplan" } } },
]): jest.SpyInstance {
  return jest.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    if (url.startsWith("/api/branch/pages/search")) return json({ entries: pages });
    if (url.startsWith("/api/channels")) {
      return json({
        data: [
          { id: C1, pluginID: "news", config: { contentType: "articles", localization: { de_DE: { title: "Truck News" } } } },
          { id: C2, pluginID: "news", config: { contentType: "updates", localization: { de_DE: { title: "Kurz" } } } },
        ],
      });
    }
    if (url.startsWith("/api/branch/posts")) {
      return json({
        data: [
          { id: N1, channelID: C1, published: "2026-09-01T08:00:00Z", contents: { de_DE: { title: "Freigabe" } } },
          { id: N2, channelID: C1, contents: { de_DE: { title: "In <em>Arbeit</em>" } } },
          { id: N3, channelID: C2, published: "2026-09-02T08:00:00Z", contents: { de_DE: { content: "<p>Kurzmeldung zum Release</p>" } } },
        ],
      });
    }
    return new Response("", { status: 404 });
  });
}

function Harness({ content, onChange }: { content?: LinkedContent; onChange?: (plan: Plan) => void }) {
  const [plan, setPlan] = useState<Plan>(() => {
    const initial = basePlan();
    return content === undefined ? initial : { ...initial, items: initial.items.map((item, index) => (index === 0 ? { ...item, content } : item)) };
  });
  const item = plan.items[0];
  return (
    <ContentPanel
      plan={plan}
      item={item}
      onPlanChange={(next) => {
        onChange?.(next);
        setPlan(next);
      }}
    />
  );
}

const lastContent = (onChange: jest.Mock): LinkedContent | undefined =>
  (onChange.mock.calls[onChange.mock.calls.length - 1][0] as Plan).items[0].content;

const optionTexts = (select: HTMLElement): string[] => within(select).getAllByRole("option").map((option) => option.textContent ?? "");

beforeEach(() => {
  resetStaffbaseCatalogs();
  document.documentElement.setAttribute("lang", "de-DE");
});
afterEach(() => jest.restoreAllMocks());

describe("ContentPanel", () => {
  it("zeigt ohne Verknüpfung nur die Wahl, ob und was verknüpft wird", () => {
    mockStaffbase();
    render(<Harness />);
    expect(screen.getByLabelText("Verknüpfung")).toHaveValue("none");
    expect(screen.queryByLabelText("Seite")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Kanal")).not.toBeInTheDocument();
  });

  it("verknüpft eine Seite aus dem Katalog — mit menuId und Titel", async () => {
    mockStaffbase();
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Verknüpfung"), { target: { value: "page" } });
    expect(onChange).not.toHaveBeenCalled();
    const select = await screen.findByLabelText("Seite");
    await screen.findByRole("option", { name: "Release 3.4" });
    expect(optionTexts(select)).toEqual(["Seite wählen …", "Release 3.4", "Messeplan"]);

    fireEvent.change(select, { target: { value: P1 } });
    expect(lastContent(onChange)).toEqual({ kind: "page", id: P1, menuId: M1, title: "Release 3.4" });
    expect(screen.getByRole("link", { name: /neuem Tab/i })).toHaveAttribute("href", `/content/page/${M1}`);
  });

  it("verknüpft einen Beitrag: erst der Kanal mit Typ, dann der Beitrag — Entwürfe sind gekennzeichnet", async () => {
    mockStaffbase();
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Verknüpfung"), { target: { value: "news" } });
    const channel = await screen.findByLabelText("Kanal");
    await screen.findByRole("option", { name: "Truck News (Artikel)" });
    expect(optionTexts(channel)).toEqual(["Kanal wählen …", "Truck News (Artikel)", "Kurz (Kurznachricht)"]);

    fireEvent.change(channel, { target: { value: C1 } });
    const post = await screen.findByLabelText("Beitrag");
    await screen.findByRole("option", { name: "In Arbeit (Entwurf)" });
    expect(optionTexts(post)).toEqual(["Beitrag wählen …", "Freigabe", "In Arbeit (Entwurf)"]);

    fireEvent.change(post, { target: { value: N2 } });
    expect(lastContent(onChange)).toEqual({ kind: "news", id: N2, channelId: C1, title: "In Arbeit" });
    expect(await screen.findByText(/Entwurf — Leser:innen sehen ihn erst nach dem Veröffentlichen/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /neuem Tab/i })).toHaveAttribute("href", `/content/news/article/${N2}`);
  });

  it("benennt eine Kurznachricht ohne Titel nach ihrem Text", async () => {
    mockStaffbase();
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Verknüpfung"), { target: { value: "news" } });
    await screen.findByRole("option", { name: "Kurz (Kurznachricht)" });
    fireEvent.change(screen.getByLabelText("Kanal"), { target: { value: C2 } });
    expect(await screen.findByRole("option", { name: "Kurzmeldung zum Release" })).toBeInTheDocument();
  });

  it("zeigt eine bestehende Verknüpfung samt Kanal und Status", async () => {
    mockStaffbase();
    render(<Harness content={{ kind: "news", id: N2, channelId: C1, title: "In Arbeit" }} />);
    expect(screen.getByLabelText("Verknüpfung")).toHaveValue("news");
    await screen.findByRole("option", { name: "In Arbeit (Entwurf)" });
    expect(screen.getByLabelText("Kanal")).toHaveValue(C1);
    expect(screen.getByLabelText("Beitrag")).toHaveValue(N2);
    expect(screen.getByText(/Entwurf — /)).toBeInTheDocument();
  });

  it("zeigt eine Seite, die nicht (mehr) im Katalog steht, mit ihrem gespeicherten Titel", async () => {
    mockStaffbase([]);
    render(<Harness content={{ kind: "page", id: P1, menuId: M1, title: "Alte Seite" }} />);
    const select = await screen.findByLabelText("Seite");
    // Auf den geladenen Katalog warten, nicht auf eine feste Zahl von Runden:
    // unter Last (Coverage-Lauf) braucht die Antwort mehr als eine.
    expect(await within(select).findByRole("option", { name: "Alte Seite (nicht im Katalog)" })).toBeInTheDocument();
    expect(select).toHaveValue(P1);
  });

  it("sagt, wenn es keine Seiten gibt", async () => {
    mockStaffbase([]);
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Verknüpfung"), { target: { value: "page" } });
    expect(await screen.findByText("Keine Seiten gefunden.")).toBeInTheDocument();
  });

  it("löst die Verknüpfung mit „Keine“", () => {
    mockStaffbase();
    const onChange = jest.fn();
    render(<Harness content={{ kind: "page", id: P1, menuId: M1, title: "Release 3.4" }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Verknüpfung"), { target: { value: "none" } });
    expect(lastContent(onChange)).toBeUndefined();
    expect(screen.queryByLabelText("Seite")).not.toBeInTheDocument();
  });

  it("fragt die Kataloge nur einmal, auch über mehrere Einträge hinweg", async () => {
    const fetchMock = mockStaffbase();
    const { unmount } = render(<Harness content={{ kind: "page", id: P1, menuId: M1 }} />);
    await screen.findByRole("option", { name: "Release 3.4" });
    unmount();
    render(<Harness content={{ kind: "page", id: P2, menuId: M2 }} />);
    await screen.findByRole("option", { name: "Messeplan" });
    expect(fetchMock.mock.calls.filter(([url]) => String(url).startsWith("/api/branch/pages/search"))).toHaveLength(1);
  });
});
