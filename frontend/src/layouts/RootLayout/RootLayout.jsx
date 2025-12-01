import { Outlet, useLocation } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Header from "../../Components/Navigation/Header";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const RootLayout = () => {
  const location = useLocation();
  const isExplorePage = location.pathname === "/explore";
  const isEmergencyPage = location.pathname === "/emergency";
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div className="px-6 md:px-16 py-4 h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main
          className={`flex-1 mt-5 ${
            !isExplorePage && !isEmergencyPage
              ? "overflow-hidden"
              : "overflow-auto"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </ClerkProvider>
  );
};

export default RootLayout;
