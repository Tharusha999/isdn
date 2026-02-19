
export interface StaffMember {
    id: string;
    name: string;
    role: string;
    status: "Active" | "Away" | "On Route" | "Offline";
    email: string;
    phone: string;
    join_date: string;
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

// This file is now primarily for types.
// Staff data is now fetched from Supabase using helpers in @/public/src/supabaseClient
