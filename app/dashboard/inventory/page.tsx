import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRightLeft, Download, Filter, MapPin, Package, Plus } from "lucide-react";

// Mock Inventory Data
const inventory = [
    {
        sku: "PRD-001",
        name: "Munchee Super Cream Cracker 490g",
        category: "Biscuits",
        rdc: "North (Jaffna)",
        stock: 450,
        status: "In Stock",
    },
    {
        sku: "PRD-002",
        name: "Sunlight Soap Bar 110g",
        category: "Home Care",
        rdc: "South (Galle)",
        stock: 25,
        status: "Low Stock",
    },
    {
        sku: "PRD-003",
        name: "Coca Cola 1.5L PET",
        category: "Beverages",
        rdc: "West (Colombo)",
        stock: 0,
        status: "Out of Stock",
    },
    {
        sku: "PRD-004",
        name: "Signal Toothpaste 160g",
        category: "Personal Care",
        rdc: "Central (Kandy)",
        stock: 1200,
        status: "In Stock",
    },
    {
        sku: "PRD-005",
        name: "Anchor Full Cream Milk Powder 400g",
        category: "Dairy",
        rdc: "East (Trincomalee)",
        stock: 85,
        status: "In Stock",
    },
];

export default function InventoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
                    <p className="text-muted-foreground">
                        Monitor stock levels across all Regional Distribution Centres.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Stock
                    </Button>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total SKUs
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,204</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Low Stock Alerts
                        </CardTitle>
                        <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            Requires immediate attention
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Stock Valuation
                        </CardTitle>
                        <div className="font-bold text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">+4%</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. 1.2M</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Stock Overview</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                            <Input
                                placeholder="Search products..."
                                className="h-8 w-[150px] lg:w-[250px]"
                            />
                        </div>
                    </div>
                    <CardDescription>
                        Real-time availability by RDC.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Location (RDC)</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.sku}>
                                    <TableCell className="font-medium">{item.sku}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            {item.rdc}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                item.status === "In Stock" ? "secondary" :
                                                    item.status === "Low Stock" ? "warning" : "destructive"
                                            }
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <span className="text-lg">...</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
