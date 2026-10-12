import { useContext, useEffect, useState } from "react";
import styles from "./Cart.module.css";
import { cartContext } from "../../Context/cartContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/auth";

export default function Cart() {
  let [cart, setCart] = useState(null);
  let [error, setError] = useState('');
  let [attempt, setAttempt] = useState(0);
  let { getProductToCart, deleteProductFromCart, updateProductInCart } = useContext(cartContext);

  async function deleteProduct(id) {
    try {
      const response = await deleteProductFromCart(id);
      setCart(response.data.data);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not remove this item.'));
    }
  }

  async function updateProduct(id, count) {
    if (count < 1) return deleteProduct(id);
    try {
      const response = await updateProductInCart(id, count);
      setCart(response.data.data);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update the quantity.'));
    }
  }

  useEffect(() => {
    let cancelled = false;
    getProductToCart()
      .then(({ data }) => { if (!cancelled) { setCart(data.data); setError(''); } })
      .catch((err) => {
        if (cancelled) return;
        // A new account has no cart yet: the API answers 404, which just means "empty".
        if (err?.response?.status === 404) { setCart({ products: [], totalCartPrice: 0 }); setError(''); }
        else setError(getErrorMessage(err, 'Could not load your cart.'));
      });
    return () => { cancelled = true; };
  }, [getProductToCart, attempt]);

  const product = cart;
  const cartId = cart?._id;

  return (
    <>
    <section className={styles.cart}>
      <div className="container">
        <div className={styles.cartContent}>
          <h2>Shopping Cart</h2>
          <p>{product?.products?.length > 0 ? product?.products?.length : 0} items in your cart</p>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className={styles.leftSide}>
                {product?.products?.length > 0 ? (
                  product?.products?.map((item) => (
                    <div key={item._id} className={styles.card}>
                      <div className="row align-items-center">
                        <div className="col-3 col-md-2">
                          <img src={item?.product?.imageCover} className={styles.productImage} alt={item?.product?.title} />
                        </div>
                        <div className="col-9 col-md-4">
                          <h4 className={styles.productTitle}>
                            {item?.product?.title.split(" ").slice(0, 3).join(" ")}
                          </h4>
                          <span className={styles.productPrice}>${item?.price}</span>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className={styles.quantityControl}>
                            <button
                              onClick={() => { updateProduct(item?.product?.id, item?.count - 1); }}
                              className={styles.qtyBtn}
                              aria-label="Decrease quantity"
                            >
                              <i className="fas fa-minus" />
                            </button>
                            <span className={styles.qtyValue}>{item?.count}</span>
                            <button
                              onClick={() => { updateProduct(item?.product?.id, item?.count + 1); }}
                              className={styles.qtyBtn}
                              aria-label="Increase quantity"
                            >
                              <i className="fas fa-plus" />
                            </button>
                          </div>
                        </div>
                        <div className="col-4 col-md-2 text-end">
                          <span className={styles.itemTotal}>${(item?.price * item?.count).toFixed(1)}</span>
                        </div>
                        <div className="col-2 col-md-1 text-end">
                          <button
                            onClick={() => { deleteProduct(item?.product?.id); }}
                            className={styles.removeBtn}
                            aria-label="Remove item"
                          >
                            <i className="fa-regular fa-trash-can" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <div className={styles.emptyCart} role="alert">
                    <h3>{error}</h3>
                    <button className="btn btn-dark mt-3" onClick={() => { setError(''); setAttempt((n) => n + 1); }}>Try again</button>
                  </div>
                ) : cart === null ? (
                  <div className={styles.emptyCart} role="status">
                    <h3>Loading your cart…</h3>
                  </div>
                ) : (
                  <div className={styles.emptyCart}>
                    <h3>Your cart is empty 🛒</h3>
                    <Link to="/products" className="btn btn-dark mt-3">Browse products</Link>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className={styles.rightSide}>
                <h3>Order Summary</h3>
                <div className={styles.state}>
                  <h4>Subtotal</h4>
                  <span>${product?.totalCartPrice || 0}</span>
                </div>
                <div className={styles.state}>
                  <h4>Shipping</h4>
                  <span className={styles.free}>Free</span>
                </div>
                <hr />
                <div className={styles.total}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Total</h4>
                    <span>${product?.totalCartPrice || 0}</span>
                  </div>
                  {cartId && product?.products?.length > 0 ? (
                    <Link to={`/checkout/${cartId}`}>
                      <button>Proceed to Checkout</button>
                    </Link>
                  ) : null}
                </div>
                <div className={styles.secureCheckout}>
                  <div>
                    <i className="fa-solid fa-lock" />
                    <span> Secure Checkout</span>
                    <p>Paid on a secure hosted checkout page</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}