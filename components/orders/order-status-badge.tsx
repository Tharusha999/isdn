import { Badge } from "@/components/ui/badge";

type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

interface OrderStatusBadgeProps {
    status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "default";

    switch (status) {
        case "Pending":
            variant = "warning";
            break;
        case "Processing":
            variant = "secondary";
            break;
        case "Delivered":
            variant = "success";
            break;
        case "Cancelled":
            variant = "destructive";
            break;
        default:
            variant = "outline";
    }

    return <Badge variant={variant}>{status}</Badge>;
}
