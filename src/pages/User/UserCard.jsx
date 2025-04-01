import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div>
      <h2>Profiel</h2>
      <p>Email: {user.email}</p>
      <p>BedrijfID: {user.bedrijfId}</p>
      <p>Rol: {user.rol}</p>
    </div>
  );
};

export default memo(UserCard);