/**
 * Utility for handling image URLs from the backend
 */

export const getImageUrl = (path: string | undefined): string => {
  if (!path) return 'https://placehold.co/400'

  // Safety check: if already has the correct prefix, don't touch it
  if (path.startsWith('/minio-storage/') || path.includes('/minio-storage/')) {
    return path
  }

  // 1. Detect internal paths (products/..., setups/...) regardless of prefix (localhost, etc)
  const match = path.match(/(products|setups)\/.*$/)
  if (match) {
    const relativePath = match[0]
    // Return the path pointing to our Nginx MinIO proxy
    return `/minio-storage/${relativePath}`
  }

  // 2. If it's an external URL (e.g. Google Image, Avatar), return as is
  // (We check this AFTER step 1 to catch http://localhost:9000/products/...)
  if ((path.startsWith('http') || path.startsWith('https')) && !path.includes('localhost')) {
    return path
  }

  // 3. Last resort fallback for clean relative paths
  const cleanPath = path.startsWith('/') ? path.substring(1) : path
  return `/minio-storage/${cleanPath}`
}
