import React, {useState} from 'react';
import { Link } from 'react-router-dom'; 
import { getAll } from '../../api/index';
import useSWR from 'swr';
import '../../components/Pagination.css';

const ProductenPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: productsEnLengthe = [], isLoading, error} = useSWR(`producten?pagina=${currentPage}`, getAll);
  const {products = [], total} = productsEnLengthe;
  const itemsPerPage = 5;

  const handleChangePage = (pageIndex) =>{
    setCurrentPage(pageIndex);
  }

  if (!products && !error) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-3" data-cy="ProductenOverzicht">Producten Overzicht</h1>
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title" data-cy="oProductNaam">{product.naam}</h5>
                <p className="card-text" data-cy="oProductStock">
                  In Stock:
                  <span
                    style={{ color: product.aantalInStock ? "green" : "red" }}
                  >
                    {product.aantalInStock ? " Ja" : " Nee"}
                  </span>
                </p>
                <Link
                  to={`/producten/product/${product.id}`}
                  className="btn btn-primary"
                  data-cy="productDetailsLink"
                >
                  Bekijk details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(total / itemsPerPage) }, (_, index) => (
        total <= itemsPerPage ? null :
          <button key={index} onClick={() => handleChangePage(index+1)} 
            className={currentPage - 1 === index ? "active button" : "button"}> {index + 1} </button>
        ))}
      </div>
    </div>
  );
};

export default ProductenPage;
