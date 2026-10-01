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
      className="man-pt-editor__template"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description ${id}-facts`}
      onClick={() => onPick(template)}
    >
      <TemplateThumbnail plan={plan} />
      <span id={`${id}-title`} className="man-pt-editor__template-title">
        {template.title}
      </span>
      <span id={`${id}-description`} className="man-pt-editor__template-description">
        {template.description}
      </span>
      <span id={`${id}-facts`} className="man-pt-editor__template-facts">
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
    <section className="man-pt-editor__empty man-pt-editor__empty--gallery" aria-labelledby={headingId}>
      <h3 id={headingId} className="man-pt-editor__empty-title">
        Vorlage wählen
      </h3>
      <p className="man-pt-editor__hint">
        Ein Klick übernimmt die Vorlage; danach lässt sich alles frei umbauen. Eine schon eingegebene Überschrift
        bleibt.
      </p>
      {/* `role="list"`: Safari nimmt einer Liste ohne Aufzählungszeichen sonst die Rolle. */}
      <ul className="man-pt-editor__templates" role="list" aria-label="Vorlagen">
        {templates.map((template, index) => (
          <li key={template.id} className="man-pt-editor__templates-item">
            <TemplateCard template={template} onPick={onPick} buttonRef={index === 0 ? firstRef : undefined} />
          </li>
        ))}
      </ul>
      <div className="man-pt-editor__actions">
        <button type="button" className="man-pt-editor__button" onClick={onBack}>
          Zurück
        </button>
      </div>
    </section>
  );
}
