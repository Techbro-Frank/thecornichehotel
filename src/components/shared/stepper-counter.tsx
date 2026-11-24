/**
 * @file StepperCounter — labeled +/- quantity control
 * @description Shared by the /book search form and each room's own inline
 *   booking panel, so the adults/children/rooms control only exists once.
 */

"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import type { ComponentType } from "react";

export default function StepperCounter({
  label,
  icon: Icon,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="label-uppercase text-[11px]">{label}</label>
      <div className="flex items-center border border-border bg-white">
        <div className="flex items-center gap-2 pl-3">
          <Icon size={16} className="text-muted" />
        </div>
        <input
          type="text"
          readOnly
          value={value}
          className="flex-1 py-3 px-2 text-sm text-dark bg-transparent text-center focus:outline-none"
        />
        <div className="flex flex-col border-l border-border">
          <button
            type="button"
            onClick={() => onChange(Math.min(value + 1, max))}
            className="px-3 py-1 hover:bg-beige transition-colors"
            aria-label={`Increase ${label}`}
          >
            <ChevronUp size={12} />
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.max(value - 1, min))}
            className="px-3 py-1 hover:bg-beige transition-colors border-t border-border"
            aria-label={`Decrease ${label}`}
          >
            <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
