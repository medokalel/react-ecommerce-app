import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Brands.module.css";
import BrandSlider from '../BrandSlider/BrandSlider'
import { API_BASE, getErrorMessage } from "../../utils/auth";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("A");
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Brands come in pages: keep asking until the last page.
  useEffect(() => {
    let cancelled = false;
    async function getBrands() {
      try {
        let allBrands = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const response = await axios.get(`${API_BASE}/brands?page=${page}`);
          allBrands = [...allBrands, ...response.data.data];
          hasMore = response.data.metadata.currentPage < response.data.metadata.numberOfPages;
          page++;
        }
        if (!cancelled) { setBrands(allBrands); setError(""); }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load brands."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    getBrands();
    return () => { cancelled = true; };
  }, [attempt]);

  // Lock page scroll while the brand dialog is open.
  useEffect(() => {
    if (!selectedBrand) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selectedBrand]);

  function retry() {
    setLoading(true);
    setAttempt((n) => n + 1);
  }

  const filteredBrands = brands.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchLetter = b.name.toUpperCase().startsWith(activeLetter);
    return matchSearch && matchLetter;
  });

  function scrollToLetter(letter) {
    setActiveLetter(letter);
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function openModal(brand) {
    setSelectedBrand(brand);
  }

  function closeModal() {
    setSelectedBrand(null);
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="text-center pt-5 pb-3">
        <h1 className={styles.pageTitle}>Shop by Brand</h1>
        <p className={styles.pageSubtitle}>Discover products from your favorite brands</p>
      </div>
      <div className="container">
        <div className={styles.searchWrapper}>
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search brands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {error ? (
        <div className="text-center py-5" role="alert">
          <p className="text-muted">{error}</p>
          <button className="btn btn-dark" onClick={retry}>Try again</button>
        </div>
      ) : loading ? (
        <div className={`${styles.spinner} d-flex justify-content-center align-items-center`} style={{height:"40vh"}}>
          <span className={styles.loader}></span>
        </div>
      ) :
      (
        <>
          <BrandSlider/>
          <div className={styles.azFilter}>
            <div className="container">
              <div className={styles.azLetters}>
                {alphabet.map(letter => (
                  <button
                    key={letter}
                    className={`${styles.azLetter} ${letter === activeLetter ? styles.azLetterActive : ""}`}
                    onClick={() => scrollToLetter(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="container mt-4 pb-5">
            <h2 id={`letter-${activeLetter}`} className={styles.letterHeading}>{activeLetter}</h2>
            <div className="row g-3">
              {filteredBrands.length > 0 ? filteredBrands.map((brand) => (
                <div key={brand._id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                  <div className={styles.brandCard} onClick={() => openModal(brand)}>
                    <div className={styles.brandImage}>
                      <img src={brand.image} alt={brand.name} />
                    </div>
                    <h4 className={styles.brandName}>{brand.name}</h4>
                  </div>
                </div>
              )) : (
                <div className="text-center py-5">
                  <p className="text-muted">No brands found.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {selectedBrand && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className={styles.modalBanner}>
              <img src={selectedBrand.image} alt={selectedBrand.name} />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalHeader}>
                <div className={styles.modalBrandInfo}>
                  <div className={styles.modalBrandLogo}>
                    <img src={selectedBrand.image} alt={selectedBrand.name} />
                  </div>
                  <div>
                    <h2>{selectedBrand.name}</h2>
                  </div>
                </div>
              </div>
              <p className={styles.modalDesc}>{selectedBrand.name}</p>
              <Link to="/products" className="btn btn-dark mt-3" onClick={closeModal}>Browse products</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}