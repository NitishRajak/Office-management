"use client";

import { useState } from "react";
import {
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmployeeDetails({ employee }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });

  const handleSave = () => {
    // In a real app, you would save the changes to your backend
    console.log("Saving employee changes:", editedEmployee);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEmployee({ ...employee });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={`/placeholder.svg?height=80&width=80`}
              alt={employee.name}
            />
            <AvatarFallback>
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{employee.name}</h2>
            <p className="text-muted-foreground">{employee.position}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="leave">Leave & Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Department
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employee.department}</div>
                <p className="text-xs text-muted-foreground">
                  {employee.position}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge
                    variant={
                      employee.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {employee.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Employee Status</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Join Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(
                    (new Date() - new Date(employee.joinDate)) /
                      (1000 * 60 * 60 * 24 * 30)
                  )}{" "}
                  months
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employee.salary}</div>
                <p className="text-xs text-muted-foreground">Annual</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{employee.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Skills & Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Current Projects
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {employee.projects.map((project, index) => (
                        <li key={index} className="text-sm">
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personal">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Edit employee's personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={editedEmployee.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editedEmployee.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={editedEmployee.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={editedEmployee.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={editedEmployee.emergencyContact}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={editedEmployee.emergencyPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Employee's personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </h4>
                      <p>{employee.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Email
                      </h4>
                      <p>{employee.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Phone
                      </h4>
                      <p>{employee.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Address
                      </h4>
                      <p>{employee.address}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Emergency Contact
                      </h4>
                      <p>{employee.emergencyContact}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Emergency Phone
                      </h4>
                      <p>{employee.emergencyPhone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="employment">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Employment Information</CardTitle>
                <CardDescription>
                  Edit employee's employment details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={editedEmployee.department}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={editedEmployee.position}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Input
                      id="manager"
                      name="manager"
                      value={editedEmployee.manager}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      name="salary"
                      value={editedEmployee.salary}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      name="joinDate"
                      type="date"
                      value={editedEmployee.joinDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      name="status"
                      value={editedEmployee.status}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Employment Information</CardTitle>
                <CardDescription>Employee's employment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Department
                      </h4>
                      <p>{employee.department}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Position
                      </h4>
                      <p>{employee.position}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Manager
                      </h4>
                      <p>{employee.manager}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Salary
                      </h4>
                      <p>{employee.salary}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Join Date
                      </h4>
                      <p>{new Date(employee.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Status
                      </h4>
                      <Badge
                        variant={
                          employee.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leave">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Leave Balances</CardTitle>
                <CardDescription>Employee's leave entitlements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Annual Leave</span>
                      <span className="text-sm font-medium">
                        {employee.leaveBalance.annual} / 20 days
                      </span>
                    </div>
                    <Progress
                      value={(employee.leaveBalance.annual / 20) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Sick Leave</span>
                      <span className="text-sm font-medium">
                        {employee.leaveBalance.sick} / 10 days
                      </span>
                    </div>
                    <Progress
                      value={(employee.leaveBalance.sick / 10) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Personal Leave
                      </span>
                      <span className="text-sm font-medium">
                        {employee.leaveBalance.personal} / 5 days
                      </span>
                    </div>
                    <Progress
                      value={(employee.leaveBalance.personal / 5) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
                <CardDescription>Employee's leave history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employee.id === "EMP001" ? (
                    <>
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Annual Leave</h4>
                            <p className="text-sm text-muted-foreground">
                              May 15 - May 20, 2023 (6 days)
                            </p>
                          </div>
                          <Badge>Pending</Badge>
                        </div>
                        <p className="text-sm mt-2">Reason: Family vacation</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Sick Leave</h4>
                            <p className="text-sm text-muted-foreground">
                              March 3 - March 4, 2023 (2 days)
                            </p>
                          </div>
                          <Badge variant="success">Approved</Badge>
                        </div>
                        <p className="text-sm mt-2">Reason: Flu</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent leave requests found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
