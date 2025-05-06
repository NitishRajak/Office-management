import type { Metadata } from "next"
import { EmployeeDashboard } from "@/components/employee/dashboard"

export const metadata: Metadata = {
  title: "Employee Dashboard | Office Management System",
  description: "Employee dashboard for the office management system",
}

export default function EmployeeDashboardPage() {
  return <EmployeeDashboard />
}
