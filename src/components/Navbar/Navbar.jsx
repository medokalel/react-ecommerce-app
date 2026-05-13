import React, { useContext } from 'react';
import styles from './Navbar.module.css';
import { Link, NavLink } from 'react-router-dom';
import { userContext } from '../../Context/userContext';
import { cartContext } from '../../Context/cartContext';

export default function MyNavbar() {
  let { isLogin, setLogin } = useContext(userContext);
  let { cartNumber } = useContext(cartContext);

  function LogOut() {
    localStorage.removeItem('userToken');
    setLogin(null);
  }

  return (
    <header>
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container">
          <Link to={''} className={`navbar-brand ${styles.brand}`}>FashionStore</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {isLogin ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className={`nav-link ${styles.navLink}`} to={''}>Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={`nav-link ${styles.navLink}`} to={'products'}>Products</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={`nav-link ${styles.navLink}`} to={'brands'}>Brands</NavLink>
                </li>
              </ul>
            ) : null}
            <div className={`mx-auto ${styles.inputGroup}`}>
              <span className={styles.searchIcon}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input className={styles.searchInput} type="search" placeholder="Search products..." name="search" />
            </div>
            <div className={`d-flex align-items-center gap-3 ${styles.navRight}`}>
              {!isLogin ? (
                <div className='d-flex gap-2'>
                  <Link to={'/auth/signup'}>
                    <button className={styles.btnAuth}>
                      <span><i className="fa-regular fa-registered"></i></span>
                      Register
                    </button>
                  </Link>
                  <Link to={'/auth'}>
                    <button className={styles.btnAuth}>
                      <span><i className="fa-solid fa-arrow-right-to-bracket"></i></span>
                      Login
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <span className={styles.cartWrapper}>
                    <Link to={'/cart'}>
                      <span className={styles.cartBadge}>{cartNumber}</span>
                      <i className="fa-solid fa-cart-shopping"></i>
                    </Link>
                  </span>
                  <Link onClick={() => { LogOut(); }} to={'auth'}>
                    <button className={styles.btnAuth}>
                      <span><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                      Log Out
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}