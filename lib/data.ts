export type RDC = "North (Jaffna)" | "South (Galle)" | "East (Trincomalee)" | "West (Colombo)" | "Central (Kandy)";

export interface Product {
    id: string;
    sku: string;
    name: string;
    category: "Packaged Food" | "Beverages" | "Home Cleaning" | "Personal Care";
    price: number;
    image: string;
    description: string;
    stock: Record<RDC, number>;
}

export interface Order {
    id: string;
    customerId: string;
    items: { productId: string; quantity: number }[];
    total: number;
    status: "Pending" | "In Transit" | "Delivered" | "Cancelled";
    rdc: RDC;
    date: string;
    eta?: string;
}

export const RDCS: RDC[] = [
    "North (Jaffna)",
    "South (Galle)",
    "East (Trincomalee)",
    "West (Colombo)",
    "Central (Kandy)"
];

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: "P001",
        sku: "ISDN-FD-101",
        name: "Staple Grid Item 101",
        category: "Packaged Food",
        price: 1250,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
        description: "High-quality essential goods sourced for regional distribution.",
        stock: {
            "Central (Kandy)": 1200,
            "North (Jaffna)": 450,
            "South (Galle)": 300,
            "East (Trincomalee)": 150,
            "West (Colombo)": 800
        }
    },
    {
        id: "P002",
        sku: "ISDN-BV-202",
        name: "Grid Beverage Unit 202",
        category: "Beverages",
        price: 980,
        image: "https://images.unsplash.com/photo-1527960669566-f882ba85a4c6?auto=format&fit=crop&q=80&w=400",
        description: "Standardized beverage unit for regional nodes.",
        stock: {
            "Central (Kandy)": 800,
            "North (Jaffna)": 200,
            "South (Galle)": 500,
            "East (Trincomalee)": 200,
            "West (Colombo)": 1200
        }
    },
    {
        id: "P003",
        sku: "ISDN-CL-303",
        name: "Node Cleaning Agent 303",
        category: "Home Cleaning",
        price: 2250,
        image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=400",
        description: "Industrial grade cleaning agent for retail hub maintenance.",
        stock: {
            "Central (Kandy)": 500,
            "North (Jaffna)": 100,
            "South (Galle)": 100,
            "East (Trincomalee)": 50,
            "West (Colombo)": 600
        }
    },
    {
        id: "P004",
        sku: "ISDN-PC-404",
        name: "Personal Care Unit 404",
        category: "Personal Care",
        price: 120,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
        description: "Standard personal care asset for distribution.",
        stock: {
            "Central (Kandy)": 2000,
            "North (Jaffna)": 500,
            "South (Galle)": 800,
            "East (Trincomalee)": 300,
            "West (Colombo)": 1500
        }
    },
    {
        id: "P005",
        sku: "ISDN-BV-205",
        name: "Grid Tea Asset 205",
        category: "Beverages",
        price: 2450,
        image: "https://images.unsplash.com/photo-1544787210-2211d7c928c7?auto=format&fit=crop&q=80&w=400",
        description: "High-grade beverage asset for centralized logistics.",
        stock: {
            "Central (Kandy)": 5000,
            "North (Jaffna)": 1000,
            "South (Galle)": 800,
            "East (Trincomalee)": 400,
            "West (Colombo)": 2500
        }
    }
];

export const INITIAL_ORDERS: Order[] = [
    {
        id: "ORD-9921",
        customerId: "CUST-001",
        items: [{ productId: "P001", quantity: 10 }],
        total: 12500,
        status: "In Transit",
        rdc: "West (Colombo)",
        date: "2026-02-18",
        eta: "2026-02-20"
    },
    {
        id: "ORD-9922",
        customerId: "CUST-002",
        items: [{ productId: "P002", quantity: 50 }],
        total: 49000,
        status: "Delivered",
        rdc: "South (Galle)",
        date: "2026-02-15",
        eta: "2026-02-17"
    },
    {
        id: "ORD-9923",
        customerId: "CUST-003",
        items: [{ productId: "P005", quantity: 100 }],
        total: 245000,
        status: "Pending",
        rdc: "Central (Kandy)",
        date: "2026-02-18",
        eta: "2026-02-19"
    }
];

export interface Transaction {
    id: string;
    orderId?: string;
    customer: string;
    amount: number;
    date: string;
    status: "PAID" | "PENDING" | "FAILED";
    method: "Credit Card" | "Bank Transfer" | "Online Banking" | "Cash on Delivery";
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
    {
        id: "INV-2026-101",
        orderId: "ORD-9922",
        customer: "Retail Partner - West 1",
        amount: 145000.00,
        date: "2026-02-18",
        status: "PAID",
        method: "Credit Card"
    },
    {
        id: "INV-2026-102",
        orderId: "ORD-9923",
        customer: "Retail Partner - South 1",
        amount: 245000.00,
        date: "2026-02-18",
        status: "PENDING",
        method: "Bank Transfer"
    },
    {
        id: "INV-2026-103",
        customer: "Retail Partner - Central 1",
        amount: 212500.00,
        date: "2026-02-17",
        status: "PAID",
        method: "Online Banking"
    }
];

export interface MissionTask {
    time: string;
    label: string;
    location: string;
    done: boolean;
}

export interface Mission {
    id: string;
    driverId: string;
    driverName: string;
    vehicle: string;
    currentLocation: string;
    kmTraversed: string;
    status: "In Transit" | "Maintenance" | "Idle";
    progress: number;
    telemetry: {
        fuel: string;
        temp: string;
        load: string;
    };
    tasks: MissionTask[];
}

export const INITIAL_MISSIONS: Mission[] = [
    {
        id: 'RT-2280',
        driverId: 'D001',
        driverName: 'Logistics Driver 1',
        vehicle: 'IS-VAN-782',
        currentLocation: 'Pettah Distribution Hub',
        kmTraversed: '142.5 KM',
        status: 'In Transit',
        progress: 65,
        telemetry: {
            fuel: '42%',
            temp: '88°C',
            load: '840kg'
        },
        tasks: [
            { time: '08:00', label: 'Payload Integration', location: 'Central RDC', done: true },
            { time: '10:30', label: 'Retail Node 1 - Colombo 03', location: 'Kollupitiya Hub', done: true },
            { time: '14:15', label: 'Retail Node 2 - Nugegoda', location: 'Nugegoda Sector', done: false },
            { time: '16:45', label: 'Retail Node 3 - Hyde Park', location: 'Union Place Hub', done: false }
        ]
    }
];
