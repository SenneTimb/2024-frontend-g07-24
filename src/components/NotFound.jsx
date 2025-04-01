import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <>
      <h1>Niet gevonden</h1>
      <div className="alert alert-warning">
        Deze pagina bestaat niet: 
        {' '}
        {pathname}
        ,
        {' '}
        <Link
          to="/"
          replace
          className="alert-link"
        >
          terug naar home
        </Link>
        .
      </div>
    </>
  );
}
