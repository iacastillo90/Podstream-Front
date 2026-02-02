import { ref } from 'vue'

const isExpanded = ref(true)
const isMobileOpen = ref(false)
const isHovered = ref(false)
const openSubmenu = ref<string | null>(null)

export function useSidebar() {
  const toggleSubmenuState = (key: string) => {
    if (openSubmenu.value === key) {
      openSubmenu.value = null
    } else {
      openSubmenu.value = key
    }
  }

  const toggleSidebar = () => {
    isExpanded.value = !isExpanded.value
  }

  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  return {
    isExpanded,
    isMobileOpen,
    isHovered,
    openSubmenu,
    toggleSubmenuState,
    toggleSidebar,
    toggleMobileSidebar,
  }
}
