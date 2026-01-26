"use client";

import { useState } from "react";
import { PROGRAMS } from "@/lib/data/programs";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function ProgramsPage() {
    const [search, setSearch] = useState("");

    const filteredPrograms = PROGRAMS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.university.toLowerCase().includes(search.toLowerCase()) ||
        p.country.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Programları Keşfet</h1>
                    <p className="text-gray-500">Sana en uygun üniversite ve bölümleri buradan incele.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Program, ülke veya üniversite ara..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrele
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map(program => (
                    <ProgramCard key={program.id} program={program} />
                ))}
                {filteredPrograms.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        Aradığınız kriterlere uygun program bulunamadı.
                    </div>
                )}
            </div>
        </div>
    );
}
