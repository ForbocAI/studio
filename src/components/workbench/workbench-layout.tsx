"use client";

import { MessageSquare } from 'lucide-react';
import navigation from '../../../data/workbench/navigation.json';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar/sidebar-context';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar/sidebar-surface';
import {
    playgroundVisibilityChanged,
    selectActiveView,
    selectShowPlayground,
} from '@/entities/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BrainScan } from './brain-scan';
import { AgentEditor } from './editor';
import { Playground } from './playground';
import { WorkbenchSidebar } from './sidebar';
import { TraceLogs } from './trace-logs';

export const WorkbenchLayout = () => {
    const dispatch = useAppDispatch();
    const showPlayground = useAppSelector(selectShowPlayground);
    const activeView = useAppSelector(selectActiveView);
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <WorkbenchSidebar />
                <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-background">
                    <div className="absolute left-4 top-4 z-30 md:hidden">
                        <SidebarTrigger />
                    </div>
                    <main className="relative flex flex-1 overflow-hidden">
                        {activeView === 'architect' && <AgentEditor />}
                        {activeView === 'brain' && <BrainScan />}
                        {activeView === 'trace' && <TraceLogs />}
                        {showPlayground && (
                            <aside className="absolute inset-y-0 right-0 z-20 w-full max-w-md xl:relative xl:z-auto">
                                <Playground />
                            </aside>
                        )}
                        {!showPlayground && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-4 z-20"
                                onClick={() => dispatch(playgroundVisibilityChanged(true))}
                                aria-label={navigation.playground.showLabel}
                                title={navigation.playground.showLabel}
                            >
                                <MessageSquare className="size-4" />
                            </Button>
                        )}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};
