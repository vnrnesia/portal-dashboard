"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserPhone } from "@/actions/user/update-phone";

const formSchema = z.object({
    phone: z.string().min(10, {
        message: "Geçerli bir telefon numarası giriniz.",
    }),
});

interface PhoneVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function PhoneVerificationModal({
    isOpen,
    onClose,
    onSuccess,
}: PhoneVerificationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
        },
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            form.reset();
        }
    }, [isOpen, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Format phone if needed (e.g. remove spaces, ensure +90 prefix)
            // For now, saving as entered + basic formatting could be added here
            const formattedPhone = values.phone.replace(/\D/g, ""); // strip non-digits

            // Add TR prefix if missing (simple check)
            const finalPhone = formattedPhone.startsWith("90")
                ? formattedPhone
                : `90${formattedPhone}`;

            const result = await updateUserPhone(finalPhone);

            if (result.success) {
                toast.success("Telefon numarası kaydedildi.");
                onSuccess();
                onClose();
            } else {
                toast.error("Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Phone mask handler
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        if (value.startsWith("90")) value = value.slice(2); // Remove leading 90 if typed
        if (value.length > 10) value = value.slice(0, 10); // Max 10 digits (without 90)

        // Format: (5XX) XXX XX XX
        let formattedValue = "";
        if (value.length > 0) formattedValue += `(${value.slice(0, 3)})`;
        if (value.length > 3) formattedValue += ` ${value.slice(3, 6)}`;
        if (value.length > 6) formattedValue += ` ${value.slice(6, 8)}`;
        if (value.length > 8) formattedValue += ` ${value.slice(8, 10)}`;

        form.setValue("phone", formattedValue, { shouldValidate: true });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        Telefon Doğrulama
                    </DialogTitle>
                    <DialogDescription>
                        Evraklarınızda bir hata olma durumunda size ulaşabilmemiz için lütfen telefon numaranızı buradan doldurun. Profil sayfasından da aynı işlemi gerçekleştirebilirsiniz.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Telefon Numarası</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center">
                                            <span className="bg-gray-100 border border-r-0 border-input rounded-l-md px-3 py-2 text-sm text-gray-500">
                                                +90
                                            </span>
                                            <Input
                                                {...field}
                                                className="rounded-l-none pl-3"
                                                placeholder="(5XX) XXX XX XX"
                                                onChange={handlePhoneChange}
                                                maxLength={15} // (555) 555 55 55 is 15 chars
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                İptal
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Kaydet ve Devam Et
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
