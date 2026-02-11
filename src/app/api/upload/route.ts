"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Yetkisiz işlem." },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "Dosya bulunamadı." },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, message: "Dosya boyutu 5MB'dan büyük olamaz." },
                { status: 400 }
            );
        }

        // Create upload directory if it doesn't exist (outside public/ for runtime persistence)
        const uploadDir = join(process.cwd(), "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = file.name.split('.').pop();
        const sanitizedType = type.replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `${sanitizedType}-${session.user.id}-${uniqueSuffix}.${extension}`;
        const filePath = join(uploadDir, fileName);
        const fileUrl = `/api/uploads/${fileName}`;

        // Write file to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            fileName: file.name,
            fileUrl,
            message: "Dosya başarıyla yüklendi."
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, message: "Dosya yüklenirken bir hata oluştu." },
            { status: 500 }
        );
    }
}
