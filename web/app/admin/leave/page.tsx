// "use client";

// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
import { useState } from "react";

export default function LeaveManagement() {
  //   const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Leave Management</h1>
      <p className="text-gray-600">
        Manage all leave requests in your organization
      </p>
      {/* <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> */}
      <LeaveManagement />
    </div>
  );
}
