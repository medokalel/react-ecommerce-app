import React, { useContext, useEffect, useState } from 'react';
import styles from './ProductDetails.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { cartContext } from '../../Context/cartContext';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  let { id } = useParams();
  let [details, setDetails] = useState(null);
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

  async function getProductDetails() {
    await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .then((item) => {
        setDetails(item.data.data);
        console.log('API', item.data.data);
      })
      .catch((error) => { console.log(error); });
  }

  useEffect(() => {
    getProductDetails();
  }, []);

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
                    <span className={styles.rateIcon}>
                      {details.ratingsAverage == 5 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          </span>
                      ) 
                      : details.ratingsAverage < 5 && details.ratingsAverage > 4 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star-half-stroke"></i>
                        </span>
                      ) 
                      : details.ratingsAverage == 4 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                        </span>
                      ) 
                      : details.ratingsAverage < 4 && details.ratingsAverage > 3 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star-half-stroke"></i>
                          <i class="fa-regular fa-star"></i>
                        </span>
                      ) 
                      : details.ratingsAverage == 3 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                        </span>
                      )
                      : details.ratingsAverage < 3 && details.ratingsAverage > 2 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star-half-stroke"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                        </span>
                      ) 
                      : details.ratingsAverage == 2 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                        </span>
                      )
                      : details.ratingsAverage < 2 && details.ratingsAverage > 1 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star-half-stroke"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                        </span>
                      ) 
                      : details.ratingsAverage == 1 ? (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                        </span>
                      )
                      : details.ratingsAverage < 1 && details.ratingsAverage > 0 ? (
                        <span>
                          <i className="fa-solid fa-star-half-stroke"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                          <i class="fa-regular fa-star"></i>
                        </span>
                      ) 
                      : (
                        <span>
                          <i className="fa-regular fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                        </span>
                      )}
                    </span>
                    <span className={styles.rate}>{details.ratingsAverage}</span>
                  </div>
                  <div>
                    <span className={styles.newPrice}>${details.price}</span>
                    <span className={styles.price}><s>{`$${((details.price)*0.38).toFixed(0)}`}</s></span>
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