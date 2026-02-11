"use client";

import { motion } from "framer-motion";

export function SplashScreen() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center bg-white">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-8"
            >
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-32 w-auto object-contain"
                />
            </motion.div>
            <motion.div
                className="mt-8 w-48 h-1 bg-gray-100 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 1.5 }}
                />
            </motion.div>
        </div>
    );
}
