"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Building,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/auth-context"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leave Requests",
    href: "/employee/leave",
    icon: Calendar,
  },
  {
    title: "Attendance",
    href: "/employee/attendance",
    icon: Clock,
  },
  {
    title: "Documents",
    href: "/employee/documents",
    icon: FileText,
  },
  {
    title: "Announcements",
    href: "/employee/announcements",
    icon: MessageSquare,
  },
  {
    title: "My Profile",
    href: "/employee/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/employee/settings",
    icon: Settings,
  },
]

export function EmployeeSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/employee/dashboard" className="flex items-center gap-2 font-semibold">
            <Building className="h-6 w-6" />
            <span>Office Manager</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive ? "bg-muted text-primary" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
