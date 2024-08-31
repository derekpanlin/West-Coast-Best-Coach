import { NavLink } from 'react-router-dom';
import './FindACoachPage.css';

function FindACoachPage() {
    return (
        <div className="find-coach-container">
            <h1 className="find-coach-title">Pick a City</h1>
            <div className="find-coach-sections">
                <div className="find-coach-section">
                    <h2 className="find-coach-region">NorCal</h2>
                    <ul className="city-list">
                        <li><NavLink to="/san-francisco-coaches">San Francisco</NavLink></li>
                        <li><NavLink to="/san-jose-coaches">San Jose</NavLink></li>
                    </ul>
                </div>
                <div className="find-coach-section">
                    <h2 className="find-coach-region">SoCal</h2>
                    <ul className="city-list">
                        <li><NavLink to="/irvine-coaches">Irvine</NavLink></li>
                        <li><NavLink to="/los-angeles-coaches">Los Angeles</NavLink></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default FindACoachPage;
