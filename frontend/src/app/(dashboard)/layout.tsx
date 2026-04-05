import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/sidebar";
import { auth0 } from "@/lib/auth0";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth0.getSession();

    if (!session) {
        redirect("/landing");
    }

    return (
        <div className="h-screen w-full bg-background flex overflow-hidden">
            <AppSidebar />
            <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-background overflow-y-auto relative">
                <div className="flex-1 flex flex-col bg-background text-foreground">
                    {children}
                </div>
            </main>
        </div>
    );
}
