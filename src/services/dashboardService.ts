import api from './api'

export const DashboardService = {
  getStats: () => {
    return api.get('/admin/stats') as unknown as Promise<any>
  },
}
