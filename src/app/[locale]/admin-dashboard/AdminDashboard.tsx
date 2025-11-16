"use client";

import React, { useEffect, useMemo, useState } from "react";

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

  if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;

  return (
    <div className="p-6 overflow-x-auto space-y-6 mt-20">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Search and filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <input type="text" placeholder="Search..." className="border px-3 py-2 rounded w-64"
               value={search} onChange={e => setSearch(e.target.value)} />
        <select className="border px-3 py-2 rounded" value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
          <option value="">Filter by Country</option>
          {availableCountries.map(c => (
            <option key={c} value={c ?? ""}>{c}</option>
            ))}
        </select>
        <select className="border px-3 py-2 rounded" value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>
          <option value="">Filter by Room</option>
          {availableRooms.map(r => (
            <option key={r} value={r ?? ""}>{r}</option>
            ))}
        </select>
        <select className="border px-3 py-2 rounded" value={promoFilter} onChange={e => setPromoFilter(e.target.value)}>
          <option value="">Filter by Promo Code</option>
          {availablePromos.map(p => (
            <option key={p} value={p ?? ""}>{p}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-300 bg-white text-sm">
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
              <th key={key} className="p-3 text-left cursor-pointer select-none" onClick={() => handleSort(key as keyof Registrant)}>
                {label}{sortColumn === key && <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((u, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-3">{u.firstName} {u.lastName}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.country}</td>
              <td className="p-3">{u.club}</td>
              <td className="p-3">{u.age ?? "-"}</td>
              <td className="p-3">{u.roomName ?? "-"}</td>
              <td className="p-3">{u.paymentPlanId ?? "-"}</td>
              <td className="p-3">{u.numberOfPayments ?? "-"}</td>
              <td className="p-3">{u.amountPaid != null ? (u.amountPaid / 2 / 100).toFixed(2) : "-"}</td>
              <td className="p-3">{u.fullPrice ?? "-"}</td>
              <td className="p-3">{u.fullPriceAfterDiscount ?? "-"}</td>
              <td className="p-3">{u.promoCode ?? "-"}</td>
              <td className="p-3">{u.dateRegistered ? new Date(u.dateRegistered).toLocaleDateString() : "-"}</td>
              <td className="p-3">{u.firstPaymentDate ? new Date(u.firstPaymentDate).toLocaleDateString() : "-"}</td>
              <td className="p-3">{u.lastPaymentDate ? new Date(u.lastPaymentDate).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
