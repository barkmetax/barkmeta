import { routes } from "wasp/client/router";
import { BlogUrl, DocsUrl } from "../../../shared/common";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Features", to: "/#features" },
  { name: "Pricing", to: routes.PricingPageRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Dashboard", to: routes.DashboardRoute.to },
  { name: "AI Scheduler", to: routes.DemoAppRoute.to },
  { name: "File Upload", to: routes.FileUploadRoute.to },
] as const;
