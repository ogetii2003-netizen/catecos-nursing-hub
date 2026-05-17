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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/254758867235?text=Hello%20Catecos%20Nursing%20Hub!%20I%20would%20like%20to%20book%20a%20nurse."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-xl hover:bg-[#1ebe5d] transition-all hover:scale-105 font-semibold text-sm"
        aria-label="Book via WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.116 1.523 5.851L.057 23.716a.5.5 0 0 0 .606.634l5.99-1.43A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.846 0-3.576-.49-5.066-1.344l-.362-.213-3.757.896.94-3.648-.237-.377A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Book via WhatsApp
      </a>

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
