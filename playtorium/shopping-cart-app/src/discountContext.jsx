import { createContext, useContext, useState } from 'react';

const DiscountContext = createContext();

export const DiscountProvider = ({ children }) => {
  const [discountConfig, setDiscountConfig] = useState({
    fixedAmount: 100,
    percentage: 10,
    ontopPercent: 10,
    points: 100,
    seasonalAmount: 50
  });

  return (
    <DiscountContext.Provider value={{ discountConfig, setDiscountConfig }}>
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscount = () => useContext(DiscountContext);

