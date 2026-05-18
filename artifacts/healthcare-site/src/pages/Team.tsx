import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    id: 1,
    name: "Dr. Wanjiku Kamau",
    role: "Chief Medical Officer",
    qualifications: "MD, Board Certified",
    img: "/images/team-k1.png"
  },
  {
    id: 2,
    name: "Brian Ochieng",
    role: "Head of Nursing",
    qualifications: "RN, BSN",
    img: "/images/team-k2.png"
  },
  {
    id: 3,
    name: "Faith Muthoni",
    role: "Senior Physiotherapist",
    qualifications: "DPT",
    img: "/images/team-k3.png"
  },
  {
    id: 4,
    name: "Dr. Samuel Mutua",
    role: "Senior Geriatrician",
    qualifications: "MD, FACP",
    img: "/images/team-k4.png"
  },
  {
    id: 5,
    name: "Grace Akinyi",
    role: "Lead Maternity Nurse",
    qualifications: "RN, LCCE",
    img: "/images/team-k5.png"
  },
  {
    id: 6,
    name: "Daniel Kipchoge",
    role: "Critical Care Specialist",
    qualifications: "RN, CCRN",
    img: "/images/team-k6.png"
  }
];

export default function Team() {
  useEffect(() => {
    document.title = "Our Team | Catecos Nursing Hub";
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-white py-20 border-b border-slate-100 text-center">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Meet Our Experts</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our team consists of highly qualified, thoroughly vetted medical professionals dedicated to providing exceptional care with genuine compassion.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden group hover-elevate transition-all duration-300">
                  <div className="aspect-[4/5] relative overflow-hidden bg-slate-200">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-300">
                      <h3 className="text-2xl font-bold font-serif mb-1">{member.name}</h3>
                      <p className="text-secondary font-medium mb-1">{member.role}</p>
                      <p className="text-sm text-slate-300 mb-4">{member.qualifications}</p>

                      <div className="flex gap-3">
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors">
                          <Linkedin className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-6">Join Our Care Team</h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Are you a passionate healthcare professional looking to make a real difference in people's lives? We're always looking for dedicated nurses and caregivers.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-slate-100 rounded-full h-14 px-8 font-bold border-0">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
