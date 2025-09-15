export const calculateDynamicPrice = (basePrice) => {
  try {
    const visits = parseInt(localStorage.getItem('userVisits')) || 0;
    
    if (visits <= 3) {
      return basePrice * 0.95; // 5% discount for new visitors
    } else if (visits > 10) {
      return basePrice * 1.10; // 10% increase for frequent visitors
    }
    
    return basePrice; // Standard price
  } catch (error) {
    console.error('Error calculating dynamic price:', error);
    return basePrice; // Fallback to base price
  }
};