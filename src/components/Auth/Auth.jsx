import React from 'react'
import styles from './Auth.module.css';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function Auth() {
  return (
    <>
    <section>
      <div className={styles.loginContent}>
        <div className={styles.leftSide}>
          <div className={styles.leftSideContent}>
            <div className={styles.backHome}>
              <Link to={'/'}><span><i className="fa-solid fa-arrow-left"></i></span>Back to Home</Link>
            </div>
            <div>
              <h1>Welcome to FashionStore</h1>
              <p className='lead'>A demo store built for practice. Create an account to browse products, fill a cart and try the checkout flow. No real orders are placed.</p>
              <ul>
                <li><span><i className="fa-solid fa-check"></i></span>Browse products and brands</li>
                <li><span><i className="fa-solid fa-check"></i></span>Add items to your cart and manage quantities</li>
                <li><span><i className="fa-solid fa-check"></i></span>Pay by card through a secure hosted checkout</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <Outlet></Outlet>
        </div>
      </div>
    </section>
    </>
  )
}
