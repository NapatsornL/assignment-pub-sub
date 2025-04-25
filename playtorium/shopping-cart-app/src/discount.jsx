// Coupon functions

export const applyFixedAmountCoupon = (totalPrice, amount) => {
    return Math.max(totalPrice - amount, 0);
  };
  
  export const applyFixedPercentageCoupon = (totalPrice, percentage) => {
    return Math.max(totalPrice - (totalPrice * percentage / 100), 0);
  };
  
// OnTop functions
export const percentageDiscountItemCategory = (items, totalPrice, percentage, category) => {
    let sameTypeTotal = 0;
    for (let item of items) {
      if (item.type === category) {
        sameTypeTotal += item.price;
      }
    }
    return Math.max(totalPrice - (sameTypeTotal * (percentage / 100)), 0);
  };
  
export const discountByPoints = (totalPrice, points) => {
    if (totalPrice * 0.2 <= points) {
      return Math.max(totalPrice * 0.8, 0);
    }
    return Math.max(totalPrice - points, 0);
  };
  
//  Seasonal function

export const specialCampaigns = (totalPrice, price, discount) => {
    const rounds = Math.floor(totalPrice / price);
    return Math.max(totalPrice - (rounds * discount), 0);
  };
  