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

export function WorkbenchSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton tooltip={item.title} className="hover:bg-accent/50 transition-colors">
                                    {item.icon && <item.icon className="text-gold/70" />}
                                    <span className="font-medium">{item.title}</span>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <a href={subItem.url} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                        <span>{subItem.title}</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        ))}
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
                    <div className="size-8 rounded-full bg-gradient-to-br from-gold to-arcane-purple opacity-80" />
                    <div className="flex flex-col">
                        <p className="text-xs font-medium">Grandmaster</p>
                        <p className="text-[10px] text-muted-foreground">Admin Access</p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
