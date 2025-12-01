import { useState } from "react";
import { Link, useLocation } from "react-router";
import { SignedIn, UserButton } from "@clerk/clerk-react";
const MobileMenu = () => {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  return (
    <div>
      {/* Menu Toggle */}
      {!isDashboardRoute && (
        <button
          className="md:hidden text-gray-300 hover:text-white transition"
          onClick={() => {
            setMenu((prev) => !prev);
          }}
        >
          {menu ? <span>X</span> : <span>☰</span>}
        </button>
      )}

      {/* UserButton */}
      {isDashboardRoute && (
        <SignedIn>
          <UserButton />
        </SignedIn>
      )}

      {/* DropDown */}
      {menu && !isDashboardRoute && (
        <div className="absolute  top-10  right-0  w-40  bg-[#1c1a29] rounded-xl shadow-md p-4 flex flex-col gap-3 text-gray-300 md:hidden z-50">
          <Link
            to="/"
            className="hover:text-[#217bfe] transition"
            onClick={() => setMenu(false)}
          >
            गृहपृष्ठ
          </Link>
          <Link
            to="/explore"
            className="hover:text-[#217bfe] transition"
            onClick={() => setMenu(false)}
          >
            अन्वेषण
          </Link>
          <Link
            to="/emergency"
            className="hover:text-red transition"
            onClick={() => setMenu(false)}
          >
            आपतकालीन सम्पर्क
          </Link>
          <Link
            to="/emergency"
            className="hover:text-[#217bfe] transition"
            onClick={() => setMenu(false)}
          >
            च्याटबोट
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
