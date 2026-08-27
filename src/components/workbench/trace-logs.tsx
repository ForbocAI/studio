"use client";

import { Activity, Trash2 } from 'lucide-react';
import { fromNullable, match } from '@forbocai/core';
import content from '../../../data/workbench/trace.json';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    selectProtocolTraces,
    tracesCleared,
} from '@/entities/trace/traceSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const formatTimestamp = (timestamp: number): string => new Intl.DateTimeFormat(
    content.timestampLocale,
    { dateStyle: 'medium', timeStyle: 'medium' },
).format(new Date(timestamp));

export const TraceLogs = () => {
    const dispatch = useAppDispatch();
    const traces = useAppSelector(selectProtocolTraces);
    return (
        <div className="flex flex-1 flex-col overflow-hidden pt-12 md:pt-0">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6 lg:p-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-serif font-bold text-gold">
                        {content.heading}
                    </h1>
                    <p className="text-sm text-muted-foreground">{content.description}</p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => dispatch(tracesCleared())}
                    disabled={traces.length === 0}
                    aria-label={content.clearLabel}
                    title={content.clearLabel}
                >
                    <Trash2 className="size-4" />
                </Button>
            </header>

            <ScrollArea className="flex-1">
                {traces.length === 0 && (
                    <div className="flex items-center gap-3 p-8 text-sm text-muted-foreground">
                        <Activity className="size-4" />
                        {content.empty}
                    </div>
                )}
                <div className="divide-y divide-border">
                    {traces.map((trace) => (
                        <article key={trace.id} className="grid gap-4 p-6 font-mono text-xs sm:grid-cols-4">
                            <div>
                                <p className="mb-1 text-muted-foreground">{content.operationLabel}</p>
                                <p>{trace.operation}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-muted-foreground">{content.statusLabel}</p>
                                <Badge variant="outline">{trace.status}</Badge>
                            </div>
                            <div>
                                <p className="mb-1 text-muted-foreground">{content.durationLabel}</p>
                                <p>
                                    {match(
                                        fromNullable(trace.durationMilliseconds),
                                        (duration) => `${duration}${content.durationUnit}`,
                                        () => content.pendingDuration,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-muted-foreground">{content.startedLabel}</p>
                                <time>{formatTimestamp(trace.startedAt)}</time>
                            </div>
                        </article>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
