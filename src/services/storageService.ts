import api from './api'

export const storageService = {
  async uploadPhoto(file: File, folder: 'products' | 'setups'): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    // The "God Interceptor" handles the response unwrapping
    // Assuming the backend returns the string URL directly in 'data'
    return await api.post('/storage/upload', formData, {
      headers: {
        'Content-Type': null,
      },
      timeout: 300000, // 5 min for large files
    })
  },
}
