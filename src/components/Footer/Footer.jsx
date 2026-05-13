import React from 'react'
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <section className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className="row">
            <div className='col-lg-3 col-md-6'>
              <div className={styles.column1}>
                <h2 className={styles.footerLogo}>FashionStore</h2>
                <p>Your destination for the latest fashion trends.</p>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className={styles.column2}>
                <h3>shop</h3>
                <ul className='list-unstyled'>
                  <li><Link className='text-decoration-none' to={'#'}>Clothing</Link></li>
                  <li><Link className='text-decoration-none' to={'#'}>Shoes</Link></li>
                  <li><Link className='text-decoration-none' to={'#'}>Accessories</Link></li>
                  <li><Link className='text-decoration-none' to={'#'}>sale</Link></li>
                </ul>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className={styles.column3}>
                <h3>Support</h3>
                <ul className='list-unstyled'>
                  <li><Link className='text-decoration-none' to={'#'}>Contact Us</Link></li>
                  <li><Link className='text-decoration-none' to={'#'}>FAQs</Link></li>
                  <li><Link className='text-decoration-none' to={'#'}>Shipping</Link></li>
                  <li><Link className='text-decoration-none' to={'#'}>Returns</Link></li>
                </ul>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className={styles.column4}>
                <h3>Company</h3>
                <ul className='list-unstyled'>
                  <li><Link className='text-decoration-none' to={'#'}>About Us</Link></li>
                  <li><Link className='text-decoration-none' to={'#'}>Careers</Link></li>
                  <li><Link className='text-decoration-none' to={'#'}>Privacy Policy</Link></li>
                  <li><Link className='text-decoration-none' to={'# '}>Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class={styles.footerBottom}>
          <p>© 2026 FashionStore. All rights reserved.</p>
        </div>
      </section>
    </footer>
  )
}
