"use client";

import { approveStudentStep } from "@/actions/admin/approve-step";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ApproveButtonProps {
    userId: string;
}

export function ApproveButton({ userId }: ApproveButtonProps) {
    const router = useRouter();

    const handleApprove = async () => {
        try {
            await approveStudentStep(userId);
            toast.success("Öğrenci bir sonraki adıma geçirildi!");
            router.refresh();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    return (
        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Onayla
        </Button>
    );
}
