import api from './api'
import type { SupportTicket } from '@/types'

export const TicketService = {
  getAll: () => {
    return api.get<SupportTicket[]>('/tickets')
  },
  create: (ticket: { title: string; description: string; severity: string; source: string }) => {
    return api.post('/tickets/create', ticket)
  },
  updateStatus: (id: number | string, status: string) => {
    return api.put(`/tickets/${id}/status`, null, {
      params: { status },
    })
  },
  delete: (id: number | string) => {
    return api.delete(`/tickets/${id}`)
  },
}
