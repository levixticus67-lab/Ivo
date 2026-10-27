import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Projects from "./pages/public/Projects";
import Contact from "./pages/public/Contact";
import Login from "./pages/admin/Login";
import Overview from "./pages/admin/Overview";
import ManageProjects from "./pages/admin/ManageProjects";
import Leads from "./pages/admin/Leads";
import Settings from "./pages/admin/Settings";
import ManageTestimonials from "./pages/admin/ManageTestimonials";

function PublicLayout() {
  return <div className="bg-mesh min-h-screen text-white"><Navbar /><main className="min-h-[60vh]"><Outlet /></main><Footer /></div>;
}

function NotFound() {
  return <div className="mx-auto max-w-7xl px-5 py-32 text-center"><p className="eyebrow">404</p><h1 className="mt-3 text-4xl font-semibold">Page not found</h1><a className="button-primary mt-8" href="/">Return home</a></div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="dashboard" element={<Overview />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="leads" element={<Leads />} />
          <Route path="testimonials" element={<ManageTestimonials />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
