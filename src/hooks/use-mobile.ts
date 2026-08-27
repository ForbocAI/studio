import { selectIsMobile } from '@/entities/ui/uiSlice';
import { useAppSelector } from '@/store/hooks';

export const useIsMobile = (): boolean => useAppSelector(selectIsMobile);
