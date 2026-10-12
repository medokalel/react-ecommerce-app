import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <section className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className={styles.column1}>
                <h2 className={styles.footerLogo}>FashionStore</h2>
                <p>A demo store built for practice. Products come from a public practice API and no real orders are placed.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className={styles.column2}>
                <h3>Shop</h3>
                <ul className="list-unstyled">
                  <li><Link className="text-decoration-none" to="/products">Products</Link></li>
                  <li><Link className="text-decoration-none" to="/brands">Brands</Link></li>
                  <li><Link className="text-decoration-none" to="/cart">Cart</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className={styles.column3}>
                <h3>Project</h3>
                <ul className="list-unstyled">
                  <li><a className="text-decoration-none" href="https://github.com/medokalel/react-ecommerce-app" target="_blank" rel="noopener noreferrer">Source on GitHub</a></li>
                  <li><a className="text-decoration-none" href="https://github.com/medokalel" target="_blank" rel="noopener noreferrer">Built by Mohamed Khalil</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 FashionStore demo project</p>
        </div>
      </section>
    </footer>
  )
}
