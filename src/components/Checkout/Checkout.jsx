import { useContext, useEffect, useState } from 'react';
import styles from './Checkout.module.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { cartContext } from '../../Context/cartContext';
import { API_BASE, authHeaders, getErrorMessage } from '../../utils/auth';

const validation = Yup.object({
  details: Yup.string().trim().min(8, 'Enter your full address details').required('Address details are required'),
  phone: Yup.string().required('Phone is required').matches(/^01[0125][0-9]{8}$/, 'Enter a valid Egyptian mobile number'),
  city: Yup.string().trim().required('City is required'),
});

export default function Checkout() {
  const { cartId } = useParams();
  const { getProductToCart } = useContext(cartContext);
  const [total, setTotal] = useState(null);

  // The total comes from the cart itself, so the page also works after a refresh or when opened directly.
  useEffect(() => {
    let cancelled = false;
    getProductToCart()
      .then(({ data }) => { if (!cancelled) setTotal(data.data.totalCartPrice); })
      .catch(() => { /* the summary just stays empty; placing the order still works */ });
    return () => { cancelled = true; };
  }, [getProductToCart]);

  async function handleCheckout(shippingAddress) {
    try {
      const response = await axios.post(
        `${API_BASE}/orders/checkout-session/${cartId}`,
        { shippingAddress },
        {
          headers: authHeaders(),
          // Where the payment page sends the customer back to: this site, wherever it is deployed.
          params: { url: window.location.origin },
        },
      );
      window.location.href = response.data.session.url;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not start the checkout. Please try again.'));
    }
  }

  const formik = useFormik({
    initialValues: { details: '', phone: '', city: '' },
    validationSchema: validation,
    onSubmit: handleCheckout,
  });

  const field = (name) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    'aria-invalid': Boolean(formik.touched[name] && formik.errors[name]),
  });
  const fieldError = (name) =>
    formik.touched[name] && formik.errors[name] ? (
      <div className="text-danger small mt-1" role="alert">{formik.errors[name]}</div>
    ) : null;

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
        <form onSubmit={formik.handleSubmit} noValidate>
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
                  <label htmlFor="details">Details <span className={styles.required}>*</span></label>
                  <div className={styles.inputWrapper}>
                    <i className="fa-regular fa-user"></i>
                    <input id="details" type="text" placeholder="Street, building and apartment" autoComplete="street-address" {...field('details')} />
                  </div>
                  {fieldError('details')}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone <span className={styles.required}>*</span></label>
                  <div className={styles.inputWrapper}>
                    <i className="fa-solid fa-phone"></i>
                    <input id="phone" type="tel" placeholder="01xxxxxxxxx" autoComplete="tel" {...field('phone')} />
                  </div>
                  {fieldError('phone')}
                </div>
                <div className="row g-3">
                  <div className="col-md-12">
                    <div className={styles.formGroup}>
                      <label htmlFor="city">City <span className={styles.required}>*</span></label>
                      <div className={styles.inputWrapper}>
                        <i className="fa-solid fa-location-dot"></i>
                        <input id="city" type="text" placeholder="Cairo" autoComplete="address-level2" {...field('city')} />
                      </div>
                      {fieldError('city')}
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
                <div className={`${styles.paymentOption} ${styles.active}`}>
                  <div className={styles.radioWrapper}>
                    <div className={styles.radio}>
                      <div className={styles.radioInner}></div>
                    </div>
                    <div className={styles.paymentInfo}>
                      <h4>Credit / Debit Card</h4>
                      <p>You will pay on a secure Stripe-hosted page, then come back to your orders.</p>
                    </div>
                  </div>
                  <i className="fa-regular fa-credit-card"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className={styles.summaryCard}>
                <h3>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{total === null ? '…' : `$${total}`}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={styles.free}>Free</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{total === null ? '…' : `$${total}`}</span>
                </div>
                <button type="submit" className={styles.placeOrderBtn} disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Redirecting to payment…' : 'Place Order'}
                </button>
                <div className={styles.secureNote}>
                  <div>
                    <i className="fa-solid fa-shield-halved"></i>
                    <span> Secure Checkout</span>
                    <p>Card details are entered on the payment page, never on this site.</p>
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
