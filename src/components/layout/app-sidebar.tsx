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
            title: "Süreç Takibi",
            url: "/timeline",
            icon: Clock,
        },
        {
            title: "Kabul & Vize",
            url: "/invitation",
            icon: Map,
        },
        {
            title: "Uçuş",
            url: "/flight",
            icon: PieChart,
        },
        {
            title: "Mesajlar",
            url: "/messages",
            icon: MessageSquare,
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
                            {data.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
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
            </SidebarContent>
            <SidebarFooter>
                <UserNav user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
