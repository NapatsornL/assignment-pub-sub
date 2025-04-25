import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import ShoppingCart from './ShoppingCart';
import EditDiscount from './EditDiscount';
import { DiscountProvider } from './discountContext';

export default function App() {
  return (
    <DiscountProvider>
      <Router>
        <Navbar />
        <div className="app-wrapper p-6">
          <Routes>
            <Route path="/" element={<ShoppingCart />} />
            <Route path="/edit-discount" element={<EditDiscount />} />
          </Routes>
        </div>
      </Router>
    </DiscountProvider>
  );
}
