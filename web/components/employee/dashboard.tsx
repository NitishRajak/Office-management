"use client"

import { useState } from "react"
import { Calendar, Clock, FileText, Bell, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeSidebar } from "@/components/employee/sidebar"
import { EmployeeLeaveRequests } from "@/components/employee/leave-requests"
import { EmployeeProfile } from "@/components/employee/profile"
import { useAuth } from "@/app/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <EmployeeSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const employee = user?.employee

  return (
    <div className="flex min-h-screen bg-muted/40">
      <EmployeeSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {employee?.name || "Employee"}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employee?.leaveBalance?.annual || 0} days</div>
                  <p className="text-xs text-muted-foreground">Remaining out of 20 days</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${((20 - (employee?.leaveBalance?.annual || 0)) / 20) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employee?.leaveBalance?.sick || 0} days</div>
                  <p className="text-xs text-muted-foreground">Remaining out of 10 days</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${((10 - (employee?.leaveBalance?.sick || 0)) / 10) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">96.5%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Team Meeting", date: "May 15, 2023", time: "10:00 AM - 11:00 AM" },
                      { title: "Project Deadline", date: "May 20, 2023", time: "End of day" },
                      { title: "Company Townhall", date: "May 25, 2023", time: "3:00 PM - 4:00 PM" },
                    ].map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="rounded-full p-2 bg-primary/10 text-primary">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <p className="text-sm text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Office Closure",
                        content: "The office will be closed on May 29 for Memorial Day.",
                        date: "2 days ago",
                      },
                      {
                        title: "New Health Benefits",
                        content: "Check your email for information about our updated health benefits package.",
                        date: "1 week ago",
                      },
                    ].map((announcement, index) => (
                      <div key={index} className="space-y-1">
                        <h4 className="text-sm font-medium">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground">{announcement.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leave">
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Manage your leave requests and balances</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeLeaveRequests employee={employee} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>View and update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeProfile employee={employee} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
