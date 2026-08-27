"use client";

import { useMemo, useState } from 'react';
import { Database, Search } from 'lucide-react';
import { fromNullable, match } from '@forbocai/core';
import content from '../../../data/workbench/memory.json';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { selectAgent } from '@/entities/agent/agentSlice';
import { useListNpcMemoryQuery } from '@/store/api/agentApi';
import { useAppSelector } from '@/store/hooks';

const formatTimestamp = (timestamp: number): string => new Intl.DateTimeFormat(
    content.timestampLocale,
    { dateStyle: 'medium', timeStyle: 'short' },
).format(new Date(timestamp));

const formatScore = (value: number): string => value.toFixed(content.fractionDigits);

export const BrainScan = () => {
    const agent = useAppSelector(selectAgent);
    const [query, setQuery] = useState('');
    const { data = [], isError, isFetching } = useListNpcMemoryQuery(agent.id);
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const memories = useMemo(
        () => data.filter((memory) => normalizedQuery.length === 0
            || memory.text.toLocaleLowerCase().includes(normalizedQuery)
            || memory.type.toLocaleLowerCase().includes(normalizedQuery)),
        [data, normalizedQuery],
    );

    return (
        <div className="flex flex-1 flex-col overflow-hidden pt-12 md:pt-0">
            <header className="space-y-5 border-b border-border p-6 lg:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-serif font-bold text-gold">
                            {content.heading}
                        </h1>
                        <p className="text-sm text-muted-foreground">{content.description}</p>
                    </div>
                    <Badge variant="outline">{content.connected}</Badge>
                </div>
                <div className="relative max-w-2xl">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={content.searchPlaceholder}
                        className="pl-10"
                    />
                </div>
            </header>

            <ScrollArea className="flex-1 p-6 lg:p-8">
                {isFetching && <p className="text-sm text-muted-foreground">{content.loading}</p>}
                {isError && <p role="alert" className="text-sm text-destructive">{content.error}</p>}
                {!isFetching && !isError && memories.length === 0 && (
                    <p className="text-sm text-muted-foreground">{content.empty}</p>
                )}
                <div className="grid gap-4">
                    {memories.map((memory) => {
                        const progress = Math.min(
                            content.percentageMaximum,
                            Math.max(
                                0,
                                memory.importance / content.importanceMaximum
                                    * content.percentageMaximum,
                            ),
                        );
                        return (
                            <article key={memory.id} className="rounded border border-border bg-card p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <Badge variant="secondary">{memory.type}</Badge>
                                    <time className="text-xs text-muted-foreground">
                                        {formatTimestamp(memory.timestamp)}
                                    </time>
                                </div>
                                <p className="mb-4 text-sm leading-relaxed">{memory.text}</p>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1 font-mono">
                                        <Database className="size-3" />
                                        {content.identifierLabel}: {memory.id}
                                    </span>
                                    <span>
                                        {content.importanceLabel}: {formatScore(memory.importance)}
                                    </span>
                                    {match(
                                        fromNullable(memory.similarity),
                                        (similarity) => (
                                            <span>
                                                {content.similarityLabel}: {formatScore(similarity)}
                                            </span>
                                        ),
                                        () => null,
                                    )}
                                    <span className="h-1 w-24 overflow-hidden rounded bg-muted">
                                        <span
                                            className="block h-full bg-gold"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};
