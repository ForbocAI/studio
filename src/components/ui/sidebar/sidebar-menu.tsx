"use client";

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar-context';

export const SidebarMenu = ({
    className,
    ...props
}: React.ComponentProps<'ul'>) => (
    <ul
        data-slot="sidebar-menu"
        data-sidebar="menu"
        className={cn('flex w-full min-w-0 flex-col gap-1', className)}
        {...props}
    />
);

export const SidebarMenuItem = ({
    className,
    ...props
}: React.ComponentProps<'li'>) => (
    <li
        data-slot="sidebar-menu-item"
        data-sidebar="menu-item"
        className={cn('group/menu-item relative', className)}
        {...props}
    />
);

const buttonVariants = cva(
    'peer/menu-button ring-sidebar-ring flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
    {
        variants: {
            size: {
                default: 'h-8 text-sm',
                sm: 'h-7 text-xs',
            },
        },
        defaultVariants: { size: 'default' },
    },
);

interface SidebarMenuButtonProps extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
    readonly asChild?: boolean;
    readonly isActive?: boolean;
    readonly tooltip?: string;
}

export const SidebarMenuButton = ({
    asChild = false,
    isActive = false,
    size,
    tooltip,
    className,
    ...props
}: SidebarMenuButtonProps) => {
    const Component = asChild ? Slot.Root : 'button';
    const { isMobile, state } = useSidebar();
    const button = (
        <Component
            data-slot="sidebar-menu-button"
            data-sidebar="menu-button"
            data-active={isActive}
            className={cn(buttonVariants({ size }), className)}
            {...props}
        />
    );
    return tooltip
        ? (
            <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent
                    side="right"
                    align="center"
                    hidden={state !== 'collapsed' || isMobile}
                >
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        )
        : button;
};
