import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("adminToken"));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Spice Garden
      </Link>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/consumers">Consumers</NavLink>
        {isLoggedIn ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button type="button" className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">Admin Login</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
