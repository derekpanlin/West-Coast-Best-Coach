import './SideNavigation.css'
import { NavLink } from 'react-router-dom';


function SideNavigation() {
    return (<>
        <nav className='sidebar'>
            <ul>
                <li><NavLink to="/manage-lessons" id='manage-lessons-link' className={({ isActive }) => isActive ? "active" : ""}>Manage Lessons</NavLink></li>
                <li><NavLink to="/manage-reviews" id='manage-reviews-link' className={({ isActive }) => isActive ? "active" : ""}>Manage Reviews</NavLink></li>
            </ul>
        </nav>
    </>);
}

export default SideNavigation;
