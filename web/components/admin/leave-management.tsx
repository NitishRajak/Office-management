"use client";

import { useEffect, useState } from "react";
import { Check, X, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leaveAPI } from "@/app/api/api";
import { toast } from "@/components/ui/use-toast";

type LeaveRequest = {
  _id: string;
  employee: {
    name: string;
    department: string;
  };
  startDate: string;
  endDate: string;
  status: string;
};

// Sample leave balances
const leaveBalances = [
  {
    employeeId: "EMP001",
    employeeName: "Sarah Johnson",
    department: "Engineering",
    annualLeave: { total: 20, used: 6, remaining: 14 },
    sickLeave: { total: 10, used: 2, remaining: 8 },
    personalLeave: { total: 5, used: 0, remaining: 5 },
  },
  {
    employeeId: "EMP002",
    employeeName: "Michael Chen",
    department: "Marketing",
    annualLeave: { total: 20, used: 8, remaining: 12 },
    sickLeave: { total: 10, used: 3, remaining: 7 },
    personalLeave: { total: 5, used: 1, remaining: 4 },
  },
  {
    employeeId: "EMP003",
    employeeName: "Emma Davis",
    department: "HR",
    annualLeave: { total: 20, used: 0, remaining: 20 },
    sickLeave: { total: 10, used: 0, remaining: 10 },
    personalLeave: { total: 5, used: 0, remaining: 5 },
  },
  {
    employeeId: "EMP004",
    employeeName: "Robert Wilson",
    department: "Finance",
    annualLeave: { total: 20, used: 5, remaining: 15 },
    sickLeave: { total: 10, used: 8, remaining: 2 },
    personalLeave: { total: 5, used: 2, remaining: 3 },
  },
];

export function LeaveManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllLeave = async () => {
    try {
      setIsLoading(true);
      const response = await leaveAPI.getAllLeaves();
      setLeaves(response);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch leave requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllLeave();
  }, []);

  const handleApproveReject = async (id: string, status: string) => {
    try {
      setIsLoading(true);
      await leaveAPI.updateLeaveStatus(id, status);

      // Update local state to reflect the change
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === id ? { ...leave, status } : leave
        )
      );

      toast({
        title: "Success",
        description: `Leave request ${status.toLowerCase()} successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast({
        title: "Error",
        description: `Failed to ${status.toLowerCase()} leave request`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter leaves based on search term and status filter
  const filteredLeaves = leaves.filter((request) => {
    const matchesSearch = request.employee?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      request.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <Tabs defaultValue="requests" className="space-y-4">
      <TabsList>
        <TabsTrigger value="requests">Leave Requests</TabsTrigger>
        <TabsTrigger value="balances">Leave Balances</TabsTrigger>
      </TabsList>

      <TabsContent value="requests">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading leave requests...
                    </TableCell>
                  </TableRow>
                ) : filteredLeaves.length > 0 ? (
                  filteredLeaves.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {request?.employee?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request?.employee?.department}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {new Date(request?.startDate).toLocaleDateString()}
                          </div>
                          <div>to</div>
                          <div>
                            {new Date(request.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "Approved"
                              ? "success"
                              : request.status === "Rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === "Pending" && (
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleApproveReject(
                                        request._id,
                                        "Approved"
                                      )
                                    }
                                    disabled={isLoading}
                                  >
                                    <Check className="h-4 w-4 text-green-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Approve</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleApproveReject(
                                        request._id,
                                        "Rejected"
                                      )
                                    }
                                    disabled={isLoading}
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Reject</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No leave requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="balances">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Annual Leave</TableHead>
                {/* <TableHead>Sick Leave</TableHead> */}
                <TableHead>Personal Leave</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveBalances.map((balance) => (
                <TableRow key={balance.employeeId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{balance.employeeName}</div>
                      <div className="text-sm text-muted-foreground">
                        {balance.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">
                          {balance.annualLeave.remaining}
                        </span>{" "}
                        / {balance.annualLeave.total} days remaining
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${
                              (balance.annualLeave.used /
                                balance.annualLeave.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">
                          {balance.sickLeave.remaining}
                        </span>{" "}
                        / {balance.sickLeave.total} days remaining
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${
                              (balance.sickLeave.used /
                                balance.sickLeave.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">
                          {balance.personalLeave.remaining}
                        </span>{" "}
                        / {balance.personalLeave.total} days remaining
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${
                              (balance.personalLeave.used /
                                balance.personalLeave.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
