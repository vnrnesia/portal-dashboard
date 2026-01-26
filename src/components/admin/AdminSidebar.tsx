"use client";

import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    ShieldCheck
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
            title: "Genel Bakış",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Öğrenciler",
            url: "/admin/users",
            icon: Users,
        },
        {
            title: "Evrak Yönetimi",
            url: "/admin/documents", // Will redirect to a list or filter view
            icon: FileText,
        },
    ],
};

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" {...props} className="border-r">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Admin Paneli</span>
                                    <span className="truncate text-xs">Yönetici Erişimi</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Yönetim</SidebarGroupLabel>
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
            </SidebarContent>
            <SidebarFooter>
                <UserNav user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
