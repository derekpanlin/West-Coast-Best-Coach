import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import "./Navigation.css";


function Navigation() {
  const user = useSelector((store) => store.session.user);

  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/" className="home-link">
            <img
              src='/logo/West-Coast-Best-Coach-logo.png'
              alt="West Coast Best Coach"
              className="nav-logo"
            />
          </NavLink>
        </li>
        {user && (
          <li className="nav-item">
            <NavLink to="/find-a-coach" className="find-a-coach-button">
              Find a Coach!
            </NavLink>
          </li>
        )}
        <li className="nav-item profile-button">
          <ProfileButton />
        </li>
      </ul>
    </nav>
  );

}

export default Navigation;
