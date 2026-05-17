import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  LogOut,
} from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    soldProducts: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/stats", { withCredentials: true }),
        axios.get("http://localhost:8000/api/admin/users", { withCredentials: true }),
        axios.get("http://localhost:8000/api/admin/products", { withCredentials: true }),
        axios.get("http://localhost:8000/api/admin/orders", { withCredentials: true }),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-blue-950 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {["dashboard", "users", "products", "orders", "payments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg capitalize ${activeTab === tab ? "bg-blue-800" : "hover:bg-blue-900"}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-900 rounded-lg">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-6">
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
                <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="bg-green-500" />
                <StatCard title="Sold Products" value={stats.soldProducts} icon={CheckCircle} color="bg-purple-500" />
                <StatCard title="Revenue" value={`₹${stats.revenue}`} icon={DollarSign} color="bg-emerald-500" />
              </div>
            )}
            
            {activeTab === "users" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">All Users</h3>
                <table className="w-full">
                  <thead><tr className="border-b text-left"><th>ID</th><th>Username</th><th>Email</th><th>Role</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b"><td className="p-2 pl-4">{u.id}</td><td className="p-2">{u.username}</td><td className="p-2">{u.email}</td><td className="p-2">{u.role}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "products" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">All Products</h3>
                <table className="w-full">
                  <thead><tr className="border-b text-left"><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b"><td className="p-2 pl-4">{p.id}</td><td className="p-2">{p.p_name}</td><td className="p-2">{p.category}</td><td className="p-2">₹{p.price}</td><td className="p-2">{p.status}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">All Orders</h3>
                <table className="w-full">
                  <thead><tr className="border-b text-left"><th>ID</th><th>Product</th><th>Buyer</th><th>Status</th><th>Amount</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b">
                        <td className="p-2 pl-4">{o.id}</td>
                        <td className="p-2">{o.p_name}</td>
                        <td className="p-2">{o.buyer_name}</td>
                        <td className="p-2">{o.status}</td>
                        <td className="p-2">₹{o.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Payment Transactions</h3>
                <table className="w-full">
                  <thead><tr className="border-b text-left"><th>Order ID</th><th>Method</th><th>Amount</th></tr></thead>
                  <tbody>
                    {orders.filter(o => o.status === 'Delivered').map(o => (
                      <tr key={o.id} className="border-b">
                        <td className="p-2 pl-4">{o.id}</td>
                        <td className="p-2 capitalize">{o.payment_method || "N/A"}</td>
                        <td className="p-2">₹{o.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
