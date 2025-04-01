import React from 'react';
import { useAuth } from '../../contexts/Auth.context';
import { getAll } from "../../api/index.js";
import BestellingenList from '../../components/bestellingen/BestellingenList.jsx';
import useSWR from "swr";



const BestellingenPage = () => {
  const { user, isAuthed } = useAuth();

  if (!isAuthed) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="alert alert-warning" role="alert">
          U moet ingelogd zijn om deze pagina te bekijken
        </div>
      </div>
    );
  }

  return (
    <BestellingenList />
  );
};

export default BestellingenPage;