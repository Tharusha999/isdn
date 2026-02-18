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
        name: "Premium Ceylon White Rice (5kg)",
        category: "Packaged Food",
        price: 1250,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
        description: "High-quality basmati rice sourced from local farmers.",
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
        name: "Ginger Beer (Pack of 6)",
        category: "Beverages",
        price: 980,
        image: "https://www.grocerylanka.com/cdn/shop/products/Ginger-Beer-330ml-can_1024x1024.jpg?v=1525742624?auto=format&fit=crop&q=80&w=400",
        description: "Classic Sri Lankan ginger beer with a spicy kick.",
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
        name: "PureHome Surface Cleaner (5L)",
        category: "Home Cleaning",
        price: 2250,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRGGl92stChsIjQqxDlcFwVpIKsh9-p6bjsA&s?auto=format&fit=crop&q=80&w=400",
        description: "Eco-friendly multi-surface cleaner.",
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
        name: "Soap (100g)",
        category: "Personal Care",
        price: 120,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD5SXTfVm14Z1KL-J9RfmTHCWfMA0MTV9R2Q&s?auto=format&fit=crop&q=80&w=400",
        description: "Moisturizing soap.",
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
        name: "Ceylon High-Grown Tea (500g)",
        category: "Beverages",
        price: 2450,
        image: "https://www.aicr.org/wp-content/uploads/2020/06/peppermint-tea-on-teacup-1417945.jpg?auto=format&fit=crop&q=80&w=400",
        description: "Premium black tea from the central highlands.",
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
        date: "2024-02-18",
        eta: "2024-02-20"
    },
    {
        id: "ORD-9922",
        customerId: "CUST-002",
        items: [{ productId: "P002", quantity: 50 }],
        total: 49000,
        status: "Delivered",
        rdc: "South (Galle)",
        date: "2024-02-15",
        eta: "2024-02-17"
    },
    {
        id: "ORD-9923",
        customerId: "CUST-003",
        items: [{ productId: "P005", quantity: 100 }],
        total: 245000,
        status: "Pending",
        rdc: "Central (Kandy)",
        date: "2024-02-18",
        eta: "2024-02-19"
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
        id: "INV-2024-101",
        orderId: "ORD-9922",
        customer: "Singer Mega - Colombo 03",
        amount: 145000.00,
        date: "2024-02-18",
        status: "PAID",
        method: "Credit Card"
    },
    {
        id: "INV-2024-102",
        orderId: "ORD-9923",
        customer: "Softlogic Retail - Galle",
        amount: 245000.00,
        date: "2024-02-18",
        status: "PENDING",
        method: "Bank Transfer"
    },
    {
        id: "INV-2024-103",
        customer: "Abans PLC - Kandy",
        amount: 212500.00,
        date: "2024-02-17",
        status: "PAID",
        method: "Online Banking"
    }
];
