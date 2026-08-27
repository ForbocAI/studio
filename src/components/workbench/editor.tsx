"use client";

import { useState, type FormEvent } from 'react';
import { BrainCircuit, Database, Plus, Trash2, Waypoints } from 'lucide-react';
import { nanoid } from '@reduxjs/toolkit';
import content from '../../../data/workbench/editor.json';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    agentActionAdded,
    agentActionRemoved,
    agentArchetypeChanged,
    agentDirectiveChanged,
    agentNameChanged,
    selectAgent,
} from '@/entities/agent/agentSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const ownershipIcons = [BrainCircuit, Database, Waypoints];

export const AgentEditor = () => {
    const dispatch = useAppDispatch();
    const agent = useAppSelector(selectAgent);
    const [actionName, setActionName] = useState('');
    const addAction = (event: FormEvent): void => {
        event.preventDefault();
        const name = actionName.trim();
        const submitAction = name
            ? () => {
                dispatch(agentActionAdded({ id: nanoid(), name }));
                setActionName('');
            }
            : () => undefined;
        submitAction();
    };

    return (
        <div className="mx-auto flex-1 space-y-8 overflow-auto p-8 pt-16 lg:max-w-5xl lg:p-12">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-serif font-bold text-gold">
                        {content.heading}
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {content.description}
                    </p>
                </div>
                <Badge variant="outline" className="border-gold/30 text-gold">
                    {content.status}
                </Badge>
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{content.identity.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="space-y-2 text-xs font-medium">
                                <span>{content.identity.nameLabel}</span>
                                <Input
                                    value={agent.name}
                                    onChange={(event) => dispatch(agentNameChanged(
                                        event.target.value,
                                    ))}
                                    placeholder={content.identity.namePlaceholder}
                                />
                            </label>
                            <label className="space-y-2 text-xs font-medium">
                                <span>{content.identity.archetypeLabel}</span>
                                <select
                                    value={agent.archetype}
                                    onChange={(event) => dispatch(agentArchetypeChanged(
                                        event.target.value,
                                    ))}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    {content.identity.archetypes.map((archetype) => (
                                        <option key={archetype}>{archetype}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <label className="block space-y-2 text-xs font-medium">
                            <span>{content.identity.directiveLabel}</span>
                            <Textarea
                                value={agent.directive}
                                onChange={(event) => dispatch(agentDirectiveChanged(
                                    event.target.value,
                                ))}
                                placeholder={content.identity.directivePlaceholder}
                                className="min-h-36 resize-none"
                            />
                        </label>
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>{content.ownership.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {content.ownership.items.map((item, index) => {
                            const Icon = ownershipIcons[index];
                            return (
                                <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                    <span className="flex items-center gap-2 text-sm">
                                        <Icon className="size-4 text-muted-foreground" />
                                        {item.label}
                                    </span>
                                    <span className="text-xs font-mono text-gold">{item.value}</span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-serif">{content.actions.title}</h2>
                <form onSubmit={addAction} className="flex max-w-xl gap-2">
                    <label className="sr-only" htmlFor="new-agent-action">
                        {content.actions.inputLabel}
                    </label>
                    <Input
                        id="new-agent-action"
                        value={actionName}
                        onChange={(event) => setActionName(event.target.value)}
                        placeholder={content.actions.inputPlaceholder}
                    />
                    <Button type="submit" disabled={!actionName.trim()}>
                        <Plus className="size-4" />
                        {content.actions.addLabel}
                    </Button>
                </form>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {agent.actions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between gap-3 rounded border border-border bg-card p-3">
                            <code className="truncate text-xs">{action.name}</code>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => dispatch(agentActionRemoved(action.id))}
                                aria-label={`${content.actions.removeLabel}: ${action.name}`}
                                title={content.actions.removeLabel}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                    {agent.actions.length === 0 && (
                        <p className="text-sm text-muted-foreground">{content.actions.empty}</p>
                    )}
                </div>
            </section>
        </div>
    );
};
