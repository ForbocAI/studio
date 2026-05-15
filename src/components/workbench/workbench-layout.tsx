"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { WorkbenchSidebar } from "./sidebar";
import { AgentEditor } from "./editor";
import { Playground } from "./playground";
import { BrainScan } from "./brain-scan";
import { TraceLogs } from "./trace-logs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveView, setShowPlayground } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight } from "lucide-react";

export function WorkbenchLayout() {
    const dispatch = useAppDispatch();
    const showPlayground = useAppSelector((state) => state.ui.showPlayground);
    const activeView = useAppSelector((state) => state.ui.activeView);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-gold/20 selection:text-gold uppercase-headings">
                <WorkbenchSidebar />
                <SidebarInset className="flex flex-col flex-1 relative bg-[radial-gradient(ellipse_at_top,oklch(0.2_0.05_280/0.05),transparent)] overflow-hidden">
                    <main className="flex flex-1 overflow-hidden relative">
                        {activeView === 'architect' && <AgentEditor />}
                        {activeView === 'brain' && <BrainScan />}
                        {activeView === 'trace' && <TraceLogs />}

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
                                onClick={() => dispatch(setShowPlayground(true))}
                            >
                                <MessageSquare className="size-4" />
                            </Button>
                        )}

                        {showPlayground && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-[430px] top-4 z-50 rounded-full border border-border bg-background shadow-lg xl:block hidden"
                                onClick={() => dispatch(setShowPlayground(false))}
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
