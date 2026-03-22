import { ChevronDown, X } from "lucide-react";
import {useState, useRef, type JSX} from "react";

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string; extra?: JSX.Element }[];
  selected: string[];
  onChange: (vals: string[]) => void;
}

export function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-sm font-medium transition-all
          ${selected.length
            ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-500"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm shadow-xl min-w-50 py-1 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className="min-w-50 flex items-center justify-start gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all
                  ${selected.includes(opt.value)
                    ? "bg-blue-500 border-blue-500"
                    : "border-slate-300 dark:border-slate-600"}`}>
                  {selected.includes(opt.value) && <X size={10} className="text-white" strokeWidth={3} />}
                </div>
                {opt.extra}
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
