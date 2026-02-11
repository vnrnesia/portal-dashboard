import { MetadataRoute } from 'next';

const APP_URL = process.env.AUTH_URL || "https://portal.studentconsultancy.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/profile/', '/api/'], // Private routes
        },
        sitemap: `${APP_URL}/sitemap.xml`,
    };
}
