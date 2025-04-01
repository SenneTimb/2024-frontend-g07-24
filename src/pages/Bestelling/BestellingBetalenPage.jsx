import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import AsyncData from '../../components/AsyncData';
import { socket } from '../../utilities/socket';
import { useAuth } from "../../contexts/Auth.context";
import { NavLink, useParams } from "react-router-dom";
import { put } from "../../api";
import betalingsStatussen from "../../utilities/betalingsstatus";
import { paymentStatusDescriptions, getKeyByValue } from '../../utilities/statusDescriptions'

const BestellingBetalenPage = () => {

  const {user} = useAuth();
  const {id} = useParams();

  const [isSucces, setIsSucces] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  useEffect(() => {

    socket.emit('join', user.id)

    socket.on('betalingVerwerken', () => {
      setIsWaitingResponse(true)
    });

    socket.on('betalingSucces', async () => {
      await put(`bestellingen/betaal/${id}`, {
        arg: {
          betalingsstatus: Number(getKeyByValue(paymentStatusDescriptions, betalingsStatussen.BETAALD))
        }
      })

      setIsWaitingResponse(false)
      setIsSucces(true)
    });

    return () => {
      socket.off('betalingVerwerken')
      socket.off('betalingSucces');
    }
  }, [])

  return (
    <div className="qrcode-container">
      <AsyncData loading={isWaitingResponse}>
        {isSucces ? (
          <div className="qrcode-succes-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="qrcode-succes">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p>Betaling met success ontvangen!</p>
            <NavLink to={'/bestellingen'} replace={true}>Keer terug naar overzicht</NavLink>
          </div>
        ) : (
          <>
            <h3>Scan voor te betalen</h3>
            <QRCode value={window.location.href + '/verwerk/' + user.id} size={300} />
          </>
        )}
      </AsyncData>
    </div>
  )
}

export default BestellingBetalenPage