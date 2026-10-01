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
 * Eine Form in ihrer Farbe — in Legende, Details, Liste, Hilfe und Editor.
 *
 * Farbe als Attribut, nicht über das Stylesheet des Plans: der Editor zeigt
 * die Figur auch dort, wo dessen Stylesheet nicht geladen ist. Ein Stylesheet
 * darf sie trotzdem übersteuern (etwa hohl für eine ausgeblendete Kategorie).
 */

import React, { ReactElement } from "react";

import { MilestoneSymbol } from "./plan-model";
import { SYMBOL_BOX, symbolPath } from "./symbols";

export interface SymbolGlyphProps {
  symbol: MilestoneSymbol;
  color: string;
  /** Kantenlänge in Pixeln; Vorgabe 12. */
  size?: number;
  className?: string;
}

export function SymbolGlyph({ symbol, color, size = 12, className }: SymbolGlyphProps): ReactElement {
  return (
    <svg
      className={`man-pt__glyph${className ? ` ${className}` : ""}`}
      width={size}
      height={size}
      viewBox={`0 0 ${SYMBOL_BOX} ${SYMBOL_BOX}`}
      aria-hidden="true"
      focusable="false"
      data-symbol={symbol}
    >
      <path d={symbolPath(symbol)} fill={color} stroke={color} strokeWidth={0} />
    </svg>
  );
}
