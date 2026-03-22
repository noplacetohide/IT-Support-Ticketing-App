
 
export const TicketStatus = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type TicketStatus =
  (typeof TicketStatus)[keyof typeof TicketStatus];

  export const TicketPriority = {
  HIGH: "high",
  MID: "mid",
  LOW: "low",
} as const;

export type TicketPriority =
  (typeof TicketPriority)[keyof typeof TicketPriority];


export type Priority = "high" | "mid" | "low";
export type Status = "todo" | "in_progress" | "completed";



 export interface Assignee {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  }
  
  export interface Ticket {
    _id: string;
    title: string;
    description?: string;
    status: Status;
    priority: Priority;
    assignee?: { id: string; name: string; email: string } | null;
    created_by: { id: string; name: string; email: string };
    createdAt: string;
    due_date: string;
  }