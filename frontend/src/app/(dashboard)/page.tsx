"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Database,
    ShieldCheck,
    TrendingUp,
    ArrowRight,
    Plus,
    TableProperties
} from "lucide-react";
import Link from "next/link";

const stats = [
    {
        label: "Total Policies",
        value: "142",
        icon: FileText,
        color: "text-blue-500",
    },
    {
        label: "Drugs Tracked",
        value: "24",
        icon: Database,
        color: "text-emerald-500",
    },
    {
        label: "Payers Covered",
        value: "8",
        icon: ShieldCheck,
        color: "text-orange-500",
    },
    {
        label: "Quarterly Changes",
        value: "31",
        icon: TrendingUp,
        color: "text-rose-500",
    },
];

const recentChanges = [
    {
        payer: "UnitedHealthcare",
        drug: "Infliximab",
        severity: "breaking",
        description: "Avsola and Inflectra now mandatory first-line. Remicade requires biosimilar failure.",
        date: "2 days ago",
    },
    {
        payer: "Aetna",
        drug: "Adalimumab",
        severity: "restrictive",
        description: "Trial duration increased from 12 to 14 weeks for rheumatoid arthritis.",
        date: "4 days ago",
    },
    {
        payer: "Cigna",
        drug: "Ustekinumab",
        severity: "relaxed",
        description: "New indication added for plaque psoriasis in adolescents.",
        date: "1 week ago",
    },
];

const recentActivity = [
    { action: "Policy Uploaded", target: "UHC Infliximab Commercial 2026", user: "Atharva", time: "1 hr ago" },
    { action: "Extraction Complete", target: "Aetna CPB 0321", user: "System", time: "2 hrs ago" },
    { action: "Query Processed", target: "Compare step therapy for adalimumab", user: "Om", time: "3 hrs ago" },
    { action: "Memo Generated", target: "Justification for Remicade (Aetna)", user: "Dominic", time: "5 hrs ago" },
];

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-text">
                        Welcome back. Here's a summary of policy intelligence for Q2 2026.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="/upload">
                        <Button className="font-semibold">
                            <Plus className="mr-2 h-4 w-4" /> Upload Policy
                        </Button>
                    </Link>
                    <Link href="/compare">
                        <Button variant="outline" className="font-semibold">
                            <TableProperties className="mr-2 h-4 w-4" /> Run Comparison
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={stat.color + " h-4 w-4"} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>What changed this quarter?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentChanges.map((change, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-white/5 hover:bg-white/10 transition"
                            >
                                <Badge
                                    variant={change.severity === "breaking" ? "destructive" : change.severity === "restrictive" ? "warning" : "success"}
                                    className="mt-0.5 capitalize"
                                >
                                    {change.severity}
                                </Badge>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{change.payer}</span>
                                        <span className="text-muted-text">•</span>
                                        <span className="font-mono text-sm">{change.drug}</span>
                                    </div>
                                    <p className="text-sm text-primary-text leading-relaxed">
                                        {change.description}
                                    </p>
                                    <p className="text-xs text-muted-text">{change.date}</p>
                                </div>
                            </div>
                        ))}
                        <Button variant="link" className="p-0 text-sky-500 hover:text-sky-400" asChild>
                            <Link href="/diffs" className="flex items-center">
                                View all changes <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-0 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {activity.action}: <span className="text-muted-text font-normal">{activity.target}</span>
                                        </p>
                                        <p className="text-xs text-muted-text">
                                            {activity.user} • {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
