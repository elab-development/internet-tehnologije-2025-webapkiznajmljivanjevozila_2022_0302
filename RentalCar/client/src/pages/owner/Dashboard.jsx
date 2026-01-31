import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Chart } from "react-google-charts";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  // stats za grafikone
  const [stats, setStats] = useState({
    year: new Date().getFullYear(),
    bookingsMonthly: Array(12).fill(0),
    revenueMonthly: Array(12).fill(0),
    statusBreakdown: [],
    topCars: [],
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Confirmed",
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ];

  const fetchDashboardData = async () => {
    const res = await axios.get("/api/owner/dashboard");
    const payload = res.data;

    if (payload.success) {
      const dd = payload.dashboardData || {};

      setData({
        totalCars: dd.totalCars ?? 0,
        totalBookings: dd.totalBookings ?? 0,
        pendingBookings: dd.pendingBookings ?? 0,
        completedBookings: dd.completedBookings ?? 0,
        monthlyRevenue: dd.monthlyRevenue ?? 0,
        recentBookings: (dd.recentBookings || []).filter(Boolean),
      });
    } else {
      throw new Error(payload.message || "Failed to load dashboard");
    }
  };

  // povuci stats za grafikone
  const fetchStats = async () => {
    const year = new Date().getFullYear();
    const res = await axios.get(`/api/owner/stats?year=${year}`);
    const payload = res.data;

    if (!payload.success) throw new Error(payload.message || "Failed to load stats");

    const s = payload.stats || {};

    setStats({
      year: s.year ?? year,
      bookingsMonthly: Array.isArray(s.bookingsMonthly) ? s.bookingsMonthly : Array(12).fill(0),
      revenueMonthly: Array.isArray(s.revenueMonthly) ? s.revenueMonthly : Array(12).fill(0),
      statusBreakdown: Array.isArray(s.statusBreakdown) ? s.statusBreakdown : [],
      topCars: Array.isArray(s.topCars) ? s.topCars : [],
    });
  };

  useEffect(() => {
    const run = async () => {
      if (!isOwner) return;
      try {
        await Promise.all([fetchDashboardData(), fetchStats()]);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  // chart data (Google Charts format)
  const monthNames = useMemo(
    () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    []
  );

  const bookingsLineData = useMemo(() => {
    const arr = stats.bookingsMonthly?.length === 12 ? stats.bookingsMonthly : Array(12).fill(0);
    return [["Month", "Bookings"], ...arr.map((v, i) => [monthNames[i], Number(v) || 0])];
  }, [stats.bookingsMonthly, monthNames]);

  const revenueColumnData = useMemo(() => {
    const arr = stats.revenueMonthly?.length === 12 ? stats.revenueMonthly : Array(12).fill(0);
    return [["Month", "Revenue"], ...arr.map((v, i) => [monthNames[i], Number(v) || 0])];
  }, [stats.revenueMonthly, monthNames]);

  const statusPieData = useMemo(() => {
    const breakdown = stats.statusBreakdown || [];
    const rows = breakdown
      .filter(Boolean)
      .map((x) => [String(x.status ?? "unknown"), Number(x.count) || 0]);

    // ako nema podataka, pie chart ume da bude prazan -> dodaj fallback red
    if (rows.length === 0) return [["Status", "Count"], ["no data", 1]];

    return [["Status", "Count"], ...rows];
  }, [stats.statusBreakdown]);

  const topCarsBarData = useMemo(() => {
    const top = stats.topCars || [];
    const rows = top
      .filter(Boolean)
      .map((x) => [String(x.name ?? "Unknown car"), Number(x.count) || 0]);

    if (rows.length === 0) return [["Car", "Bookings"], ["no data", 0]];

    return [["Car", "Bookings"], ...rows];
  }, [stats.topCars]);

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent + Monthly */}
      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        {/* recent booking */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest customer bookings</p>

          {(data.recentBookings || []).filter(Boolean).map((booking, index) => (
            <div key={index} className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <img src={assets.listIconColored} alt="" className="h-5 w-5" />
                </div>

                <div>
                  <p>
                    {booking?.car?.brand || "Deleted car"} {booking?.car?.model || ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking?.createdAt ? booking.createdAt.split("T")[0] : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-gray-500">
                  {currency}
                  {booking?.price ?? 0}
                </p>
                <p className="px-3 py-0.5 border border-borderColor rounded-full text-sm">
                  {booking?.status || "unknown"}
                </p>
              </div>
            </div>
          ))}

          {(data.recentBookings || []).length === 0 && (
            <p className="text-gray-500 mt-4">No bookings yet.</p>
          )}
        </div>

        {/* monthly revenue */}
        <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency}
            {data.monthlyRevenue}
          </p>
        </div>
      </div>

      {/*  Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="p-4 md:p-6 border border-borderColor rounded-md">
          <h2 className="text-lg font-medium">Bookings by Month</h2>
          <p className="text-gray-500 mb-4">Number of created bookings per month</p>

          <Chart
            chartType="LineChart"
            width="100%"
            height="320px"
            data={bookingsLineData}
            options={{
              legend: { position: "bottom" },
              curveType: "function",
            }}
          />
        </div>

        <div className="p-4 md:p-6 border border-borderColor rounded-md">
          <h2 className="text-lg font-medium">Revenue by Month</h2>
          <p className="text-gray-500 mb-4">Sum of confirmed bookings</p>

          <Chart
            chartType="ColumnChart"
            width="100%"
            height="320px"
            data={revenueColumnData}
            options={{
              legend: { position: "none" },
            }}
          />
        </div>

        <div className="p-4 md:p-6 border border-borderColor rounded-md">
          <h2 className="text-lg font-medium">Booking Status Breakdown</h2>
          <p className="text-gray-500 mb-4">Distribution by status</p>

          <Chart
            chartType="PieChart"
            width="100%"
            height="320px"
            data={statusPieData}
            options={{
              pieHole: 0.45,
              legend: { position: "right" },
            }}
          />
        </div>

        <div className="p-4 md:p-6 border border-borderColor rounded-md">
          <h2 className="text-lg font-medium">Top Cars</h2>
          <p className="text-gray-500 mb-4">Most booked cars</p>

          <Chart
            chartType="BarChart"
            width="100%"
            height="320px"
            data={topCarsBarData}
            options={{
              legend: { position: "none" },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
