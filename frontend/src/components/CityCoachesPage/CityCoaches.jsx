import React from 'react';
import { useParams } from 'react-router-dom';
import CoachList from './CoachList';
import './CityCoaches.css'

const CityCoaches = () => {
    const { city } = useParams();

    return (
        <div>
            <h1>Coaches in {city.replace(/-/g, ' ')}</h1>
            <CoachList city={city.replace(/-/g, ' ')} />
        </div>
    );
};

export default CityCoaches;
