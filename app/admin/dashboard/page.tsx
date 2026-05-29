import {
    Search,
    Wallet,
    Banknote,
    TrendingUp,
    CheckCircle2,
    Car,
    Wrench,
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
            className={`rounded-xl border p-5 ${dark
                ? "bg-gradient-to-r from-[#1B263B] via-[#0F172A] to-[#1B263B] text-white border-transparent"
                : "bg-white border-[#E5E7EB]"
                }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p
                        className={`text-xs tracking-wider uppercase ${dark ? "text-[#D0D9E6]" : "text-gray-500"
                            }`}
                    >
                        {title}
                    </p>

                    <h3 className="text-[32px] font-bold mt-5">
                        {value}
                    </h3>

                    <p
                        className={`mt-2 text-sm ${dark ? "text-white" : "text-gray-500"
                            }`}
                    >
                        {change}
                    </p>
                </div>

                <div
                    className={`p-3 rounded-lg ${dark
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
        icon: <CheckCircle2 size={18} />,
        title: "Porsche 911 GT3 RS",
        description: "Invoice #INV-2023-089",
        time: "2 hours ago",
        badge: "Sold",
        badgeClass: "bg-green-100 text-green-700",
    },
    {
        icon: <Car size={18} />,
        title: "Mercedes-Benz G63 AMG",
        description: "Added to Inventory",
        time: "5 hours ago",
        badge: "New Unit",
        badgeClass: "bg-blue-100 text-[#415A77]",
    },
    {
        icon: <Wrench size={18} />,
        title: "Range Rover Autobiography",
        description: "Sent to detailed inspection",
        time: "Yesterday",
        badge: "Maintenance",
        badgeClass: "bg-orange-100 text-orange-700",
    },
];

export default function DashboardPage() {
    const chartData = [4.2, 6.6, 5.8, 9, 8.2, 12, 14.5];

    return (
        <div className="px-8 py-6">
            {/* Top Header */}
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-[28px] font-bold text-[#1B263B]">
                    Financial Trackers
                </h1>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            placeholder="Search inventory..."
                            className="w-[260px] h-10 rounded-lg border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none"
                        />
                    </div>

                    <img
                        src="https://i.pravatar.cc/100"
                        alt="profile"
                        className="w-11 h-11 rounded-full object-cover"
                    />
                </div>
            </div>

            {/* Heading */}
            <div className="mb-10">
                <h2 className="text-[40px] font-bold text-[#1B263B]">
                    Selamat Datang, Admin!
                </h2>

                <p className="text-base text-gray-500 mt-2">
                    Berikut adalah overview keuangan untuk bulan ini.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Pemasukan"
                    value="Rp 12.4B"
                    change="+8.2% vs last month"
                    icon={<Wallet size={20} />}
                />

                <StatCard
                    title="Total Pengeluaran"
                    value="Rp 8.1B"
                    change="-2.4% vs last month"
                    icon={<Banknote size={20} />}
                />

                <StatCard
                    dark
                    title="Keuntungan"
                    value="Rp 4.3B"
                    change="+12.5% vs last month"
                    icon={<TrendingUp size={20} />}
                />
            </div>

            {/* Content */}
            <div className="grid grid-cols-12 gap-6">
                {/* Chart */}
                <div className="col-span-8 bg-white rounded-xl border border-[#E5E7EB] p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[24px] font-bold text-[#1B263B]">
                            Tren Keuntungan Bulanan
                        </h3>

                        <button className="px-4 py-2 border rounded-lg text-[#415A77] text-sm font-medium">
                            This Year
                        </button>
                    </div>

                    <div className="h-[300px] flex items-end justify-between gap-8 px-4">
                        {chartData.map((value, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center flex-1 gap-3"
                            >
                                <div
                                    className={`w-full rounded-t-md ${index === 6
                                        ? "bg-[#1B263B]"
                                        : "bg-[#7F93AE]"
                                        }`}
                                    style={{
                                        height: `${value * 12}px`,
                                    }}
                                />

                                <span className="text-xs text-gray-500">
                                    {
                                        [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                        ][index]
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div className="col-span-4 bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-[24px] font-bold text-[#1B263B]">
                            Aktivitas Terakhir
                        </h3>

                        <button className="text-[#415A77] text-sm font-semibold">
                            View All
                        </button>
                    </div>

                    <div>
                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                className="flex gap-4 p-6 border-b last:border-b-0"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#F3F5F8] flex items-center justify-center text-[#415A77] shrink-0">
                                    {activity.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-[14px] text-[#1B263B]">
                                            {activity.title}
                                        </h4>

                                        <span
                                            className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${activity.badgeClass}`}
                                        >
                                            {activity.badge}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {activity.description}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-2">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}