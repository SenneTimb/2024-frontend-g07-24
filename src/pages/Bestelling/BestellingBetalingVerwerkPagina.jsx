import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { socket } from '../../utilities/socket';
import { io } from 'socket.io-client';

const BestellingBetalingVerwerkPagina = () => {

  const {id, userId} = useParams()

  const [text, setText] = useState("Aan het verwerken...")

  useEffect(() => {
    const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:9000';
    const socket = io(URL);
    socket.connect()
    socket.emit('verwerkBetaling', { userId });
    setTimeout(() => {
      socket.emit('succesBetaling', { userId });
      setText("betaling bevestigd, keer terug naar vorige pagina")
    }, 3000);
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className='qrcode-container'>
      {text}
    </div>
  )
}

export default BestellingBetalingVerwerkPagina