import { useContext, useEffect, useState } from 'react';
import styles from './ProductDetails.module.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { cartContext } from '../../Context/cartContext';
import toast from 'react-hot-toast';
import { API_BASE, getErrorMessage } from '../../utils/auth';

// Five icons: full, half or empty, from the average rating.
function Stars({ value = 0 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = value >= n - 0.25 ? 'fa-solid fa-star' : value >= n - 0.75 ? 'fa-solid fa-star-half-stroke' : 'fa-regular fa-star';
        return <i key={n} className={icon}></i>;
      })}
    </span>
  );
}

export default function ProductDetails() {
  let { id } = useParams();
  let [details, setDetails] = useState(null);
  let [error, setError] = useState('');
  let { addProductToCart } = useContext(cartContext);

  async function addProduct(productId) {
    try {
      const response = await addProductToCart(productId);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add this item to your cart.'));
    }
  }

  useEffect(() => {
    let cancelled = false;
    axios.get(`${API_BASE}/products/${id}`)
      .then((item) => { if (!cancelled) setDetails(item.data.data); })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err, 'Could not load this product.')); });
    return () => { cancelled = true; };
  }, [id]);

  return (
    <section className={styles.productDetails}>
      <div className="container">
        <div className="row align-items-center g-5">
          {details ? (
            <>
              <div className="col-lg-5 col-md-6">
                <div className={styles.leftSide}>
                  <div className={styles.detailsImage}>
                    <img src={details.imageCover} alt={details.title} />
                  </div>
                </div>
              </div>
              <div className="col-lg-7 col-md-6">
                <div className={styles.rightSide}>
                  <h2>{details.title}</h2>
                  <div className={styles.rateInfo}>
                    <span className={styles.rateIcon} aria-hidden="true"><Stars value={details.ratingsAverage} /></span>
                    <span className={styles.rate}>{details.ratingsAverage}</span>
                  </div>
                  <div>
                    <span className={styles.newPrice}>${details.price}</span>
                  </div>
                  <p className={styles.description}>
                    {details.description}
                  </p>
                  <div className={styles.btn}>
                    <button onClick={() => { addProduct(details.id); }}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </>
          ) : error ? (
            <div className="text-center py-5 w-100" role="alert">
              <p className="text-muted">{error}</p>
              <Link to="/products" className="btn btn-dark">Back to products</Link>
            </div>
          ) : (
            <div className={`${styles.spinner} d-flex justify-content-center align-items-center w-100`}>
              <span className={styles.loader}></span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}