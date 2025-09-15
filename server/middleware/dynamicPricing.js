const applyDynamicPricing = (req, res, next) => {
  // This middleware will be applied to product routes
  // It will modify product prices based on user visit count
  
  const originalJson = res.json;
  
  res.json = function(data) {
    if (data && data.products) {
      // Apply dynamic pricing to products
      data.products = data.products.map(product => {
        const dynamicPrice = calculateDynamicPrice(product.basePrice, req.visitCount);
        return {
          ...product.toObject ? product.toObject() : product,
          price: dynamicPrice,
          originalPrice: product.basePrice
        };
      });
    } else if (data && data.product) {
      // Apply dynamic pricing to single product
      const dynamicPrice = calculateDynamicPrice(data.product.basePrice, req.visitCount);
      data.product = {
        ...data.product.toObject ? data.product.toObject() : data.product,
        price: dynamicPrice,
        originalPrice: data.product.basePrice
      };
    }
    
    originalJson.call(this, data);
  };
  
  next();
};

// Dynamic pricing logic
function calculateDynamicPrice(basePrice, visitCount) {
  // First 3 visits: 5% discount to encourage purchase
  if (visitCount <= 3) {
    return basePrice * 0.95;
  }
  // 4-10 visits: standard price
  else if (visitCount <= 10) {
    return basePrice;
  }
  // 10+ visits: 10% increase (assume high interest)
  else {
    return basePrice * 1.10;
  }
}

export default applyDynamicPricing;