"use client";

import * as React from 'react';
import { PanelLeftIcon } from 'lucide-react';
import navigation from '../../../../data/workbench/navigation.json';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar-context';

interface SidebarProps extends React.ComponentProps<'div'> {
    readonly side?: 'left' | 'right';
    readonly variant?: 'sidebar' | 'floating' | 'inset';
    readonly collapsible?: 'offcanvas' | 'icon' | 'none';
}

const StaticSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<'div'>) => (
    <div
        data-slot="sidebar"
        className={cn(
            'bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col',
            className,
        )}
        {...props}
    >
        {children}
    </div>
);

const MobileSidebar = ({
    side,
    children,
    ...props
}: SidebarProps) => {
    const { openMobile, setOpenMobile } = useSidebar();
    return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
            <SheetContent
                data-sidebar="sidebar"
                data-slot="sidebar"
                data-mobile="true"
                className="bg-sidebar text-sidebar-foreground w-72 p-0 [&>button]:hidden"
                side={side}
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>{navigation.sidebar.mobileTitle}</SheetTitle>
                    <SheetDescription>{navigation.sidebar.mobileDescription}</SheetDescription>
                </SheetHeader>
                <div className="flex h-full w-full flex-col">{children}</div>
            </SheetContent>
        </Sheet>
    );
};

const DesktopSidebar = ({
    side,
    variant,
    collapsible,
    className,
    children,
    ...props
}: SidebarProps) => {
    const { state } = useSidebar();
    return (
        <div
            className="group peer text-sidebar-foreground hidden md:block"
            data-state={state}
            data-collapsible={state === 'collapsed' ? collapsible : ''}
            data-variant={variant}
            data-side={side}
            data-slot="sidebar"
        >
            <div
                data-slot="sidebar-gap"
                className={cn(
                    'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
                    'group-data-[collapsible=offcanvas]:w-0',
                    'group-data-[side=right]:rotate-180',
                    variant === 'floating' || variant === 'inset'
                        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
                        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
                )}
            />
            <div
                data-slot="sidebar-container"
                className={cn(
                    'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
                    side === 'left'
                        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
                        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
                    variant === 'floating' || variant === 'inset'
                        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
                    className,
                )}
                {...props}
            >
                <div
                    data-sidebar="sidebar"
                    data-slot="sidebar-inner"
                    className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Sidebar = ({
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    ...props
}: SidebarProps) => {
    const { isMobile } = useSidebar();
    return collapsible === 'none'
        ? <StaticSidebar {...props} />
        : isMobile
            ? <MobileSidebar side={side} {...props} />
            : <DesktopSidebar
                side={side}
                variant={variant}
                collapsible={collapsible}
                {...props}
            />;
};

const surface = (slot: string, classes: string) => {
    const SidebarSurface = ({
        className,
        ...props
    }: React.ComponentProps<'div'>) => (
        <div data-slot={slot} className={cn(classes, className)} {...props} />
    );
    SidebarSurface.displayName = slot;
    return SidebarSurface;
};

export const SidebarHeader = surface('sidebar-header', 'flex flex-col gap-2 p-2');
export const SidebarFooter = surface('sidebar-footer', 'flex flex-col gap-2 p-2');
export const SidebarContent = surface(
    'sidebar-content',
    'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
);
export const SidebarGroup = surface(
    'sidebar-group',
    'relative flex w-full min-w-0 flex-col p-2',
);
export const SidebarGroupLabel = surface(
    'sidebar-group-label',
    'text-sidebar-foreground/70 flex h-8 shrink-0 items-center px-2 text-xs font-medium',
);
export const SidebarGroupContent = surface('sidebar-group-content', 'w-full text-sm');

export const SidebarInset = ({
    className,
    ...props
}: React.ComponentProps<'main'>) => (
    <main
        data-slot="sidebar-inset"
        className={cn(
            'bg-background relative flex w-full flex-1 flex-col',
            'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
            className,
        )}
        {...props}
    />
);

export const SidebarTrigger = ({
    className,
    ...props
}: React.ComponentProps<typeof Button>) => {
    const { toggleSidebar } = useSidebar();
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn('size-8', className)}
            onClick={toggleSidebar}
            aria-label={navigation.sidebar.toggleLabel}
            title={navigation.sidebar.toggleLabel}
            {...props}
        >
            <PanelLeftIcon />
        </Button>
    );
};
