import React from 'react'
import { useAuth } from '../../contexts/Auth.context'
import useSWR from 'swr';
import { getAll } from '../../api';
import AsyncData from '../AsyncData';
import NotificatieModalItem from './NotificatieModalItem';
import { useMemo } from 'react';

const NotificatiesList = () => {

  const { user } = useAuth();
  const url = user.rol === 2 ? "notificaties/klant?limit=false" : "notificaties/leverancier?limit=false";

  const { isLoading, error, data: notifications = []} = useSWR(url, getAll);

  const processedNotifications = useMemo(() => {
    return notifications.map(notification => ({
      ...notification,
      isNew: notification.status === "ongelezen" && new Date(user.last_login) < new Date(notification.date)
    }));
  }, [notifications]);

  return (
    <div className='h-100 px-4 d-flex flex-column align-items-center'>
      <h2>Notificaties</h2>
      <div className='notifications-list'>
        <AsyncData error={error} loading={isLoading}>
          {processedNotifications.map((notification, idx) => (
            <NotificatieModalItem key={idx} {...notification} />
          ))}
        </AsyncData>
      </div>
    </div>
  )
}

export default NotificatiesList