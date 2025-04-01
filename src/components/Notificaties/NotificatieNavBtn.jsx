import './notificaties.css'
import NotificatieModal from './NotifactieModal';
import useSWR from 'swr';
import AsyncData from '../AsyncData';
import { useEffect } from 'react';
import { getAll } from '../../api';
import { socket } from '../../utilities/socket';
import { useAuth } from '../../contexts/Auth.context';
import { typeNotificatie } from "../../utilities/statusDescriptions"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const NotificatieNavBtn = ({isOpen, setIsOpen}) => {

  const {user} = useAuth()
  const navigate = useNavigate();
  const { isLoading, error, data: result = {} } = useSWR("notificaties/ongelezen", getAll);

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    socket.emit('join', user.id)

    socket.on('message', (data) => {

      const Msg = ({closeToast, toastProps}) => {

        const handleSelectedNotification = async () => {
          navigate('/bestelling', { state: { bestelling: data.bestelling } });
          const response = await put(`notificaties/${notificatieId}`, {
            arg: {
                "status": "gelezen"
            }
          });
          console.log(response);
        };

        return (
          <a className='notificatie-modal-item' onClick={handleSelectedNotification}> 
            <div>
              <h3 className='notificatie-header'>{typeNotificatie[data.type]}<span className="notificatie-tag rounded-pill">nieuw</span></h3>
              <p className='notificatie-txt'>{data.tekst}</p>
              <p className='notificatie-txt'>Bestelling: {data.bestelling.id}</p>
            </div>
          </a>
        )
      }

      toast.info(<Msg />)
    })


    return () => {
      socket.off('message')
    }
  }, [])

  return (
    <>
      <AsyncData error={error} loading={isLoading}>
        <button className="btn notification-btn" onClick={toggleNotifications}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="notification-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="notification-num">
            {result.total}
          </span>
        </button>
      </AsyncData>
      { isOpen && <NotificatieModal setIsOpen={setIsOpen} /> }
  </>
  )
}

export default NotificatieNavBtn