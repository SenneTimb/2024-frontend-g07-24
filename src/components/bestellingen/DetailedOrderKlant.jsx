// DetailedOrder.jsx
import React, { useMemo } from 'react';
import {formatDate} from '../../utilities/dateFormater'
import { useLocation, useNavigate } from 'react-router-dom';
import AsyncData from '../AsyncData';
import betalingsStatussen from '../../utilities/betalingsstatus';
import useSWR from 'swr';
import { getAll } from '../../api';

const DetailedOrder = () => {

    const location = useLocation();
    const navigate = useNavigate()

    const bestelling = location.state?.bestelling;

    const products = bestelling.products;

    //const { data: products, error: errorProducts, isValidating: isValidatingProducts } = useSWR(`producten/${bestelling.id}`, getAll);

    const totalOrderAmount = useMemo(() => {
        return products ? products.reduce((acc, product) => acc + product.aantal * product.eenheidsprijs, 0) : 0
    }, [products]);

    if (!bestelling) {
        return (
            <div className="alert alert-info">
            Geen bestelling gevonden.
            </div>
        );
    }

    const handleBetalen = () => {
        navigate(`betalen/${bestelling ? bestelling?.id : null}`)
    }

    return (
        <AsyncData>
            <div className="container mt-4">
                <h1 data-cy="bestellingDetailsTitelKlant">Bestelling Details</h1>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Bestelling ID: {bestelling.uuidCode}</h5>

                        <table className="info-table">
                            <thead>
                                <tr><th colSpan="2">Datums en Financieel</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Te betalen tegen</td><td>{formatDate(bestelling.betalingsdeadline)}</td></tr>
                                <tr><td>Bestelling geplaatst op</td><td>{formatDate(bestelling.datumgeplaatst)}</td></tr>
                                <tr><td>Betalingsstatus</td><td>{bestelling.betalingsstatus}</td></tr>
                            </tbody>
                        </table>
                        <table className="info-table">
                            <thead>
                                <tr><th colSpan="2">Klant en Leverancier</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Klant</td><td>{bestelling.klant}</td></tr>
                                <tr><td>Leverancier</td><td>{bestelling.leverancier}</td></tr>
                                <tr><td>Leveradres</td><td>{bestelling.leveradres}</td></tr>
                                <tr><td>Orderstatus</td><td>{bestelling.orderstatus}</td></tr>
                            </tbody>
                        </table>

                        {/* Products table */}
                        <div>
                            <h6>Bestelde Producten</h6>
                            {products ? (
                                <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Product Naam</th>
                                        <th>Aantal</th>
                                        <th>Eenheidsprijs</th>
                                        <th>In Stock</th>
                                        <th>Totale Prijs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.naam}</td>
                                            <td>{product.aantal}</td>
                                            <td>€{product.eenheidsprijs.toFixed(2)}</td>
                                            <td>{product.aantalInStock > 0 ? "Ja" : "Neen"}</td>
                                            <td>€{(product.aantal * product.eenheidsprijs).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr><td><strong>Totale prijs Excl. BTW:</strong></td><td>€{totalOrderAmount.toFixed(2)}</td></tr>
                                    <tr><td><strong>Totale prijs Incl. BTW (21%):</strong></td><td>€{(totalOrderAmount * 1.21).toFixed(2)}</td></tr>
                                </tbody>
                            </table>
                            ) : (
                                <p>Geen producten gevonden.</p>
                            )}
                        </div>
                    </div>
                    {bestelling.betalingsstatus === betalingsStatussen.FACTUURVERZONDEN && (
                        <button className='btn btn-primary' onClick={handleBetalen}>
                            Betaal bestelling
                        </button>
                    )}
                </div>
            </div>
        </AsyncData>
    );
};

export default DetailedOrder;
