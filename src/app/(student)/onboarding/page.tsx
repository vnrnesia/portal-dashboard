"use client";

import { useEffect, useState } from "react";
import { useOnboardingStore } from "@/lib/stores/useOnboardingStore";
import { SplashScreen } from "@/components/onboarding/SplashScreen";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { AIInputStep } from "@/components/onboarding/AIInputStep";
import { ConfirmationStep } from "@/components/onboarding/ConfirmationStep";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
    const [showSplash, setShowSplash] = useState(true);
    const { currentStep } = useOnboardingStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000); // 2 seconds splash
        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-right text-sm text-gray-500 mt-2">Adım {currentStep + 1} / 3</p>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStep === 0 && <WelcomeStep />}
                    {currentStep === 1 && <AIInputStep />}
                    {currentStep === 2 && <ConfirmationStep />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
