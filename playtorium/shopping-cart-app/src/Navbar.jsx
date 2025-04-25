import { NavLink } from "react-router-dom";
import { ShoppingCart, Settings } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <h1 className="navbar-title">Shopping Cart</h1>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            <ShoppingCart size={18} /> Home
          </NavLink>

          <NavLink
            to="/edit-discount"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            <Settings size={18} /> Edit&nbsp;Discounts
          </NavLink>
        </div>
      </div>
    </header>
  );
}
