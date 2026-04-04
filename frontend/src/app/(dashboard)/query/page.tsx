"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Clock, BookOpen, Quote, Sparkles, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";

const suggestedQueries = [
    "Which plans cover infliximab for Crohn's disease?",
    "What prior auth criteria does UHC require for Remicade in rheumatoid arthritis?",
    "Compare step therapy requirements for adalimumab across Aetna and UHC",
    "What changed in UHC's infliximab policy between Jan 2025 and Feb 2026?",
    "Does Aetna's medical policy for rituximab differ from their pharmacy policy?",
];

const mockResponse = `
### Step Therapy Requirements for Adalimumab: Aetna vs UHC

Both Aetna and UnitedHealthcare cover adalimumab (Humira and its biosimilars) for Rheumatoid Arthritis, but their step therapy requirements differ significantly in restrictiveness.

| Payer | Preferred Products | Step Therapy Failures Required | Trial Duration |
|-------|-------------------|--------------------------------|----------------|
| **Aetna** | Cyltezo, Amjevita (Rank 1) | **1 failure** required (conventional DMARD e.g., methotrexate) | 12 weeks |
| **UnitedHealthcare (UHC)** | Amjevita | **2 failures** required (one DMARD *plus* one targeted conventional therapy) | 14 weeks |

**Summary**: Aetna is **less restrictive** (🟡) than UnitedHealthcare (🔴) for adalimumab step therapy. Aetna requires a single trial of a conventional DMARD for 12 weeks, whereas UHC requires two prior therapies for an extended trial period of 14 weeks.

*Please note: Data is based on current ingested Commercial policies as of Q1 2026.*
`;

export default function QueryInterfacePage() {
    const [query, setQuery] = useState("");
    const [isResponding, setIsResponding] = useState(false);
    const [hasQueried, setHasQueried] = useState(false);
    const [citationsOpen, setCitationsOpen] = useState(false);

    const handleQuery = (e: React.FormEvent | string) => {
        if (typeof e !== "string") e.preventDefault();
        setIsResponding(true);
        setTimeout(() => {
            setIsResponding(false);
            setHasQueried(true);
        }, 1200);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 h-[calc(100vh-2rem)] flex flex-col">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Query Interface</h2>
                <p className="text-muted-text mt-1">
                    Natural language search powered by Bedrock. Ask questions about extracted policies.
                </p>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                <div className="hidden lg:block w-64 shrink-0 space-y-6 overflow-y-auto pr-2">
                    <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center">
                            <Clock className="h-4 w-4 mr-2" /> Recent Queries
                        </h4>
                        <div className="space-y-2">
                            {["Who requires a rheumatologist for ustekinumab?", "Aetna CPB 0321 changes", "Infliximab dosing limit UHC"].map((q, i) => (
                                <button key={i} className="text-left w-full text-sm text-muted-text hover:text-primary-text hover:underline truncate py-1">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-w-0 bg-card rounded-xl border border-border overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {!hasQueried && !isResponding && (
                            <div className="h-full flex flex-col items-center justify-center space-y-8 text-center max-w-2xl mx-auto">
                                <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Ask anything about drug policies.</h3>
                                    <p className="text-muted-text">Type a question or choose a suggested query below to get cited answers instantly.</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {suggestedQueries.map((sq, i) => (
                                        <Badge
                                            key={i}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-white/10 hover:text-primary-text text-muted-text px-3 py-1.5"
                                            onClick={() => { setQuery(sq); handleQuery(sq); }}
                                        >
                                            "{sq}"
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isResponding && (
                            <div className="flex items-center gap-4 text-muted-text animate-pulse">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">Synthesizing intelligence...</span>
                            </div>
                        )}

                        {hasQueried && !isResponding && (
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 shrink-0 bg-white/10 rounded-full flex items-center justify-center text-sm font-semibold">
                                        You
                                    </div>
                                    <div className="pt-1.5">
                                        <p className="text-primary-text font-medium text-lg leading-tight">
                                            {query || "Compare step therapy requirements for adalimumab across Aetna and UHC"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 space-y-4 pt-1">
                                        <div className="prose prose-invert prose-sm max-w-none text-primary-text prose-p:leading-relaxed prose-th:bg-background/50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2">
                                            <ReactMarkdown>{mockResponse}</ReactMarkdown>
                                        </div>

                                        <div className="mt-6 border border-border rounded-md overflow-hidden bg-background">
                                            <button
                                                className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-white/5 transition"
                                                onClick={() => setCitationsOpen(!citationsOpen)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-muted-text" />
                                                    <span>View 2 Citations</span>
                                                </div>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${citationsOpen ? "rotate-180" : ""}`} />
                                            </button>
                                            {citationsOpen && (
                                                <div className="p-4 border-t border-border space-y-4 bg-background">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Badge variant="outline" className="text-[10px] text-muted-text border-border">AETNA</Badge>
                                                            <span className="font-semibold">CPB 0321 (Effective Feb 12, 2026)</span>
                                                        </div>
                                                        <div className="flex gap-3 pl-2 border-l-2 border-border/50 text-sm text-muted-text">
                                                            <Quote className="h-4 w-4 shrink-0 mt-0.5" />
                                                            <p>"Patient must have a documented inadequate response to at least one conventional DMARD (e.g., methotrexate) for a minimum of 12 weeks prior to authorization of a preferred adalimumab product (Cyltezo, Amjevita)."</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Badge variant="outline" className="text-[10px] text-muted-text border-border">UNITEDHEALTHCARE</Badge>
                                                            <span className="font-semibold">Medical Benefit: Adalimumab (Effective Jan 1, 2026)</span>
                                                        </div>
                                                        <div className="flex gap-3 pl-2 border-l-2 border-border/50 text-sm text-muted-text">
                                                            <Quote className="h-4 w-4 shrink-0 mt-0.5" />
                                                            <p>"Authorization requires documentation demonstrating trial and failure of two prior therapies, consisting of one conventional disease-modifying antirheumatic drug AND one targeted synthetic DMARD, each for a duration of no less than 14 weeks."</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-border bg-background">
                        <form onSubmit={handleQuery} className="relative">
                            <Input
                                placeholder="Message PolicyDiff intelligence..."
                                className="w-full bg-card border-border pr-12 h-12 text-md shadow-inner"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-2 top-2 h-8 w-8"
                                disabled={isResponding || !query}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                        <p className="text-center text-[10px] text-muted-text mt-2 font-mono">
                            Query classification & synthesis via anthropic.claude-sonnet-4-5
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
