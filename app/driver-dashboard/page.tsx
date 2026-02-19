"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMissions, getDriverUser } from "@/public/src/supabaseClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface Mission {
  id: string;
  driver_name: string;
  vehicle: string;
  current_location: string;
  km_traversed: string;
  status: string;
  progress: number;
  fuel_level: string;
  temperature: string;
  load_weight: string;
  mission_tasks: any[];
}

export default function DriverDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState<any>(null);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(authUser);
    if (userData.role !== "driver") {
      router.push("/login");
      return;
    }

    setUser(userData);
    loadData(userData.id);
  }, [router]);

  const loadData = async (driverId: string) => {
    try {
      const missionsData = await fetchMissions();
      const driverData = await getDriverUser(driverId);

      // Filter missions for this driver
      const driverMissions = missionsData.filter(
        (m: Mission) => m.driver_name === driverData.full_name,
      );

      setMissions(driverMissions);
      setDriverInfo(driverData);
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

  const activeMission = missions.find((m) => m.status === "In Transit");
  const completedMissions = missions.filter(
    (m) => m.status !== "In Transit" && m.status !== "Maintenance",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Driver Dashboard
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
        {/* Driver Information Card */}
        {driverInfo && (
          <Card className="mb-8">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Full Name
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {driverInfo.full_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    License Number
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {driverInfo.license_number}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Assigned Vehicle
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {driverInfo.vehicle_assigned || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">RDC Hub</h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {driverInfo.rdc_hub || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Active Mission */}
        {activeMission && (
          <Card className="mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Active Mission
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Mission ID
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {activeMission.id}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Vehicle</h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {activeMission.vehicle}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Current Location
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {activeMission.current_location}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Distance Traveled
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {activeMission.km_traversed}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Mission Progress
                  </h3>
                  <span className="text-lg font-semibold text-gray-900">
                    {activeMission.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${activeMission.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Telemetry */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Fuel Level
                  </h3>
                  <p className="text-lg font-semibold text-blue-600 mt-1">
                    {activeMission.fuel_level}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Temperature
                  </h3>
                  <p className="text-lg font-semibold text-orange-600 mt-1">
                    {activeMission.temperature}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Load Weight
                  </h3>
                  <p className="text-lg font-semibold text-purple-600 mt-1">
                    {activeMission.load_weight}
                  </p>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h3 className="text-gray-700 font-semibold mb-4">Tasks</h3>
                <div className="space-y-2">
                  {activeMission.mission_tasks?.map(
                    (task: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          disabled
                          className="w-5 h-5 text-green-600 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {task.task_label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.location} @ {task.task_time}
                          </p>
                        </div>
                        {task.completed && (
                          <Badge variant="default">Completed</Badge>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Completed Missions */}
        {completedMissions.length > 0 && (
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Completed Missions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Mission ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Distance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {completedMissions.map((mission) => (
                    <tr key={mission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        {mission.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {mission.vehicle}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant="default">{mission.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {mission.current_location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {mission.km_traversed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {missions.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No missions assigned yet.</p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
