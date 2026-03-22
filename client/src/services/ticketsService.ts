import { TicketStatus, TicketPriority } from "@/types/tickets";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000/api/v1";

const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee?: UserInfo | null;
  created_by: UserInfo;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TicketsResponse {
  data: Ticket[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetAllUsersResponse {
  users: UserInfo[];
}

export async function getTickets(
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: TicketStatus[];
    assignee?: string[];
    priority?: TicketPriority[];
  }
): Promise<TicketsResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));

  filters?.status?.forEach((s) => queryParams.append("status", s));
  filters?.assignee?.forEach((a) => queryParams.append("assignee", a));
  filters?.priority?.forEach((p) => queryParams.append("priority", p));

  const response = await fetch(`${API_BASE_URL}/tickets?${queryParams}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.statusText}`);
  }

  return response.json();
}

export async function createTicket(payload: {
  title: string;
  description?: string;
  due_date?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  assignee?: string;
}): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to create ticket`);
  }

  return response.json();
}

export async function updateTicket(
  ticketId: string,
  payload: {
    title?: string;
    description?: string;
    due_date?: string;
    priority?: TicketPriority;
    status?: TicketStatus;
    assignee?: string;
  }
): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to update ticket`);
  }

  return response.json();
}

export async function deleteTicket(ticketId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to delete ticket`);
  }
}

export async function getAllUsers(): Promise<GetAllUsersResponse> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const users = await response.json();
  
  // The backend returns an array directly, wrap it in an object
  return {
    users: Array.isArray(users) ? users : users.users || [],
  };
}
