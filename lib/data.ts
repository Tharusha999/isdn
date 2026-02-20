export type RDC = "North (Jaffna)" | "South (Galle)" | "East (Trincomalee)" | "West (Colombo)" | "Central (Kandy)";

export const RDCS: RDC[] = [
    "North (Jaffna)",
    "South (Galle)",
    "East (Trincomalee)",
    "West (Colombo)",
    "Central (Kandy)"
];

// Compatibility Types
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

export interface Transaction {
    id: string;
    orderId?: string;
    customer: string;
    amount: number;
    date: string;
    status: "PAID" | "PENDING" | "FAILED";
    method: "Credit Card" | "Bank Transfer" | "Online Banking" | "Cash on Delivery";
}

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
