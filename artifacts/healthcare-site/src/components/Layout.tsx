import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, HeartPulse, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/team", label: "Our Team" },
    { href: "/testimonials", label: "Reviews" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground">
      {/* Top Bar */}
      <div className="hidden md:flex bg-primary text-primary-foreground py-2 px-6 justify-between items-center text-sm font-medium">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>0758 867 235</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>njerimuringo@gmail.com</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Facebook className="w-4 h-4 hover:text-secondary cursor-pointer transition-colors" />
          <Twitter className="w-4 h-4 hover:text-secondary cursor-pointer transition-colors" />
          <Instagram className="w-4 h-4 hover:text-secondary cursor-pointer transition-colors" />
          <Linkedin className="w-4 h-4 hover:text-secondary cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-3" : "bg-white/95 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary group">
            <HeartPulse className="w-8 h-8 group-hover:text-secondary transition-colors" />
            <span className="font-serif font-bold text-2xl tracking-tight">Catecos Nursing Hub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-sm transition-colors hover:text-primary ${
                  location === link.href ? "text-primary border-b-2 border-primary" : "text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book" className="ml-4">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-md hover-elevate">
                Book a Nurse
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-slate-700 hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 flex flex-col py-4 px-6 gap-4 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-lg py-2 border-b border-slate-50 ${
                  location === link.href ? "text-primary" : "text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book" className="mt-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                Book a Nurse
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 text-white mb-6">
                <HeartPulse className="w-8 h-8 text-secondary" />
                <span className="font-serif font-bold text-2xl">Catecos Nursing Hub</span>
              </div>
              <p className="mb-6 leading-relaxed">
                Premium home nursing agency delivering compassionate, qualified care directly to your doorstep. Your health, our priority.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-serif font-bold text-lg mb-6">Quick Links</h3>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-secondary transition-colors flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-serif font-bold text-lg mb-6">Our Services</h3>
              <ul className="flex flex-col gap-3">
                <li><Link href="/services" className="hover:text-secondary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Home Nursing Care</Link></li>
                <li><Link href="/services" className="hover:text-secondary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Elderly Care</Link></li>
                <li><Link href="/services" className="hover:text-secondary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Post-Surgery Care</Link></li>
                <li><Link href="/services" className="hover:text-secondary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Maternity Care</Link></li>
                <li><Link href="/services" className="hover:text-secondary transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Physiotherapy Support</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-serif font-bold text-lg mb-6">Contact Info</h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>Pema Community Hospital,<br />Utawala</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary shrink-0" />
                  <span>0758 867 235 / 0785 466 886</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-secondary shrink-0" />
                  <span>njerimuringo@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} Catecos Nursing Hub. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
