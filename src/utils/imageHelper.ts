import { getImageUrl } from './imageUtils'

/**
 * Legacy helper now redirected to the robust getImageUrl utility.
 * This ensures all parts of the app use the correct Nginx proxy logic.
 */
export const getFullImageUrl = (path: string | undefined | null): string => {
  return getImageUrl(path || undefined)
}
