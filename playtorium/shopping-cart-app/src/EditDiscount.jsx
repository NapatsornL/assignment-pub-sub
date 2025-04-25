// ---------- EditDiscount.jsx ----------
import { useDiscount } from './discountContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditDiscount.css';

export default function EditDiscount() {
  const { discountConfig, setDiscountConfig } = useDiscount();
  const [form, setForm] = useState(discountConfig);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = () => {
    // ---- validation ----
    const required = [
      'fixedAmount',
      'percentage',
      'ontopPercent',
      'points',
      'seasonalAmount',
    ];

    // check missing / invalid
    for (const key of required) {
      const val = form[key];
      if (val === '' || isNaN(val) || parseFloat(val) < 0) {
        alert('Please enter valid numbers for every field.');
        return; // block save
      }
    }

    setDiscountConfig({
      fixedAmount:   parseFloat(form.fixedAmount),
      percentage:    parseFloat(form.percentage),
      ontopPercent:  parseFloat(form.ontopPercent),
      points:        parseFloat(form.points),
      seasonalAmount:parseFloat(form.seasonalAmount),
    });
    navigate('/');
  };

  return (
    <div className="center-screen">
      <div className="edit-card">
        <h2 className="title">✏️ Edit Discount Parameters</h2>

        {[
          { label: 'Fixed Amount Coupon ($)', name: 'fixedAmount' },
          { label: 'Percentage Coupon (%)',  name: 'percentage' },
          { label: 'OnTop Clothing (%)',     name: 'ontopPercent' },
          { label: 'Points Redeem',          name: 'points' },
          { label: 'Seasonal Amount ($)',    name: 'seasonalAmount' },
        ].map(({ label, name }) => (
          <div className="field" key={name}>
            <label>{label}</label>
            <input
              type="number"
              name={name}
              value={form[name]}
              onChange={handleChange}
              min="0"
            />
          </div>
        ))}

        <button onClick={handleSave} className="save-btn">
          💾 Save &amp; Return
        </button>
      </div>
    </div>
  );
}
