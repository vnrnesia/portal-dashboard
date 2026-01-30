import { getProfile } from "@/actions/profile";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ProfilePage() {
    const session = await auth();
    if (!session) redirect("/login");

    const profile = await getProfile();

    return <ProfileClient initialProfile={profile || null} />;
}
