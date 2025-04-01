import { isAxiosError } from 'axios';

export default function Error({ error }) {
  if (isAxiosError(error)) {
    const responseData = error.response && error.response.data ? error.response.data : null;

    return (
      <>
      {/*
      <div className="alert alert-danger" data-cy="axios_error_message">
        <h4 className="alert-heading">Oeps, er ging iets mis</h4>
        {<p>
          {responseData && responseData.message ? responseData.message : error.message}
          {responseData && responseData.details && (
            <>
              <br />
              {JSON.stringify(responseData.details)}
            </>
          )}
        </p>}
      </div>
    */}
      </>
    );
  }


  if (error) {
    return (
      <div className="alert alert-danger" data-cy="error_message">
        <h4 className="alert-heading">Er is een onverwachte fout opgetreden</h4>
        {/*<p>{error.message ? error.message : JSON.stringify(error)}</p>*/}
      </div>
    );
  }

  return null;
}
