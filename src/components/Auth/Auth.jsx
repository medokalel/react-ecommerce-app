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
              <p className='lead'>Discover the latest trends in fashion. Join our community and enjoy exclusive deals, early access to new collections, and personalized shopping experiences.</p>
              <ul>
                <li><span><i className="fa-solid fa-check"></i></span>Free shipping on orders over $50</li>
                <li><span><i className="fa-solid fa-check"></i></span>30-day easy returns policy</li>
                <li><span><i className="fa-solid fa-check"></i></span>Exclusive member discounts</li>
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
