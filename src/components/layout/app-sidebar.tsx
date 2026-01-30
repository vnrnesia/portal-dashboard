"use client";

import {
    BookOpen,
    Frame,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    Calculator,
    Calendar,
    Smile,
    Command,
    GraduationCap,
    Files,
    FileText,
    Clock,
    MessageSquare,
    LifeBuoy,
    Send
} from "lucide-react";
import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarRail,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserNav } from "@/components/layout/user-nav";

const data = {
    navMain: [
        {
            title: "Panel",
            url: "/dashboard",
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: "Programlar",
            url: "/programs",
            icon: GraduationCap,
        },
        {
            title: "Evraklar",
            url: "/documents",
            icon: Files,
        },
        {
            title: "Sözleşme",
            url: "/contract",
            icon: FileText,
        },
        {
            title: "Tercüme",
            url: "/translation",
            icon: BookOpen,
        },
        {
            title: "Başvuru",
            url: "/application-status",
            icon: Frame,
        },
        {
            title: "Kabul & Vize",
            url: "/acceptance",
            icon: Map,
        },
        {
            title: "Uçuş",
            url: "/flight",
            icon: PieChart,
        },
    ],
    navSecondary: [
        {
            title: "Destek",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Geri Bildirim",
            url: "#",
            icon: Send,
        },
    ],
};

// ... props definition
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: "student" | "admin" | string;
        onboardingStep?: number;
        stepApprovalStatus?: "pending" | "approved" | "rejected" | string;
    }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" {...props} className="border-r-0">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                                    <Command className="size-4 text-white" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Student Portal</span>
                                    <span className="truncate text-xs">Consultancy App</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.navMain.map((item, index) => {
                                // Simple step logic: Programs (index 1) is Step 1.
                                // Items before "Programs" (Dashboard) are always visible (Step 0)
                                // or we can just say index + 1 is the step required if we ignore dashboard.

                                // Let's define specific step requirements
                                let requiredStep = 1;
                                if (item.url === "/programs") requiredStep = 1; // Unlock for new users (Step 1)
                                else if (item.url === "/documents") requiredStep = 3; // Step 3: Evrak
                                else if (item.url === "/contract") requiredStep = 4; // Step 4: Sozlesme
                                else if (item.url === "/translation") requiredStep = 5; // Step 5: Tercume
                                else if (item.url === "/application-status") requiredStep = 6; // Step 6: Basvuru
                                else if (item.url === "/acceptance") requiredStep = 7; // Step 7: Kabul & Vize
                                else if (item.url === "/flight") requiredStep = 8; // Step 8: Ucus
                                else if (item.url === "/timeline") requiredStep = 0; // Always accessible
                                else if (item.url === "/dashboard") requiredStep = 0; // Always accessible
                                else requiredStep = 99; // Others locked

                                // @ts-ignore
                                const userStep = (user?.onboardingStep || 1);
                                const approvalStatus = user?.stepApprovalStatus;

                                // Unlock if step is reached OR if it's the immediate next step and current is approved
                                const isNextUnlockable = (userStep === requiredStep - 1) && approvalStatus === "approved";
                                const isLocked = (userStep < requiredStep) && !isNextUnlockable;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild={!isLocked}
                                            isActive={pathname === item.url}
                                            tooltip={item.title}
                                            disabled={isLocked}
                                            className={isLocked ? "opacity-50 cursor-not-allowed" : ""}
                                        >
                                            {isLocked ? (
                                                <div className="flex w-full items-center gap-2">
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                    <div className="ml-auto text-xs text-muted-foreground">
                                                        🔒
                                                    </div>
                                                </div>
                                            ) : (
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


                {/* --- Admin Button Logic --- */}
                {/* @ts-ignore */}
                {
                    user?.role === "admin" && (
                        <SidebarGroup className="mt-auto border-t">
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip="Admin Dashboard" isActive={pathname.startsWith("/admin")}>
                                            <Link href="/admin/dashboard">
                                                <Settings2 />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                }

                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <div className="px-2 pb-2">
                            <Separator className="my-2" />
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild size="lg" className="h-auto py-3">
                                        <Link href="/timeline">
                                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                                <Clock className="size-4" />
                                            </div>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">Süreç Takibi</span>
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {(() => {
                                                        const steps = ["Kayıt", "Program", "Evrak", "Sözleşme", "Tercüme", "Başvuru", "Kabul & Vize", "Uçuş"];
                                                        // @ts-ignore
                                                        const stepIndex = (user?.onboardingStep || 1) - 1;
                                                        // Handle case where step might be out of bounds or step names need alignment
                                                        return `Adım ${user?.onboardingStep || 1}: ${steps[stepIndex] || "İşlemde"}`;
                                                    })()}
                                                </span>
                                            </div>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                            <Separator className="my-2" />
                        </div>

                        <SidebarMenu>
                            {data.navSecondary.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild size="sm">
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent >
            <SidebarFooter>
                <UserNav user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    );
}
