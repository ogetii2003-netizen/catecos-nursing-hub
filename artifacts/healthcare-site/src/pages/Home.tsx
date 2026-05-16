import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PhoneCall, Clock, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  useEffect(() => {
    document.title = "Catecos Nursing Hub | Premium Home Nursing Services";
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.jpg" 
            alt="Nurse helping elderly patient" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/30 text-secondary font-semibold text-sm mb-6 backdrop-blur-sm">
              Trusted Home Healthcare
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Professional nursing care, <span className="text-secondary">comfort</span> of home.
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed max-w-xl">
              We bring hospital-quality care directly to your doorstep. Compassionate, qualified nurses available 24/7 for you and your loved ones.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/book">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg">
                  Book a Nurse
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full px-8 h-14 text-lg backdrop-blur-sm">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Row */}
      <section className="bg-white py-12 relative z-20 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">24/7 Care Available</h3>
              <p className="text-slate-500 text-sm">Round-the-clock support when you need it.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Qualified Nurses</h3>
              <p className="text-slate-500 text-sm">Certified, experienced, and background-checked.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <HeartPulse className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Affordable Services</h3>
              <p className="text-slate-500 text-sm">Premium care plans tailored to your budget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600">Comprehensive home healthcare solutions designed to support recovery, manage conditions, and improve quality of life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Elderly Care", desc: "Compassionate daily assistance, medication management, and companionship for seniors.", img: "/images/elderly-care.jpg" },
              { title: "Post-Surgery Care", desc: "Specialized recovery support, wound care, and vital monitoring after hospital discharge.", img: "/images/checkup.jpg" },
              { title: "Physiotherapy", desc: "In-home rehabilitation exercises and mobility support by licensed therapists.", img: "/images/rehab.jpg" },
            ].map((service, i) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover-elevate transition-all duration-300 group">
                  <div className="h-48 overflow-hidden">
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">{service.desc}</p>
                    <Link href="/services" className="text-primary font-semibold flex items-center gap-2 hover:text-secondary transition-colors">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white px-8">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="bg-primary text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="max-w-xl">
              <h2 className="text-3xl font-serif font-bold mb-4">Need urgent home care?</h2>
              <p className="text-primary-foreground/80 text-lg">
                Our care coordinators are available 24/7 to arrange emergency nursing support for your loved ones.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-4">
              <a href="tel:+254758867235">
                <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-full h-14 px-8 font-bold w-full sm:w-auto shadow-xl">
                  <PhoneCall className="w-5 h-5 mr-2" />
                  0758 867 235
                </Button>
              </a>
              <a href="tel:+254785466886">
                <Button size="lg" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full h-14 px-8 font-bold w-full sm:w-auto shadow-xl backdrop-blur-sm">
                  <PhoneCall className="w-5 h-5 mr-2" />
                  0785 466 886
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
