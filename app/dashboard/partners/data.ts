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
        name: "Regional Logistics Group A",
        type: "Prime Logistics",
        hub: "Central Hub",
        contact: "Operations Contact 1",
        email: "rdc-a@isdn.ops",
        phone: "+94 11 234 5678",
        status: "Active",
        rating: 4.8,
        contractStart: "January 2022",
        contractEnd: "December 2025",
        agreementType: "Tier 1 Logistics",
        complianceScore: 98,
        bio: "Primary logistics partner for the central hub, managing bulk throughput and regional node distribution.",
        recentAudits: [
            { date: "2024-01-15", result: "Excellent", inspector: "Grid Inspector 1" },
            { date: "2023-07-20", result: "Good", inspector: "Grid Inspector 2" }
        ]
    },
    {
        id: "RDC-102",
        name: "Northern Distribution Network",
        type: "Regional Distributor",
        hub: "North (Jaffna)",
        contact: "Operations Contact 2",
        email: "rdc-north@isdn.ops",
        phone: "+94 21 888 1234",
        status: "Active",
        rating: 4.5,
        contractStart: "March 2023",
        contractEnd: "February 2026",
        agreementType: "Regional Distribution",
        complianceScore: 92,
        bio: "Critical access partner for the Northern grid, maintaining high reliability in challenging terrain nodes.",
        recentAudits: [
            { date: "2024-02-10", result: "Good", inspector: "Grid Inspector 1" }
        ]
    },
    {
        id: "RDC-103",
        name: "Urban Fleet Solutions",
        type: "Eco Delivery Partner",
        hub: "West (Colombo)",
        contact: "Operations Contact 3",
        email: "rdc-west@isdn.ops",
        phone: "+94 77 123 4455",
        status: "Review",
        rating: 4.2,
        contractStart: "June 2023",
        contractEnd: "June 2024",
        agreementType: "Specialized Delivery",
        complianceScore: 85,
        bio: "Specialized urban delivery partner currently in pilot for zero-emission node distribution in Colombo.",
        recentAudits: [
            { date: "2023-12-05", result: "Satisfactory", inspector: "Grid Inspector 3" }
        ]
    },
    {
        id: "RDC-104",
        name: "Southern Expressway Logistics",
        type: "Prime Logistics",
        hub: "South (Galle)",
        contact: "Operations Contact 4",
        email: "rdc-south@isdn.ops",
        phone: "+94 91 555 6789",
        status: "Active",
        rating: 4.9,
        contractStart: "August 2022",
        contractEnd: "August 2025",
        agreementType: "Tier 1 Logistics",
        complianceScore: 99,
        bio: "High-efficiency partner managing the southern logistics corridor with exceptional turnaround telemetry.",
        recentAudits: [
            { date: "2024-01-22", result: "Excellent", inspector: "Grid Inspector 4" }
        ]
    }
];
