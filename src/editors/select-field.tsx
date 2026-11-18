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
 * Das native Auswahlfeld im Look der Steuerelemente von `@man/config-ui`
 * (Höhe 36 px, Rundung und Rand wie `Input`, Pfeil rechts).
 *
 * Nativ statt Radix-Select: die Listen hier (Ebenen, Kategorien, Seiten,
 * Beiträge) tragen deaktivierte Platzhalter und die Option „Neue … anlegen“,
 * und eine native Liste bedient Tastatur und Screenreader ohne Zutun. Passt
 * in ein `Field`: `id` und `aria-*` landen am `<select>`.
 */

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Field } from "@man/config-ui/form/field";
import { cn } from "@man/config-ui/primitives/utils";

export function SelectBox({ className, children, ...props }: React.ComponentProps<"select">): React.ReactElement {
  return (
    <div className={cn("relative", className)}>
      <select
        {...props}
        className={cn(
          "h-9 w-full min-w-0 cursor-pointer appearance-none rounded-md border border-input bg-background pr-9 pl-3 text-sm text-foreground shadow-xs outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Ein beschriftetes Auswahlfeld. */
export function SelectField({ label, value, onChange, hint, className, children }: SelectFieldProps): React.ReactElement {
  return (
    <Field label={label} hint={hint} className={className}>
      <SelectBox value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </SelectBox>
    </Field>
  );
}
