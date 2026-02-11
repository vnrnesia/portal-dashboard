"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "@/components/ui/phone-input";

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
    phone: z.string().refine((val) => isValidPhoneNumber(val), {
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
            // PhoneInput returns E.164 format (e.g. +905551234567), so we can use it directly
            const result = await updateUserPhone(values.phone);

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

    // Phone mask handler removed since PhoneInput handles it

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
                                        <PhoneInput
                                            placeholder="Telefon numaranızı giriniz"
                                            defaultCountry="TR"
                                            {...field}
                                        />
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
