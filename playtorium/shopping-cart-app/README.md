Name : Napatsorn Luchaichana
# Shopping Cart Application

A React-based shopping cart application featuring a comprehensive discount management system. This project allows users to manage items in a shopping cart and apply various types of discounts including fixed amounts, percentages, category-specific discounts, and seasonal promotions.

## Features

- **Item Management**
  - Add/remove items with name, price, and category
  - Support for multiple item categories (Clothing, Electronics, Accessories)
  - Real-time cart total calculation

- **Discount System**
  - Fixed amount coupons
  - Percentage-based discounts
  - Category-specific discounts (e.g., special discounts on clothing)
  - Points redemption system
  - Seasonal promotions
  - Stackable discount support

- **User Interface**
  - Clean and intuitive interface
  - Real-time discount calculations
  - Discount history tracking
  - Responsive design

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd shopping-cart-app
```

2. Install dependencies:
```bash
npm install
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Project Structure

```
.
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src/
    ├── App.js                 # Main application component
    ├── discount.jsx           # Discount calculation logic
    ├── discountContext.jsx    # Discount state management
    ├── EditDiscount.jsx      # Discount configuration component
    ├── Navbar.jsx            # Navigation component
    ├── ShoppingCart.jsx      # Shopping cart component
    └── index.js              # Application entry point
```

## Usage

1. **Adding Items to Cart**
   - Enter item name, price, and category
   - Click "Add Item" button
   - Items will appear in the cart list

2. **Applying Discounts**
   - Select from available discount options:
     * Fixed amount coupons
     * Percentage discounts
     * Category-specific discounts
     * Points redemption
     * Seasonal promotions
   - Discounts can be stacked in specific orders
   - View applied discounts and final price in real-time

3. **Managing Discount Parameters**
   - Navigate to the Edit Discount page
   - Modify discount values for different types
   - Save changes to update discount calculations
