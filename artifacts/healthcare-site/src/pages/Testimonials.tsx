import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "Amina Waweru",
    role: "Daughter of Patient",
    rating: 5,
    img: "/images/review-1.png",
    text: "The nurses from Catecos Nursing Hub were an absolute godsend during my father's recovery from hip surgery. Professional, incredibly kind, and always on time. They made a stressful situation so much easier for our whole family.",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "John Mwangi",
    role: "Patient",
    rating: 5,
    img: "/images/review-2.png",
    text: "After my heart attack, I needed daily monitoring. The team at Catecos Nursing Hub didn't just check my vitals; they genuinely cared about my mental well-being too. I felt like I was in a private hospital.",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Mercy Njeri",
    role: "New Mother",
    rating: 5,
    img: "/images/review-3.png",
    text: "Having a maternity nurse for the first two weeks was the best decision we made. She helped with feeding, sleep schedules, and gave me the confidence I needed as a first-time mom.",
    date: "2 months ago"
  },
  {
    id: 4,
    name: "Peter Otieno",
    role: "Son of Patient",
    rating: 4,
    img: "/images/review-4.png",
    text: "Excellent elderly care services. My mother has dementia and can be difficult, but her caregiver handles everything with such grace and patience. Highly recommend their services.",
    date: "3 months ago"
  },
  {
    id: 5,
    name: "Rose Achieng",
    role: "Patient",
    rating: 5,
    img: "/images/review-5.png",
    text: "The physiotherapy at home was fantastic. My therapist brought all the necessary equipment and tailored the exercises perfectly. I recovered my mobility much faster than expected.",
    date: "4 months ago"
  },
  {
    id: 6,
    name: "James Kariuki",
    role: "Husband of Patient",
    rating: 5,
    img: "/images/review-6.png",
    text: "When my wife needed 24/7 care, Catecos Nursing Hub stepped in immediately. The seamless handover between nurses and their constant communication with our doctor gave us total peace of mind.",
    date: "5 months ago"
  }
];

export default function Testimonials() {
  useEffect(() => {
    document.title = "Reviews | Catecos Nursing Hub";
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Patient Stories</h1>
          <p className="text-lg text-slate-600">
            Don't just take our word for it. Read what our patients and their families have to say about their experience with Catecos Nursing Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover-elevate transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex text-[#FFB800] mb-6">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${index < review.rating ? "fill-current" : "fill-transparent"}`}
                      />
                    ))}
                  </div>
                  <Quote className="w-10 h-10 text-primary/10 mb-4" />
                  <p className="text-slate-700 leading-relaxed italic flex-grow mb-6">
                    "{review.text}"
                  </p>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.img}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{review.name}</p>
                        <p className="text-sm text-slate-500">{review.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{review.date}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Ready to experience our care?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied families who have trusted Catecos Nursing Hub with their loved ones' health and well-being.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-14 text-lg shadow-md hover-elevate">
              Book a Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
