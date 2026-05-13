import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Brands.module.css";
import BrandSlider from '../BrandSlider/BrandSlider'

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const categories = ["All Brands", "Fashion", "Electronics", "Beauty", "Home", "Sports", "Kids"];

const topProducts = [
  { name: "Headphones Pro", price: 199.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop" },
  { name: "Wireless Buds", price: 149.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&h=150&fit=crop" },
  { name: "Noise Cancel", price: 299.99, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=150&h=150&fit=crop" },
  { name: "Studio Max", price: 349.99, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&h=150&fit=crop" },
];

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Brands");
  const [activeLetter, setActiveLetter] = useState("A");
  const [selectedBrand, setSelectedBrand] = useState(null);

  async function getBrands() {
    setLoading(true);
    try {
      let allBrands = [];
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/brands?page=${page}`);
        allBrands = [...allBrands, ...response.data.data];
        hasMore = response.data.metadata.currentPage < response.data.metadata.numberOfPages;
        page++;
      }
      setBrands(allBrands);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBrands();
  }, []);

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
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setSelectedBrand(null);
    document.body.style.overflow = "auto";
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
      {loading ? (
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
          <div className="container mt-4">
            <div className={styles.categoryTabs}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.categoryTab} ${cat === activeCategory ? styles.categoryTabActive : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
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
      <div className={styles.newsletter}>
        <div className="text-center">
          <i className={`fa-solid fa-arrow-trend-up ${styles.newsletterIcon}`}></i>
          <h3>New Brands Added Weekly</h3>
          <p>Subscribe to get notified about the latest brand partnerships</p>
          <form className={styles.newsletterForm}>
            <div className={styles.emailInputWrapper}>
              <i className="fa-regular fa-envelope"></i>
              <input type="email" placeholder="Enter your email" required/>
            </div>
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
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
                    <div className={styles.modalMeta}>
                      <span className={styles.modalCategory}>Electronics</span>
                      <span className={styles.modalProducts}>120 Products</span>
                    </div>
                  </div>
                </div>
                <button className={styles.followBtn}>
                  <i className="fa-regular fa-bell"></i> Follow Brand
                </button>
              </div>
              <p className={styles.modalDesc}>Discover amazing products from {selectedBrand.name}</p>
              <div className={styles.modalProductsSection}>
                <div className={styles.modalSectionHeader}>
                  <h4>Top Products</h4>
                  <a href="#" className={styles.seeAll}>See All</a>
                </div>
                <div className={styles.modalProductsGrid}>
                  {topProducts.map((product, idx) => (
                    <div key={idx} className={styles.modalProductCard}>
                      <img src={product.image} alt={product.name} />
                      <span className={styles.modalProductName}>{product.name}</span>
                      <span className={styles.modalProductPrice}>${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}