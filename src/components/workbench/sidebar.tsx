"use client";

import Image from 'next/image';
import {
    Activity,
    Brain,
    LayoutDashboard,
    type LucideIcon,
} from 'lucide-react';
import navigation from '../../../data/workbench/navigation.json';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
} from '@/components/ui/sidebar/sidebar-surface';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar/sidebar-menu';
import {
    activeViewChanged,
    selectActiveView,
    type ActiveView,
} from '@/entities/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const icons: Readonly<Record<string, LucideIcon>> = {
    architect: LayoutDashboard,
    brain: Brain,
    trace: Activity,
};

export const WorkbenchSidebar = () => {
    const dispatch = useAppDispatch();
    const activeView = useAppSelector(selectActiveView);
    return (
        <Sidebar variant="inset" className="border-r border-border/50 bg-sidebar/50">
            <SidebarHeader className="h-16 border-b border-border/50 flex items-center px-6">
                <div className="flex items-center gap-3">
                    <Image
                        src={navigation.brand.logo}
                        alt={navigation.brand.logoAlt}
                        width={navigation.brand.logoWidth}
                        height={navigation.brand.logoHeight}
                        className="rounded object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="font-serif text-lg font-bold text-gold">
                            {navigation.brand.name}
                        </span>
                        <span className="text-[10px] uppercase text-muted-foreground">
                            {navigation.brand.product}
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-mono uppercase text-muted-foreground/70">
                        {navigation.groupLabel}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {navigation.views.map((view) => {
                            const Icon = icons[view.icon];
                            return (
                                <SidebarMenuItem key={view.id}>
                                    <SidebarMenuButton
                                        isActive={activeView === view.id}
                                        onClick={() => dispatch(activeViewChanged(
                                            view.id as ActiveView,
                                        ))}
                                        tooltip={view.tooltip}
                                    >
                                        <Icon className="text-gold/70" />
                                        <span>{view.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};
