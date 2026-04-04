"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ChevronDown, ChevronRight, TableProperties } from "lucide-react";
import Link from "next/link";

const drugsData = [
    {
        id: "d1",
        name: "Infliximab",
        brandNames: "Remicade, Inflectra, Avsola",
        payers: ["UnitedHealthcare", "Aetna", "Cigna", "Anthem"],
        indications: 14,
        lastUpdated: "Feb 12, 2026",
    },
    {
        id: "d2",
        name: "Adalimumab",
        brandNames: "Humira, Amjevita, Cyltezo",
        payers: ["UnitedHealthcare", "Aetna", "Cigna"],
        indications: 11,
        lastUpdated: "Feb 10, 2026",
    },
    {
        id: "d3",
        name: "Ustekinumab",
        brandNames: "Stelara, Wezlana",
        payers: ["UnitedHealthcare", "Aetna", "Anthem"],
        indications: 4,
        lastUpdated: "Jan 15, 2026",
    },
    {
        id: "d4",
        name: "Rituximab",
        brandNames: "Rituxan, Truxima, Ruxience",
        payers: ["UnitedHealthcare", "Cigna"],
        indications: 9,
        lastUpdated: "Dec 05, 2025",
    },
];

export default function DrugExplorerPage() {
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleRow = (id: string) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Drug Explorer</h2>
                    <p className="text-muted-text mt-1">
                        Browse all extracted drug criteria across ingested payer policies.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-text" />
                        <Input
                            placeholder="Search drug or brand name..."
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

            <div className="rounded-md border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-background/50">
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-10"></TableHead>
                            <TableHead>Drug Name</TableHead>
                            <TableHead>Brand Names</TableHead>
                            <TableHead>Payers Covered</TableHead>
                            <TableHead className="text-right">Indications</TableHead>
                            <TableHead className="text-right">Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drugsData.map((drug) => (
                            <React.Fragment key={drug.id}>
                                <TableRow
                                    className={`cursor-pointer hover:bg-white/5 border-border ${expandedRows.includes(drug.id) ? "bg-white/5" : ""}`}
                                    onClick={() => toggleRow(drug.id)}
                                >
                                    <TableCell>
                                        {expandedRows.includes(drug.id) ? (
                                            <ChevronDown className="h-4 w-4 text-muted-text" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-muted-text" />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono font-medium text-primary-text">{drug.name}</TableCell>
                                    <TableCell className="text-muted-text text-sm">{drug.brandNames}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {drug.payers.map((payer) => (
                                                <Badge key={payer} variant="outline" className="text-[10px] bg-background/50 text-muted-text border-border">
                                                    {payer}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm">{drug.indications}</TableCell>
                                    <TableCell className="text-right text-sm text-muted-text">{drug.lastUpdated}</TableCell>
                                </TableRow>

                                {expandedRows.includes(drug.id) && (
                                    <TableRow className="bg-black/40 border-border">
                                        <TableCell colSpan={6} className="p-0">
                                            <div className="p-6 border-l-2 border-primary ml-[22px] my-2">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-semibold text-sm">Policy Documents ({drug.payers.length})</h4>
                                                    <Button size="sm" asChild>
                                                        <Link href={`/compare?drug=${drug.name.toLowerCase()}`}>
                                                            <TableProperties className="h-4 w-4 mr-2" /> Compare this drug
                                                        </Link>
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {drug.payers.map((payer) => (
                                                        <div key={payer} className="p-3 rounded-md bg-card/60 border border-border/50 text-sm space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium text-primary-text">{payer}</span>
                                                                <Badge variant="success" className="text-[10px] h-4">Active</Badge>
                                                            </div>
                                                            <div className="flex justify-between text-muted-text text-xs">
                                                                <span>Indications</span>
                                                                <span className="font-mono">{Math.max(1, drug.indications - Math.floor(Math.random() * 3))}</span>
                                                            </div>
                                                            <div className="flex justify-between text-muted-text text-xs cursor-pointer hover:text-sky-500">
                                                                <span>View criteria</span>
                                                                <ChevronRight className="h-3 w-3" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
