import { useAppSelector } from "@/store/hooks"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  return useAppSelector((state) => state.ui.sidebar.isMobile)
}
