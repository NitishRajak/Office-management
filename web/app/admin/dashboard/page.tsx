import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Office Management System",
  description: "Admin dashboard for the office management system",
}

export default function AdminDashboardPage() {
  return <AdminDashboard />
}
