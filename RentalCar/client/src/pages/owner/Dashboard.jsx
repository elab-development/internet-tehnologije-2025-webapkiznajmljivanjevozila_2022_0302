import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/useAppContext.js";
import toast from "react-hot-toast";
import { Chart } from "react-google-charts";

const Dashboard = () => {
  const { axios, isOwner, currency, user } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

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

  const fetchStats = async () => {
    const year = new Date().getFullYear();
    const res = await axios.get(`/api/owner/stats?year=${year}`);
    const payload = res.data;

    if (!payload.success)
      throw new Error(payload.message || "Failed to load stats");

    const s = payload.stats || {};

    setStats({
      year: s.year ?? year,
      bookingsMonthly: Array.isArray(s.bookingsMonthly)
        ? s.bookingsMonthly
        : Array(12).fill(0),
      revenueMonthly: Array.isArray(s.revenueMonthly)
        ? s.revenueMonthly
        : Array(12).fill(0),
      statusBreakdown: Array.isArray(s.statusBreakdown)
        ? s.statusBreakdown
        : [],
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
  }, [isOwner]);

  const monthNames = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    [],
  );

  const bookingsLineData = useMemo(() => {
    const arr =
      stats.bookingsMonthly?.length === 12
        ? stats.bookingsMonthly
        : Array(12).fill(0);
    return [
      ["Month", "Bookings"],
      ...arr.map((v, i) => [monthNames[i], Number(v) || 0]),
    ];
  }, [stats.bookingsMonthly, monthNames]);

  const revenueColumnData = useMemo(() => {
    const arr =
      stats.revenueMonthly?.length === 12
        ? stats.revenueMonthly
        : Array(12).fill(0);
    return [
      ["Month", "Revenue"],
      ...arr.map((v, i) => [monthNames[i], Number(v) || 0]),
    ];
  }, [stats.revenueMonthly, monthNames]);

  const statusPieData = useMemo(() => {
    const breakdown = stats.statusBreakdown || [];
    const rows = breakdown
      .filter(Boolean)
      .map((x) => [String(x.status ?? "unknown"), Number(x.count) || 0]);

    if (rows.length === 0)
      return [
        ["Status", "Count"],
        ["no data", 1],
      ];

    return [["Status", "Count"], ...rows];
  }, [stats.statusBreakdown]);

  const topCarsBarData = useMemo(() => {
    const top = stats.topCars || [];
    const rows = top
      .filter(Boolean)
      .map((x) => [String(x.name ?? "Unknown car"), Number(x.count) || 0]);

    if (rows.length === 0)
      return [
        ["Car", "Bookings"],
        ["no data", 0],
      ];

    return [["Car", "Bookings"], ...rows];
  }, [stats.topCars]);

  return (
    <div className="px-4 pt-6 md:px-10 flex-1 bg-white text-black">
      {/* TOP BAR */}
      <div className="-mx-4 md:-mx-10 px-4 md:px-10 w-auto flex justify-end items-center mb-6 pt-1 pb-5 border-b border-primary">
        <p className="text-sm text-black">
          Welcome,{" "}
          <span className="text-primary font-semibold">
            {user?.name || "Owner"}
          </span>
        </p>
      </div>
      <div className="pt-0 pb-6 [&_h1]:text-primary [&_*]:text-gray-800 [&_p]:text-gray-600">
        <Title
          title="Admin Dashboard"
          subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
          className="text-primary"
        />
      </div>
      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-gray-200 bg-white shadow-md"
          >
            <div>
              <h1 className="text-xs text-gray-600">{card.title}</h1>
              <p className="text-lg font-semibold text-black">{card.value}</p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent + Monthly */}
      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        <div className="p-4 md:p-6 border border-gray-200 rounded-md max-w-lg w-full bg-white shadow-md">
          <h1 className="text-lg font-medium text-primary">Recent Bookings</h1>
          <p className="text-gray-600">Latest customer bookings</p>

          {(data.recentBookings || []).filter(Boolean).map((booking, index) => (
            <div key={index} className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <img
                    src={assets.listIconColored}
                    alt=""
                    className="h-5 w-5"
                  />
                </div>

                <div>
                  <p className="text-black">
                    {booking?.car?.brand || "Deleted car"}{" "}
                    {booking?.car?.model || ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking?.createdAt ? booking.createdAt.split("T")[0] : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-gray-600">
                  {currency}
                  {booking?.price ?? 0}
                </p>
                <p className="px-3 py-0.5 border border-gray-300 rounded-full text-sm text-black">
                  {booking?.status || "unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 md:p-6 mb-6 border border-gray-200 rounded-md w-full md:max-w-xs bg-white shadow-md">
          <h1 className="text-lg font-medium text-primary">Monthly Revenue</h1>
          <p className="text-gray-600">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency}
            {data.monthlyRevenue}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="p-4 md:p-6 border border-gray-200 rounded-md bg-white shadow-md">
          <h2 className="text-lg font-medium text-primary">
            Bookings by Month
          </h2>
          <Chart
            chartType="LineChart"
            width="100%"
            height="320px"
            data={bookingsLineData}
            options={{
              backgroundColor: "transparent",
              colors: ["#C6A96B"],
            }}
          />
        </div>

        <div className="p-4 md:p-6 border border-gray-200 rounded-md bg-white shadow-md">
          <h2 className="text-lg font-medium text-primary">Revenue by Month</h2>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="320px"
            data={revenueColumnData}
            options={{
              backgroundColor: "transparent",
              colors: ["#C6A96B"],
            }}
          />
        </div>

        <div className="p-4 md:p-6 border border-gray-200 rounded-md bg-white shadow-md">
          <h2 className="text-lg font-medium text-primary">
            Booking Status Breakdown
          </h2>
          <Chart
            chartType="PieChart"
            width="100%"
            height="320px"
            data={statusPieData}
            options={{
              backgroundColor: "transparent",
              colors: ["#C6A96B", "#A8894E", "#F5E6B3"],
            }}
          />
        </div>

        <div className="p-4 md:p-6 border border-gray-200 rounded-md bg-white shadow-md">
          <h2 className="text-lg font-medium text-primary">Top Cars</h2>
          <Chart
            chartType="BarChart"
            width="100%"
            height="320px"
            data={topCarsBarData}
            options={{
              backgroundColor: "transparent",
              colors: ["#C6A96B"],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
