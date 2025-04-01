import { useState } from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/Auth.context";
import Logo from './Logo_Groot.png';
import NotificatieNavBtn from "../Notificaties/NotificatieNavBtn";

const Navbar = () => {
  const { isAuthed, user } = useAuth();
  const userId = user?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <button className="navbar-toggler" type="button" onClick={toggleMenu}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <NavLink to="/" className="navbar-brand nav-brand">
        <img src={Logo} className="navbar-brand img" alt="Logo" />
      </NavLink>
      <div className={`navbar-nav ${isOpen ? "open" : ""}`}>
        <div className="nav-item my-1 mx-sm-2 my-sm-0" data-cy="profile-btn">
          <NavLink className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" to="/producten">
            Producten
          </NavLink>
        </div>
        {isAuthed ? (
          <>
            <div className="nav-item my-1 mx-sm-2 my-sm-0" data-cy="profile-btn">
              <NavLink className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" to="/bestellingen">
                Bestellingen
              </NavLink>
            </div>
            <div className="nav-item my-1 mx-sm-2 my-sm-0" data-cy="profile-btn">
              <NavLink className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" to={`/user/${userId}`}>
                Profiel
              </NavLink>
            </div>
            <div className="nav-item my-1 mx-sm-2 my-sm-0" data-cy="profile-btn">
              <NotificatieNavBtn isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
            </div>
            <div className="nav-item my-1 mx-sm-2 my-sm-0">
                <NavLink to="/logout">
                  <button className="btn btn-outline-danger logout-button"
                  data-cy="logout_btn">
                    Log uit
                  </button>
                </NavLink>
              </div>
          </>
        ) : (    
          <div className="nav-item my-1 mx-sm-2 my-sm-0">
            <NavLink to="/login">
              <button className="btn btn-outline-primary login-button">Inloggen</button>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
