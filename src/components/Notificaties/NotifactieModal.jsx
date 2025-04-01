import './notificaties.css'
import { NavLink } from "react-router-dom";
import NotificatieModalItem from './NotificatieModalItem';
import { useAuth } from '../../contexts/Auth.context';
import useSWR from 'swr';
import AsyncData from '../AsyncData';
import { useEffect, useMemo } from 'react';
import { getAll } from '../../api';


const NotifactieModal = ({setIsOpen}) => {

  const { user } = useAuth();
  const url = user ? user.rol === 2 ? "notificaties/klant?limit=true" : "notificaties/leverancier?limit=true" : null;
  const { isLoading, error, data: notifications = [] } = useSWR(url, getAll);

  const processedNotifications = useMemo(() => {
    return notifications.map(notification => ({
      ...notification,
      isNew: notification.status === "ongelezen" && new Date(user.last_login) < new Date(notification.date)
    }));
  }, [notifications]);

  const handleModal = () => {
    setIsOpen(false)
  }

  return (
    <div className="notification-modal">
      <div className='notifications-header'>Notificaties</div>
      <AsyncData error={error} loading={isLoading}>
        {processedNotifications.map((notification, idx) => (
          <div key={idx} onClick={handleModal}>
            <NotificatieModalItem {...notification} />
          </div>
        ))}
      </AsyncData>
      <div className='notifications-footer'>
        <NavLink to={'/notificaties'} onClick={handleModal}>
          Alle notificaties
        </NavLink>
      </div>
    </div>
  )
}

export default NotifactieModal