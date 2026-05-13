import React, { useState, useMemo } from "react";
import styles from "./Allorders.module.css";

const ordersData = [
  {
    id: "ORD-2024-004",
    orderedDate: "Apr 22, 2024",
    estimatedDate: "Apr 27, 2024",
    deliveredDate: null,
    status: "Pending",
    shippingAddress: "321 Elm St, Manhattan, NY 10002",
    paymentMethod: "Visa ending in 9999",
    trackingNumber: "Pending",
    items: [
      { name: "Bluetooth Speaker", qty: 1, price: 79.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop" }
    ]
  },
  {
    id: "ORD-2024-003",
    orderedDate: "Apr 20, 2024",
    estimatedDate: "Apr 25, 2024",
    deliveredDate: null,
    status: "Processing",
    shippingAddress: "456 Oak Ave, Brooklyn, NY 11201",
    paymentMethod: "Mastercard ending in 4444",
    trackingNumber: "TRK-2024-003-XYZ",
    items: [
      { name: "Laptop Sleeve", qty: 1, price: 49.99, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&h=100&fit=crop" }
    ]
  },
  {
    id: "ORD-2024-002",
    orderedDate: "Apr 18, 2024",
    estimatedDate: "Apr 23, 2024",
    deliveredDate: null,
    status: "Shipped",
    shippingAddress: "789 Pine Rd, Queens, NY 11375",
    paymentMethod: "Amex ending in 1234",
    trackingNumber: "TRK-2024-002-ABC",
    items: [
      { name: "Smart Watch", qty: 1, price: 299.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
      { name: "Watch Band", qty: 2, price: 29.99, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100&h=100&fit=crop" }
    ]
  },
  {
    id: "ORD-2024-001",
    orderedDate: "Apr 15, 2024",
    estimatedDate: null,
    deliveredDate: "Apr 20, 2024",
    status: "Delivered",
    shippingAddress: "123 Maple St, Bronx, NY 10451",
    paymentMethod: "Visa ending in 8888",
    trackingNumber: "TRK-2024-001-DEF",
    items: [
      { name: "Wireless Headphones", qty: 1, price: 129.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" }
    ]
  },
  {
    id: "ORD-2024-005",
    orderedDate: "Mar 10, 2024",
    estimatedDate: "Mar 15, 2024",
    deliveredDate: null,
    status: "Cancelled",
    shippingAddress: "555 Cedar Ln, Staten Island, NY 10301",
    paymentMethod: "PayPal",
    trackingNumber: "N/A",
    items: [
      { name: "Gaming Mouse", qty: 1, price: 89.99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop" }
    ]
  }
];

function getStatusClass(status) {
  switch (status) {
    case "Pending": return styles.statusPending;
    case "Processing": return styles.statusProcessing;
    case "Shipped": return styles.statusShipped;
    case "Delivered": return styles.statusDelivered;
    case "Cancelled": return styles.statusCancelled;
    default: return styles.statusPending;
  }
}

function getOrderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
}

export default function Allorders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Newest First");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const statusOptions = ["All Statuses", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const sortOptions = ["Newest First", "Oldest First", "Highest Total", "Lowest Total"];

  const filteredOrders = useMemo(() => {
    let result = [...ordersData];
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
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === "Oldest First") {
      result.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortBy === "Highest Total") {
      result.sort((a, b) => parseFloat(getOrderTotal(b)) - parseFloat(getOrderTotal(a)));
    } else if (sortBy === "Lowest Total") {
      result.sort((a, b) => parseFloat(getOrderTotal(a)) - parseFloat(getOrderTotal(b)));
    }
    return result;
  }, [search, statusFilter, sortBy]);

  function toggleDetails(orderId) {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <h1 className={styles.pageTitle}>My Orders</h1>
        <p className={styles.totalOrders}>Total orders: {filteredOrders.length}</p>
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
        <div className="row">
          {filteredOrders.map(order => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="col-12 col-md-6 col-lg-4">
                <div className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <div className={styles.orderId}>
                        {order.id}
                        <i className={`fa-regular fa-copy ${styles.copyIcon}`} title="Copy"></i>
                      </div>
                      <div className={styles.orderDate}>Ordered: {order.orderedDate}</div>
                      {order.estimatedDate && <div className={styles.orderDate}>Estimated: {order.estimatedDate}</div>}
                      {order.deliveredDate && <div className={styles.orderDate}>Delivered: {order.deliveredDate}</div>}
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
                    <span className={styles.orderTotalValue}>${getOrderTotal(order)}</span>
                  </div>
                  <div className={styles.actionButtons}>
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button className={styles.btnTrack}>
                        <i className="fa-solid fa-truck-fast me-1"></i> Track Order
                      </button>
                    )}
                    <button className={styles.btnOutline} onClick={() => toggleDetails(order.id)}>
                      View Details <i className={`fa-solid fa-chevron-${isExpanded ? "up" : "down"} ms-1`} style={{fontSize:10}}></i>
                    </button>
                    <button className={styles.btnOutline}>Reorder</button>
                    {order.status === "Pending" && (
                      <button className={styles.btnCancel}>Cancel</button>
                    )}
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
                        <i className="fa-solid fa-truck"></i>
                        <div>
                          <div className={styles.detailLabel}>Tracking Number</div>
                          <div className={styles.detailValue}>{order.trackingNumber}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-5">
            <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
            <p className="text-muted">No orders found.</p>
          </div>
        )}
        <p className={styles.footerText}>Displaying {filteredOrders.length} of {filteredOrders.length} orders</p>
      </div>
    </div>
  );
}