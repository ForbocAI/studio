"use client";

import { useAgent } from "@/hooks/use-agent";
import { Send, Bot, User, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { useAppDispatch } from "@/store/hooks";
import { resetAgentChat } from "@/store/slices/formSlice";

export function Playground() {
    const dispatch = useAppDispatch();
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useAgent();

    return (
        <div className="flex flex-col h-full bg-sidebar/30 backdrop-blur-xl border-l border-border/50 w-full max-w-md">
            <header className="h-16 border-b border-border/50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="animate-pulse bg-gold/5 border-gold/40 text-gold text-[10px]">LIVE</Badge>
                    <h2 className="font-serif text-sm font-bold tracking-wide">Playground</h2>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => dispatch(resetAgentChat())}>
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </header>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="size-12 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center">
                                <Bot className="size-6 text-gold/50" />
                            </div>
                            <p className="text-xs text-muted-foreground font-mono max-w-[200px]">
                                The agent awaits your command. Type into the manifest to begin.
                            </p>
                        </div>
                    )}
                    {messages.map((m: any) => (
                        <div
                            key={m.id}
                            className={`flex gap-3 animate-in fade-in duration-300 ${m.role === 'user' ? 'flex-row-reverse slide-in-from-right-5' : 'slide-in-from-left-5'}`}
                        >
                            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-arcane-purple/20 border border-arcane-purple/30' : 'bg-gold/10 border border-gold/20'
                                }`}>
                                {m.role === 'user' ? <User className="size-4 text-arcane-purple" /> : <Bot className="size-4 text-gold" />}
                            </div>
                            <div className={`flex flex-col space-y-1 ${m.role === 'user' ? 'items-end' : ''}`}>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">{m.role}</span>
                                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-arcane-purple/10 text-foreground rounded-tr-none border border-arcane-purple/20'
                                    : 'bg-black/40 text-muted-foreground rounded-tl-none border border-border/50'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 animate-in fade-in duration-300">
                            <div className="size-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                                <Loader2 className="size-4 text-gold animate-spin" />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">Thinking</span>
                                <div className="p-3 rounded-2xl text-sm leading-relaxed bg-black/40 text-muted-foreground/50 rounded-tl-none border border-border/50 animate-pulse">
                                    Processing multi-round protocol...
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <footer className="p-4 border-t border-border/50">
                <form onSubmit={handleSubmit} className="relative">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Transmit command..."
                        className="pr-12 bg-black/40 border-border/50 focus:border-gold/50 font-mono text-xs h-12"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10 bg-gold text-background hover:bg-gold/90"
                    >
                        <Send className="size-4" />
                    </Button>
                </form>
                <p className="text-[10px] text-center text-muted-foreground mt-3 font-mono">
                    Tokens used: 0 | Latency: 42ms
                </p>
            </footer>
        </div>
    );
}
