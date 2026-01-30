export const APPLICATION_STEPS = [
    { id: 1, title: "Kayıt", label: "Kayıt İşlemleri", description: "Hesap oluşturma ve giriş işlemleri." },
    { id: 2, title: "Program", label: "Program Seçimi", description: "Size en uygun üniversite ve bölümün belirlenmesi." },
    { id: 3, title: "Evrak", label: "Evrak Yükleme", description: "Pasaport, diploma ve transkript gibi gerekli belgelerin yüklenmesi." },
    { id: 4, title: "Sözleşme", label: "Sözleşme Onayı", description: "Hizmet sözleşmesinin incelenmesi ve imzalanması." },
    { id: 5, title: "Tercüme", label: "Tercüme İşlemleri", description: "Belgelerinizin yeminli tercüme ve noter onay süreci." },
    { id: 6, title: "Başvuru", label: "Üniversite Başvurusu", description: "Üniversiteye resmi başvurunun yapılması." },
    { id: 7, title: "Kabul & Vize", label: "Kabul ve Vize Süreci", description: "Davet mektubunun gelmesi ve vize başvurusu." },
    { id: 8, title: "Uçuş", label: "Uçuş ve Karşılama", description: "Uçak bileti organizasyonu ve havalimanı karşılaması." }
];

export const STEP_REQUIREMENTS: Record<number, string[]> = {
    1: [], // Registration always done if user exists
    2: [], // Program selection (checked via saved programs?)
    3: ["passport", "diploma", "transcript", "biometric_photo"], // Essential docs
    4: ["signed_contract"],
    5: ["passport_translation", "diploma_translation", "transcript_translation"],
    6: [], // University Application (Manual check for now)
    7: ["invitation_letter", "visa_receipt"],
    8: ["flight_ticket"]
};
