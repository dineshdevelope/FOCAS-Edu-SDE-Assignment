const trackVisit = (req, res, next) => {
  // Get visit count from cookie or set to 0
  let visitCount = parseInt(req.cookies.visitCount) || 0;
  visitCount += 1;
  
  // Set cookie with updated visit count
  res.cookie('visitCount', visitCount, { 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true 
  });
  
  // Add visit count to request object for dynamic pricing
  req.visitCount = visitCount;
  next();
};

export default trackVisit;