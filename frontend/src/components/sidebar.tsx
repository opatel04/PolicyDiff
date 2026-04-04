"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    UploadCloud,
    Search,
    TableProperties,
    Activity,
    MessageSquare,
    AlertTriangle,
    FileCheck,
} from "lucide-react";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Policy Upload",
        icon: UploadCloud,
        href: "/upload",
        color: "text-violet-500",
    },
    {
        label: "Drug Explorer",
        icon: Search,
        href: "/explorer",
        color: "text-pink-700",
    },
    {
        label: "Comparison Matrix",
        icon: TableProperties,
        href: "/compare",
        color: "text-orange-700",
    },
    {
        label: "Change Feed",
        icon: Activity,
        href: "/diffs",
        color: "text-emerald-500",
    },
    {
        label: "Query Interface",
        icon: MessageSquare,
        href: "/query",
        color: "text-blue-700",
    },
    {
        label: "Discordance Alerts",
        icon: AlertTriangle,
        href: "/discordance",
        color: "text-red-700",
    },
    {
        label: "Approval Path",
        icon: FileCheck,
        href: "/approval-path",
        color: "text-green-700",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card text-primary-text border-r border-border">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">PolicyDiff</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-muted-text"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
