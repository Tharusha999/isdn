export interface RDCPartner {
    id: string;
    name: string;
    type: string;
    hub: string;
    contact: string;
    email: string;
    phone: string;
    status: string;
    rating: number;
    contractStart: string;
    contractEnd: string;
    agreementType: string;
    complianceScore: number;
    bio: string;
    recentAudits: {
        date: string;
        result: string;
        inspector: string;
    }[];
}

export const partners: RDCPartner[] = [
    {
        id: "RDC-101",
        name: "Lanka Logistics & Co.",
        type: "Prime Logistics",
        hub: "Central Hub",
        contact: "Damien Silva",
        email: "contact@lanka-log.lk",
        phone: "+94 11 234 5678",
        status: "Active",
        rating: 4.8,
        contractStart: "January 2022",
        contractEnd: "December 2025",
        agreementType: "Tier 1 Logistics",
        complianceScore: 98,
        bio: "Lanka Logistics & Co. is our primary partner for the central region, specializing in bulk distribution and last-mile delivery. They have consistently exceeded performance targets for the past three years.",
        recentAudits: [
            { date: "2024-01-15", result: "Excellent", inspector: "R. Jayasinghe" },
            { date: "2023-07-20", result: "Good", inspector: "S. Fernando" }
        ]
    },
    {
        id: "RDC-102",
        name: "Island Wide Distributors",
        type: "Regional Distributor",
        hub: "North (Jaffna)",
        contact: "K. Rathnam",
        email: "jaffna-dist@iwd.lk",
        phone: "+94 21 888 1234",
        status: "Active",
        rating: 4.5,
        contractStart: "March 2023",
        contractEnd: "February 2026",
        agreementType: "Regional Distribution",
        complianceScore: 92,
        bio: "Focused on northern regional distribution, Island Wide Distributors provides critical access to Jaffna and surrounding areas. Their fleet is optimized for northern terrain.",
        recentAudits: [
            { date: "2024-02-10", result: "Good", inspector: "M. Perera" }
        ]
    },
    {
        id: "RDC-103",
        name: "Eco-Fleet Express",
        type: "Eco Delivery Partner",
        hub: "West (Colombo)",
        contact: "Sarah Perera",
        email: "fleet@ecofleet.com",
        phone: "+94 77 123 4455",
        status: "Review",
        rating: 4.2,
        contractStart: "June 2023",
        contractEnd: "June 2024",
        agreementType: "Specialized Delivery",
        complianceScore: 85,
        bio: "An eco-friendly fleet trial partner focusing on zero-emission deliveries within the Colombo municipality. Currently under review for contract extension.",
        recentAudits: [
            { date: "2023-12-05", result: "Satisfactory", inspector: "A. Wickramasinghe" }
        ]
    },
    {
        id: "RDC-104",
        name: "Southern Speed Logistics",
        type: "Prime Logistics",
        hub: "South (Galle)",
        contact: "Roshan Kumara",
        email: "ops@southernspeed.lk",
        phone: "+94 91 555 6789",
        status: "Active",
        rating: 4.9,
        contractStart: "August 2022",
        contractEnd: "August 2025",
        agreementType: "Tier 1 Logistics",
        complianceScore: 99,
        bio: "Southern Speed Logistics manages our southern corridor with exceptional efficiency. They are known for their rapid turnaround times at the Galle hub.",
        recentAudits: [
            { date: "2024-01-22", result: "Excellent", inspector: "K. Gunawardena" }
        ]
    }
];
