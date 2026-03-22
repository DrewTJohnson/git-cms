import { Router, Route } from "@solidjs/router";
import { lazy } from "solid-js";
import SiteLayout from "./public-site/components/SiteLayout";
import AdminLayout from "./admin/components/AdminLayout";

// Public routes
const HomePage = lazy(() => import("./public-site/pages/HomePage"));
const ContentPage = lazy(() => import("./public-site/pages/ContentPage"));
const NotFoundPage = lazy(() => import("./public-site/pages/NotFoundPage"));

// Admin routes
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminNew = lazy(() => import("./admin/pages/AdminNew"));
const AdminEdit = lazy(() => import("./admin/pages/AdminEdit"));

export default function App() {
  return (
    <Router>
      {/* Public site */}
      <Route path="/" component={SiteLayout}>
        <Route path="/" component={HomePage} />
        <Route path="/page/:slug" component={ContentPage} />
        <Route path="*" component={NotFoundPage} />
      </Route>

      {/* Admin panel */}
      <Route path="/admin" component={AdminLayout}>
        <Route path="/" component={AdminDashboard} />
        <Route path="/new" component={AdminNew} />
        <Route path="/edit/:slug" component={AdminEdit} />
      </Route>
    </Router>
  );
}
