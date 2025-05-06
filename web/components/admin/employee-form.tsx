"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { employeeAPI } from "@/app/api/api";

const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  department: z.string({ required_error: "Please select a department." }),
  position: z
    .string()
    .min(2, { message: "Position must be at least 2 characters." }),
  salary: z.string().min(1, { message: "Please enter a salary." }),
  joinDate: z.string().min(1, { message: "Please select a join date." }),
  manager: z
    .string()
    .min(2, { message: "Manager name must be at least 2 characters." }),
  emergencyContactName: z.string().min(2, {
    message: "Emergency contact name must be at least 2 characters.",
  }),
  emergencyContactPhone: z
    .string()
    .min(10, { message: "Emergency phone must be at least 10 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function EmployeeForm({ onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      department: "",
      position: "",
      salary: "",
      joinDate: new Date().toISOString().split("T")[0],
      manager: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      const employeeData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        department: values.department,
        position: values.position,
        joinDate: values.joinDate,
        salary: values.salary,
        manager: values.manager,
        emergencyContact: {
          name: values.emergencyContactName,
          phone: values.emergencyContactPhone,
        },
        password: values.password,
      };

      await employeeAPI.createEmployee(employeeData);

      onComplete();
    } catch (err) {
      console.error("Error creating employee:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create employee. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="text-lg font-medium">Personal Information</h3>
          <p className="text-sm text-muted-foreground">
            Enter the employee's personal details.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Nitish Rajak" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="nitish@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="555-123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="subidhanagar, Tinkune" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Nitish Rajak" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyContactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="555-987-6543" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium">Employment Information</h3>
          <p className="text-sm text-muted-foreground">
            Enter the employee's employment details.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Engineering">Developer</SelectItem>
                    <SelectItem value="Marketing">UI/UX</SelectItem>
                    <SelectItem value="Finance">QA</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    {/* <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem> */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="FrontEnd Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input placeholder="$75,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Join Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium">Account Information</h3>
          <p className="text-sm text-muted-foreground">
            Create login credentials for the employee.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Add Employee"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
