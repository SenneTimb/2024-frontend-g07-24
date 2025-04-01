import { useState } from 'react';
import './HomePage.css';
import { useAuth } from '../../contexts/Auth.context';
import { Link, Navigate } from 'react-router-dom';

const HomePage = () => {
  const [error] = useState("");
  const { user, isAuthed } = useAuth();

  if (error) {
    return <div>Error bij het laden</div>;
  }

  let path = "/login"

  if (isAuthed) {
    path = "/bestellingen"
  }
  
  return <Navigate replace to={path} />;

};

export default HomePage;