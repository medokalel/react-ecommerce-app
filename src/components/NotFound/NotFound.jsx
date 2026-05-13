import React from 'react'
import styles from './NotFound.module.css';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='text-center'>
        <h2 className={styles.error}>404</h2>
        <h3 className={styles.errorMessage}>Oops! We can't find that page</h3>
        <p className={styles.p}>Looks like this page went shopping and never came back. Don't worry, we'll help you find what you're looking for!</p>
        <div className={styles.btns}>
          <Link to={'/'}>
            <button className={styles.btn1}><i className="fa-solid fa-house"></i>Go Home</button>
          </Link>
          <Link to={'/products'}>
            <button className={styles.btn2}>Browse Products</button>
          </Link>
        </div>
      </div>
    </div>
  )
}