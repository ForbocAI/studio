"use client";

import * as React from 'react';
import { fromNullable, match } from '@forbocai/core';
import navigation from '../../../../data/workbench/navigation.json';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
    mobileSidebarToggled,
    mobileSidebarVisibilityChanged,
    selectSidebar,
    sidebarToggled,
    sidebarVisibilityChanged,
} from '@/entities/ui/uiSlice';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface SidebarContextValue {
    readonly state: 'expanded' | 'collapsed';
    readonly open: boolean;
    readonly setOpen: (open: boolean) => void;
    readonly openMobile: boolean;
    readonly setOpenMobile: (open: boolean) => void;
    readonly isMobile: boolean;
    readonly toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export const useSidebar = (): SidebarContextValue => match(
    fromNullable(React.useContext(SidebarContext)),
    (context) => context,
    () => {
        throw new Error(navigation.sidebar.contextError);
    },
);

export const SidebarProvider = ({
    className,
    style,
    children,
    ...props
}: React.ComponentProps<'div'>) => {
    const dispatch = useAppDispatch();
    const { open, openMobile, isMobile } = useAppSelector(selectSidebar);
    const setOpen = React.useCallback(
        (value: boolean) => dispatch(sidebarVisibilityChanged(value)),
        [dispatch],
    );
    const setOpenMobile = React.useCallback(
        (value: boolean) => dispatch(mobileSidebarVisibilityChanged(value)),
        [dispatch],
    );
    const toggleSidebar = React.useCallback(
        () => dispatch(isMobile ? mobileSidebarToggled() : sidebarToggled()),
        [dispatch, isMobile],
    );
    const context = React.useMemo<SidebarContextValue>(() => ({
        state: open ? 'expanded' : 'collapsed',
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
    }), [isMobile, open, openMobile, setOpen, setOpenMobile, toggleSidebar]);

    return (
        <SidebarContext.Provider value={context}>
            <TooltipProvider delayDuration={0}>
                <div
                    data-slot="sidebar-wrapper"
                    style={{
                        '--sidebar-width': '16rem',
                        '--sidebar-width-icon': '3rem',
                        ...style,
                    } as React.CSSProperties}
                    className={cn(
                        'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
                        className,
                    )}
                    {...props}
                >
                    {children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    );
};
