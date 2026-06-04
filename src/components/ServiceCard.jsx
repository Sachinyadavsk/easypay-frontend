import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon, title, link, onClick }) => {
  return (
    <Link to={link}  onClick={onClick}>
      <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition hover:-translate-y-1 text-center cursor-pointer">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
    </Link>
  )
}

export default ServiceCard
