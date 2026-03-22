import type { Ticket } from "@/types/tickets";
import { PRIORITY_CONFIG } from "@/utils/badge";
import { format, isPast, isToday, isTomorrow, parseISO } from "date-fns";
import { GripVertical, X, CalendarDays, User } from "lucide-react";
import { Avatar } from "./Avatar";

interface CardProps {
  ticket: Ticket;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDelete: (ticketId: string) => void;
  isCompleted: boolean;
}

function dueDateStyle(dateStr: string) {
  const d = parseISO(dateStr);
  if (isPast(d) && !isToday(d))
    return "text-red-500 dark:text-red-400 font-semibold";
  if (isToday(d)) return "text-orange-500 dark:text-orange-400 font-semibold";
  if (isTomorrow(d)) return "text-amber-500 dark:text-amber-400 font-semibold";
  return "text-slate-500 dark:text-slate-400";
}

export function TicketCard({
  ticket,
  onClick,
  onDragStart,
  onDelete,
  isCompleted,
}: CardProps) {
  const assignee = ticket.assignee;
  const pc = PRIORITY_CONFIG[ticket.priority];

  return (
    <div
      draggable={!isCompleted}
      onDragStart={isCompleted ? undefined : onDragStart}
      onClick={onClick}
      className={`group bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 p-3.5 
        shadow-sm hover:shadow-md dark:shadow-none dark:hover:border-slate-600 transition-all
        ${!isCompleted ? "cursor-grab active:cursor-grabbing hover:-translate-y-0.5" : "cursor-pointer opacity-80"}
      `}
    >
      {/* Top row: drag handle + priority badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {!isCompleted && (
            <GripVertical
              size={13}
              className="text-slate-300 dark:text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors"
            />
          )}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${pc.classes}`}
          >
            {pc.icon}
            {pc.label}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ticket._id);
          }}
          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5 leading-snug line-clamp-2">
        {ticket.title}
      </p>

      {/* Description */}
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2">
        {ticket.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {ticket.due_date ? (
          <div
            className={`flex items-center gap-1 text-xs ${dueDateStyle(ticket.due_date)}`}
          >
            <CalendarDays size={11} />
            <span>{format(parseISO(ticket.due_date), "MMM d")}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-300 dark:text-slate-600">
            No due date
          </span>
        )}
        <div className="flex items-center gap-1.5">
          {assignee ? (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              {assignee.name.split(" ")[0]}
              <Avatar
                assignee={{
                  id: assignee.id,
                  name: assignee.name,
                  avatar: "",
                  initials: assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase(),
                }}
                size="sm"
              />
            </span>
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <User size={11} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
