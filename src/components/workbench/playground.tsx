"use client";

import { Bot, Loader2, PanelRightClose, Send, Trash2, User } from 'lucide-react';
import { fromNullable, match } from '@forbocai/core';
import content from '../../../data/workbench/playground.json';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatCleared, type ChatRole } from '@/entities/chat/chatSlice';
import { playgroundVisibilityChanged } from '@/entities/ui/uiSlice';
import { useAgent } from '@/hooks/use-agent';
import { useAppDispatch } from '@/store/hooks';

const roleIcons = { user: User, assistant: Bot } as const;

export const Playground = () => {
    const dispatch = useAppDispatch();
    const {
        error,
        handleInputChange,
        handleSubmit,
        input,
        isLoading,
        latestTrace,
        messages,
    } = useAgent();
    const status = isLoading
        ? 'pending'
        : latestTrace?.status ?? 'idle';

    return (
        <div className="flex h-full w-full flex-col border-l border-border bg-background">
            <header className="flex h-16 items-center justify-between border-b border-border px-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">{content.statuses[status]}</Badge>
                    <h2 className="font-serif text-sm font-bold">{content.title}</h2>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(chatCleared())}
                        aria-label={content.clearLabel}
                        title={content.clearLabel}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(playgroundVisibilityChanged(false))}
                        aria-label={content.closeLabel}
                        title={content.closeLabel}
                    >
                        <PanelRightClose className="size-4" />
                    </Button>
                </div>
            </header>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                            <Bot className="size-8 text-gold/60" />
                            <p className="max-w-64 text-xs text-muted-foreground">
                                {content.empty}
                            </p>
                        </div>
                    )}
                    {messages.map((message) => {
                        const role = message.role as ChatRole;
                        const Icon = roleIcons[role];
                        return (
                            <div
                                key={message.id}
                                className={role === 'user'
                                    ? 'flex flex-row-reverse gap-3'
                                    : 'flex gap-3'}
                            >
                                <div className="flex size-8 shrink-0 items-center justify-center rounded border border-border bg-card">
                                    <Icon className="size-4" />
                                </div>
                                <div className={role === 'user'
                                    ? 'flex max-w-[80%] flex-col items-end gap-1'
                                    : 'flex max-w-[80%] flex-col gap-1'}
                                >
                                    <span className="text-[10px] uppercase text-muted-foreground">
                                        {content.roles[role]}
                                    </span>
                                    <div className="rounded border border-border bg-card p-3 text-sm leading-relaxed">
                                        {message.content}
                                    </div>
                                    {match(
                                        fromNullable(message.action),
                                        (action) => (
                                            <Badge variant="secondary">
                                                {content.result.actionLabel}: {action}
                                            </Badge>
                                        ),
                                        () => null,
                                    )}
                                    {match(
                                        fromNullable(message.thought),
                                        (thought) => (
                                            <p className="rounded border border-border/70 bg-muted/40 p-2 text-xs text-muted-foreground">
                                                <strong>{content.result.thoughtLabel}:</strong> {thought}
                                            </p>
                                        ),
                                        () => null,
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin text-gold" />
                            {content.thinking}
                        </div>
                    )}
                    {error && (
                        <p role="alert" className="rounded border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </p>
                    )}
                </div>
            </ScrollArea>

            <footer className="border-t border-border p-4">
                <form onSubmit={handleSubmit} className="relative">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder={content.inputPlaceholder}
                        className="h-12 pr-12"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1 size-10"
                        disabled={!input.trim() || isLoading}
                        aria-label={content.sendLabel}
                        title={content.sendLabel}
                    >
                        <Send className="size-4" />
                    </Button>
                </form>
                {match(
                    fromNullable(latestTrace?.durationMilliseconds),
                    (duration) => (
                        <p className="mt-3 text-center text-[10px] text-muted-foreground">
                            {content.timing.label}: {duration}{content.timing.unit}
                        </p>
                    ),
                    () => null,
                )}
            </footer>
        </div>
    );
};
