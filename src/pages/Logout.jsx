import { useEffect, memo } from 'react';
import { useAuth } from '../contexts/Auth.context';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
//import '../logout.css';


export default memo(function Logout() {
  const { isAuthed, logout } = useAuth();

  useEffect(() => {
    logout(); 
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          {isAuthed ? (
            <>
              <h1 className="display-4">Uitloggen...</h1>
              <div className="mt-4">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </>
          ) : (
            <>
              <h1 className="display-4">Uitgelogd</h1>
              <p className="lead mt-3">Je bent succesvol uitgelogd. Bedankt voor je bezoek!</p>
              <Link to="/" className="btn btn-primary btn-lg mt-4">Terug naar Home</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );

})
