import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

import Home from "@/pages/Home";
import Book from "@/pages/Book";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Team from "@/pages/Team";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Public routes wrapped in Layout — pathless Route catches everything else */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/book" component={Book} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/team" component={Team} />
            <Route path="/testimonials" component={Testimonials} />
            <Route path="/contact" component={Contact} />
            <Route path="/blog" component={Blog} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
