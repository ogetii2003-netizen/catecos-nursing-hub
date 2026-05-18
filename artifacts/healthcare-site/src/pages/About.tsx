import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { HeartPulse, CheckCircle2, Users, Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  useEffect(() => {
    document.title = "About Us | Catecos Nursing Hub";
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <HeartPulse className="w-12 h-12 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
              Dedicated to Your Care and Comfort
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Catecos Nursing Hub was founded on a simple principle: everyone deserves access to compassionate, high-quality healthcare in the comfort of their own home.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-serif font-bold text-slate-900">Our Story</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                What started as a small team of dedicated nurses has grown into one of the region's most trusted home healthcare providers. We realized early on that hospitals, while necessary, aren't always the best environment for recovery and long-term care.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                For over a decade, we've brought the hospital to the home. By carefully selecting only the most qualified, empathetic professionals, we ensure that every patient receives care that goes beyond just medical treatment—we provide peace of mind.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Licensed, experienced, and background-checked staff",
                  "Personalized care plans tailored to individual needs",
                  "24/7 support and emergency availability",
                  "Seamless coordination with primary physicians"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="/images/about.png" 
                alt="Healthcare professional with patient" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px] hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl text-slate-900">10+</h4>
                    <p className="text-sm text-slate-500 font-medium">Years Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-white py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Users className="w-8 h-8" />, value: "5,000+", label: "Happy Patients" },
              { icon: <ShieldCheck className="w-8 h-8" />, value: "250+", label: "Certified Nurses" },
              { icon: <CheckCircle2 className="w-8 h-8" />, value: "100%", label: "Satisfaction Rate" },
              { icon: <HeartPulse className="w-8 h-8" />, value: "24/7", label: "Care Support" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold font-serif">{stat.value}</h3>
                <p className="text-primary-foreground/80 font-medium text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <HeartPulse className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To provide exceptional, compassionate, and personalized home healthcare services that enhance the quality of life for our patients, promoting independence and dignity in the comfort of their own homes.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To be the community's leading and most trusted partner in home healthcare, setting the standard for clinical excellence and deeply empathetic, human-centric patient care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Brochure / In Action */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Care You Can See and Feel</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Every nurse at Catecos Nursing Hub is selected not just for clinical excellence, but for genuine compassion. We believe that healing happens not only through medicine, but through human connection.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                From Nairobi to communities across Kenya, our teams arrive ready — equipped, trained, and deeply committed to making every patient feel seen, safe, and cared for.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="/images/african-nurse.png" alt="Catecos nurse with patient" className="w-full h-64 object-cover rounded-2xl shadow-lg" />
              <img src="/images/happy-family.png" alt="Happy family with caregiver" className="w-full h-64 object-cover rounded-2xl shadow-lg mt-8" />
              <img src="/images/consultation.png" alt="Healthcare consultation" className="w-full h-64 object-cover rounded-2xl shadow-lg -mt-4" />
              <img src="/images/caregiver.png" alt="Caregiver support" className="w-full h-64 object-cover rounded-2xl shadow-lg mt-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
