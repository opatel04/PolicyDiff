import { AppSidebar } from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-full bg-black flex overflow-hidden">
            <AppSidebar />
            <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-black overflow-hidden relative">
                <div className="flex-1 overflow-auto bg-black text-white">
                    {children}
                </div>
            </main>
        </div>
    );
}
