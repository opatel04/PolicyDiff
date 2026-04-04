"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Search, ArrowRight, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";

const discordances = [
    {
        id: "dsc1",
        payer: "Aetna",
        drug: "Ustekinumab",
        criterion: "Step Therapy required",
        description: "Medical requires 4 prior DMARD failures; pharmacy requires 2",
        medical: { val: "4 failures", sev: "destructive" },
        pharmacy: { val: "2 failures", sev: "warning" },
        mostRestrictive: "Medical Benefit",
    },
    {
        id: "dsc2",
        payer: "Cigna",
        drug: "Infliximab",
        criterion: "Prescriber Requirement",
        description: "Medical requires Rheumatologist; pharmacy accepts any specialist",
        medical: { val: "Rheumatologist Only", sev: "destructive" },
        pharmacy: { val: "Any Specialist", sev: "success" },
        mostRestrictive: "Medical Benefit",
    },
    {
        id: "dsc3",
        payer: "UnitedHealthcare",
        drug: "Rituximab",
        criterion: "Trial Duration",
        description: "Pharmacy benefit requires 16 weeks prior trial; medical requires 12 weeks",
        medical: { val: "12 weeks", sev: "success" },
        pharmacy: { val: "16 weeks", sev: "destructive" },
        mostRestrictive: "Pharmacy Benefit",
    }
];

export default function DiscordancePage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Discordance Alerts</h2>
                    <p className="text-muted-text mt-1">
                        Identify criteria discrepancies between medical and pharmacy benefit policies for the same drug.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-text" />
                        <Input
                            placeholder="Filter by drug or payer..."
                            className="pl-9 bg-card border-border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="shrink-0 bg-card">
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {discordances.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-stretch">
                            <div className="bg-destructive/10 border-r border-border p-6 flex flex-col items-center justify-center md:w-48 shrink-0 text-center space-y-2">
                                <ShieldAlert className="h-8 w-8 text-destructive opacity-80" />
                                <span className="font-semibold text-primary-text">{item.payer}</span>
                                <span className="font-mono text-sm text-muted-text">{item.drug}</span>
                            </div>
                            <div className="p-6 flex-1 space-y-4">
                                <div>
                                    <h4 className="text-lg font-semibold flex items-center gap-2">
                                        Discordance: {item.criterion}
                                    </h4>
                                    <p className="text-muted-text text-sm mt-1">{item.description}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-md border border-border bg-background space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-text uppercase tracking-wider">Medical Benefit</span>
                                            {item.mostRestrictive === "Medical Benefit" && (
                                                <Badge variant="outline" className="text-[10px] border-destructive text-destructive bg-destructive/10">Most Restrictive</Badge>
                                            )}
                                        </div>
                                        <div className={`p-2 rounded text-sm font-semibold flex items-center justify-center ${item.medical.sev === 'destructive' ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                                                item.medical.sev === 'warning' ? 'bg-warning/20 text-warning border border-warning/30' :
                                                    'bg-success/20 text-success border border-success/30'
                                            }`}>
                                            {item.medical.val}
                                        </div>
                                        <div className="text-right">
                                            <Button variant="link" className="p-0 h-auto text-xs text-sky-500">View source policy <ArrowRight className="inline h-3 w-3 ml-1" /></Button>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-md border border-border bg-background space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-text uppercase tracking-wider">Pharmacy Benefit</span>
                                            {item.mostRestrictive === "Pharmacy Benefit" && (
                                                <Badge variant="outline" className="text-[10px] border-destructive text-destructive bg-destructive/10">Most Restrictive</Badge>
                                            )}
                                        </div>
                                        <div className={`p-2 rounded text-sm font-semibold flex items-center justify-center ${item.pharmacy.sev === 'destructive' ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                                                item.pharmacy.sev === 'warning' ? 'bg-warning/20 text-warning border border-warning/30' :
                                                    'bg-success/20 text-success border border-success/30'
                                            }`}>
                                            {item.pharmacy.val}
                                        </div>
                                        <div className="text-right">
                                            <Button variant="link" className="p-0 h-auto text-xs text-sky-500">View source policy <ArrowRight className="inline h-3 w-3 ml-1" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
