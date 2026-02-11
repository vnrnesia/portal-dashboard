"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile, updateProfileImage, ProfileData } from "@/actions/profile";
import { toast } from "sonner";
import { User, Phone, MapPin, AlertCircle, Save, Loader2, Camera, X } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";

interface ProfileClientProps {
    initialProfile: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        phone: string | null;
        secondaryPhone: string | null;
        birthDate: Date | null;
        nationality: string | null;
        tcKimlik: string | null;
        passportNumber: string | null;
        address: string | null;
        city: string | null;
        country: string | null;
        postalCode: string | null;
        emergencyContactName: string | null;
        emergencyContactPhone: string | null;
        emergencyContactRelation: string | null;
    } | null;
}

export default function ProfileClient({ initialProfile }: ProfileClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [profileImage, setProfileImage] = useState(initialProfile?.image || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: initialProfile?.name || "",
        phone: initialProfile?.phone || "",
        secondaryPhone: initialProfile?.secondaryPhone || "",
        birthDate: initialProfile?.birthDate ? new Date(initialProfile.birthDate).toISOString().split('T')[0] : "",
        nationality: initialProfile?.nationality || "",
        tcKimlik: initialProfile?.tcKimlik || "",
        passportNumber: initialProfile?.passportNumber || "",
        address: initialProfile?.address || "",
        city: initialProfile?.city || "",
        country: initialProfile?.country || "",
        postalCode: initialProfile?.postalCode || "",
        emergencyContactName: initialProfile?.emergencyContactName || "",
        emergencyContactPhone: initialProfile?.emergencyContactPhone || "",
        emergencyContactRelation: initialProfile?.emergencyContactRelation || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePhoneChange = (fieldName: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Lütfen geçerli bir resim dosyası seçin.");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Resim boyutu 2MB'dan küçük olmalıdır.");
            return;
        }

        setIsUploadingImage(true);

        try {
            // Create a data URL for the image
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imageDataUrl = reader.result as string;

                // Update profile image in database
                await updateProfileImage(imageDataUrl);
                setProfileImage(imageDataUrl);
                toast.success("Profil fotoğrafınız güncellendi.");
                setIsUploadingImage(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error("Fotoğraf yüklenirken bir hata oluştu.");
            setIsUploadingImage(false);
        }
    };

    const handleRemoveImage = async () => {
        setIsUploadingImage(true);
        try {
            await updateProfileImage(null);
            setProfileImage("");
            toast.success("Profil fotoğrafınız kaldırıldı.");
        } catch (error) {
            toast.error("Fotoğraf kaldırılırken bir hata oluştu.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data: ProfileData = {
                ...formData,
                birthDate: formData.birthDate ? new Date(formData.birthDate) : null
            };

            await updateProfile(data);
            toast.success("Profil bilgileriniz güncellendi.");
        } catch (error) {
            toast.error("Güncelleme sırasında bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Profil Bilgileri</h1>
                <p className="text-gray-500">Kişisel ve iletişim bilgilerinizi buradan güncelleyebilirsiniz.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-20 w-20 border-2 border-gray-200">
                                    <AvatarImage src={profileImage} />
                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                        {initialProfile?.name?.[0] || "Ö"}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Upload overlay */}
                                <div
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploadingImage ? (
                                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                                    ) : (
                                        <Camera className="h-6 w-6 text-white" />
                                    )}
                                </div>

                                {/* Remove button */}
                                {profileImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        disabled={isUploadingImage}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Temel Bilgiler
                                </CardTitle>
                                <CardDescription>{initialProfile?.email}</CardDescription>
                                <p className="text-xs text-gray-400 mt-1">Fotoğrafı değiştirmek için üzerine tıklayın</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ad Soyad</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Adınız ve soyadınız"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Doğum Tarihi</Label>
                            <Input
                                id="birthDate"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nationality">Uyruk</Label>
                            <Input
                                id="nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                placeholder="Örn: Türkiye"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tcKimlik">TC Kimlik No</Label>
                            <Input
                                id="tcKimlik"
                                name="tcKimlik"
                                value={formData.tcKimlik}
                                onChange={handleChange}
                                placeholder="11 haneli TC kimlik numaranız"
                                maxLength={11}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passportNumber">Pasaport Numarası</Label>
                            <Input
                                id="passportNumber"
                                name="passportNumber"
                                value={formData.passportNumber}
                                onChange={handleChange}
                                placeholder="Pasaport numaranız"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            İletişim Bilgileri
                        </CardTitle>
                        <CardDescription>Sizinle iletişime geçebileceğimiz telefon numaraları</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon Numarası</Label>
                            <PhoneInput
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={(value) => handlePhoneChange("phone", value as string)}
                                defaultCountry="TR"
                                placeholder="Telefon Numarası"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secondaryPhone">2. Telefon Numarası</Label>
                            <PhoneInput
                                id="secondaryPhone"
                                name="secondaryPhone"
                                value={formData.secondaryPhone}
                                onChange={(value) => handlePhoneChange("secondaryPhone", value as string)}
                                defaultCountry="TR"
                                placeholder="Alternatif iletişim numarası"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Adres Bilgileri
                        </CardTitle>
                        <CardDescription>İkamet adresiniz</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Açık Adres</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Mahalle, sokak, bina no, daire no"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Şehir</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Şehir"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Ülke</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Ülke"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Posta Kodu</Label>
                                <Input
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="Posta kodu"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                            <AlertCircle className="h-5 w-5" />
                            Acil Durum İletişim Bilgileri
                        </CardTitle>
                        <CardDescription className="text-orange-700">
                            Acil durumlarda ulaşabileceğimiz yakınınızın bilgileri
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactName">Yakının Adı Soyadı</Label>
                            <Input
                                id="emergencyContactName"
                                name="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={handleChange}
                                placeholder="Ad Soyad"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactPhone">Telefon Numarası</Label>
                            <PhoneInput
                                id="emergencyContactPhone"
                                name="emergencyContactPhone"
                                value={formData.emergencyContactPhone}
                                onChange={(value) => handlePhoneChange("emergencyContactPhone", value as string)}
                                defaultCountry="TR"
                                placeholder="Yakınınızın telefonu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactRelation">Yakınlık Derecesi</Label>
                            <Input
                                id="emergencyContactRelation"
                                name="emergencyContactRelation"
                                value={formData.emergencyContactRelation}
                                onChange={handleChange}
                                placeholder="Örn: Anne, Baba, Eş"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Değişiklikleri Kaydet
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
