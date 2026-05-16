import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, MapPin, User, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  location: z.string().min(5, "Full address is required"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Book() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Book a Nurse | Catecos Nursing Hub";
  }, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      location: "",
      service: "",
      date: "",
      notes: "",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          location: data.location,
          service: data.service,
          preferredDate: data.date,
          notes: data.notes || null,
        }),
      });
    } catch {
      // silently continue — WhatsApp booking still works even if API is down
    }

    const message = `Hello Catecos Nursing Hub! I would like to book a service:
Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.location}
Service: ${data.service}
Preferred Date: ${data.date}
Notes: ${data.notes || "None"}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/254758867235?text=${encodedMessage}`, "_blank");

    toast({
      title: "Booking Request Initiated",
      description: "Opening WhatsApp to complete your booking.",
    });

    form.reset();
  };

  return (
    <div className="w-full bg-slate-50 py-16 md:py-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Book a Nurse</h1>
          <p className="text-lg text-slate-600">
            Fill out the form below and our care coordinator will contact you within 30 minutes to confirm your booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="font-serif">Need immediate help?</CardTitle>
                <CardDescription>Call us directly for urgent requirements.</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="tel:+254758867235">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 text-base shadow-lg">
                    <Phone className="w-5 h-5 mr-2" /> Call Now
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-secondary text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                  <h3 className="font-bold text-xl">Why choose us?</h3>
                </div>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Verified & experienced nurses</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> 24/7 Availability</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Transparent pricing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Personalized care plans</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-slate-50 border-slate-200 focus-visible:ring-primary h-12" />
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
                            <FormLabel className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (234) 567-8900" {...field} className="bg-slate-50 border-slate-200 focus-visible:ring-primary h-12" />
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
                            <FormLabel className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} className="bg-slate-50 border-slate-200 focus-visible:ring-primary h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Preferred Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} className="bg-slate-50 border-slate-200 focus-visible:ring-primary h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Full Address</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. House No. 5, Utawala, Nairobi" {...field} className="bg-slate-50 border-slate-200 focus-visible:ring-primary h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Type of Service</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-50 border-slate-200 focus-visible:ring-primary h-12">
                                  <SelectValue placeholder="Select a service..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Home Nursing Care">Home Nursing Care</SelectItem>
                                <SelectItem value="Elderly Care">Elderly Care</SelectItem>
                                <SelectItem value="Post-Surgery Care">Post-Surgery Care</SelectItem>
                                <SelectItem value="Maternity Care">Maternity Care</SelectItem>
                                <SelectItem value="Physiotherapy">Physiotherapy Support</SelectItem>
                                <SelectItem value="Medical Checkups">Medical Checkups</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us more about the patient's condition or any specific requirements..." 
                                className="bg-slate-50 border-slate-200 focus-visible:ring-primary min-h-[120px] resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full h-14 text-lg font-bold shadow-lg mt-8">
                      Book via WhatsApp
                    </Button>
                    <p className="text-center text-sm text-slate-500 mt-4">
                      By submitting, you agree to our terms of service and privacy policy.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
