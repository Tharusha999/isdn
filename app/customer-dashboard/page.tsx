"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchOrders, fetchTransactions } from "@/public/src/supabaseClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(authUser);
    if (userData.role !== "customer") {
      router.push("/login");
      return;
    }

    setUser(userData);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const ordersData = await fetchOrders();
      const transactionsData = await fetchTransactions();
      setOrders(ordersData || []);
      setTransactions(transactionsData || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "Pending").length,
    inTransitOrders: orders.filter((o) => o.status === "In Transit").length,
    deliveredOrders: orders.filter((o) => o.status === "Delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    paidTransactions: transactions.filter((t) => t.status === "PAID").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Customer Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.full_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <h3 className="text-gray-500 text-sm font-medium">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalOrders}
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-gray-500 text-sm font-medium">In Transit</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.inTransitOrders}
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-gray-500 text-sm font-medium">Delivered</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.deliveredOrders}
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-gray-500 text-sm font-medium">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                Rs. {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    RDC
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "In Transit"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.rdc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Rs. {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge
                        variant={
                          transaction.status === "PAID" ? "default" : "outline"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.method}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
