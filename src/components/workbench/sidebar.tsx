"use client";

import * as React from "react";
import Image from "next/image";
import {
    Book,
    Code2,
    History,
    LayoutDashboard,
    Library,
    Settings2,
    Sparkles,
    Sword
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar";

const data = {
    navMain: [
        {
            title: "Divine Workbench",
            url: "#",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Agent Architect",
                    url: "#",
                },
                {
                    title: "Lore Weaver",
                    url: "#",
                },
                {
                    title: "State Machine",
                    url: "#",
                },
            ],
        },
        {
            title: "Grimoires",
            url: "#",
            icon: Book,
            items: [
                {
                    title: "Prime Directives",
                    url: "#",
                },
                {
                    title: "Action Schemas",
                    url: "#",
                },
            ],
        },
    ],
    secondary: [
        {
            title: "Arsenal",
            url: "#",
            icon: Sword,
        },
        {
            title: "Chronicles",
            url: "#",
            icon: History,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
        },
    ],
};

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveView } from "@/store/slices/uiSlice";

export function WorkbenchSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const dispatch = useAppDispatch();
    const activeView = useAppSelector((state) => state.ui.activeView);
    return (
        <Sidebar variant="inset" {...props} className="border-r border-border/50 bg-sidebar/50 backdrop-blur-md">
            <SidebarHeader className="h-16 border-b border-border/50 flex items-center px-6">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Forboc AI" width={32} height={32} className="rounded-lg object-contain" />
                    <div className="flex flex-col">
                        <span className="font-serif text-lg font-bold tracking-tight text-gold">FORBOC</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">Studio</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">Core Modules</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={activeView === 'architect'}
                                onClick={() => dispatch(setActiveView('architect'))}
                                tooltip="Agent Architect"
                            >
                                <LayoutDashboard className="text-gold/70" />
                                <span className="font-medium">Agent Architect</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={activeView === 'brain'}
                                onClick={() => dispatch(setActiveView('brain'))}
                                tooltip="Lore Weaver (Brain)"
                            >
                                <Library className="text-gold/70" />
                                <span className="font-medium">Lore Weaver</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={activeView === 'trace'}
                                onClick={() => dispatch(setActiveView('trace'))}
                                tooltip="Trace Logs"
                            >
                                <Code2 className="text-gold/70" />
                                <span className="font-medium">Trace Logs</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.secondary.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild size="sm" className="hover:bg-accent/50">
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-border/50 p-4">
                <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-black/20 p-3 backdrop-blur-sm">
                    <div className="size-8 rounded-full bg-linear-to-br from-gold to-arcane-purple opacity-80" />
                    <div className="flex flex-col">
                        <p className="text-xs font-medium">Grandmaster</p>
                        <p className="text-[10px] text-muted-foreground">Admin Access</p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
