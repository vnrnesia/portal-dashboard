"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function FlightClient() {
    useEffect(() => {
        // Only trigger confetti if we assume success, or maybe controlled by props?
        // keeping it simple for now, maybe remove excessive confetti if in pending state?
        // Actually, let's remove it for now to avoid confusion if pending.
    }, []);

    return null;
}
