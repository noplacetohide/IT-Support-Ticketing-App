import type { Priority } from "@/types/tickets";
import { Flame, AlertCircle, Minus } from "lucide-react";
import type { JSX } from "react";

export const PRIORITY_CONFIG: Record<Priority, { label: string; icon: JSX.Element; classes: string }> = {
  high: {
    label: "High",
    icon: <Flame size={11} />,
    classes: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  mid: {
    label: "Mid",
    icon: <AlertCircle size={11} />,
    classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  low: {
    label: "Low",
    icon: <Minus size={11} />,
    classes: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  },
};