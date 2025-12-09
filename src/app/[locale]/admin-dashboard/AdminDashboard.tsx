"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

interface Registrant {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  club: string;
  age: number | null;
  roomName: string | null;
  paymentPlanId: string | null;
  numberOfPayments: number | null;
  amountPaid: number | null;
  fullPrice: number | null;
  fullPriceAfterDiscount: number | null;
  promoCode: string | null;
  dateRegistered: string | null;
  firstPaymentDate: string | null;
  lastPaymentDate: string | null;
}

type SortOrder = "asc" | "desc";

export default function AdminDashboard() {
  const [data, setData] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [promoFilter, setPromoFilter] = useState("");

  const [sortColumn, setSortColumn] = useState<keyof Registrant | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/registrants`);
        const json = await res.json();

        if (!json.success) {
          setError("Failed to load data");
        } else {
          setData(json.data);
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const availableCountries = useMemo(() => Array.from(new Set(data.map(d => d.country).filter(Boolean))), [data]);
  const availableRooms = useMemo(() => Array.from(new Set(data.map(d => d.roomName).filter(Boolean))), [data]);
  const availablePromos = useMemo(() => Array.from(new Set(data.map(d => d.promoCode).filter(Boolean))), [data]);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(r => JSON.stringify(r).toLowerCase().includes(term));
    }

    if (countryFilter) result = result.filter(r => r.country === countryFilter);
    if (roomFilter) result = result.filter(r => r.roomName === roomFilter);
    if (promoFilter) result = result.filter(r => r.promoCode === promoFilter);

    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === null) return 1;
        if (bVal === null) return -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortOrder === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [data, search, countryFilter, roomFilter, promoFilter, sortColumn, sortOrder]);

  const handleSort = (column: keyof Registrant) => {
    if (column === sortColumn) setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const downloadCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Country",
      "Club",
      "Age",
      "Room",
      "Payment Plan ID",
      "Number of Payments",
      "Amount Paid",
      "Full Price",
      "Full Price After Discount",
      "Promo Code",
      "Date Registered",
      "First Payment Date",
      "Last Payment Date",
    ];

    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    const rows = filteredData.map(r => [
      r.firstName,
      r.lastName,
      r.email,
      r.country,
      r.club,
      r.age ?? "",
      r.roomName ?? "",
      r.paymentPlanId ?? "",
      r.numberOfPayments ?? "",
      r.amountPaid != null ? (r.amountPaid / 2 / 100).toFixed(2) : "",
      r.fullPrice ?? "",
      r.fullPriceAfterDiscount ?? "",
      r.promoCode ?? "",
      formatDate(r.dateRegistered),
      formatDate(r.firstPaymentDate),
      formatDate(r.lastPaymentDate),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `registrants-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;

  return (
    <div className="p-4 md:p-6 overflow-x-auto space-y-4 md:space-y-6 mt-16 md:mt-20">
      <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-stretch sm:items-center flex-1">
          <input type="text" placeholder="Search..." className="border px-3 py-2 rounded w-full sm:w-64"
                 value={search} onChange={e => setSearch(e.target.value)} />
          <select className="border px-3 py-2 rounded w-full sm:w-auto" value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
            <option value="">Filter by Country</option>
            {availableCountries.map(c => (
              <option key={c} value={c ?? ""}>{c}</option>
              ))}
          </select>
          <select className="border px-3 py-2 rounded w-full sm:w-auto" value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>
            <option value="">Filter by Room</option>
            {availableRooms.map(r => (
              <option key={r} value={r ?? ""}>{r}</option>
              ))}
          </select>
          <select className="border px-3 py-2 rounded w-full sm:w-auto" value={promoFilter} onChange={e => setPromoFilter(e.target.value)}>
            <option value="">Filter by Promo Code</option>
            {availablePromos.map(p => (
              <option key={p} value={p ?? ""}>{p}</option>
            ))}
          </select>
        </div>
        <button
          onClick={downloadCSV}
          className="text-white px-3 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md w-full sm:w-auto"
          style={{ backgroundColor: '#3cc4ffff' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00d0ffff'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3cc4ffff'}
          title={`Download CSV (${filteredData.length} records)`}
        >
          <Download size={20} />
          <span className="sm:hidden">Download CSV ({filteredData.length})</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="min-w-full border border-gray-300 bg-white text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              {[
                ["Name", "firstName"],
                ["Email", "email"],
                ["Country", "country"],
                ["Club", "club"],
                ["Age", "age"],
                ["Room", "roomName"],
                ["Installments", "paymentPlanId"],
                ["Payments", "numberOfPayments"],
                ["Paid", "amountPaid"],
                ["Full Price", "fullPrice"],
                ["After Discount", "fullPriceAfterDiscount"],
                ["Promo", "promoCode"],
                ["Registered", "dateRegistered"],
                ["First Payment", "firstPaymentDate"],
                ["Last Payment", "lastPaymentDate"],
              ].map(([label, key]) => (
                <th key={key} className="p-2 md:p-3 text-left cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort(key as keyof Registrant)}>
                  {label}{sortColumn === key && <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((u, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2 md:p-3 whitespace-nowrap">{u.firstName} {u.lastName}</td>
                <td className="p-2 md:p-3">{u.email}</td>
                <td className="p-2 md:p-3">{u.country}</td>
                <td className="p-2 md:p-3">{u.club}</td>
                <td className="p-2 md:p-3">{u.age ?? "-"}</td>
                <td className="p-2 md:p-3">{u.roomName ?? "-"}</td>
                <td className="p-2 md:p-3">{u.paymentPlanId ?? "-"}</td>
                <td className="p-2 md:p-3">{u.numberOfPayments ?? "-"}</td>
                <td className="p-2 md:p-3">{u.amountPaid != null ? (u.amountPaid / 2 / 100).toFixed(2) : "-"}</td>
                <td className="p-2 md:p-3">{u.fullPrice ?? "-"}</td>
                <td className="p-2 md:p-3">{u.fullPriceAfterDiscount ?? "-"}</td>
                <td className="p-2 md:p-3">{u.promoCode ?? "-"}</td>
                <td className="p-2 md:p-3 whitespace-nowrap">{u.dateRegistered ? new Date(u.dateRegistered).toLocaleDateString() : "-"}</td>
                <td className="p-2 md:p-3 whitespace-nowrap">{u.firstPaymentDate ? new Date(u.firstPaymentDate).toLocaleDateString() : "-"}</td>
                <td className="p-2 md:p-3 whitespace-nowrap">{u.lastPaymentDate ? new Date(u.lastPaymentDate).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}