import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from "../../contexts/Auth.context.jsx";
import useSWR from "swr";
import { getAll } from "../../api/index.js";
import './bestellingenlist.css';
import AsyncData from "../AsyncData.jsx";
import { useNavigate } from 'react-router-dom';
import { paymentStatusDescriptions, orderStatusDescriptions } from '../../utilities/statusDescriptions.js';
import { formatDate } from '../../utilities/dateFormater.js';
import orderStatussen from "../../utilities/ordersStatus.js";
import betalingsStatssen from "../../utilities/betalingsstatus";
import betalingsStatussen from '../../utilities/betalingsstatus';

function BestellingenTable({ bestellingen, handleSelectBestelling }) {
  if (!bestellingen || bestellingen.length === 0) {
    return <div className="alert alert-info">Er zijn nog geen bestellingen.</div>;
  }

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "Betaald":
        return "status-betaald";
      case "Onverwerkt":
        return "status-onverwerkt";
      case "Factuur verzonden":
        return "status-factuurverzonden";
      default:
        return "";
    }
  };
  

  return (
    <div className="table-container">
      <table className="table table-hover table-responsive">
        <thead>
          <tr>
            <th>Klant</th>
            <th>Bestel nummer</th>
            <th>Bestel datum</th>
            <th>Betalingsstatus</th>
            <th>Orderstatus</th>
          </tr>
        </thead>
        <tbody>
          {bestellingen.map(bestelling => (
            <tr key={bestelling.id} onClick={() => handleSelectBestelling(bestelling)}>
              <td>{bestelling.klant}</td>
              <td>{bestelling.ordernummer}</td>
              <td>{formatDate(bestelling.datumgeplaatst)}</td>
              <td className={getPaymentStatusClass(bestelling.betalingsstatus)}>{bestelling.betalingsstatus}</td>
              <td>{bestelling.orderstatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BestellingList() {
  const { user } = useAuth();
  const navigate = useNavigate();  
  const [sortKey, setSortKey] = useState('datumgeplaatst');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterKey, setFilterKey] = useState('ordernummer');
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 50;

  const url = useMemo(() => {
    const baseEndpoint = user.rol === 2 ? "bestellingen/klant" : "bestellingen/leverancier";
    return `${baseEndpoint}?pagina=${currentPage + 1}&filterBy=${filterKey}&filterWaarde=${filterValue}&orderBy=${sortKey}&orderWaarde=${sortOrder}`;
  }, [user.rol, currentPage, filterKey, filterValue, sortKey, sortOrder]);

  const { isLoading, error, data: bestellingenEnLengte = [] } = useSWR(url, getAll);
  const {bestellingen = [], lengthAllOrders} = bestellingenEnLengte;

  const handleChangePage = (pageIndex) =>{
    setCurrentPage(pageIndex);
  }

  const handleSelectBestelling = bestelling => {
    navigate('/bestelling', { state: { bestelling } });
  };

  const processedBestellingen = useMemo(() => {
    return bestellingen.map(bestelling => ({
      ...bestelling,
      orderstatus: orderStatusDescriptions[bestelling.orderstatus],
      betalingsstatus: paymentStatusDescriptions[bestelling.betalingsstatus],
    }));
  }, [bestellingen]);

  const filteredAndSortedBestellingen = useMemo(() => {
    const standaardFilter = (bestelling) => {
      if (user.rol === 2) {
        return !(bestelling.orderstatus === orderStatussen.GELEVERD && bestelling.betalingsstatus === betalingsStatssen.BETAALD);
      } else {
        return (bestelling.orderstatus === orderStatussen.VERZONDEN || (bestelling.orderstatus === orderStatussen.GELEVERD && bestelling.betalingsstatus !== betalingsStatssen.BETAALD));
      }
    };

    return processedBestellingen.filter(bestelling => {
      return(filterValue.split('').length !== 0  ? true : standaardFilter(bestelling));
    });
  }, [bestellingen]);

  /*useEffect(() => {
    if (bestellingen.length > 0) {
      setSortKey('datumgeplaatst');
      setSortOrder('desc');
    }
  }, [bestellingen]);*/

  const changeSort = event => {
    setSortKey(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container-fluid mt-5">
        <h1 className="mb-4" data-cy="bestellingenTitel">Bestellingen</h1>
        <div className="card">
            <div className="card-header">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="mb-2"><strong>Filter op:</strong></p>
                        <select className="form-select" value={filterKey} onChange={e => setFilterKey(e.target.value)}>
                            <option value="ordernummer">Ordernummer</option>
                            <option value="betalingsstatus">Betalingsstatus</option>
                            <option value="datumgeplaatst">Datum geplaatst</option>
                            <option value="orderstatus">Orderstatus</option>
                            <option value={user.rol === 2 ? "leverancier" : "klant"}>{user.rol === 2 ? "Leverancier" : "Klant"}</option>
                        </select>
                        {
                          filterKey === "betalingsstatus" ? (
                            <select className="form-select" value={filterValue} onChange={e => setFilterValue(e.target.value)}>
                              <option value={""} defaultChecked>-- selecteer waarde --</option>
                              {Object.keys(paymentStatusDescriptions).map(paymentKey => (
                                <option value={paymentKey}>{paymentStatusDescriptions[paymentKey]}</option>
                              ))}
                            </select>
                          ) :
                            filterKey === "orderstatus" ? (
                              <select className="form-select" value={filterValue} onChange={e => setFilterValue(e.target.value)}>
                                <option value={""} defaultChecked>-- selecteer waarde --</option>
                                {Object.keys(orderStatusDescriptions).map((orderKey, idx) => (
                                  <option value={orderKey}>{orderStatusDescriptions[orderKey]}</option>
                                ))}
                              </select>
                            ) : (
                              <input type="text" className="form-control mt-2" value={filterValue} onChange={e => setFilterValue(e.target.value)} placeholder="Filterwaarde" />
                            )
                        }
                    </div>

                    <div className="col-md-6">
                        <p className="mb-2"><strong>Sorteren op:</strong></p>
                        <select className="form-select d-inline-block w-auto" value={sortKey} onChange={changeSort}>
                            <option value="ordernummer">Ordernummer</option>
                            <option value="betalingsstatus">Betalingsstatus</option>
                            <option value="datumgeplaatst">Datum geplaatst</option>
                            <option value="orderstatus">Orderstatus</option>
                            <option value={user.rol === 2 ? "leverancier" : "klant"}>{user.rol === 2 ? "Leverancier" : "Klant"}</option>
                        </select>
                        <button className="btn btn-outline-secondary ml-2" onClick={toggleSortOrder}>{sortOrder === 'asc' ? '↑' : '↓'}</button>
                    </div>
                </div>
            </div>
            
            <div className="card-body">
                <AsyncData loading={isLoading} error={error}>
                    <BestellingenTable bestellingen={filteredAndSortedBestellingen} handleSelectBestelling={handleSelectBestelling} />
                </AsyncData>
            </div>
            <div className="pagination">
              {Array.from({ length: Math.ceil(lengthAllOrders / itemsPerPage) || 1 }, (_, index) => (
                <button key={index} onClick={() => handleChangePage(index)} 
                  className={currentPage === index ? "active button" : "button"}> {index + 1} </button>
              ))}
            </div>
        </div>
    </div>
);
}
