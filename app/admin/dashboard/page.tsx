import {
    Wallet,
    Banknote,
    TrendingUp,
    CheckCircle2,
    Car,
    Wrench,
    Plus,
    FileText,
    Users,
    Settings
} from "lucide-react";

function StatCard({
    title,
    value,
    change,
    icon,
    dark = false,
}: {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
    dark?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border p-4 ${dark
                ? "bg-gradient-to-r from-[#1B263B] via-[#0F172A] to-[#1B263B] text-white border-transparent shadow-md"
                : "bg-white border-[#E5E7EB] shadow-sm"
                }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p
                        className={`text-[11px] font-semibold tracking-wider uppercase ${dark ? "text-[#D0D9E6]" : "text-gray-500"
                            }`}
                    >
                        {title}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                        {value}
                    </h3>

                    <p
                        className={`mt-1 text-xs ${dark ? "text-gray-300" : "text-gray-500"
                            }`}
                    >
                        {change}
                    </p>
                </div>

                <div
                    className={`p-2 rounded-lg ${dark
                        ? "bg-[#415A77]"
                        : "bg-[#EEF2F7] text-[#415A77]"
                        }`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

const activities = [
    {
        icon: <CheckCircle2 size={16} />,
        title: "Porsche 911 GT3 RS",
        description: "Invoice #INV-2023-089",
        time: "2 hours ago",
        badge: "Sold",
        badgeClass: "bg-green-100 text-green-700",
    },
    {
        icon: <Car size={16} />,
        title: "Mercedes-Benz G63 AMG",
        description: "Added to Inventory",
        time: "5 hours ago",
        badge: "New Unit",
        badgeClass: "bg-blue-100 text-[#415A77]",
    },
    {
        icon: <Wrench size={16} />,
        title: "Range Rover",
        description: "Sent to inspection",
        time: "Yesterday",
        badge: "Maintenance",
        badgeClass: "bg-orange-100 text-orange-700",
    },
];

export default function DashboardPage() {
    const chartData = [4.2, 6.6, 5.8, 9, 8.2, 12, 14.5];

    return (
        <div className="flex flex-col gap-6">

            {/* Heading */}
            <div>
                <h2 className="text-2xl font-bold text-[#1B263B]">
                    Selamat Datang, Admin!
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Berikut adalah overview keuangan untuk bulan ini.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard
                    title="Total Pemasukan"
                    value="Rp 12.4B"
                    change="+8.2% vs last month"
                    icon={<Wallet size={18} />}
                />
                <StatCard
                    title="Total Pengeluaran"
                    value="Rp 8.1B"
                    change="-2.4% vs last month"
                    icon={<Banknote size={18} />}
                />
                <StatCard
                    dark
                    title="Keuntungan"
                    value="Rp 4.3B"
                    change="+12.5% vs last month"
                    icon={<TrendingUp size={18} />}
                />
            </div>

            {/* Content (Charts & Activity) */}
            <div className="grid grid-cols-12 gap-4">
                {/* Chart */}
                <div className="col-span-8 bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#1B263B]">
                            Tren Keuntungan Bulanan
                        </h3>

                        <button className="px-3 py-1.5 border rounded-lg text-[#415A77] text-xs font-semibold hover:bg-gray-50 transition-colors">
                            This Year
                        </button>
                    </div>

                    <div className="flex-1 min-h-[220px] flex items-end justify-between gap-6 px-2">
                        {chartData.map((value, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center flex-1 gap-2 h-full justify-end"
                            >
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-500 ${index === 6
                                        ? "bg-[#1B263B]"
                                        : "bg-[#7F93AE] hover:bg-[#62758f]"
                                        }`}
                                    style={{
                                        height: `${(value / 15) * 100}%`,
                                        minHeight: '20px'
                                    }}
                                />
                                <span className="text-[11px] font-medium text-gray-400 mt-1">
                                    {
                                        ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][index]
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div className="col-span-4 flex flex-col">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] flex flex-col shadow-sm flex-1">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-bold text-[#1B263B]">
                                Aktivitas
                            </h3>

                            <button className="text-[#415A77] text-xs font-semibold hover:underline">
                                View All
                            </button>
                        </div>

                        <div className="flex-1">
                            {activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-[#F3F5F8] flex items-center justify-center text-[#415A77] shrink-0">
                                        {activity.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-semibold text-sm text-[#1B263B] truncate">
                                                {activity.title}
                                            </h4>

                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${activity.badgeClass}`}
                                            >
                                                {activity.badge}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            {activity.description}
                                        </p>

                                        <p className="text-[10px] text-gray-400 mt-1">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
                <button className="flex items-center gap-3 p-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#415A77] hover:shadow-md transition-all group text-left shadow-sm">
                    <div className="p-2.5 bg-[#EEF2F7] rounded-lg text-[#415A77] group-hover:bg-[#415A77] group-hover:text-white transition-colors">
                        <Plus size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#1B263B]">Tambah Unit Baru</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Input kendaraan ke inventory</p>
                    </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#415A77] hover:shadow-md transition-all group text-left shadow-sm">
                    <div className="p-2.5 bg-[#EEF2F7] rounded-lg text-[#415A77] group-hover:bg-[#415A77] group-hover:text-white transition-colors">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#1B263B]">Buat Invoice</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Catat transaksi penjualan</p>
                    </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#415A77] hover:shadow-md transition-all group text-left shadow-sm">
                    <div className="p-2.5 bg-[#EEF2F7] rounded-lg text-[#415A77] group-hover:bg-[#415A77] group-hover:text-white transition-colors">
                        <Users size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#1B263B]">Data Pelanggan</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola database klien</p>
                    </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#415A77] hover:shadow-md transition-all group text-left shadow-sm">
                    <div className="p-2.5 bg-[#EEF2F7] rounded-lg text-[#415A77] group-hover:bg-[#415A77] group-hover:text-white transition-colors">
                        <Settings size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#1B263B]">Pengaturan</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Konfigurasi sistem admin</p>
                    </div>
                </button>
            </div>

        </div>
    );
}