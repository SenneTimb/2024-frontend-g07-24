// DetailedOrder.jsx
import React, { useCallback, useMemo, useState } from 'react';
import {formatDate} from '../../utilities/dateFormater'
import { paymentStatusDescriptions, orderStatusDescriptions, getKeyByValue } from '../../utilities/statusDescriptions'
import { put, save, getAll } from "../../api/index";
import notificatieTypes from '../../utilities/notificatieTypes';
import betalingsStatussen from '../../utilities/betalingsstatus';
import AsyncData from '../AsyncData';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';



const DetailedOrder = () => {

    const location = useLocation();
    const bestelling = location.state?.bestelling;
    const products = bestelling.products;

    // const { data: herinnering, error: errorHerinnering, isValidating: isValidatingHerinnering } = useSWR(`betalingsherinneringen/${bestelling.id}`, getAll);
    //const { data: products, error: errorProducts, isValidating: isValidatingProducts } = useSWR(`producten/${bestelling.id}`, getAll);

    const totalOrderAmount = useMemo(() => {
        return products ? products.reduce((acc, product) => acc + product.aantal * product.eenheidsprijs, 0) : 0
    }, [products]);

    const [paymentStatus, setPaymentStatus] = useState(bestelling.betalingsstatus);
    const [orderStatus, setOrderStatus] = useState(bestelling.orderstatus);

    const handlePaymentStatusChange = (e) => {
        setPaymentStatus(paymentStatusDescriptions[e.target.value]);
    };

    const handleOrderStatusChange = (e) => {
        setOrderStatus(orderStatusDescriptions[e.target.value]);
    };

    const handleSaveChanges = useCallback(async () => {
        try {
            const response = await put(`bestellingen/${Number(bestelling.id)}`, {
                arg: {
                    "betalingsstatus": Number(getKeyByValue(paymentStatusDescriptions, paymentStatus)),
                    "orderstatus": Number(getKeyByValue(orderStatusDescriptions, orderStatus))
                }
            });
            
            toast.success('Wijziging opgeslaan!')
        } catch (error) {
           toast.error('Error updating bestelling:', error);
        }
    }, [paymentStatus, orderStatus, bestelling.id]);
    
    const handleCreateNotification = useCallback(async () => {
        try {
            await save('notificaties', {
                arg: {
                    tekst: 'Betalingsherrinnering',
                    type: notificatieTypes.BETALINGSVERZOEK,
                    order_id: bestelling.id
                }
            })

            toast.success('Betalingsherrinnering gestuurd!')
        } catch (error) {
            toast.error('Error sturen betalingsherrinnering:', error)
        }
    }, [save]) 

    return (
        <AsyncData >
            <div className="container mt-4">
                <h1 data-cy="bestellingDetailsTitelLeverancier">Bestelling Details</h1>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Bestelling ID: {bestelling.uuidCode}</h5>

                        <table className="info-table">
                            <thead>
                                <tr><th colSpan="2">Algemeen</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Klant</td><td>{bestelling.klant}</td></tr>
                                <tr><td>Te betalen tegen</td><td>{formatDate(bestelling.betalingsdeadline)}</td></tr>
                                <tr><td>Bestelling geplaatst op</td><td>{formatDate(bestelling.datumgeplaatst)}</td></tr>
                                <tr><td>Datum laatste betalingsherinnering</td><td>{"Onbestaand"}</td></tr>
                                <tr>
                                    <td>Betalingsstatus</td>
                                    <td>
                                        <select value={getKeyByValue(paymentStatusDescriptions, paymentStatus)} onChange={handlePaymentStatusChange}>
                                            {Object.entries(paymentStatusDescriptions).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>    
                                    </td>
                                </tr>
                                
                            
                            </tbody>
                        </table>
                        <table className="info-table">
                            <thead>
                                <tr><th colSpan="2">Klant en Leverancier</th></tr>
                            </thead>
                            <tbody>
                                {/*<tr><td>Leverancier</td><td>{bestelling.leverancier}</td></tr>*/}
                                <tr><td>Leveradres</td><td>{bestelling.leveradres}</td></tr>
                                <tr>
                                    <td>Orderstatus</td>
                                    <td>
                                        <select value={getKeyByValue(orderStatusDescriptions, orderStatus)} onChange={handleOrderStatusChange}>
                                            {Object.entries(orderStatusDescriptions).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                        
                                

                            </tbody>
                        </table>

                        {/* Products table */}
                        <div>
                            <h6>Bestelde Producten</h6>
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
                                    {products && products.map(product => (
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
                        </div>
                    </div>
                        {(bestelling.orderstatus !== orderStatus || bestelling.betalingsstatus !== paymentStatus) && (
                            <button className="btn btn-primary" onClick={handleSaveChanges}>
                                Wijzigingen opslaan
                            </button>
                        )}
                        { bestelling.betalingsstatus !== betalingsStatussen.BETAALD  && (
                            <button className="btn btn-danger" onClick={handleCreateNotification}>
                                Stuur betalingsherinnering
                            </button>
                        )}
                </div>
            </div>
        </AsyncData>
    );
};

export default DetailedOrder;
