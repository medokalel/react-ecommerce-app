import React from 'react'
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer'
import styles from './Home.module.css';
import classNames from "classnames";
import CategorySlider from '../CategorySlider/CategorySlider';


export default function Home() {
  return (
    <>
    <main>
      <section className={styles.heroSection}>
        <div className={`${styles.heroInfo} container`}>
          <div className="row">
            <div className="col-lg-6">
              <h2>Summer Sale <br /> <span>Up to 70% Off</span></h2>
              <p>Discover the latest trends in fashion. Exclusive deals on clothing, shoes, and accessories.</p>
              <div className={styles.btns}>
                <Link to={'/products'}>
                  <button className={styles.btn1}>Shop Now</button>
                </Link>
                <Link to={'/products'}>
                  <button className={styles.btn2}>View Collection</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CategorySlider/>
      <section className={styles.categorySection}>
        <div className={styles.categoryContent}>
          <div className={styles.categoryHeader}>
            <h2>Shop by Category</h2>
            <span>Explore our curated collections</span>
          </div>
          <div className={`row g-3 ${styles.categoryCards}`}>
            <div className="col-lg-4">
              <Link className='text-decoration-none' to={'/products'}>
                <div className={styles.card}>
                  <div className={classNames(styles.cardIcon ,styles.icon1) }>
                    <span><i class="fa-solid fa-shirt"></i></span>
                  </div>
                  <div className={styles.des}>
                    <h3>Clothing</h3>
                    <p>Trendy apparel for every occasion</p>
                  </div>
                </div>              
              </Link>
            </div>
            <div className="col-lg-4">
              <Link className='text-decoration-none' to={'/products'}>
                <div className={styles.card}>
                  <div className={classNames(styles.cardIcon ,styles.icon2)}>
                    <span><i class="fa-solid fa-shoe-prints"></i></span>
                  </div>
                  <div className={styles.des}>
                    <h3>Shoes</h3>
                    <p>Step into style and comfort</p>
                  </div>
                </div>              
              </Link>
            </div>
            <div className="col-lg-4">
              <Link className='text-decoration-none' to={'/products'}>
                <div className={styles.card}>
                  <div className={classNames(styles.cardIcon ,styles.icon3)}>
                    <span><i class="fa-solid fa-display"></i></span>
                  </div>
                  <div className={styles.des}>
                    <h3>Electronics</h3>
                    <p>Complete your perfect look</p>
                  </div>
                </div>              
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
