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
 * Die Wahl der Vorlage im leeren Editor: je Vorlage eine Karte mit
 * Vorschaubild, Name, Beschreibung und dem, was sie mitbringt. Ein Klick
 * übernimmt sie — der Plan ist leer, es geht also nichts verloren, und
 * „Abbrechen“ im Kopf verwirft wie sonst auch.
 */

import * as React from "react";
import { ReactElement, Ref, useEffect, useId, useMemo, useRef } from "react";

import { Button } from "@man/config-ui/primitives/button";

import { formatMonthYear } from "../format";
import { Plan } from "../plan-model";
import type { PlanTemplate } from "../plan-templates";
import { TemplateThumbnail, templateRange } from "./template-thumbnail";

/** Der Editor spricht nur Deutsch; die Monate folgen ihm. */
const LOCALE = "de-DE";

const count = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

/** „3 Ebenen · 7 Kategorien · 41 Einträge · Januar 2025 – Dezember 2031“. */
export function describeTemplatePlan(plan: Plan): string {
  const range = templateRange(plan);
  return [
    count(plan.lanes.length, "Ebene", "Ebenen"),
    count(plan.categories.length, "Kategorie", "Kategorien"),
    count(plan.items.length, "Eintrag", "Einträge"),
    ...(range === null
      ? []
      : [`${formatMonthYear(range.start, LOCALE)} – ${formatMonthYear(range.end, LOCALE)}`]),
  ].join(" · ");
}

interface TemplateCardProps {
  template: PlanTemplate;
  onPick(template: PlanTemplate): void;
  buttonRef?: Ref<HTMLButtonElement>;
}

function TemplateCard({ template, onPick, buttonRef }: TemplateCardProps): ReactElement {
  const id = useId();
  const plan = useMemo(() => template.create(), [template]);
  return (
    <button
      ref={buttonRef}
      type="button"
      className="flex h-full w-full cursor-pointer flex-col items-stretch gap-2 rounded-lg border bg-background p-3 text-left whitespace-normal text-foreground outline-none transition-colors hover:border-primary-soft-border hover:bg-primary-soft focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description ${id}-facts`}
      onClick={() => onPick(template)}
    >
      <TemplateThumbnail plan={plan} />
      <span id={`${id}-title`} className="block text-sm font-semibold text-foreground">
        {template.title}
      </span>
      <span id={`${id}-description`} className="block text-[13px] text-muted-foreground">
        {template.description}
      </span>
      <span id={`${id}-facts`} className="mt-auto block text-xs text-muted-foreground">
        {describeTemplatePlan(plan)}
      </span>
    </button>
  );
}

export interface TemplateGalleryProps {
  templates: readonly PlanTemplate[];
  onPick(template: PlanTemplate): void;
  onBack(): void;
}

export function TemplateGallery({ templates, onPick, onBack }: TemplateGalleryProps): ReactElement {
  const headingId = useId();
  const firstRef = useRef<HTMLButtonElement>(null);

  // Der Knopf, der hierher führte, ist verschwunden; der Fokus gehört auf die
  // erste Wahl statt zurück an den Anfang des Dialogs.
  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  return (
    <section className="mx-auto flex max-w-[760px] flex-col items-stretch gap-4 px-6 py-8" aria-labelledby={headingId}>
      <h3 id={headingId} className="text-xl font-semibold text-foreground">
        Vorlage wählen
      </h3>
      <p className="text-sm text-muted-foreground">
        Ein Klick übernimmt die Vorlage; danach lässt sich alles frei umbauen. Eine schon eingegebene Überschrift
        bleibt.
      </p>
      {/* `role="list"`: Safari nimmt einer Liste ohne Aufzählungszeichen sonst die Rolle. */}
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 p-0" role="list" aria-label="Vorlagen">
        {templates.map((template, index) => (
          <li key={template.id} className="m-0 p-0">
            <TemplateCard template={template} onPick={onPick} buttonRef={index === 0 ? firstRef : undefined} />
          </li>
        ))}
      </ul>
      <div>
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Zurück
        </Button>
      </div>
    </section>
  );
}
