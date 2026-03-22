import type { Ticket } from "@/services/ticketsService";
import type { Assignee } from "@/types/tickets";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useState } from "react";

interface ModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onSave: (t: Ticket) => void;
  assignees: Assignee[];
  isLoading?: boolean;
}

export function TicketModal({ ticket, onClose, onSave, assignees, isLoading }: ModalProps) {
  const isNew = !ticket?._id || ticket._id.startsWith("t");
  const [form, setForm] = useState<Ticket>({
    _id: "",
    title: "",
    description: "",
    due_date: format(new Date(), "yyyy-MM-dd"),
    priority: "mid",
    status: "todo",
    assignee: null,
    created_by: { id: "", name: "", email: "" },
    createdAt: format(new Date(), "yyyy-MM-dd"),
    updatedAt: format(new Date(), "yyyy-MM-dd"),
    is_deleted: false,
    ...ticket,
  });

  const set = (key: keyof Ticket, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.title?.trim()) return;
    onSave({
      ...form,
      _id: form._id || `t${Date.now()}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {isNew ? "Create Ticket" : "Edit Ticket"}
            </h2>
            {!isNew && (
              <p className="text-xs text-slate-400 mt-0.5">{ticket?._id}</p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-sm flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Enter ticket title..."
              className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Row: Due Date + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
              <input
                min={new Date().toISOString().split('T')[0]}
                type="date"
                value={form.due_date}
                onChange={(e) => set("due_date", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={isLoading}
              >
                <option value="high">🔥 High</option>
                <option value="mid">⚡ Mid</option>
                <option value="low">➖ Low</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isLoading}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Assignee</label>
            <select
              value={form.assignee?.id || ""}
              onChange={(e) => {
                console.log({e: e.target.value})
                const userId = e.target.value;
                const user = assignees.find((a) => a.id === userId);
                set("assignee", user ? { id: user.id, name: user.name, email: "" } : null);
              }}
              className="w-full px-3.5 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isLoading}
            >
              <option value="">— Unassigned —</option>
              {assignees.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button onClick={onClose} className="px-4 py-2 rounded-sm text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title?.trim() || isLoading}
            className="px-5 py-2 rounded-sm text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-sm shadow-blue-500/20"
          >
            {isLoading ? "Saving..." : isNew ? "Create Ticket" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
