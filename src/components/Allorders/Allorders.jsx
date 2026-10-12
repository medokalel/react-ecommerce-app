import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE, authHeaders, getErrorMessage, getUserId } from "../../utils/auth";
import styles from "./Allorders.module.css";

const statusOptions = ["All Statuses", "Pending", "Paid", "Delivered"];
const sortOptions = ["Newest First", "Oldest First", "Highest Total", "Lowest Total"];

function getStatusClass(status) {
  switch (status) {
    case "Paid": return styles.statusProcessing;
    case "Delivered": return styles.statusDelivered;
    default: return styles.statusPending;
  }
}

/** Maps an order from the API to what this page renders. */
function toViewModel(order) {
  const address = order.shippingAddress || {};
  return {
    id: String(order.id ?? order._id),
    createdAt: order.createdAt,
    status: order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Pending",
    total: Number(order.totalOrderPrice) || 0,
    paymentMethod: order.paymentMethodType === "card" ? "Card" : order.paymentMethodType === "cash" ? "Cash" : "–",
    shippingAddress: [address.details, address.city].filter(Boolean).join(", ") || "–",
    phone: address.phone || "–",
    items: (order.cartItems || []).map((item) => ({
      name: item.product?.title || "Product",
      qty: item.count,
      price: Number(item.price) || 0,
      image: item.product?.imageCover,
    })),
  };
}

function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "–"
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Allorders() {
  const userId = useMemo(() => getUserId(), []);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Newest First");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    axios
      .get(`${API_BASE}/orders/user/${userId}`, { headers: authHeaders() })
      .then(({ data }) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.data || [];
        setOrders(list.map(toViewModel));
        setError("");
      })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err, "Could not load your orders.")); });
    return () => { cancelled = true; };
  }, [attempt, userId]);

  const shownError = error || (userId ? "" : "Please sign in again to see your orders.");

  const filteredOrders = useMemo(() => {
    let result = [...(orders || [])];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== "All Statuses") {
      result = result.filter(o => o.status === statusFilter);
    }
    if (sortBy === "Newest First") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "Oldest First") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "Highest Total") {
      result.sort((a, b) => b.total - a.total);
    } else if (sortBy === "Lowest Total") {
      result.sort((a, b) => a.total - b.total);
    }
    return result;
  }, [orders, search, statusFilter, sortBy]);

  function toggleDetails(orderId) {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <h1 className={styles.pageTitle}>My Orders</h1>
        <p className={styles.totalOrders}>Total orders: {orders ? orders.length : 0}</p>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by order ID or product name"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={`dropdown ${styles.dropdown}`}>
            <button
              className={styles.dropdownToggle}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <span><i className="fa-solid fa-filter me-2" style={{fontSize:12}}></i>{statusFilter}</span>
              <i className="fa-solid fa-chevron-down" style={{fontSize:10}}></i>
            </button>
            {showStatusDropdown && (
              <ul className={`dropdown-menu show ${styles.dropdownMenu}`} style={{position:"absolute", zIndex:1000}}>
                {statusOptions.map(s => (
                  <li key={s} className={styles.dropdownItem} onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={`dropdown ${styles.dropdown}`}>
            <button
              className={styles.dropdownToggle}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span>{sortBy}</span>
              <i className="fa-solid fa-chevron-down" style={{fontSize:10}}></i>
            </button>
            {showSortDropdown && (
              <ul className={`dropdown-menu show ${styles.dropdownMenu}`} style={{position:"absolute", zIndex:1000}}>
                {sortOptions.map(s => (
                  <li key={s} className={styles.dropdownItem} onClick={() => { setSortBy(s); setShowSortDropdown(false); }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {shownError ? (
          <div className="text-center py-5" role="alert">
            <p className="text-muted">{shownError}</p>
            <button className="btn btn-dark" onClick={() => { setError(""); setAttempt((n) => n + 1); }}>Try again</button>
          </div>
        ) : orders === null && userId ? (
          <div className="text-center py-5" role="status"><p className="text-muted">Loading your orders…</p></div>
        ) : null}
        <div className="row">
          {filteredOrders.map(order => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="col-12 col-md-6 col-lg-4">
                <div className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <div className={styles.orderId}>#{order.id}</div>
                      <div className={styles.orderDate}>Ordered: {formatDate(order.createdAt)}</div>
                    </div>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className={styles.productRow}>
                      <img src={item.image} alt={item.name} className={styles.productImage} />
                      <div className={styles.productInfo}>
                        <div className={styles.productName}>{item.name}</div>
                        <div className={styles.productQty}>Qty: {item.qty}</div>
                      </div>
                      <div className={styles.productPrice}>${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                  <div className={styles.orderTotalRow}>
                    <span className={styles.orderTotalLabel}>Order Total</span>
                    <span className={styles.orderTotalValue}>${order.total.toFixed(2)}</span>
                  </div>
                  <div className={styles.actionButtons}>
                    <button className={styles.btnOutline} onClick={() => toggleDetails(order.id)}>
                      View Details <i className={`fa-solid fa-chevron-${isExpanded ? "up" : "down"} ms-1`} style={{fontSize:10}}></i>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className={styles.detailsSection}>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-location-dot"></i>
                        <div>
                          <div className={styles.detailLabel}>Shipping Address</div>
                          <div className={styles.detailValue}>{order.shippingAddress}</div>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-regular fa-credit-card"></i>
                        <div>
                          <div className={styles.detailLabel}>Payment Method</div>
                          <div className={styles.detailValue}>{order.paymentMethod}</div>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-phone"></i>
                        <div>
                          <div className={styles.detailLabel}>Phone</div>
                          <div className={styles.detailValue}>{order.phone}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {orders !== null && !shownError && filteredOrders.length === 0 && (
          <div className="text-center py-5">
            <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
            <p className="text-muted">{orders.length === 0 ? "You have no orders yet." : "No orders match your filters."}</p>
          </div>
        )}
        {orders !== null && <p className={styles.footerText}>Displaying {filteredOrders.length} of {orders.length} orders</p>}
      </div>
    </div>
  );
}