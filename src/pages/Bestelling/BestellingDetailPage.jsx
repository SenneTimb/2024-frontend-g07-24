// BestellingDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/Auth.context';
import './BestellingDetailPage.css';
import DetailedOrderKlant from '../../components/bestellingen/DetailedOrderKlant';
import DetailedOrderLeverancier from '../../components/bestellingen/DetailedOrderLeverancier';
import Loader from '../../components/Loader';
import Error from '../../components/Error';

const BestellingDetailPage = () => {
  const { isAuthed, user } = useAuth();

  if (!isAuthed) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="alert alert-warning" role="alert">
          U moet ingelogd zijn om deze pagina te bekijken.
        </div>
      </div>
    );
  }

  return (
    user.rol === 1 
      ? <DetailedOrderLeverancier />
      : <DetailedOrderKlant />
  );
    
};

export default BestellingDetailPage;
