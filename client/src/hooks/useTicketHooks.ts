import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getAllUsers,
  type Ticket,
  type TicketsResponse,
  type GetAllUsersResponse,
} from "@/services/ticketsService";
import type { TicketPriority, TicketStatus } from "@/types/tickets";
 
export function useGetTickets(
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: TicketStatus[];
    assignee?: string[];
    priority?: TicketPriority[];
  }
) {
  return useQuery<TicketsResponse, Error>({
    queryKey: ["tickets", page, limit, filters],
    queryFn: () => getTickets(page, limit, filters),
  });
}

export function useGetAllUsers() {
  return useQuery<GetAllUsersResponse, Error>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation<
    Ticket,
    Error,
    {
      title: string;
      description?: string;
      due_date?: string;
      priority?: TicketPriority;
      status?: TicketStatus;
      assignee?: string;
    }
  >({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation<
    Ticket,
    Error,
    {
      ticketId: string;
      payload: {
        title?: string;
        description?: string;
        due_date?: string;
        priority?: TicketPriority;
        status?: TicketStatus;
        assignee?: string;
      };
    }
  >({
    mutationFn: ({ ticketId, payload }) => updateTicket(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
