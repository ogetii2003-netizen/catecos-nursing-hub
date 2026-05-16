import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const articles = [
  {
    id: 1,
    title: "10 Tips for Fall Prevention in Seniors at Home",
    excerpt: "Falls are the leading cause of injury among seniors. Learn how to fall-proof your home with these simple, effective modifications.",
    category: "Elderly Care",
    date: "Oct 15, 2023",
    author: "Dr. Robert Foster",
    img: "/images/fall-prevention.jpg"
  },
  {
    id: 2,
    title: "Understanding Post-Surgery Recovery Timelines",
    excerpt: "What to expect in the weeks following major surgery and how professional home care can significantly speed up the healing process.",
    category: "Recovery",
    date: "Oct 02, 2023",
    author: "Michael Chang, RN",
    img: "/images/wound-care.jpg"
  },
  {
    id: 3,
    title: "The Benefits of In-Home Physiotherapy",
    excerpt: "Why doing your rehab exercises in the environment where you live can lead to better, more sustainable mobility outcomes.",
    category: "Therapy",
    date: "Sep 28, 2023",
    author: "Emily Roberts, DPT",
    img: "/images/rehab.jpg"
  },
  {
    id: 4,
    title: "Navigating the First Weeks with a Newborn",
    excerpt: "Essential tips for new parents to manage sleep deprivation, feeding schedules, and postpartum recovery.",
    category: "Maternity",
    date: "Sep 15, 2023",
    author: "Jessica Lopez, RN",
    img: "/images/newborn.jpg"
  },
  {
    id: 5,
    title: "Signs Your Loved One Might Need Home Care",
    excerpt: "It's not always obvious when an aging parent needs help. Here are the subtle signs to watch out for.",
    category: "Elderly Care",
    date: "Sep 05, 2023",
    author: "Dr. Sarah Jenkins",
    img: "/images/elderly-couple.jpg"
  },
  {
    id: 6,
    title: "Managing Chronic Conditions at Home",
    excerpt: "How continuous monitoring and lifestyle adjustments can help patients with diabetes or heart disease thrive.",
    category: "Health Management",
    date: "Aug 22, 2023",
    author: "David Smith, RN",
    img: "/images/chronic.jpg"
  }
];

const categories = ["All", "Elderly Care", "Recovery", "Therapy", "Maternity", "Health Management"];

export default function Blog() {
  useEffect(() => {
    document.title = "Health Blog | Catecos Nursing Hub";
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen py-16 md:py-24">
      <div className="container px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Health & Wellness Insights</h1>
            <p className="text-lg text-slate-600">
              Expert advice, care tips, and medical insights from our team of healthcare professionals.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search articles..." className="pl-10 bg-white border-slate-200 rounded-full h-12" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 0 ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-0 shadow-md overflow-hidden hover-elevate transition-all duration-300 flex flex-col group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={article.img} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
                      <Tag className="w-3 h-3" /> {article.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 mb-6 text-sm line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {article.date}
                    </div>
                  </div>

                  <Link href={`/blog/${article.id}`}>
                    <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" className="rounded-full px-8 h-12 text-slate-600 border-slate-300 hover:bg-slate-100">
            Load More Articles
          </Button>
        </div>

      </div>
    </div>
  );
}
