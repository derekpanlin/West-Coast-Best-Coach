import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/" className="nav-link">West Coast Best Coach</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/find-a-coach" className="nav-link find-a-coach-button">
            Find a Coach!
          </NavLink>
        </li>
        <li className="nav-item profile-button">
          <ProfileButton />
        </li>
      </ul>
    </nav>
  );

}

export default Navigation;
