export interface StaffMember {
    name: string;
    role: string;
    status: "Active" | "Away" | "On Route" | "Offline";
    email: string;
    phone: string;
    joinDate: string;
    department: string;
    location: string;
    bio: string;
    recentActivity: {
        action: string;
        date: string;
        time: string;
    }[];
    performance: {
        deliveriesCompleted: number;
        onTimeRate: string;
        hoursWorked: number;
        rating: number;
    };
}

export const staff: StaffMember[] = [
    {
        name: "John Doe",
        role: "Warehouse Manager",
        status: "Active",
        email: "john@isdn.lk",
        phone: "+94 77 123 4567",
        joinDate: "March 2022",
        department: "Logistics",
        location: "Colombo HQ",
        bio: "Experienced warehouse manager with over 10 years in logistics and supply chain management. Expert in inventory optimization.",
        recentActivity: [
            { action: "Approved shipment #4432", date: "Today", time: "10:30 AM" },
            { action: "Updated inventory logs", date: "Today", time: "09:15 AM" },
            { action: "Staff meeting", date: "Yesterday", time: "02:00 PM" }
        ],
        performance: {
            deliveriesCompleted: 1240,
            onTimeRate: "98%",
            hoursWorked: 160,
            rating: 4.8
        }
    },
    {
        name: "Jane Smith",
        role: "Logistics Coordinator",
        status: "Away",
        email: "jane@isdn.lk",
        phone: "+94 77 234 5678",
        joinDate: "January 2023",
        department: "Operations",
        location: "Kandy Branch",
        bio: "Dedicated coordinator ensuring smooth operations between fleet and warehouse. Specialist in route planning.",
        recentActivity: [
            { action: "Scheduled fleet maintenance", date: "Today", time: "11:00 AM" },
            { action: "Client call", date: "Yesterday", time: "04:30 PM" }
        ],
        performance: {
            deliveriesCompleted: 850,
            onTimeRate: "95%",
            hoursWorked: 155,
            rating: 4.7
        }
    },
    {
        name: "Mike Johnson",
        role: "Driver",
        status: "On Route",
        email: "mike@isdn.lk",
        phone: "+94 77 345 6789",
        joinDate: "June 2023",
        department: "Transport",
        location: "Galle Hub",
        bio: "Reliable senior driver with a perfect safety record. Knows the southern routes like the back of his hand.",
        recentActivity: [
            { action: "Started route #882", date: "Today", time: "06:00 AM" },
            { action: "Delivered package #998", date: "Yesterday", time: "05:00 PM" }
        ],
        performance: {
            deliveriesCompleted: 2100,
            onTimeRate: "99%",
            hoursWorked: 180,
            rating: 4.9
        }
    },
    {
        name: "Sarah Williams",
        role: "Inventory Specialist",
        status: "Active",
        email: "sarah@isdn.lk",
        phone: "+94 77 456 7890",
        joinDate: "August 2023",
        department: "Inventory",
        location: "Colombo HQ",
        bio: "Detail-oriented specialist focused on stock accuracy and minimizing shrinkage. Implemented the new RFID system.",
        recentActivity: [
            { action: "Stock audit completed", date: "Today", time: "02:00 PM" },
            { action: "Received new stock", date: "Today", time: "08:00 AM" }
        ],
        performance: {
            deliveriesCompleted: 0,
            onTimeRate: "100%",
            hoursWorked: 162,
            rating: 4.8
        }
    },
    {
        name: "David Brown",
        role: "Driver",
        status: "Active",
        email: "david@isdn.lk",
        phone: "+94 77 567 8901",
        joinDate: "November 2023",
        department: "Transport",
        location: "Jaffna Branch",
        bio: "Newest addition to the fleet. Quick learner and efficient on long-haul routes to the north.",
        recentActivity: [
            { action: "Vehicle check completed", date: "Today", time: "07:30 AM" }
        ],
        performance: {
            deliveriesCompleted: 340,
            onTimeRate: "92%",
            hoursWorked: 150,
            rating: 4.5
        }
    },
    {
        name: "Emily Davis",
        role: "Finance Officer",
        status: "Offline",
        email: "emily@isdn.lk",
        phone: "+94 77 678 9012",
        joinDate: "February 2021",
        department: "Finance",
        location: "Colombo HQ",
        bio: "Certified accountant managing payroll and operational expenses. Keeps the books balanced and transparent.",
        recentActivity: [
            { action: "Processed payroll", date: "Friday", time: "03:00 PM" }
        ],
        performance: {
            deliveriesCompleted: 0,
            onTimeRate: "100%",
            hoursWorked: 160,
            rating: 4.9
        }
    },
];
