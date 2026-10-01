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
 * Was der Editor bei leerem Plan zeigt: zwei Wege zu beginnen — mit einer
 * Vorlage (dann erst die Galerie) oder leer mit einer Ebene.
 */

import * as React from "react";
import { ReactElement, useEffect, useId, useRef, useState } from "react";

import { PLAN_TEMPLATES, PlanTemplate } from "../plan-templates";
import { TemplateGallery } from "./template-gallery";

export interface EmptyStateProps {
  onTemplate(template: PlanTemplate): void;
  onEmpty(): void;
}

export function EmptyState({ onTemplate, onEmpty }: EmptyStateProps): ReactElement {
  const headingId = useId();
  const [choosing, setChoosing] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const returning = useRef(false);

  // Zurück aus der Galerie steht der Fokus wieder dort, wo er hineinführte.
  useEffect(() => {
    if (choosing || !returning.current) return;
    returning.current = false;
    startRef.current?.focus();
  }, [choosing]);

  if (choosing) {
    return (
      <TemplateGallery
        templates={PLAN_TEMPLATES}
        onPick={onTemplate}
        onBack={() => {
          returning.current = true;
          setChoosing(false);
        }}
      />
    );
  }

  return (
    <section className="man-pt-editor__empty" aria-labelledby={headingId}>
      <h3 id={headingId} className="man-pt-editor__empty-title">
        Der Plan ist noch leer
      </h3>
      <p className="man-pt-editor__hint">
        Eine Vorlage bringt Ebenen, Kategorien und Einträge mit und lässt sich danach frei umbauen. Leer beginnt der
        Plan mit einer Ebene.
      </p>
      <div className="man-pt-editor__actions">
        <button
          ref={startRef}
          type="button"
          className="man-pt-editor__button man-pt-editor__button--primary"
          onClick={() => setChoosing(true)}
        >
          Mit Vorlage beginnen
        </button>
        <button type="button" className="man-pt-editor__button" onClick={onEmpty}>
          Leer beginnen
        </button>
      </div>
    </section>
  );
}
