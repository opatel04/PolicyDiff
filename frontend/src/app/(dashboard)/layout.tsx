import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative font-sans overflow-hidden">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-card">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}
