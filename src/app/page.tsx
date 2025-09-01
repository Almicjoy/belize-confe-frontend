"use client"; // 👈 This makes it a client component

import React from "react";
import { useRouter } from "next/navigation";

import MemberDirectory from "../components/MemberDirectory";


export default function Home() {
  return <MemberDirectory />;
}
