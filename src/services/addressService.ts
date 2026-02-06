import api from './api'
import type { Address } from '@/types/address'

export const AddressService = {
  // CheckoutView compatibility aliases
  getAll: () => AddressService.getMyAddresses(),
  create: (address: Partial<Address>) => AddressService.createAddress(address as Address),

  async getMyAddresses(): Promise<Address[]> {
    const response = await api.get('/addresses/my-addresses') // Keeping existing endpoint assumption or changing to /addresses?
    // Use /addresses if that's the standard REST for "my addresses" usually
    return response.data || response
  },

  async createAddress(address: Address): Promise<Address> {
    const response = await api.post('/addresses', address) // Changed /address to /addresses for consistency
    return response.data || response
  },

  async updateAddress(id: number, address: Partial<Address>): Promise<Address> {
    const response = await api.put(`/addresses/${id}`, address) // Changed /address to /addresses
    return response.data || response
  },

  async deleteAddress(id: number): Promise<void> {
    return await api.delete(`/addresses/${id}`)
  },

  // Admin
  async getAllAdmin(): Promise<unknown> {
    return (await api.get('/admin/addresses')) as unknown
  },
}
