import { MetadataRoute } from 'next';

const APP_URL = process.env.AUTH_URL || "https://portal.studentconsultancy.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        "",
        "/login",
        "/programs",
        "/contact", // Assuming this exists or will exist
    ].map((route) => ({
        url: `${APP_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === "" ? 1 : 0.8,
    }));

    return routes;
}
