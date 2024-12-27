import { Separator } from "@/components/ui/separator";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  const navigate = useNavigate();
  let location = useLocation();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/sign-in"
    >
      <header>
        <SignedIn>
          <div className="w-screen flex justify-between items-center h-14 px-2">
            <p className="text-primary font-bold text-xl"> EnergyWise</p>
            <div className="flex items-center justify-center gap-12 font-semibold text-secondary-foreground">
              <Link
                to="/"
                className={
                  location.pathname === "/" ? "text-primary" : "text-black"
                }
              >
                Home
              </Link>
              <Link
                to="/water-bills"
                className={
                  location.pathname === "/water-bills"
                    ? "text-primary"
                    : "text-black"
                }
              >
                Water Bills
              </Link>
              <Link
                to="/electricity-bills"
                className={
                  location.pathname === "/electricity-bills"
                    ? "text-primary"
                    : "text-black"
                }
              >
                Electricity Bills
              </Link>
            </div>
            <UserButton />
          </div>
          <Separator />
        </SignedIn>
      </header>
      <main>
        <Outlet />
      </main>
    </ClerkProvider>
  );
}
