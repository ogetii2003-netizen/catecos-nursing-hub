import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const servicesList = [
  { 
    id: "home-nursing",
    title: "Home Nursing Care", 
    desc: "Comprehensive medical care provided by registered nurses in the comfort of your home.",
    img: "/images/wound-care.jpg",
    benefits: ["Medication administration", "Wound care & dressing", "Vitals monitoring", "IV therapy"]
  },
  { 
    id: "elderly-care",
    title: "Elderly Care", 
    desc: "Compassionate daily assistance and companionship for seniors to ensure safe, independent living.",
    img: "/images/elderly-care.jpg",
    benefits: ["Assistance with daily living activities", "Fall prevention", "Meal preparation", "Companionship"]
  },
  { 
    id: "post-surgery",
    title: "Post-Surgery Care", 
    desc: "Specialized recovery support designed to prevent complications and speed up healing after hospital discharge.",
    img: "/images/checkup.jpg",
    benefits: ["Incision care", "Pain management", "Mobility assistance", "Doctor coordination"]
  },
  { 
    id: "maternity",
    title: "Maternity & Newborn Care", 
    desc: "Expert support for new mothers and babies during those crucial first weeks at home.",
    img: "/images/newborn.jpg",
    benefits: ["Lactation support", "Newborn vitals monitoring", "Mother's recovery care", "Sleep routine establishment"]
  },
  { 
    id: "physiotherapy",
    title: "Physiotherapy Support", 
    desc: "In-home rehabilitation exercises and mobility support by licensed physical therapists.",
    img: "/images/rehab.jpg",
    benefits: ["Post-injury rehab", "Stroke recovery", "Arthritis management", "Strength building"]
  },
  { 
    id: "24-7-care",
    title: "24/7 Continuous Care", 
    desc: "Around-the-clock monitoring and support for patients requiring constant medical supervision.",
    img: "/images/caregiver.jpg",
    benefits: ["Shift-based nursing", "Overnight monitoring", "Emergency response readiness", "Continuous comfort care"]
  }
];

export default function Services() {
  useEffect(() => {
    document.title = "Our Services | Catecos Nursing Hub";
  }, []);

  return (
    <div className="w-full bg-slate-50">
      {/* Header */}
      <section className="bg-primary py-20 text-white text-center">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Services</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Professional, compassionate healthcare delivered directly to your door. We tailor our services to meet the unique needs of every patient.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg overflow-hidden flex flex-col hover-elevate transition-all duration-300">
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                      {service.desc}
                    </p>
                    <ul className="space-y-2 mb-8">
                      {service.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/book?service=${encodeURIComponent(service.title)}`}>
                      <Button className="w-full bg-slate-900 hover:bg-primary text-white rounded-full">
                        Book this Service <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-slate-100 text-center">
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Not sure which service you need?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Contact our care coordinators for a free consultation. We'll help you determine the best care plan for your specific situation.
          </p>
          <div className="flex justify-center gap-4">
            <a href="tel:+254758867235">
              <Button size="lg" className="bg-primary text-white rounded-full h-14 px-8">
                Call 0758 867 235
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8">
                Send a Message
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
