"use client";

import { motion } from "framer-motion";

export function SplashScreen() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center bg-white">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-24 w-24 bg-primary rounded-3xl flex items-center justify-center text-5xl font-bold text-white shadow-2xl mb-8"
            >
                S
            </motion.div>
            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-3xl font-bold text-gray-900"
            >
                Student Portal
            </motion.h1>
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
