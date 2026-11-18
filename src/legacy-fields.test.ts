import { readLegacyFlagsFromDialog, startHiddenLegacyFields } from "./legacy-fields";

const row = (key: string, extra = ""): string =>
  `<div data-row="${key}"><label for="root_${key}">${key}</label><input id="root_${key}" ${extra}><p>Hilfe</p></div>`;
const check = (key: string, checked: boolean): string => row(key, `type="checkbox" ${checked ? "checked" : ""}`);

const rowOf = (key: string): HTMLElement | null => document.querySelector<HTMLElement>(`[data-row="${key}"]`);

afterEach(() => {
  document.body.innerHTML = "";
});

describe("startHiddenLegacyFields", () => {
  it("blendet die alten Schalter im eigenen Dialog aus und lässt den Plan stehen", () => {
    document.body.innerHTML = `<form>${row("plan")}${check("show-today", true)}${check("allow-export", true)}</form>`;
    const stop = startHiddenLegacyFields();
    expect(rowOf("show-today")?.style.display).toBe("none");
    expect(rowOf("allow-export")?.style.display).toBe("none");
    expect(rowOf("plan")?.style.display).toBe("");
    stop();
    expect(rowOf("show-today")?.style.display).toBe("");
  });

  it("erfasst später erscheinende Zeilen", async () => {
    document.body.innerHTML = "<form></form>";
    const stop = startHiddenLegacyFields();
    document.querySelector("form")?.insertAdjacentHTML("beforeend", `${row("plan")}${check("show-today", true)}`);
    await Promise.resolve();
    expect(rowOf("show-today")?.style.display).toBe("none");
    stop();
  });

  it("lässt den Dialog eines anderen Widgets mit gleichem Feldnamen unberührt", () => {
    document.body.innerHTML =
      `<form id="other">${row("config")}${check("allow-export", true)}</form>` +
      `<form id="own">${row("plan")}${check("allow-export", true)}</form>`;
    const stop = startHiddenLegacyFields();
    const rows = document.querySelectorAll<HTMLElement>('[data-row="allow-export"]');
    expect(rows[0].style.display).toBe("");
    expect(rows[1].style.display).toBe("none");
    stop();
  });
});

describe("readLegacyFlagsFromDialog", () => {
  it("liest die Zustände der Kontrollkästchen", () => {
    document.body.innerHTML = `<form>${row("plan")}${check("show-today", false)}${check("allow-export", true)}</form>`;
    expect(readLegacyFlagsFromDialog()).toEqual({ showToday: false, allowExport: true });
  });

  it("lässt nicht lesbare Felder weg, statt Vorgaben zu raten", () => {
    document.body.innerHTML = `<form>${row("plan")}<div id="root_show-today"></div>${check("allow-export", true)}</form>`;
    expect(readLegacyFlagsFromDialog()).toEqual({ allowExport: true });
  });

  it("liest ohne eigenen Dialog nichts", () => {
    document.body.innerHTML = `<form>${check("show-today", false)}</form>`;
    expect(readLegacyFlagsFromDialog()).toEqual({});
  });
});
