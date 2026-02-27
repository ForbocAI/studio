"use client";
import { motion } from "framer-motion";
import { Brain, Database, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function BrainScan() {
    const memories = [
        { id: '1', text: 'Encountered Malakor at the gates.', importance: 0.8, timestamp: '2 minutes ago', type: 'experience' },
        { id: '2', text: 'Learned the secret of the silver key.', importance: 0.95, timestamp: '1 hour ago', type: 'lore' },
        { id: '3', text: 'The sky turned red when the spell was cast.', importance: 0.6, timestamp: '3 hours ago', type: 'observation' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col overflow-hidden"
        >
            <header className="p-8 border-b border-border/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-serif font-bold text-gold">Brain Scan</h1>
                        <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Inspecting Long-Term Vector Manifold</p>
                    </div>
                    <Badge className="bg-arcane-purple/20 text-arcane-purple border-arcane-purple/30 font-mono">
                        CONNECTED: LANCE_DB
                    </Badge>
                </div>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input placeholder="Search memory vectors..." className="pl-10 bg-black/40 border-border/30" />
                    </div>
                    <Button variant="outline" className="border-border/30">
                        <Filter className="size-4 mr-2" /> Filter
                    </Button>
                </div>
            </header>

            <ScrollArea className="flex-1 p-8">
                <div className="grid gap-4">
                    {memories.map((m) => (
                        <div key={m.id} className="p-4 rounded-xl border border-border/30 bg-black/20 hover:border-gold/30 transition-all group">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="text-[10px] font-mono uppercase bg-white/5">{m.type}</Badge>
                                <span className="text-[10px] text-muted-foreground font-mono">{m.timestamp}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/80 mb-4">{m.text}</p>
                            <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Database className="size-3" />
                                    <span>ID: {m.id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gold" style={{ width: `${m.importance * 100}%` }} />
                                    </div>
                                    <span>Importance: {m.importance}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </motion.div>
    );
}

import { Button } from "@/components/ui/button";
