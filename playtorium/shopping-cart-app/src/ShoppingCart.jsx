import { useState } from "react";
import { useDiscount } from "./discountContext";
import "./ShoppingCart.css";

import {
  applyFixedAmountCoupon,
  applyFixedPercentageCoupon,
  percentageDiscountItemCategory,
  discountByPoints,
  specialCampaigns,
} from "./discount";

export default function ShoppingCart() {
  const { discountConfig } = useDiscount();

  const [items, setItems] = useState([
    { name: "T-shirt", price: 350, type: "Clothing" },
    { name: "Hoodie", price: 700, type: "Clothing" },
    { name: "Watch", price: 850, type: "Electronics" },
    { name: "Bag", price: 640, type: "Accessories" },
  ]);

  const [newItem, setNewItem] = useState({ name: "", price: "", type: "" });
  const [discountedPrice, setDiscounted] = useState(null);
  const [applied, setApplied] = useState({
    coupon: false,
    ontop: false,
    seasonal: false,
  });
  const [details, setDetails] = useState([]);

  const allowedTypes = ["Clothing", "Accessories", "Electronics"];

  const handleChange = (e) =>
    setNewItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addItem = () => {
    if (!newItem.name.trim() || !newItem.price || !newItem.type.trim()) {
      alert("Fill all fields");
      return;
    }
    if (!isNaN(newItem.name)) {
      alert("Name must be text");
      return;
    }
    if (isNaN(newItem.price) || +newItem.price <= 0) {
      alert("Price must be >0");
      return;
    }
    if (!allowedTypes.includes(newItem.type)) {
      alert("Type must be Clothing / Accessories / Electronics");
      return;
    }

    setItems((p) => [...p, { ...newItem, price: +newItem.price }]);
    setNewItem({ name: "", price: "", type: "" });
    resetDiscounts();
  };

  const removeItem = (name) => {
    setItems((p) => p.filter((i) => i.name !== name));
    resetDiscounts();
  };

  const total = items.reduce((s, i) => s + i.price, 0);

  const resetDiscounts = () => {
    setDiscounted(null);
    setApplied({ coupon: false, ontop: false, seasonal: false });
    setDetails([]);
  };

  const applyDiscount = (kind, fn, label) => {
    if (applied[kind]) return;
    if (kind === "ontop" && !applied.coupon) return;
    if (kind === "seasonal" && (!applied.coupon || !applied.ontop)) return;

    setDiscounted((prev) => {
      const base = prev ?? total;
      return fn(base);
    });
    setApplied((p) => ({ ...p, [kind]: true }));
    setDetails((p) => [...p, label]);
  };

  return (
    <div className="shopping-cart-container">
      {/* add item */}
      <div className="shopping-cart-inputs mb-8">
        <input
          name="name"
          value={newItem.name}
          onChange={handleChange}
          placeholder="Item name"
          className="input-field"
        />
        <input
          name="price"
          value={newItem.price}
          onChange={handleChange}
          placeholder="Item price"
          className="input-field"
          type="number"
        />
        <input
          name="type"
          value={newItem.type}
          onChange={handleChange}
          placeholder="Item type"
          className="input-field"
        />
        <button onClick={addItem} className="add-item-button">
          ➕ Add Item
        </button>
      </div>

      {/* list */}
      <ul className="shopping-cart-list mb-8">
        {items.map((it, i) => (
          <li key={i} className="shopping-cart-item">
            <div className="item-info">
              <span className="item-name">{it.name}</span>
              <span className="item-category">Category: {it.type}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-green-600 font-bold text-lg">
                ${it.price}
              </span>
              <button
                onClick={() => removeItem(it.name)}
                className="remove-item-button"
              >
                ✖
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="shopping-cart-total mb-8 text-center font-semibold">
        Original Total Price: ${total.toFixed(2)}
      </div>

      <div className="shopping-cart-coupon">
        <h3 className="text-xl font-bold mb-4">🎯 Apply Discounts</h3>

        {/* Coupon */}
        <div className="mb-6">
          <h4 className="font-bold mb-2">Coupon</h4>
          <button
            onClick={() =>
              applyDiscount(
                "coupon",
                (p) => applyFixedAmountCoupon(p, discountConfig.fixedAmount),
                `-$${discountConfig.fixedAmount} Fixed Discount`
              )
            }
            disabled={applied.coupon}
            className={`discount-btn ${
              applied.coupon
                ? "disabled bg-gray-300"
                : "bg-green-500 text-white"
            }`}
          >
            ${discountConfig.fixedAmount} Fixed
          </button>

          <button
            onClick={() =>
              applyDiscount(
                "coupon",
                (p) => applyFixedPercentageCoupon(p, discountConfig.percentage),
                `-${discountConfig.percentage}% Coupon Discount`
              )
            }
            disabled={applied.coupon}
            className={`discount-btn ${
              applied.coupon ? "disabled bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            {discountConfig.percentage}% Off
          </button>
        </div>

        {/* OnTop */}
        <div className="mb-6">
          <h4 className="font-bold mb-2">On-Top Campaign</h4>
          <button
            onClick={() =>
              applyDiscount(
                "ontop",
                (p) =>
                  percentageDiscountItemCategory(
                    items,
                    p,
                    discountConfig.ontopPercent,
                    "Clothing"
                  ),
                `-${discountConfig.ontopPercent}% Clothing Discount`
              )
            }
            disabled={applied.ontop || !applied.coupon}
            className={`discount-btn ${
              applied.ontop || !applied.coupon
                ? "disabled bg-gray-300"
                : "bg-yellow-500 text-white"
            }`}
          >
            {discountConfig.ontopPercent}% Off Clothing
          </button>

          <button
            onClick={() =>
              applyDiscount(
                "ontop",
                (p) => discountByPoints(p, discountConfig.points),
                `-${discountConfig.points} Points Redeemed`
              )
            }
            disabled={applied.ontop || !applied.coupon}
            className={`discount-btn ${
              applied.ontop || !applied.coupon
                ? "disabled bg-gray-300"
                : "bg-pink-500 text-white"
            }`}
          >
            Redeem {discountConfig.points} pts
          </button>
        </div>

        {/* Seasonal */}
        <div className="mb-6">
          <h4 className="font-bold mb-2">Seasonal Promotion</h4>
          <button
            onClick={() =>
              applyDiscount(
                "seasonal",
                (p) => specialCampaigns(p, 500, discountConfig.seasonalAmount),
                `Every $500 get $${discountConfig.seasonalAmount} off`
              )
            }
            disabled={applied.seasonal || !applied.coupon || !applied.ontop}
            className={`discount-btn ${
              applied.seasonal || !applied.coupon || !applied.ontop
                ? "disabled bg-gray-300"
                : "bg-purple-500 text-white"
            }`}
          >
            Spend $500 Get ${discountConfig.seasonalAmount} Off
          </button>
        </div>
      </div>

      {details.length > 0 && (
        <div className="discount-summary">
          <h4>🧾 Applied Discounts:</h4>
          <ul>
            {details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          {discountedPrice !== null && (
            <div className="text-green-600 font-bold text-lg mt-4">
              Discounted Total Price: ${discountedPrice.toFixed(2)}
            </div>
          )}
        </div>
      )}

      <button onClick={resetDiscounts} className="reset-button mt-8">
        🔄 Reset Discounts
      </button>
    </div>
  );
}
