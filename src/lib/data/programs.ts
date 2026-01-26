export interface UniversityDetails {
    studentCount: string;
    internationalStudents: string;
    livingCost: string;
    ranking: string;
    locationStats: string;
    description: string;
}

export interface Program {
    id: string;
    university: string;
    logo: string;
    name: string;
    country: string;
    city: string;
    language: string;
    tuition: string; // Annual cost
    duration: string;
    rating: number; // 0-100 match score
    tags: string[];
    details?: UniversityDetails; // Optional for backward compatibility/mock data
}

export const PROGRAMS: Program[] = [
    {
        id: "spbpu-1",
        university: "Peter the Great St. Petersburg Polytechnic University",
        logo: "SPbPU",
        name: "Intelligent Systems (M.Sc.)",
        country: "Rusya",
        city: "St. Petersburg",
        language: "İngilizce",
        tuition: "3.500$ / Yıl",
        duration: "2 Yıl",
        rating: 94,
        tags: ["Yapay Zeka", "Teknoloji", "Ekonomik"],
        details: {
            studentCount: "33,000+",
            internationalStudents: "5,000+",
            livingCost: "250$ - 350$ / Ay",
            ranking: "#610 (QS World)",
            locationStats: "Tarihi Kampüs",
            description: "Rusya'nın önde gelen teknik üniversitelerinden biri olan SPbPU, 100'den fazla ülkeden öğrenciye ev sahipliği yapmaktadır. Nobel ödüllü mezunları ve devasa yeşil kampüsü ile bilinir. St. Petersburg gibi kültürel bir başkentte, uygun yaşam maliyetleri ile dünya standartlarında mühendislik eğitimi sunar."
        }
    },
    {
        id: "1",
        university: "Technical University of Munich",
        logo: "TUM",
        name: "Computer Science (B.Sc.)",
        country: "Almanya",
        city: "Münih",
        language: "İngilizce",
        tuition: "Ücretsiz",
        duration: "3 Yıl",
        rating: 95,
        tags: ["Mühendislik", "Top University"],
        details: {
            studentCount: "50,000+",
            internationalStudents: "18,000+",
            livingCost: "1.200€ / Ay",
            ranking: "#37 (QS World)",
            locationStats: "Sanayi Merkezi",
            description: "Münih Teknik Üniversitesi (TUM), Avrupa'nın en iyi teknik üniversitelerinden biridir. Mükemmeliyet girişimi kapsamında seçilen ilk üniversitelerden olup, araştırma ve inovasyon odaklıdır."
        }
    },
    {
        id: "2",
        university: "Warsaw University",
        logo: "VAR",
        name: "Medicine via English",
        country: "Polonya",
        city: "Varşova",
        language: "İngilizce",
        tuition: "12.000€ / Yıl",
        duration: "6 Yıl",
        rating: 88,
        tags: ["Tıp", "Ekonomik"],
    },
    {
        id: "3",
        university: "Bahçeşehir University",
        logo: "BAU",
        name: "Software Engineering",
        country: "Türkiye",
        city: "İstanbul",
        language: "İngilizce",
        tuition: "15.000$ / Yıl",
        duration: "4 Yıl",
        rating: 92,
        tags: ["Teknoloji", "Kampüs"],
    },
    {
        id: "4",
        university: "Berlin International",
        logo: "BI",
        name: "Architecture & Design",
        country: "Almanya",
        city: "Berlin",
        language: "İngilizce",
        tuition: "8.000€ / Yıl",
        duration: "4 Yıl",
        rating: 85,
        tags: ["Tasarım", "Sanat"],
    },
    {
        id: "5",
        university: "Lomonosov Moscow State",
        logo: "MSU",
        name: "International Relations",
        country: "Rusya",
        city: "Moskova",
        language: "Rusça",
        tuition: "5.000$ / Yıl",
        duration: "4 Yıl",
        rating: 78,
        tags: ["Siyaset", "Tarih"],
    },
    {
        id: "6",
        university: "RWTH Aachen",
        logo: "RWTH",
        name: "Mechanical Engineering",
        country: "Almanya",
        city: "Aachen",
        language: "Almanca",
        tuition: "Ücretsiz",
        duration: "3.5 Yıl",
        rating: 90,
        tags: ["Mühendislik", "Zorlu"],
    },
];
