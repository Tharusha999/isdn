import { StaffMember } from "@/app/dashboard/staff/data"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
} // Note: Staff data is now handled via Supabase queries. 
// See @/public/src/supabaseClient for data fetching helpers.

