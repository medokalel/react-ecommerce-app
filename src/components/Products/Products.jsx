import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Products.module.css';
import { Link, useSearchParams } from 'react-router-dom';
import { cartContext } from '../../Context/cartContext';
import toast from 'react-hot-toast';
import ScrollToTop from '../ScrollToTop/ScrollToTop'
import { API_BASE, getErrorMessage } from '../../utils/auth';

export default function Products() {
  let [product, setProduct] = useState([]);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState('');
  let [attempt, setAttempt] = useState(0);
  let { addProductToCart } = useContext(cartContext);
  let [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  async function addProduct(id) {
    try {
      const response = await addProductToCart(id);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add this item to your cart.'));
    }
  }

  useEffect(() => {
    let cancelled = false;
    axios.get(`${API_BASE}/products`)
      .then((response) => {
        if (cancelled) return;
        setProduct(response.data.data);
        setError('');
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err, 'Could not load products.'));
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [attempt]);

  function retry() {
    setLoading(true);
    setAttempt((n) => n + 1);
  }

  const visible = query
    ? product.filter((item) => item.title.toLowerCase().includes(query) || item.category?.name?.toLowerCase().includes(query))
    : product;

  return (
  <>
    <div>
      <section className={styles.productSection}>
        <div className="container">
          <div className={styles.productContent}>
            <div className={styles.productHeader}>
              <h2>All Products</h2>
              <span>{loading || error ? '' : query ? `${visible.length} result${visible.length === 1 ? '' : 's'} for "${searchParams.get('q')}"` : `Showing ${visible.length} products`}</span>
            </div>
            <div className={styles.productBody}>
              <div className="row g-4">
                {!loading && !error && visible.length > 0 ? visible.map((item) => (
                  <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                    <div className={styles.card}>
                      <div>
                        <Link className="text-decoration-none" to={`/productdetails/${item.id}`}>
                          <div className={styles.cardImage}>
                            <img src={item.imageCover} alt={item.title} />
                          </div>
                          <div className={styles.cardBody}>
                            <h4>{item.category.name}</h4>
                            <h3>{item.title.split(' ').slice(0, 3).join(' ')}</h3>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className={styles.newPrice}>{`$${item.price}`}</span>
                              </div>
                              <div>
                                {item.ratingsAverage > 2.5 ? (
                                  <span className={styles.rate}><i className="fa-solid fa-star"></i></span>
                                ) : item.ratingsAverage <= 2.5 && item.ratingsAverage > 0 ? (
                                  <span className={styles.rate}><i className="fa-solid fa-star-half-stroke"></i></span>
                                ) : (
                                  <span className={styles.rate}><i className="fa-regular fa-star"></i></span>
                                )}
                                <span>{item.ratingsAverage}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <div className={styles.cardFooter}>
                          <button onClick={() => { addProduct(item.id); }}>Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : loading ? (
                  <div className={`${styles.spinner} d-flex justify-content-center align-items-center w-100`}>
                    <span className={styles.loader}></span>
                  </div>
                ) : error ? (
                  <div className="text-center py-5 w-100" role="alert">
                    <p className="text-muted">{error}</p>
                    <button className="btn btn-dark" onClick={retry}>Try again</button>
                  </div>
                ) : (
                  <div className="text-center py-5 w-100">
                    <p className="text-muted">No products match your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <ScrollToTop />
  </>
  );
}