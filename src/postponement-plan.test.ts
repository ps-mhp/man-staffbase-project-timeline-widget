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

import { BarItem, isLaneItem } from "./plan-model";
import { postponementPlan } from "./postponement-plan";

describe("postponementPlan", () => {
  it("markiert alten und neuen Termin als Stichtage über alle Ebenen", () => {
    const deadlines = postponementPlan()
      .items.filter((item) => item.kind === "deadline")
      .map((item) => (item.kind === "deadline" ? item.date : ""));
    expect(deadlines).toEqual(["2027-03-15", "2027-04-26"]);
  });

  it("überbrückt in jeder betroffenen Ebene alten bis neuen Termin ohne Lücke", () => {
    // Endete der Zeitraum früher, klaffte zwischen ihm und der roten Linie
    // eine Lücke, die wie eine zweite Verzögerung aussähe.
    const plan = postponementPlan();
    const affected = plan.lanes.filter((lane) => lane.id !== "lane-communication");
    expect(affected.length).toBe(5);
    for (const lane of affected) {
      const bridge = plan.items.find(
        (item): item is BarItem => isLaneItem(item) && item.lane === lane.id && item.kind === "bar" && item.start === "2027-03-15",
      );
      expect({ lane: lane.id, end: bridge?.end }).toEqual({ lane: lane.id, end: "2027-04-25" });
    }
  });

  it("hält Einträge einer Ebene getrennt, damit das Layout sie schmal untereinander stellen kann", () => {
    // In einer Serie teilten sich die Zeiträume eine Zeile; schmal überdeckte
    // dann der Folgebalken die nach rechts ausweichende Beschriftung.
    expect(postponementPlan().items.filter((item) => isLaneItem(item) && item.series !== undefined)).toEqual([]);
  });
});
