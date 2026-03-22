import { CalendarDays, X } from "lucide-react";

export function DateFilter({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <CalendarDays size={14} />
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2.5 py-1.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={14} />
        </button>
      )}
    </div>
  );
}