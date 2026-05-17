import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import {
  LayoutDashboard, CalendarCheck, Settings, Users, Star, Briefcase,
  LogOut, Search, Download, Trash2, Phone, MessageSquare, ChevronDown,
  ChevronUp, Edit3, Save, X, Plus, Eye, EyeOff, RefreshCw, CheckCircle2,
  Clock, XCircle, PhoneCall, ShieldCheck, BarChart2, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Booking {
  id: number; fullName: string; phone: string; email: string;
  location: string; service: string; preferredDate: string;
  notes: string | null; status: "pending"|"contacted"|"confirmed"|"completed"|"cancelled";
  createdAt: string; updatedAt: string;
}
interface Stats { total:number; pending:number; contacted:number; confirmed:number; completed:number; cancelled:number; services:{service:string;count:number}[]; }
interface ServiceItem { id: string; title: string; description: string; icon: string; }
interface TeamMember { id: string; name: string; role: string; bio: string; image: string; }
interface Testimonial { id: string; name: string; text: string; rating: number; visible: boolean; }

type Section = "dashboard"|"bookings"|"settings"|"services"|"team"|"testimonials";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  pending:"bg-yellow-100 text-yellow-800", contacted:"bg-blue-100 text-blue-800",
  confirmed:"bg-green-100 text-green-800", completed:"bg-slate-100 text-slate-700",
  cancelled:"bg-red-100 text-red-800",
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending:<Clock className="w-3 h-3"/>, contacted:<PhoneCall className="w-3 h-3"/>,
  confirmed:<CheckCircle2 className="w-3 h-3"/>, completed:<ShieldCheck className="w-3 h-3"/>,
  cancelled:<XCircle className="w-3 h-3"/>,
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const token = localStorage.getItem("catecos_admin_token") ?? "";

  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats|null>(null);
  const [settings, setSettings] = useState<Record<string,string>>({});
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number|null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number|null>(null);
  const [noteText, setNoteText] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<string|null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string|null>(null);
  const [savingSettings, setSavingSettings] = useState<Record<string,boolean>>({});

  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  // ── Verify token ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { setLocation("/admin"); return; }
    fetch(apiUrl("/api/admin/verify"), { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) { localStorage.removeItem("catecos_admin_token"); setLocation("/admin"); } })
      .catch(() => setLocation("/admin"));
  }, [token, setLocation]);

  // ── Fetch bookings ────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const [bRes, sRes] = await Promise.all([
        fetch(apiUrl("/api/bookings"), { headers: authHeaders }),
        fetch(apiUrl("/api/bookings/stats"), { headers: authHeaders }),
      ]);
      if (bRes.ok) setBookings(await bRes.json());
      if (sRes.ok) setStats(await sRes.json());
    } finally { setLoadingBookings(false); }
  }, [token]);

  // ── Fetch settings ────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/settings"), { headers: authHeaders });
      if (!res.ok) return;
      const data: Record<string,string> = await res.json();
      setSettings(data);
      if (data.services) setServices(JSON.parse(data.services) as ServiceItem[]);
      if (data.team) setTeam(JSON.parse(data.team) as TeamMember[]);
      if (data.testimonials) setTestimonials(JSON.parse(data.testimonials) as Testimonial[]);
    } catch {}
  }, [token]);

  useEffect(() => { fetchBookings(); fetchSettings(); }, [fetchBookings, fetchSettings]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const logout = () => { localStorage.removeItem("catecos_admin_token"); setLocation("/admin"); };

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(apiUrl(`/api/bookings/${id}`), { method: "PATCH", headers: authHeaders, body: JSON.stringify({ status }) });
    if (res.ok) { const b = await res.json(); setBookings(p => p.map(x => x.id === id ? b : x)); toast({ title: "Status updated" }); }
    else toast({ variant: "destructive", title: "Update failed" });
  };

  const deleteBooking = async (id: number) => {
    if (!window.confirm("Delete this booking?")) return;
    const res = await fetch(apiUrl(`/api/bookings/${id}`), { method: "DELETE", headers: authHeaders });
    if (res.ok) { setBookings(p => p.filter(x => x.id !== id)); toast({ title: "Booking deleted" }); }
    else toast({ variant: "destructive", title: "Delete failed" });
  };

  const saveNote = async (id: number) => {
    const res = await fetch(apiUrl(`/api/bookings/${id}`), { method: "PATCH", headers: authHeaders, body: JSON.stringify({ notes: noteText }) });
    if (res.ok) { const b = await res.json(); setBookings(p => p.map(x => x.id === id ? b : x)); setEditingNoteId(null); toast({ title: "Note saved" }); }
    else toast({ variant: "destructive", title: "Save failed" });
  };

  const exportCSV = () => { window.open(apiUrl("/api/bookings/export") + `?token=${encodeURIComponent(token)}`, "_blank"); };

  const whatsapp = (b: Booking) => {
    const msg = `Hello ${b.fullName}! This is Catecos Nursing Hub. We are confirming your booking for *${b.service}* on ${b.preferredDate}. Please let us know if you have any questions.`;
    window.open(`https://wa.me/${b.phone.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const saveSetting = async (key: string, value: string) => {
    setSavingSettings(p => ({ ...p, [key]: true }));
    try {
      const res = await fetch(apiUrl(`/api/settings/${key}`), { method: "PUT", headers: authHeaders, body: JSON.stringify({ value }) });
      if (res.ok) { setSettings(p => ({ ...p, [key]: value })); toast({ title: "Saved!" }); }
      else toast({ variant: "destructive", title: "Save failed" });
    } finally { setSavingSettings(p => ({ ...p, [key]: false })); }
  };

  const saveJson = async (key: string, data: unknown) => {
    await saveSetting(key, JSON.stringify(data));
  };

  // Services CRUD
  const addService = () => {
    const id = Date.now().toString();
    const updated = [...services, { id, title: "New Service", description: "Description here", icon: "Heart" }];
    setServices(updated); setEditingServiceId(id);
  };
  const updateService = (id: string, field: keyof ServiceItem, value: string) => {
    setServices(p => p.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const deleteService = async (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated); await saveJson("services", updated); toast({ title: "Service deleted" });
  };
  const saveService = async (id: string) => {
    await saveJson("services", services); setEditingServiceId(null);
  };

  // Team CRUD
  const addTeamMember = () => {
    const id = Date.now().toString();
    const updated = [...team, { id, name: "New Member", role: "Nurse", bio: "Bio here", image: "" }];
    setTeam(updated); setEditingTeamId(id);
  };
  const updateTeam = (id: string, field: keyof TeamMember, value: string) => {
    setTeam(p => p.map(m => m.id === id ? { ...m, [field]: value } : m));
  };
  const deleteTeamMember = async (id: string) => {
    const updated = team.filter(m => m.id !== id);
    setTeam(updated); await saveJson("team", updated);
  };
  const saveTeamMember = async (id: string) => {
    await saveJson("team", team); setEditingTeamId(null);
  };

  // Testimonials
  const toggleTestimonial = async (id: string) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, visible: !t.visible } : t);
    setTestimonials(updated); await saveJson("testimonials", updated);
  };
  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated); await saveJson("testimonials", updated);
  };
  const addTestimonial = async () => {
    const id = Date.now().toString();
    const updated = [...testimonials, { id, name: "New Review", text: "Review text here", rating: 5, visible: true }];
    setTestimonials(updated); await saveJson("testimonials", updated);
  };

  // Filtered bookings
  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchesSearch = !q || b.fullName.toLowerCase().includes(q) || b.phone.includes(q) || b.email.toLowerCase().includes(q) || b.service.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ── Nav items ─────────────────────────────────────────────────────────────
  const navItems: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5"/> },
    { key: "bookings", label: "Bookings", icon: <CalendarCheck className="w-5 h-5"/> },
    { key: "settings", label: "Site Settings", icon: <Settings className="w-5 h-5"/> },
    { key: "services", label: "Services", icon: <Briefcase className="w-5 h-5"/> },
    { key: "team", label: "Our Team", icon: <Users className="w-5 h-5"/> },
    { key: "testimonials", label: "Testimonials", icon: <Star className="w-5 h-5"/> },
  ];

  const pendingCount = bookings.filter(b => b.status === "pending").length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-slate-700">
          <div className="text-lg font-bold">Catecos Admin</div>
          <div className="text-xs text-slate-400 mt-1">Management Portal</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setSection(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === item.key ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
            >
              {item.icon}
              {item.label}
              {item.key === "bookings" && pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
            <LogOut className="w-5 h-5"/> Log Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6 text-slate-600"/>
            </button>
            <h1 className="text-lg font-bold text-slate-800">
              {navItems.find(n => n.key === section)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-green-500"/>
            Admin
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">

          {/* ── DASHBOARD ─────────────────────────────────────────────── */}
          {section === "dashboard" && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: "Total", value: stats?.total ?? 0, color: "bg-slate-600" },
                  { label: "Pending", value: stats?.pending ?? 0, color: "bg-yellow-500" },
                  { label: "Contacted", value: stats?.contacted ?? 0, color: "bg-blue-500" },
                  { label: "Confirmed", value: stats?.confirmed ?? 0, color: "bg-green-500" },
                  { label: "Completed", value: stats?.completed ?? 0, color: "bg-primary" },
                  { label: "Cancelled", value: stats?.cancelled ?? 0, color: "bg-red-500" },
                ].map(s => (
                  <Card key={s.label} className="border-0 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                      <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                        <BarChart2 className="w-4 h-4 text-white"/>
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Popular services */}
              {stats && stats.services.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader><CardTitle className="text-base">Most Requested Services</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.services.map(s => (
                        <div key={s.service} className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">{s.service}</span>
                          <Badge variant="secondary">{s.count} booking{Number(s.count)!==1?"s":""}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent bookings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Recent Bookings</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setSection("bookings")}>View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="font-medium text-sm text-slate-800">{b.fullName}</p>
                          <p className="text-xs text-slate-500">{b.service} · {b.preferredDate}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]}`}>
                          {STATUS_ICONS[b.status]} {b.status}
                        </span>
                      </div>
                    ))}
                    {bookings.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No bookings yet</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── BOOKINGS ──────────────────────────────────────────────── */}
          {section === "bookings" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <Input placeholder="Search name, phone, email, service…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9"/>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchBookings} disabled={loadingBookings}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loadingBookings ? "animate-spin" : ""}`}/> Refresh
                </Button>
                <Button variant="outline" onClick={exportCSV}>
                  <Download className="w-4 h-4 mr-2"/> Export CSV
                </Button>
              </div>

              <p className="text-sm text-slate-500">{filtered.length} of {bookings.length} bookings</p>

              {/* Bookings list */}
              <div className="space-y-3">
                {filtered.map(b => (
                  <Card key={b.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      {/* Header row */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800">{b.fullName}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]}`}>
                              {STATUS_ICONS[b.status]} {b.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{b.service} · {b.preferredDate}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Select value={b.status} onValueChange={v => updateStatus(b.id, v)}>
                            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => whatsapp(b)} title="WhatsApp">
                            <MessageSquare className="w-4 h-4"/>
                          </Button>
                          <a href={`tel:${b.phone}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Call">
                              <Phone className="w-4 h-4"/>
                            </Button>
                          </a>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                            {expandedId === b.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => deleteBooking(b.id)}>
                            <Trash2 className="w-4 h-4"/>
                          </Button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedId === b.id && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div><span className="text-slate-500 font-medium">Phone:</span> <a href={`tel:${b.phone}`} className="text-primary hover:underline">{b.phone}</a></div>
                            <div><span className="text-slate-500 font-medium">Email:</span> <a href={`mailto:${b.email}`} className="text-primary hover:underline">{b.email}</a></div>
                            <div className="sm:col-span-2"><span className="text-slate-500 font-medium">Address:</span> {b.location}</div>
                            <div><span className="text-slate-500 font-medium">Booked:</span> {format(new Date(b.createdAt), "dd MMM yyyy, HH:mm")}</div>
                            <div><span className="text-slate-500 font-medium">Updated:</span> {format(new Date(b.updatedAt), "dd MMM yyyy, HH:mm")}</div>
                          </div>

                          {/* Notes */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-600">Admin Notes</span>
                              {editingNoteId !== b.id && (
                                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setEditingNoteId(b.id); setNoteText(b.notes ?? ""); }}>
                                  <Edit3 className="w-3 h-3 mr-1"/> Edit Note
                                </Button>
                              )}
                            </div>
                            {editingNoteId === b.id ? (
                              <div className="space-y-2">
                                <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} className="text-sm" placeholder="Add your notes here…"/>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => saveNote(b.id)}><Save className="w-3 h-3 mr-1"/> Save</Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingNoteId(null)}><X className="w-3 h-3 mr-1"/> Cancel</Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-600 bg-slate-50 rounded p-2 min-h-[40px]">{b.notes || <span className="text-slate-400 italic">No notes</span>}</p>
                            )}
                          </div>

                          {/* Patient's original notes */}
                          {b.notes && editingNoteId !== b.id && (
                            <div>
                              <span className="text-sm font-medium text-slate-600">Patient Notes:</span>
                              <p className="text-sm text-slate-600 mt-1">{b.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                    <p>No bookings found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SITE SETTINGS ─────────────────────────────────────────── */}
          {section === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <p className="text-sm text-slate-500">Edit the contact details and page content shown on your website.</p>

              {[
                { key: "phone1", label: "Primary Phone", placeholder: "0758 867 235" },
                { key: "phone2", label: "Secondary Phone", placeholder: "0785 466 886" },
                { key: "email", label: "Email Address", placeholder: "njerimuringo@gmail.com" },
                { key: "address", label: "Address", placeholder: "Pema Community Hospital, Utawala" },
                { key: "hours", label: "Business Hours", placeholder: "24 Hours, 7 Days a Week" },
                { key: "hero_title", label: "Homepage Headline", placeholder: "Professional nursing care, comfort of home." },
              ].map(field => (
                <SettingField key={field.key} field={field} settings={settings} saving={savingSettings[field.key]} onSave={saveSetting}/>
              ))}

              <SettingTextarea
                field={{ key: "hero_subtitle", label: "Homepage Subtitle" }}
                settings={settings}
                saving={savingSettings["hero_subtitle"]}
                onSave={saveSetting}
              />
              <SettingTextarea
                field={{ key: "about_text", label: "About Page Text" }}
                settings={settings}
                saving={savingSettings["about_text"]}
                onSave={saveSetting}
              />
            </div>
          )}

          {/* ── SERVICES ──────────────────────────────────────────────── */}
          {section === "services" && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">{services.length} services</p>
                <Button size="sm" onClick={addService}><Plus className="w-4 h-4 mr-1"/> Add Service</Button>
              </div>
              {services.map(s => (
                <Card key={s.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    {editingServiceId === s.id ? (
                      <div className="space-y-3">
                        <Input value={s.title} onChange={e => updateService(s.id, "title", e.target.value)} placeholder="Service title"/>
                        <Textarea value={s.description} onChange={e => updateService(s.id, "description", e.target.value)} placeholder="Description" rows={2}/>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveService(s.id)}><Save className="w-3 h-3 mr-1"/> Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingServiceId(null)}>Cancel</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteService(s.id)}><Trash2 className="w-3 h-3 mr-1"/> Delete</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{s.title}</p>
                          <p className="text-sm text-slate-500 mt-1">{s.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingServiceId(s.id)}><Edit3 className="w-4 h-4"/></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => deleteService(s.id)}><Trash2 className="w-4 h-4"/></Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ── TEAM ──────────────────────────────────────────────────── */}
          {section === "team" && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">{team.length} team members</p>
                <Button size="sm" onClick={addTeamMember}><Plus className="w-4 h-4 mr-1"/> Add Member</Button>
              </div>
              {team.map(m => (
                <Card key={m.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    {editingTeamId === m.id ? (
                      <div className="space-y-3">
                        <Input value={m.name} onChange={e => updateTeam(m.id, "name", e.target.value)} placeholder="Full name"/>
                        <Input value={m.role} onChange={e => updateTeam(m.id, "role", e.target.value)} placeholder="Role / Title"/>
                        <Textarea value={m.bio} onChange={e => updateTeam(m.id, "bio", e.target.value)} placeholder="Short bio" rows={2}/>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveTeamMember(m.id)}><Save className="w-3 h-3 mr-1"/> Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingTeamId(null)}>Cancel</Button>
                          <Button size="sm" variant="destructive" onClick={async () => { await deleteTeamMember(m.id); setEditingTeamId(null); }}><Trash2 className="w-3 h-3 mr-1"/> Delete</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{m.name}</p>
                          <p className="text-sm text-primary font-medium">{m.role}</p>
                          <p className="text-sm text-slate-500 mt-1">{m.bio}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingTeamId(m.id)}><Edit3 className="w-4 h-4"/></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => deleteTeamMember(m.id)}><Trash2 className="w-4 h-4"/></Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
          {section === "testimonials" && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">{testimonials.length} reviews</p>
                <Button size="sm" onClick={addTestimonial}><Plus className="w-4 h-4 mr-1"/> Add Review</Button>
              </div>
              {testimonials.map(t => (
                <Card key={t.id} className={`border-0 shadow-sm ${!t.visible ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">{t.name}</p>
                          <div className="flex">{Array.from({length:t.rating}).map((_,i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
                          {!t.visible && <Badge variant="outline" className="text-xs">Hidden</Badge>}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">"{t.text}"</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleTestimonial(t.id)} title={t.visible ? "Hide" : "Show"}>
                          {t.visible ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => deleteTestimonial(t.id)}>
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SettingField({ field, settings, saving, onSave }: { field:{key:string;label:string;placeholder?:string}; settings:Record<string,string>; saving?:boolean; onSave:(k:string,v:string)=>void }) {
  const [val, setVal] = useState(settings[field.key] ?? "");
  useEffect(() => { setVal(settings[field.key] ?? ""); }, [settings, field.key]);
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{field.label}</label>
      <div className="flex gap-2">
        <Input value={val} onChange={e => setVal(e.target.value)} placeholder={field.placeholder} className="flex-1"/>
        <Button size="sm" disabled={saving} onClick={() => onSave(field.key, val)}>
          {saving ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3 mr-1"/>} Save
        </Button>
      </div>
    </div>
  );
}

function SettingTextarea({ field, settings, saving, onSave }: { field:{key:string;label:string}; settings:Record<string,string>; saving?:boolean; onSave:(k:string,v:string)=>void }) {
  const [val, setVal] = useState(settings[field.key] ?? "");
  useEffect(() => { setVal(settings[field.key] ?? ""); }, [settings, field.key]);
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{field.label}</label>
      <Textarea value={val} onChange={e => setVal(e.target.value)} rows={4} className="resize-none"/>
      <Button size="sm" disabled={saving} onClick={() => onSave(field.key, val)}>
        {saving ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3 mr-1"/>} Save
      </Button>
    </div>
  );
}
