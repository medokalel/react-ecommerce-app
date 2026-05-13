import React, { useContext, useEffect, useState } from "react";
import styles from "./Cart.module.css";
import { cartContext } from "../../Context/cartContext";
import { Link } from "react-router-dom";
import Checkout from "../Checkout/Checkout";

export default function Cart() {
  let [price, setPrice] = useState({})
  let [cartId, setCartId] = useState(null);
  let [product, setProduct] = useState({});
  let { getProductToCart, deleteProductFromCart, updateProductInCart } = useContext(cartContext);

  async function deleteProduct(id) {
    console.log(id);
    let response = await deleteProductFromCart(id);
    setProduct(response?.data?.data);
    setPrice(response?.data?.data);
  }

  async function updateProduct(Id, count) {
    let response = await updateProductInCart(Id, count);
    console.log("response", response?.data?.data);
    setProduct(response?.data?.data);
    setPrice(response?.data?.data);

  }

  useEffect(() => {
    async function fetchCartProduct() {
      let { data } = await getProductToCart();
      console.log('cart', data.data);
      setCartId(data?.data._id);
      setProduct(data?.data);
      setPrice(data?.data);
    }
    fetchCartProduct();
  }, [getProductToCart]);

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
                            >
                              <i className="fas fa-minus" />
                            </button>
                            <span className={styles.qtyValue}>{item?.count}</span>
                            <button
                              onClick={() => { updateProduct(item?.product?.id, item?.count + 1); }}
                              className={styles.qtyBtn}
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
                          >
                            <i className="fa-regular fa-trash-can" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyCart}>
                    <h3>Your cart is empty 🛒</h3>
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
                <div className={styles.state}>
                  <h4>Tax (8%)</h4>
                  <span>${(product?.totalCartPrice * 0.08).toFixed(2) || 0}</span>
                </div>
                <hr />
                <div className={styles.total}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Total</h4>
                    <span>${((product?.totalCartPrice || 0) * 1.08).toFixed(2)}</span>
                  </div>
                  <Link to={`/checkout/${cartId}`} state={{price: price}}>
                    <button>Proceed to Checkout</button>
                  </Link>
                </div>
                <div className={styles.promoCode}>
                  <p>Have a promo code?</p>
                  <div className={styles.promoInput}>
                    <input type="text" placeholder="Enter code" />
                    <button>Apply</button>
                  </div>
                </div>
                <div className={styles.secureCheckout}>
                  <div>
                    <i className="fa-solid fa-lock" />
                    <span> Secure Checkout</span>
                    <p>SSL Encrypted Payment</p>
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