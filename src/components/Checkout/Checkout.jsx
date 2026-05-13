import React, { useState } from 'react';
import styles from './Checkout.module.css';
import { Link, useParams, useLocation  } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';

export default function Checkout() {
  let Location = useLocation();
  let price = Location.state?.price || {};
  let { cartId } = useParams();
  let [paymentMethod, setPaymentMethod] = useState('cash');
  let headers = {
    token: localStorage.getItem('userToken')
  };

  async function handleLogin(formsData) {
    console.log('formData', formsData);
    axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}`,
      { 'shippingAddress': formsData },
      {
        headers: headers,
        params: { url: 'http://localhost:5173' }
      }
    ).then((response) => {
      console.log('checkout', response);
      location.href = response.data.session.url;
    })
      .catch((error) => { console.log('error', error); });
  }

  let formik = useFormik({
    initialValues: {
      details: '',
      phone: '',
      city: '',
    },
    onSubmit: handleLogin,
  });


  return (
    <section className={styles.checkout}>
      <div className="container">
        <div className={styles.backLink}>
          <Link to="/cart">
            <i className="fa-solid fa-arrow-left"></i>
            Back to Cart
          </Link>
        </div>
        <div className={styles.header}>
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className={styles.shippingCard}>
                <div className={styles.cardTitle}>
                  <span className={styles.iconCircle}>
                    <i className="fa-solid fa-truck"></i>
                  </span>
                  <h3>Shipping Information</h3>
                </div>
                <div className={styles.formGroup}>
                  <label>Details <span className={styles.required}>*</span></label>
                  <div className={styles.inputWrapper}>
                    <i className="fa-regular fa-user"></i>
                    <input
                      type="text"
                      name="details"
                      placeholder="Enter your full name and address details"
                      value={formik.values.details}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Phone <span className={styles.required}>*</span></label>
                  <div className={styles.inputWrapper}>
                    <i className="fa-solid fa-phone"></i>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-12">
                    <div className={styles.formGroup}>
                      <label>City <span className={styles.required}>*</span></label>
                      <div className={styles.inputWrapper}>
                        <i className="fa-solid fa-location-dot"></i>
                        <input
                          type="text"
                          name="city"
                          placeholder="New York"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.paymentCard}>
                <div className={styles.cardTitle}>
                  <span className={styles.iconCircle}>
                    <i className="fa-regular fa-credit-card"></i>
                  </span>
                  <h3>Payment Method</h3>
                </div>
                <div
                  className={`${styles.paymentOption} ${paymentMethod === 'cash' ? styles.active : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className={styles.radioWrapper}>
                    <div className={styles.radio}>
                      {paymentMethod === 'cash' && <div className={styles.radioInner}></div>}
                    </div>
                    <div className={styles.paymentInfo}>
                      <h4>Credit / Debit Card</h4>
                      <p>Pay securely with your cash</p>
                    </div>
                  </div>
                  <i className="fa-regular fa-credit-cash"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className={styles.summaryCard}>
                <h3>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${price?.totalCartPrice}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={styles.free}>Free</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax (8%)</span>
                  <span>${(price?.totalCartPrice * 0.08).toFixed(2) || 0}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${((price?.totalCartPrice || 0) * 1.08).toFixed(2)}</span>
                </div>
                <button type="submit" className={styles.placeOrderBtn}>Place Order</button>
                <div className={styles.secureNote}>
                  <div>
                    <i className="fa-solid fa-shield-halved"></i>
                    <span> Secure Checkout</span>
                    <p>Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}