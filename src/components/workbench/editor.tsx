"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, Zap, Shield, Wand2, Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function AgentEditor() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 overflow-auto p-8 lg:p-12 space-y-12 max-w-5xl mx-auto"
        >
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif font-bold text-gold gold-glow">Agent Architect</h1>
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Designing Soul Manifest #0X-F4B1</p>
                </div>
                <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5 px-3 py-1 font-mono text-[10px]">
                    STABLE_MANIFOLD
                </Badge>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="arcane-card md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Sparkles className="size-4 text-gold" />
                            Core Identity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground">Entity Name</label>
                                <Input placeholder="e.g. Malakor the Wise" className="bg-black/40 border-border/50 focus:border-gold/50 transition-all font-serif text-lg" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground">Archetype (Class)</label>
                                <select className="flex h-10 w-full rounded-md border border-border/50 bg-black/40 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all">
                                    <option>Scholar</option>
                                    <option>Rogue</option>
                                    <option>Paladin</option>
                                    <option>Necromancer</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground">Prime Directive (System Prompt)</label>
                            <Textarea
                                placeholder="Define the agent's fundamental nature and mission..."
                                className="min-h-[200px] bg-black/40 border-border/50 focus:border-gold/50 font-mono text-sm leading-relaxed resize-none"
                            />
                            <p className="text-[10px] text-muted-foreground italic mt-2">
                                * This will be the foundational context for all LLM interactions.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="arcane-card h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="size-4 text-arcane-purple" />
                            Manifest Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: "Logic", value: "85%", icon: Zap },
                            { label: "Lore", value: "92%", icon: Book },
                            { label: "Will", value: "74%", icon: Wand2 },
                        ].map((stat) => (
                            <div key={stat.label} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <stat.icon className="size-3 text-muted-foreground" />
                                    <span className="text-xs font-mono">{stat.label}</span>
                                </div>
                                <span className="text-xs font-bold font-mono text-gold">{stat.value}</span>
                            </div>
                        ))}
                        <Separator className="bg-border/50 my-4" />
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Model Context</span>
                            <p className="font-mono text-[10px] text-gold/70">GPT-4O-MINI-ARCANE</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-serif text-muted-foreground flex items-center gap-2">
                    <Wand2 className="size-5" />
                    Action Grimoire
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['scout_area', 'cast_spell', 'query_lore'].map((action) => (
                        <div key={action} className="p-4 rounded-xl border border-dashed border-border/100 bg-black/40 flex items-center justify-between hover:border-gold/40 transition-all cursor-pointer group">
                            <code className="text-xs text-muted-foreground group-hover:text-gold transition-colors">{action}</code>
                            <code className="text-[10px] bg-white/5 px-2 py-1 rounded">f(x)</code>
                        </div>
                    ))}
                    <div className="p-4 rounded-xl border border-dashed border-border/100 bg-black/5 flex items-center justify-center hover:bg-gold/5 hover:border-gold/40 transition-all cursor-pointer">
                        <span className="text-xs text-muted-foreground flex items-center gap-2">
                            <Sparkles className="size-3" />
                            Forge New Action
                        </span>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
