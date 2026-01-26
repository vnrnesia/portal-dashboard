import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-indigo-50">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <div className="mb-8 flex justify-center">
          <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-xl">
            S
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900">
          Student Consultancy Portal
        </h1>
        <p className="text-xl text-gray-600">
          Hayallerindeki üniversiteye giden yol buradan başlıyor. Yapay zeka destekli danışmanlık platformu.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/login">
            <Button size="lg" className="w-32 text-lg">Giriş Yap</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="w-32 text-lg">Kayıt Ol</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="ghost" className="text-lg">Dashboard (Dev)</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
