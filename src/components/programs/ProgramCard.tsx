import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Program } from "@/lib/data/programs";
import { MapPin, Clock, Banknote, Star } from "lucide-react";
import { useAppStore } from "@/lib/stores/useAppStore";
import { ProgramDetailsDialog } from "./ProgramDetailsDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFunnelStore, FunnelStep } from "@/lib/stores/useFunnelStore";
import { advanceUserStep } from "@/actions/advance-step";
import { toast } from "sonner";

interface ProgramCardProps {
    program: Program;
    currentSelection?: Program | null;
}

export function ProgramCard({ program, currentSelection }: ProgramCardProps) {
    const { selectProgram: selectProgramClient, addToCompare } = useAppStore();
    const { setStep } = useFunnelStore();
    const [showDetails, setShowDetails] = useState(false);
    const router = useRouter();

    const handleConfirmSelection = async () => {
        try {
            // Server action to save selection
            const { selectProgram } = await import("@/actions/student/select-program");
            const res = await selectProgram(program);

            if (res.success) {
                // Client store update (optional, but good for immediate UI)
                selectProgramClient(program);
                setStep(FunnelStep.DOCUMENTS_UPLOAD); // Update funnel step
                setShowDetails(false);
                toast.success(res.message);
                router.push("/documents"); // Move to next step
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
            console.error(error);
        }
    };

    const isSelected = currentSelection?.id === program.id;
    const hasSelection = !!currentSelection;

    return (
        <>
            <Card className={`flex flex-col h-full hover:shadow-lg transition-shadow border-t-4 ${isSelected ? "border-green-500 ring-2 ring-green-500 ring-offset-2" : "border-primary"}`}>
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                                {program.logo}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight line-clamp-2">{program.name}</h3>
                                <p className="text-sm text-gray-500">{program.university}</p>
                            </div>
                        </div>
                        {isSelected && (
                            <Badge className="bg-green-600 hover:bg-green-700">Seçildi</Badge>
                        )}
                        {!isSelected && program.rating >= 90 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 shrink-0">
                                %{program.rating} Uygun
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {program.city}, {program.country}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            {program.duration}
                        </div>
                        <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-green-600" />
                            {program.tuition}
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {program.language}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {program.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t bg-orange-50/50">
                    <Button variant="outline" size="sm" onClick={() => addToCompare(program)}>
                        Karşılaştır
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setShowDetails(true)}
                        className={isSelected ? "bg-green-600 hover:bg-green-700" : hasSelection ? "bg-orange-600 hover:bg-orange-700" : "bg-primary hover:bg-primary/90"}
                    >
                        {isSelected ? "Seçildi" : hasSelection ? "Programı Değiştir" : "Seç ve İlerle"}
                    </Button>
                </CardFooter>
            </Card>

            <ProgramDetailsDialog
                open={showDetails}
                onOpenChange={setShowDetails}
                program={program}
                onConfirm={handleConfirmSelection}
            />
        </>
    );
}
