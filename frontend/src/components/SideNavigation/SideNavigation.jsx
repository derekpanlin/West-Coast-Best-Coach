import './SideNavigation.css'
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


function SideNavigation() {
    return (<>
        <nav className='sidebar'>
            <ul>
                <li><NavLink to="/manage-lessons" className={({ isActive }) => isActive ? "active" : ""}>Manage Lessons</NavLink></li>
                <li><NavLink to="/manage-reviews" className={({ isActive }) => isActive ? "active" : ""}>Manage Reviews</NavLink></li>
            </ul>
        </nav>
    </>);
}

export default SideNavigation;
