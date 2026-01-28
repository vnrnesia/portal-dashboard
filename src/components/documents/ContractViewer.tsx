"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { FileText, Download, Check, Loader2, User, Phone, MapPin, ArrowRight, Clock } from "lucide-react";
import { useAppStore } from "@/lib/stores/useAppStore";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadContract, updateDocumentStatus } from "@/actions/documents";
import { useRouter } from "next/navigation";

interface ContractViewerProps {
    userName: string;
    contractDoc?: {
        id: string;
        status: string | null;
        fileName: string | null;
        fileUrl: string | null;
    } | null;
}

export function ContractViewer({ userName, contractDoc }: ContractViewerProps) {
    const [isExporting, setIsExporting] = useState(false);
    const { selectedProgram } = useAppStore();
    const contractRef = useRef<HTMLDivElement>(null);

    // Contract Details State
    const [contractDetails, setContractDetails] = useState({
        tcNo: "",
        phone: "",
        address: ""
    });
    const [isDetailsSubmitted, setIsDetailsSubmitted] = useState(!!contractDoc); // If doc exists, skip details

    const currentDate = new Date().toLocaleDateString('tr-TR');

    // Dynamic Data
    const studentName = userName || "Öğrenci Adı";
    const universityName = selectedProgram?.university || "UNIVERISTY_PLACEHOLDER";
    const programName = selectedProgram?.name || "PROGRAM_PLACEHOLDER";

    const router = useRouter();

    // Offline Signing State
    const isUploaded = contractDoc?.status === 'uploaded' || contractDoc?.status === 'approved' || contractDoc?.status === 'reviewing';
    const isReviewing = contractDoc?.status === 'reviewing';
    const isApproved = contractDoc?.status === 'approved';
    const [localUploadedFileName, setLocalUploadedFileName] = useState<string | null>(contractDoc?.fileName || null);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contractDetails.tcNo || !contractDetails.phone || !contractDetails.address) {
            toast.error("Lütfen tüm alanları doldurunuz.");
            return;
        }
        if (contractDetails.tcNo.length !== 11) {
            toast.error("T.C. Kimlik Numarası 11 haneli olmalıdır.");
            return;
        }
        setIsDetailsSubmitted(true);
        toast.success("Bilgiler kaydedildi, sözleşme oluşturuluyor...");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // In a real app, upload to S3/Blob storage here and get URL.
                // For now, we simulate with a fake URL or base64.
                const fakeUrl = URL.createObjectURL(file);

                await uploadContract(file.name, fakeUrl);
                setLocalUploadedFileName(file.name);
                toast.success("İmzalı sözleşme yüklendi.");
            } catch (error) {
                toast.error("Yükleme başarısız oldu.");
            }
        }
    };

    const handleDownloadPdf = async () => {
        if (!contractRef.current) {
            toast.error("Sözleşme içeriği bulunamadı.");
            return;
        }

        setIsExporting(true);

        try {
            // Create canvas
            const canvas = await html2canvas(contractRef.current, {
                scale: 2,
                useCORS: true,
                logging: false, // Logları kapattık performans için
                onclone: (clonedDoc) => {
                    // 1. Overwrite all CSS variables that might use oklch/lab with safe HEX values
                    // This prevents html2canvas from resolving vars to unsupported functions
                    const body = clonedDoc.body;
                    body.style.setProperty('--background', '#ffffff');
                    body.style.setProperty('--foreground', '#000000');
                    body.style.setProperty('--primary', '#000000');
                    body.style.setProperty('--primary-foreground', '#ffffff');
                    body.style.setProperty('--muted', '#f3f4f6');
                    body.style.setProperty('--muted-foreground', '#6b7280');
                    body.style.setProperty('--border', '#e5e7eb');
                    body.style.setProperty('--input', '#e5e7eb');
                    body.style.setProperty('--ring', '#000000');
                    body.style.setProperty('--radius', '0.5rem');

                    const content = clonedDoc.querySelector('[data-contract-content]') as HTMLElement;
                    if (content) {
                        content.style.boxShadow = 'none';
                        content.style.backgroundColor = '#ffffff';
                        content.style.color = '#000000';

                        // 2. Iterate elements to force simple styles (User's logic preserved and enhanced)
                        const allElements = content.getElementsByTagName('*');
                        for (let i = 0; i < allElements.length; i++) {
                            const el = allElements[i] as HTMLElement;
                            el.style.color = '#000000';
                            el.style.borderColor = '#000000';
                            el.style.boxShadow = 'none';

                            // Specific fix for gray backgrounds
                            if (el.classList.contains('bg-gray-50')) {
                                el.style.backgroundColor = '#f9fafb';
                                el.style.borderColor = '#d1d5db';
                            } else {
                                el.style.backgroundColor = 'transparent';
                            }
                        }
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png');

            // Initialize PDF
            const jsPDF = (await import('jspdf')).default;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Portal_Sozlesmesi_${studentName.replace(/\s+/g, '_')}.pdf`);
            toast.success("Sözleşme PDF'i indirildi.");
        } catch (error) {
            console.error("PDF Export Error:", error);
            const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
            toast.error(`PDF Hatası: ${errorMessage}`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleSubmitForApproval = async () => {
        if (!contractDoc?.id) return;
        try {
            await updateDocumentStatus(contractDoc.id, "reviewing");
            toast.success("Sözleşme onaya gönderildi.");
        } catch (error) {
            toast.error("İşlem başarısız.");
        }
    };

    if (!isDetailsSubmitted && !isUploaded && !isReviewing) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Sözleşme Bilgileri</h1>
                    <p className="text-gray-500">Sözleşmenizin hazırlanabilmesi için lütfen aşağıdaki bilgileri eksiksiz doldurunuz.</p>
                </div>

                <Card className="p-6 border shadow-lg bg-white">
                    <form onSubmit={handleDetailsSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="tcNo">T.C. Kimlik Numarası</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    id="tcNo"
                                    placeholder="11 haneli T.C. Kimlik Numaranız"
                                    className="pl-9"
                                    maxLength={11}
                                    value={contractDetails.tcNo}
                                    onChange={(e) => setContractDetails({ ...contractDetails, tcNo: e.target.value.replace(/\D/g, '') })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon Numarası</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    id="phone"
                                    placeholder="05XX XXX XX XX"
                                    className="pl-9"
                                    value={contractDetails.phone}
                                    onChange={(e) => setContractDetails({ ...contractDetails, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">İkamet Adresi</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Textarea
                                    id="address"
                                    placeholder="Tam adresiniz..."
                                    className="pl-9 min-h-[100px]"
                                    value={contractDetails.address}
                                    onChange={(e) => setContractDetails({ ...contractDetails, address: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-primary" size="lg">
                            Sözleşmeyi Oluştur
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Sözleşme Onayı</h1>
                    <p className="text-gray-500">Süreci tamamlamak için aşağıdaki adımları takip ediniz.</p>
                </div>
                {!isUploaded && !isReviewing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsDetailsSubmitted(false)} className="text-gray-500">
                        Bilgileri Düzenle
                    </Button>
                )}
            </div>

            {/* Step 1: Preview & Download */}
            <Card className="p-6 border-2 border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shrink-0 ${isReviewing ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                        {isReviewing ? <Check className="h-4 w-4" /> : '1'}
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">Sözleşmeyi İncele ve İndir</h3>
                        <p className="text-sm text-gray-500">Sözleşme metnini kontrol ettikten sonra PDF olarak indiriniz.</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border shadow-sm mb-4">
                    <ScrollArea className="h-[400px] w-full p-4">
                        {/* Compact Preview - Reusing safe rendering logic */}
                        <div
                            ref={contractRef}
                            data-contract-content
                            className="max-w-[210mm] mx-auto p-[10mm] font-serif text-[10pt] origin-top scale-90"
                            style={{
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                boxShadow: 'none'
                            }}
                        >
                            <h2 className="text-center font-bold text-lg mb-8 underline">PORTAL YURTDIŞI EĞİTİM DANIŞMANLIĞI HİZMETİ ANA SÖZLEŞMESİ</h2>
                            <p className="mb-4 text-justify">
                                İşbu sözleşme; Pazar Camii Mah., Pazar Sok. No 68. Nizip Gaziantep adresinde yer alan “Portal Yurtdışı Eğitim Danışmanlığı” adına yürürlükteki mevzuata göre yetkili Fırat Böler ile aşağıda müşteri olarak kişisel bilgileri yazılı <strong>{studentName}</strong> adına, kendi aralarında aşağıdaki maddeler çerçevesinde imzalanmış, yurtdışı eğitim danışmanlığı sözleşmesidir.
                            </p>
                            <div className="mb-6 p-4 border text-sm" style={{ backgroundColor: '#f9fafb', borderColor: '#d1d5db', color: '#000000' }}>
                                <p className="mb-1"><strong>Müşterinin:</strong> {studentName}</p>
                                <p className="mb-1"><strong>T.C. Kimlik Numarası:</strong> {contractDetails.tcNo}</p>
                                <p className="mb-1"><strong>Telefonu:</strong> {contractDetails.phone}</p>
                                <p className="mb-1"><strong>Adresi:</strong> {contractDetails.address}</p>
                                <p><strong>Talep Ettiği Üniversite ve Bölümü:</strong> {universityName} - {programName}</p>
                            </div>

                            <p className="mb-4 text-justify">
                                Sözleşmede, “Portal Yurtdışı Eğitim Danışmanlığı” bundan sonra “Danışman”, <strong>{studentName}</strong> ise “Müşteri” olarak anılacaktır.
                            </p>

                            <h3 className="font-bold mb-2">A- SÖZLEŞME KONUSU VE AMACI</h3>
                            <p className="mb-4 text-justify">
                                İşbu sözleşmenin konusu, Müşterinin talep etmiş olduğu hizmet alanlarında yurtdışı eğitim danışmanlığı hizmetinin verilmesidir. Danışman; İşbu sözleşme ve varsa eklerinde belirtildiği şekilde ve zamanında taahhüt ettiği işi yerine getirmekle yükümlüdür. Müşteri ise yapılan işin bedelini, ilgili maddelerde belirtilen şekilde ve miktarda ödemek, Portal Yurtdışı Eğitim Danışmanlığı tarafından kendisinden istenen evrakları, dökümanları ve belgeleri sağlamakla yükümlüdür.
                            </p>
                            <p className="mb-4 text-justify">
                                İşbu anlaşmanın amacı; Danışman tarafından, bünyesinde bulunan tercüman, danışman veya sözleşmeli olduğu danışmanlar aracılığı ile Şirket Ana Sözleşmesi’nde belirtilen konularda ve bu sözleşme ile sınırlandırılmış alanlarda, müşterinin menfaatlerini gözeterek, Rusya Federasyonu sınırları içerisindeki üniversitelere kaydının yapılması konusunda aracılık ve eğitim danışmanlığı hizmetinin verilmesidir.
                            </p>

                            <h3 className="font-bold mb-2">B- ANLAŞMA MADDELERİ</h3>
                            <p className="mb-4 text-justify">
                                İşbu anlaşma kapsamında, danışmanın görevi, Rusya Federasyonu sınırları içindeki üniversitelere kaydının yapılması konusunda bünyesinde bulunan danışmanlar veya sözleşmeli olduğu danışmanlar ile müşteriye danışmanlık ve aracılık hizmetleri vermek ve bu konuda gerekli işlemlerin yapılmasını sağlamaktır.
                            </p>
                            <p className="mb-4 text-justify">
                                İşbu anlaşma uyarınca, danışman taahhüt ettiği işleri, anlaşma süresi içinde ya da tarafların aşağıda belirtilen protokolle belirleyecekleri süre içinde tamamlamayı taahhüt eder.
                            </p>
                            <p className="mb-4 text-justify">
                                Danışman, Rusya Federasyonu sınırları içindeki üniversitelerin öğrenci kayıt şartları, bu üniversitelerin eğitim-öğretim imkanları ve şayet işbu sözleşme kapsamında müşterinin bir üniversiteye kaydının yapılması durumunda müşterinin öğrenime başlayıp devam edebilmesi konularında müşteriye eğitim danışmanlığı yapmakla yükümlüdür. Eğitim danışmanı, kendi ana sözleşmesinde geçmeyen alanlarda danışmanlık yapamaz.
                            </p>

                            <h3 className="font-bold mb-2">C- TARAFLARIN HAK VE YÜKÜMLÜLÜKLERİ</h3>
                            <p className="mb-4 text-justify">
                                Müşteri ve Danışman her türlü yasal denetimden, cezadan, vergi/resim/harçlardan vb. giderlerden kendileri adına sorumlu olup her türlü kanuni sorumluluk kendilerine aittir. Tarafların belirtilen konudaki “Hak ve Yükümlülükleri” karşılıklı olarak bu sözleşme ile sınırlandırılmıştır.
                            </p>
                            <p className="mb-4 text-justify">
                                İşbu anlaşma doğrultusunda yerine getirilmeyen yükümlülükler için kusurlu taraf, sözleşmeye aykırı eylemlerinden kaynaklanan tüm masrafları ile birlikte kusuru sebebiyle meydana gelen kazanç kayıplarını da tazminat olarak ödemekle yükümlüdür.
                            </p>

                            <h3 className="font-bold mb-2">D- EĞİTİM DANIŞMANININ YÜKÜMLÜLÜKLERİ</h3>
                            <p className="mb-4 text-justify">
                                Danışman, Rusya Federasyonu sınırları içerisinde yer alan üniversitelerin kayıt şartları ve eğitim öğretim imkanları hakkında bilgilendirme ve yurtdışı eğitim danışmanlığı hizmetleri konusunda müşteriye eksiksiz ve işbu anlaşma şartlarına uygun olarak bilgi vermek ve danışmanlık yapmakla yükümlüdür.
                            </p>
                            <p className="mb-4 text-justify">
                                Danışman, müşterinin, belirtilen eğitim kurumlarına kayıt olabilmesi ve eğitim imkanlarından faydalanabilmesi için gerekli tüm evrakları müşterinin taleplerine uygun olarak temin etmek (Başvuru evrakları, okul kaydı için gerekli formlar vb.) ve bu evrakların doldurulup gerekli başvuruların yapılması konusunda müşteriye aracılık ve danışmanlık yapmakla yükümlüdür.
                            </p>

                            <h3 className="font-bold mb-2">E- MÜŞTERİNİN YÜKÜMLÜLÜKLERİ</h3>
                            <p className="mb-4 text-justify">
                                Müşteri, sözleşme kapsamındaki Zorunlu Masraflar ve Ön Danışmanlık Hizmeti Ücreti ile Eğitim Danışmanlığı Ücretini işbu sözleşmesinde belirtildiği şekliyle ödemekle yükümlüdür. Müşteri, danışmanın anlaşma şartlarına uygun olarak verdiği ve vereceği danışmanlık hizmetlerini, belirtilen zaman ve yerde, verilen tüm dokümanlarla birlikte kabul etmek ve eğitim danışmanının danışmanlık konusundaki talimatlara uymakla yükümlüdür.
                            </p>

                            <h3 className="font-bold mb-2">F- ÖDEME ŞEKLİ VE MİKTARI</h3>
                            <p className="mb-2">Eğitim danışmanlığı hizmeti aşağıdaki hizmetleri kapsamaktadır:</p>
                            <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
                                <li>Gerekli belgelerin Rusça’ya noter onaylı çevirisi</li>
                                <li>Vize almak için gelecek davetiyenin harç ve ulaşım bedeli</li>
                                <li>Vize takip işlemlerinin yapılması, vizenin alınması ve vizenin uzatılması</li>
                                <li>Türkiye kalkışlı Rusya Federasyonu’na uçak ile seyahat bedeli (Fazladan valiz hakkını öğrenci öder)</li>
                                <li>Havalimanında karşılama ve havalimanından transfer</li>
                                <li>Rusya'ya ilk varış sonrası müşterinin otelde veya paylaşımlı evde 3 gün konaklama masrafı</li>
                                <li>Oturma izni masrafları, Öğrenci yurduna kayıt işlemleri</li>
                                <li>1 akademik yıl süresince müşterinin üniversite yurdunda konaklama ücreti</li>
                                <li>1 yıl zorunlu sağlık sigortası ücreti</li>
                                <li>Rusya Federasyonu'nda bir akademik yıllık oturum izni</li>
                                <li>Rusya Federasyonu'nda kullanılabilecek bir adet mobil GSM hattı</li>
                                <li>1 Akademik yıllık danışmanlık hizmeti</li>
                            </ul>
                            <p className="mb-4 text-justify font-semibold">
                                İşbu sözleşme kapsamında müşterinin (öğrencinin) ödeyeceği toplam hizmet bedeli 6.500 Amerikan Doları (USD)’dır.
                            </p>

                            <h3 className="font-bold mb-2">G- ANLAŞMANIN SÜRESİ VE İMZA</h3>
                            <p className="mb-8 text-justify">
                                İşbu sözleşme, taraflara birer tane olmak üzere, her biri aynı hukuki statüye sahip iki nüsha halinde hazırlanmıştır. <strong>{currentDate}</strong> tarihinde imzalanmış ve yürürlüğe girmiştir.
                            </p>

                            <div className="flex justify-between items-start mt-12 pt-8 border-t" style={{ borderColor: '#d1d5db' }}>
                                <div className="text-center">
                                    <p className="font-bold mb-2">{studentName}</p>
                                    <p className="text-gray-500 mb-8" style={{ color: '#6b7280' }}>Müşteri</p>
                                    <div className="h-16 border-b border-dashed w-48" style={{ borderColor: '#9ca3af' }}></div>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold mb-2">Fırat Böler</p>
                                    <p className="text-gray-500 mb-8" style={{ color: '#6b7280' }}>Portal Yurtdışı Eğitim Danışmanlığı</p>
                                    <div className="h-16 border-b border-dashed w-48" style={{ borderColor: '#9ca3af' }}></div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                <Button onClick={handleDownloadPdf} disabled={isExporting} className="w-full sm:w-auto" variant="outline">
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    {isExporting ? "Oluşturuluyor..." : "Adım 1: PDF Olarak İndir"}
                </Button>
            </Card>

            {/* Step 2: Print & Sign */}
            <Card className="p-6 border-2 border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shrink-0 ${isReviewing ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                        {isReviewing ? <Check className="h-4 w-4" /> : '2'}
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">Çıktı Al ve İmzala</h3>
                        <p className="text-sm text-gray-500">İndirdiğiniz PDF'in çıktısını alıp, "Müşteri" kısmını ıslak imza ile imzalayınız.</p>
                    </div>
                </div>
            </Card>

            {/* Step 3: Upload */}
            <Card className={`p-6 border-2 transition-colors ${isReviewing ? 'border-green-200 bg-green-50' : isUploaded ? 'border-primary/20 bg-primary/5' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                <div className="flex items-start gap-4 mb-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shrink-0 ${isUploaded || isReviewing ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                        {isUploaded || isReviewing ? <Check className="h-4 w-4" /> : '3'}
                    </div>
                    <div className="space-y-1 w-full">
                        <h3 className="font-semibold text-lg">İmzalı Belgeyi Yükle</h3>
                        <p className="text-sm text-gray-500">İçaladığınız belgeyi taratarak veya fotoğrafını çekerek buraya yükleyiniz.</p>

                        {isReviewing ? (
                            <div className="mt-4 flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-green-100 shadow-sm animate-in fade-in zoom-in-95">
                                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                    <Check className="h-6 w-6" />
                                </div>
                                <h4 className="font-semibold text-gray-900">Sözleşme Onaya Gönderildi</h4>
                                <p className="text-sm text-gray-500 text-center max-w-sm mt-1">
                                    Belgeniz başarıyla yüklendi ve incelenmek üzere tarafımıza iletildi. Onay durumunu buradan takip edebilirsiniz.
                                </p>
                            </div>
                        ) : !isUploaded ? (
                            <div className="mt-4">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileText className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyin (PDF, JPG, PNG)</p>
                                    </div>
                                    <input type="file" className="hidden" accept="application/pdf,image/png,image/jpeg,image/jpg" onChange={handleFileUpload} />
                                </label>
                            </div>
                        ) : (
                            <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-full">
                                        <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{localUploadedFileName || "imzali_sozlesme.pdf"}</p>
                                        <p className="text-xs text-green-600 font-medium">Başarıyla yüklendi</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={async () => {
                                    try {
                                        // If it is already uploaded to DB, maybe we want to allow removing? 
                                        // For now just reset local state if needed or implement a remove action
                                        toast.info("Silme işlemi henüz aktif değil.");
                                    } catch (e) { }
                                }}>
                                    Kaldır
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {isApproved ? (
                    <div className="mt-4 flex justify-end">
                        <Button
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                            onClick={() => router.push("/translation")}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Onaylandı - Sonraki Adım
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                ) : isReviewing ? (
                    <div className="mt-4 flex justify-end">
                        <Button className="w-full sm:w-auto" disabled>
                            <Clock className="mr-2 h-4 w-4" />
                            İncelemede
                        </Button>
                    </div>
                ) : isUploaded ? (
                    <div className="mt-4 flex justify-end">
                        <Button className="w-full sm:w-auto bg-primary" onClick={handleSubmitForApproval}>
                            <Check className="mr-2 h-4 w-4" />
                            Onaya Gönder
                        </Button>
                    </div>
                ) : null}
            </Card>
        </div>
    );
}