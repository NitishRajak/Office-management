"use client";

import { useState } from "react";
import { Search, Plus, Filter, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSidebar } from "@/components/admin/sidebar";
import { EmployeeTable } from "@/components/admin/employee-table";
import { EmployeeDetails } from "@/components/admin/employee-details";
import { EmployeeForm } from "@/components/admin/employee-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState("all-employees");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setActiveTab("employee-details");
  };

  const handleAddEmployee = () => {
    setIsAddingEmployee(true);
    setActiveTab("add-employee");
  };

  const handleBackToList = () => {
    setSelectedEmployee(null);
    setIsAddingEmployee(false);
    setActiveTab("all-employees");
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Employee Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all employees in your organization
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}
            <Button size="sm" onClick={handleAddEmployee}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-employees">All Employees</TabsTrigger>
            <TabsTrigger value="employee-details" disabled={!selectedEmployee}>
              Employee Details
            </TabsTrigger>
            <TabsTrigger value="add-employee" disabled={!isAddingEmployee}>
              Add Employee
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-employees" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>
                  Manage your organization's employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={departmentFilter}
                      onValueChange={setDepartmentFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Developer</SelectItem>
                        <SelectItem value="marketing">QA</SelectItem>
                        <SelectItem value="hr">UI/UX</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </div>
                </div>
                <EmployeeTable
                  onViewEmployee={handleViewEmployee}
                  searchTerm={searchTerm}
                  departmentFilter={departmentFilter}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employee-details">
            {selectedEmployee && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Employee Details</CardTitle>
                      <CardDescription>
                        View and edit employee information
                      </CardDescription>
                    </div>
                    <Button variant="ghost" onClick={handleBackToList}>
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent></CardContent>
                <EmployeeDetails employee={selectedEmployee} />
              </Card>
            )}
          </TabsContent>

          <TabsContent value="add-employee">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Add New Employee</CardTitle>
                    <CardDescription>
                      Enter details for the new employee
                    </CardDescription>
                  </div>
                  <Button variant="ghost" onClick={handleBackToList}>
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <EmployeeForm onComplete={handleBackToList} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
