import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getById } from '../../api/index';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, error } = useSWR(`producten/${id}`, () => getById(`producten/${id}`));

  if (!product && !error) {
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
      <div className="card">
        <div className="card-body">
          <h1 className="card-title mb-3 text-center"
          data-cy="productTitle">{product.naam}</h1>
          <p className="card-text" data-cy="productVoorraad">
            <strong>Aantal in vooraad</strong> {product.aantalInStock}
          </p>
          <p className="card-text" data-cy="productPrijs">
            <strong>Eenheidsprijs</strong> €{product.eenheidsprijs.toFixed(2)}
          </p>
          <p className="card-text" data-cy="productLeverancier">
            <strong>Leverancier</strong> {product.bedrijfsNaam}
          </p>
          <p className="card-text" data-cy="productStock">
            <strong>In Stock</strong> 
            <span style={{ color: product.aantalInStock ? "green" : "red" }}>
              {product.aantalInStock ? " Ja" : " Nee"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;