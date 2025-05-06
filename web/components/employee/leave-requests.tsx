"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { leaveAPI } from "@/app/api/api"

export function EmployeeLeaveRequests({ employee }) {
  const [open, setOpen] = useState(false)
  const [leaveType, setLeaveType] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (employee?._id) {
        try {
          setLoading(true)
          const data = await leaveAPI.getEmployeeLeaves(employee._id)
          setLeaveRequests(data)
        } catch (err) {
          console.error("Error fetching leave requests:", err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchLeaveRequests()
  }, [employee])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (!leaveType || !startDate || !endDate || !reason) {
        setError("Please fill in all fields")
        return
      }

      // Format data for API
      const leaveData = {
        type: leaveType === "annual" ? "Annual Leave" : leaveType === "sick" ? "Sick Leave" : "Personal Leave",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reason,
      }

      // Submit leave request
      await leaveAPI.createLeave(leaveData)

      // Reset form and close dialog
      setLeaveType("")
      setStartDate(undefined)
      setEndDate(undefined)
      setReason("")
      setOpen(false)
      setSuccess(true)

      // Refresh leave requests
      const data = await leaveAPI.getEmployeeLeaves(employee._id)
      setLeaveRequests(data)
    } catch (err) {
      console.error("Error submitting leave request:", err)
      setError(err.response?.data?.message || "Failed to submit leave request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">Leave request submitted successfully!</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Your Leave Balances</h3>
          <div className="flex gap-4">
            <div>
              <span className="text-sm font-medium">Annual Leave:</span>{" "}
              <span className="text-sm">{employee?.leaveBalance?.annual || 0} days remaining</span>
            </div>
            <div>
              <span className="text-sm font-medium">Sick Leave:</span>{" "}
              <span className="text-sm">{employee?.leaveBalance?.sick || 0} days remaining</span>
            </div>
            <div>
              <span className="text-sm font-medium">Personal Leave:</span>{" "}
              <span className="text-sm">{employee?.leaveBalance?.personal || 0} days remaining</span>
            </div>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Leave</DialogTitle>
              <DialogDescription>Fill out the form below to submit a leave request.</DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="leave-type">Leave Type</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe the reason for your leave request"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(request.startDate).toLocaleDateString()}</div>
                        <div>to</div>
                        <div>{new Date(request.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>{request.reason}</TableCell>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
