import { typeNotificatie } from "../../utilities/statusDescriptions"
import { formatDate } from "../../utilities/dateFormater"
import { useNavigate } from "react-router-dom";
import { put } from "../../api/index";

const NotificatieModalItem = ({notificatieId, type, tekst, date, status, isNew, bestelling}) => {

  const navigate = useNavigate();

  const handleSelectedNotification = async () => {
    navigate('/bestelling', { state: { bestelling } });
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
        <h3 className='notificatie-header'>{typeNotificatie[type]}{isNew && <span className="notificatie-tag rounded-pill">nieuw</span>}</h3>
        <p className='notificatie-txt'>{tekst}</p>
        <p className='notificatie-txt'>Bestelling: {bestelling.id}</p>
        <p className='notificatie-txt'>{formatDate(date)}</p>
      </div>
      <div>
        {status === "ongelezen" && <span className='notification-status'></span>}
      </div>
    </a>
  )
}

export default NotificatieModalItem