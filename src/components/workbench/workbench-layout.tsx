"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { WorkbenchSidebar } from "./sidebar";
import { AgentEditor } from "./editor";
import { Playground } from "./playground";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings, ChevronRight } from "lucide-react";

export function WorkbenchLayout() {
    const [showPlayground, setShowPlayground] = useState(true);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-gold/20 selection:text-gold uppercase-headings">
                <WorkbenchSidebar />
                <SidebarInset className="flex flex-col flex-1 relative bg-[radial-gradient(ellipse_at_top,_oklch(0.2_0.05_280_/_0.05),_transparent)] overflow-hidden">
                    <main className="flex flex-1 overflow-hidden relative">
                        <AgentEditor />

                        {showPlayground && (
                            <aside className="hidden xl:block">
                                <Playground />
                            </aside>
                        )}

                        {!showPlayground && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-4 z-50 rounded-full border border-border bg-background shadow-lg"
                                onClick={() => setShowPlayground(true)}
                            >
                                <MessageSquare className="size-4" />
                            </Button>
                        )}

                        {showPlayground && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-[430px] top-4 z-50 rounded-full border border-border bg-background shadow-lg xl:block hidden"
                                onClick={() => setShowPlayground(false)}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        )}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
