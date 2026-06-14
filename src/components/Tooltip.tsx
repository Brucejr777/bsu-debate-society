"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
}

/**
 * A reusable, accessible tooltip component.
 * 
 * @example
 * <Tooltip content="Provisional for 7 days. Subject to petition per R&P Art. I, Sec. 5.">
 *   <span className="...">Provisional</span>
 * </Tooltip>
 */
export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 200,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={delayDuration}>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={4}
          className="z-50 overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-neutral-900" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}