"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DOMPurify from "dompurify";

const palette = {
  background: '#ffffffff',
  cardBg: '#FFFFFF',
  cardBorder: '#b2f3ffff',
  cardShadow: '0 4px 12px rgba(60, 190, 255, 0.08)',
  accent: '#00d0ffff',
  primary: '#3cc4ffff',
  secondary: '#66f2ffff',
  tertiary: '#509cffff',
  midday: '#2C5282',
  middayLight: '#4299E1',
  middayDark: '#1A365D',
  text: '#2D2D2D',
  textSecondary: '#7F8C8D',
  textLight: '#B0B0B0',
  hobbyBg: '#e0fcffff',
  hobbyText: '#3c6dffff',
  success: '#4CAF50',
  white: '#FFFFFF',
  lightOrange: '#f0feffff',
};

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    amount: "500.00",
    description: "Belize 2026 Conference Registration - Cupo #1",
    returnUrl: process.env.NEXT_PUBLIC_RETURN_URL,
    orderNumber: uuidv4(),
    clientId: "",
    email: "",
    fullName: "",
    dob: "",
    shirtSize: "",
    clubName: "",
    country: "",
    dynamicCallbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL,
  });

  const sanitizeInput = (input: string) => DOMPurify.sanitize(input);

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateEmail(formData.email)) {
    alert("Invalid email address");
    return;
  }

  const amount = parseFloat(formData.amount);
  if (isNaN(amount) || amount <= 0) {
    alert("Invalid amount");
    return;
  }

  const payload = {
    amount: Math.round(amount * 100),
    description: sanitizeInput(formData.description),
    returnUrl: sanitizeInput(formData.returnUrl ?? ""),
    orderNumber: formData.orderNumber,
    clientId: sanitizeInput(formData.clientId ?? ""),
    email: sanitizeInput(formData.email),
    fullName: sanitizeInput(formData.fullName),
    dob: sanitizeInput(formData.dob),
    shirtSize: sanitizeInput(formData.shirtSize),
    clubName: sanitizeInput(formData.clubName),
    country: sanitizeInput(formData.country),
    dynamicCallbackUrl: sanitizeInput(formData.dynamicCallbackUrl ?? ""),
  };

  try {
    const result = await fetch("https://belize-confe-backend.onrender.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await result.json();

    console.log("Payment Response:", data.bankResponse);

    // Check if the bank returned a formURL
    if (data.bankResponse?.formUrl) {
      // Redirect to the payment form
      window.location.href = data.bankResponse.formUrl;
    } else {
      alert("Payment request sent, but no redirect URL received.");
    }
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Error occurred while sending payment request.");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--bg)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white border rounded-2xl shadow-md p-6"
        style={{
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
          boxShadow: palette.cardShadow,
        }}
      >
        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ color: palette.middayDark }}
        >
          Rotaract Bi-District Conference 2026
        </h1>

        {/* Prefilled Info */}
        <div className="mb-4 text-[var(--text)]">
          <p>
            <strong>Description:</strong> {formData.description}
          </p>
          <p>
            <strong>Amount:</strong> ${formData.amount}
          </p>
        </div>

        {/* Fields */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: palette.primary }}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: palette.primary }}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Shirt Size</label>
          <select
            name="shirtSize"
            value={formData.shirtSize}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: palette.primary }}
          >
            <option value="">Select size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Club Name</label>
          <input
            type="text"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: palette.primary }}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: palette.primary }}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: palette.primary }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-white transition"
          style={{
            backgroundColor: palette.midday,
          }}
        >
          Continue to Payment Info
        </button>
      </form>
    </div>
  );
}


