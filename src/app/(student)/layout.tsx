import { AppSidebar } from "@/components/layout/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/layout/theme-toggle"

import { auth } from "@/auth"

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();
    let user = session?.user;

    // Fetch fresh user data from DB to ensure name and step are up to date
    if (session?.user?.id) {
        const { db } = await import("@/db");
        const { users } = await import("@/db/schema");
        const { eq } = await import("drizzle-orm");

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (dbUser) {
            user = {
                ...session.user,
                name: dbUser.name,
                image: dbUser.image,
                onboardingStep: dbUser.onboardingStep || 1,
                stepApprovalStatus: dbUser.stepApprovalStatus || "pending",
                role: dbUser.role || "student"
            };
        }
    }

    // Fallback user if something goes wrong (though middleware protects this)
    if (!user) {
        user = {
            id: "guest",
            name: "Öğrenci",
            email: "guest@edu.com",
            image: "",
            onboardingStep: 1,
            role: "student",
            stepApprovalStatus: "pending"
        };
    }

    return (
        <SidebarProvider>
            <AppSidebar user={user} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4 justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Öğrenci Paneli
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Genel Bakış</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-10">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
