import { useState } from "react";
import { Plus, X, Search, LogOut, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  useGetTickets,
  useGetAllUsers,
  useCreateTicket,
  useUpdateTicket,
  useDeleteTicket,
} from "@/hooks/useTicketHooks";
import {
  TicketPriority,
  TicketStatus,
  type Assignee,
  type Priority,
  type Status,
  type Ticket,
} from "@/types/tickets";
import { MultiSelect } from "@/components/MultiSelect";
import { DateFilter } from "@/components/DateFilter";
import { TicketModal } from "@/components/TicketModal";
import { PRIORITY_CONFIG } from "@/utils/badge";
import { TicketCard } from "@/components/TicketCard";
import { Avatar } from "@/components/Avatar";
import { ConfirmModal } from "@/components/ConfirmModal";

// Map API status to display status
const mapApiStatus = (status: string): Status => {
  const statusMap: Record<string, Status> = {
    [TicketStatus.TODO]: "todo",
    [TicketStatus.IN_PROGRESS]: "in_progress",
    [TicketStatus.COMPLETED]: "completed",
  };
  return statusMap[status] || "todo";
};

// Map display status to API status
const mapToApiStatus = (status: Status): TicketStatus => {
  const statusMap: Record<Status, TicketStatus> = {
    todo: TicketStatus.TODO,
    in_progress: TicketStatus.IN_PROGRESS,
    completed: TicketStatus.COMPLETED,
  };
  return statusMap[status];
};

// Map API priority to display priority
const mapApiPriority = (priority: string): Priority => {
  const priorityMap: Record<string, Priority> = {
    [TicketPriority.HIGH]: "high",
    [TicketPriority.MID]: "mid",
    [TicketPriority.LOW]: "low",
  };
  return priorityMap[priority] || "low";
};

// Map display priority to API priority
const mapToApiPriority = (priority: Priority): TicketPriority => {
  const priorityMap: Record<Priority, TicketPriority> = {
    high: TicketPriority.HIGH,
    mid: TicketPriority.MID,
    low: TicketPriority.LOW,
  };
  return priorityMap[priority];
};

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; dot: string }
> = {
  todo: { label: "To Do", color: "text-slate-500", dot: "bg-slate-400" },
  in_progress: {
    label: "In Progress",
    color: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    color: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

interface ColumnProps {
  status: Status;
  tickets: Ticket[];
  onDrop: (ticketId: string, targetStatus: Status) => void;
  onCardClick: (t: Ticket) => void;
  onDragStart: (ticketId: string) => void;
  onDelete: (ticketId: string) => void;
}

function Column({
  status,
  tickets,
  onDrop,
  onCardClick,
  onDragStart,
  onDelete,
}: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const cfg = STATUS_CONFIG[status];
  const isCompleted = status === "completed";

  const COLUMN_STYLES: Record<Status, string> = {
    todo: "bg-slate-50 dark:bg-slate-900/50",
    in_progress: "bg-blue-50/50 dark:bg-blue-950/20",
    completed: "bg-emerald-50/50 dark:bg-emerald-950/20",
  };

  return (
    <div
      onDragOver={(e) => {
        if (!isCompleted) {
          e.preventDefault();
          setIsDragOver(true);
        }
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!isCompleted) {
          const id = e.dataTransfer.getData("ticketId");
          if (id) onDrop(id, status);
        }
      }}
      className={`flex flex-col rounded-lg border transition-all min-h-125
        ${COLUMN_STYLES[status]}
        ${
          isDragOver
            ? "border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/30"
            : "border-slate-200 dark:border-slate-700/50"
        }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          <h3 className={`text-sm font-bold tracking-tight ${cfg.color}`}>
            {cfg.label}
          </h3>
          <span className="ml-1 text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {tickets.length}
          </span>
        </div>
        {isCompleted && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
            drop disabled
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5 p-3 flex-1">
        {tickets.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40">
            <div className="w-10 h-10 rounded-sm bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-2">
              <Search size={16} className="text-slate-400" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              No tickets
            </p>
          </div>
        )}
        {tickets.map((t) => (
          <TicketCard
            key={t._id}
            ticket={t}
            isCompleted={isCompleted}
            onClick={() => onCardClick(t)}
            onDragStart={(e) => {
              e.dataTransfer.setData("ticketId", t._id);
              onDragStart(t._id);
            }}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectBoard() {
  const { logout, user } = useAuth();
  const [modal, setModal] = useState<{
    open: boolean;
    ticket: (Ticket & { is_deleted: boolean; updatedAt: string }) | null;
  }>({ open: false, ticket: null });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [createdAfter, setCreatedAfter] = useState("");
  const [dueAfter, setDueAfter] = useState("");

  // API calls
  const {
    data: ticketsResponse,
    isLoading: ticketsLoading,
    error: ticketsError,
  } = useGetTickets(1, 100, {
    status:
      statusFilter.length > 0
        ? statusFilter.map((s) => mapToApiStatus(s as Status))
        : undefined,
    priority:
      priorityFilter.length > 0
        ? priorityFilter.map((p) => mapToApiPriority(p as Priority))
        : undefined,
    assignee: assigneeFilter.length > 0 ? assigneeFilter : undefined,
  });

  const { data: usersResponse, isLoading: usersLoading } = useGetAllUsers();
  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();
  const deleteTicketMutation = useDeleteTicket();

  // Convert API responses to assignees format
  const assignees: Assignee[] =
    usersResponse?.users?.map((user) => ({
      id: user.id,
      name: user.name,
      avatar: "",
      initials: user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    })) || [];

  const activeFiltersCount =
    statusFilter.length +
    assigneeFilter.length +
    priorityFilter.length +
    (createdAfter ? 1 : 0) +
    (dueAfter ? 1 : 0);

  const clearAll = () => {
    setStatusFilter([]);
    setAssigneeFilter([]);
    setPriorityFilter([]);
    setCreatedAfter("");
    setDueAfter("");
  };

  // Convert API tickets to display format
  const displayTickets: Ticket[] =
    ticketsResponse?.data?.map((ticket) => ({
      _id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      status: mapApiStatus(ticket.status),
      priority: mapApiPriority(ticket.priority),
      assignee: ticket.assignee,
      created_by: ticket.created_by,
      createdAt: ticket.createdAt,
      due_date: ticket.due_date,
      is_deleted: ticket.is_deleted,
      updatedAt: ticket.updatedAt,
    })) || [];

  const filtered = displayTickets.filter((t) => {
    if (statusFilter.length && !statusFilter.includes(t.status)) return false;
    if (assigneeFilter.length && !assigneeFilter.includes(t.assignee?.id || ""))
      return false;
    if (priorityFilter.length && !priorityFilter.includes(t.priority))
      return false;
    if (createdAfter && t.createdAt < createdAfter) return false;
    if (dueAfter && t.due_date && t.due_date < dueAfter) return false;
    return true;
  });

  const byStatus = (s: Status) => filtered.filter((t) => t.status === s);

  const handleDrop = (ticketId: string, newStatus: Status) => {
    const ticket = displayTickets.find((t) => t._id === ticketId);
    if (ticket) {
      updateTicketMutation.mutate({
        ticketId,
        payload: {
          status: mapToApiStatus(newStatus),
        },
      });
    }
  };

  const handleSave = (t: Ticket) => {
    if (t._id.startsWith("t")) {
      // New ticket
      createTicketMutation.mutate({
        title: t.title,
        description: t.description,
        due_date: t.due_date,
        priority: mapToApiPriority(t.priority),
        status: mapToApiStatus(t.status),
        assignee: t.assignee?.id,
      });
    } else {
      // Update existing ticket
      updateTicketMutation.mutate({
        ticketId: t._id,
        payload: {
          title: t.title,
          description: t.description,
          due_date: t.due_date,
          priority: mapToApiPriority(t.priority),
          status: mapToApiStatus(t.status),
          assignee: t.assignee?.id,
        },
      });
    }
    setModal({ open: false, ticket: null });
  };

  const handleDelete = (ticketId: string) => {
    setConfirmDelete(ticketId);
  };

  const handleCardClick = (t: Ticket) => {
    setModal({
      open: true,
      ticket: { ...t, is_deleted: false, updatedAt: new Date().toISOString() },
    });
  };

  const COLUMNS: Status[] = ["todo", "in_progress", "completed"];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      {/* Top bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-sm bg-blue-600 flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                Project Board
              </p>
              <p className="text-sm font-medium opacity-60">Hi, {user?.name}</p>
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => setModal({ open: true, ticket: null })}
              className="flex items-center gap-2 px-4 py-2 rounded-sm bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold transition-all shadow-sm shadow-blue-500/30"
              disabled={ticketsLoading || usersLoading}
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Ticket
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-sm bg-red-500 hover:bg-red-700 active:scale-95 text-white text-sm font-bold transition-all shadow-sm shadow-blue-500/30"
            >
              <LogOut size={16} strokeWidth={2.5} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
            Filters
          </span>

          <MultiSelect
            label="Status"
            selected={statusFilter}
            onChange={setStatusFilter}
            options={COLUMNS.map((s) => ({
              value: s,
              label: STATUS_CONFIG[s].label,
              extra: (
                <div
                  className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot} shrink-0`}
                />
              ),
            }))}
          />

          <MultiSelect
            label="Assignee"
            selected={assigneeFilter}
            onChange={setAssigneeFilter}
            options={assignees.map((a) => ({
              value: a.id,
              label: a.name,
              extra: <Avatar assignee={a} size="sm" />,
            }))}
          />

          <MultiSelect
            label="Priority"
            selected={priorityFilter}
            onChange={setPriorityFilter}
            options={(["high", "mid", "low"] as Priority[]).map((p) => ({
              value: p,
              label: PRIORITY_CONFIG[p].label,
              extra: (
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${PRIORITY_CONFIG[p].classes}`}
                >
                  {PRIORITY_CONFIG[p].icon}
                </span>
              ),
            }))}
          />

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          <DateFilter
            label="Created after"
            value={createdAfter}
            onChange={setCreatedAfter}
          />
          <DateFilter
            label="Due after"
            value={dueAfter}
            onChange={setDueAfter}
          />

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
            >
              <X size={12} />
              Clear all ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Loading/Error State */}
      {ticketsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
        </div>
      )}

      {ticketsError && (
        <div className="max-w-7xl mx-auto px-6 py-4 mt-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          Error loading tickets: {ticketsError.message}
        </div>
      )}

      {/* Board */}
      {!ticketsLoading && (
        <div className="max-w-7xl mx-auto py-4 ">
          <div className="grid grid-cols-3 gap-5">
            {COLUMNS.map((s) => (
              <Column
                key={s}
                status={s}
                tickets={byStatus(s)}
                onDrop={handleDrop}
                onCardClick={handleCardClick}
                onDragStart={() => {}}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <TicketModal
          ticket={modal.ticket}
          onClose={() => setModal({ open: false, ticket: null })}
          onSave={handleSave}
          assignees={assignees}
          isLoading={
            createTicketMutation.isPending || updateTicketMutation.isPending
          }
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this ticket?"
          onConfirm={() => {
            deleteTicketMutation.mutate(confirmDelete);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
