"use client";
import { Code2, Terminal, Cpu, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function TraceLogs() {
    const logs = [
        { step: 'DIRECTIVE', status: '200 OK', time: '12ms', payload: '{ "observation": "hello" }' },
        { step: 'CONTEXT', status: '200 OK', time: '45ms', payload: '{ "recalled": ["mem_1"] }' },
        { step: 'VERDICT', status: '200 OK', time: '143ms', payload: '{ "valid": true, "action": "SPEAK" }' },
    ];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-black/20 animate-in fade-in duration-500">
            <header className="p-8 border-b border-border/50 bg-background/50 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-serif font-bold text-arcane-purple">Trace Logs</h1>
                        <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Real-time Protocol Monitoring</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                            <Activity className="size-3 text-gold" />
                            <span>API Latency: 42ms</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                            <Cpu className="size-3 text-gold" />
                            <span>Cortex: Online</span>
                        </div>
                    </div>
                </div>
            </header>

            <ScrollArea className="flex-1 p-0">
                <div className="divide-y divide-border/20">
                    {logs.map((log, i) => (
                        <div key={i} className="p-6 font-mono text-xs hover:bg-white/5 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-gold/10 text-gold border-gold/20">{log.step}</Badge>
                                    <span className="text-green-500">{log.status}</span>
                                </div>
                                <span className="text-muted-foreground">{log.time}</span>
                            </div>
                            <div className="bg-black/40 p-4 rounded-lg border border-border/30 overflow-x-auto">
                                <pre className="text-gold/70">{log.payload}</pre>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
