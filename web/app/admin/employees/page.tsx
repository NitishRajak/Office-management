import type { Metadata } from "next"
import { EmployeeManagement } from "@/components/admin/employee-management"

export const metadata: Metadata = {
  title: "Employee Management | Office Management System",
  description: "Manage all employees in your organization",
}

export default function EmployeesPage() {
  return <EmployeeManagement />
}
