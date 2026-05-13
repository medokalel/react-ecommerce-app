import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Products.module.css';
import { Link } from 'react-router-dom';
import { cartContext } from '../../Context/cartContext';
import toast from 'react-hot-toast';
import ScrollToTop from '../ScrollToTop/ScrollToTop'

export default function Products() {
  let [product, setProduct] = useState([]);
  let { addProductToCart } = useContext(cartContext);

  async function addProduct(id) {
    let response = await addProductToCart(id);
    console.log('re =', response);
    if (response.data.status == 'success') {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  }

  async function getData() {
    await axios.get('https://ecommerce.routemisr.com/api/v1/products')
      .then((response) => {
        setProduct(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => { console.log('error', error); });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
  <>
    <main>
      <section className={styles.productSection}>
        <div className="container">
          <div className={styles.productContent}>
            <div className={styles.productHeader}>
              <h2>All Products</h2>
              <span>Showing 40 of 40 products</span>
            </div>
            <div className={styles.productBody}>
              <div className="row g-4">
                {product.length > 0 ? product.map((item) => (
                  <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                    <div className={styles.card}>
                      <div>
                        <Link className="text-decoration-none" to={`/productdetails/${item.id}`}>
                          <div className={styles.des}>
                            <span>-38%</span>
                          </div>
                          <div className={styles.cardImage}>
                            <img src={item.imageCover} alt={item.title} />
                          </div>
                          <div className={styles.cardBody}>
                            <h4>{item.category.name}</h4>
                            <h3>{item.title.split(' ').slice(0, 3).join(' ')}</h3>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className={styles.newPrice}>{`$${item.price}`}</span>
                                <span className={styles.price}><s>{`$${((item.price)*0.38).toFixed(0)}`}</s></span>
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
                )) : (
                  <div className={`${styles.spinner} d-flex justify-content-center align-items-center w-100`}>
                    <span className={styles.loader}></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>    
    <ScrollToTop />
  </>
  );
}