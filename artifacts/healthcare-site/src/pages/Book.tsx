import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, MapPin, User, Phone, Mail, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Book a Nurse | Catecos Nursing Hub";
  }, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { fullName: "", phone: "", email: "", location: "", service: "", date: "", notes: "" },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/bookings"), {
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
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Could not send your booking. Please call us directly on 0758 867 235.");
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="font-serif">Need immediate help?</CardTitle>
                <CardDescription>Call us directly for urgent requirements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="tel:+254758867235">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 text-base shadow-lg">
                    <Phone className="w-5 h-5 mr-2" /> 0758 867 235
                  </Button>
                </a>
                <a href="tel:+254785466886">
                  <Button variant="outline" className="w-full rounded-full h-12 text-base">
                    <Phone className="w-5 h-5 mr-2" /> 0785 466 886
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
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Response within 30 minutes</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Form / Success */}
          <div className="lg:col-span-2">
            {submitted ? (
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <CardContent className="p-12 flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Booking Received!</h2>
                    <p className="text-slate-600 text-lg">
                      Thank you! Your booking has been sent to our team. We will call you back within <strong>30 minutes</strong> to confirm.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 w-full text-left">
                    <p className="text-sm text-slate-500 font-medium mb-1">Need faster help?</p>
                    <a href="tel:+254758867235" className="text-primary font-bold text-lg hover:underline">
                      Call 0758 867 235
                    </a>
                  </div>
                  <Button onClick={() => { setSubmitted(false); form.reset(); }} variant="outline" className="rounded-full px-8">
                    Make Another Booking
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Full Name</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} className="bg-slate-50 border-slate-200 h-12" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Phone Number</FormLabel>
                            <FormControl><Input placeholder="07XX XXX XXX" {...field} className="bg-slate-50 border-slate-200 h-12" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Email Address</FormLabel>
                            <FormControl><Input type="email" placeholder="you@example.com" {...field} className="bg-slate-50 border-slate-200 h-12" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="date" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Preferred Date</FormLabel>
                            <FormControl><Input type="date" {...field} className="bg-slate-50 border-slate-200 h-12" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="location" render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Full Address</FormLabel>
                            <FormControl><Input placeholder="e.g. House No. 5, Utawala, Nairobi" {...field} className="bg-slate-50 border-slate-200 h-12" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="service" render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Type of Service</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-50 border-slate-200 h-12">
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
                        )} />
                        <FormField control={form.control} name="notes" render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us about the patient's condition or specific requirements..." className="bg-slate-50 border-slate-200 min-h-[100px] resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>
                      )}

                      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-14 text-lg font-bold shadow-lg">
                        {isSubmitting ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending Booking…</>
                        ) : "Submit Booking"}
                      </Button>
                      <p className="text-center text-sm text-slate-500">
                        Your details go directly to our team. We will call you back within 30 minutes.
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
