"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { employeeAPI } from "@/app/api/api"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  emergencyContact: z.string().min(2, { message: "Emergency contact name must be at least 2 characters." }),
  emergencyPhone: z.string().min(10, { message: "Emergency contact phone must be at least 10 characters." }),
  bio: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function EmployeeProfile({ employee }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: employee?.name || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      address: employee?.address || "",
      emergencyContact: employee?.emergencyContact?.name || "",
      emergencyPhone: employee?.emergencyContact?.phone || "",
      bio: employee?.bio || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      // Format data for API
      const updatedEmployee = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        emergencyContact: {
          name: data.emergencyContact,
          phone: data.emergencyPhone,
        },
        bio: data.bio,
      }

      // Update employee
      await employeeAPI.updateEmployee(employee._id, updatedEmployee)

      setSuccess(true)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err.response?.data?.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Avatar className="w-20 h-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt={employee?.name} />
          <AvatarFallback>
            {employee?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{employee?.name}</h3>
          <p className="text-sm text-muted-foreground">{employee?.position}</p>
          <p className="text-sm text-muted-foreground">{employee?.department} Department</p>
          <p className="text-sm text-muted-foreground">
            Employee since {new Date(employee?.joinDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} disabled />
                  </FormControl>
                  <FormDescription>Email cannot be changed</FormDescription>
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us a little about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Brief description for your profile.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
