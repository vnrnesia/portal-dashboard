export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <img src="/logo1.png" alt="Logo" className="h-12 w-auto object-contain mr-2" />
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Bu platform sayesinde hayalimdeki üniversiteye kabul aldım. Süreç yönetimi ve danışmanlık hizmeti harikaydı.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Davis - Bilgisayar Mühendisliği Öğrencisi</footer>
                    </blockquote>
                </div>
            </div>
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-zinc-900">
                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
