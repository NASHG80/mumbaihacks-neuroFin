export const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0";
  
  const absValue = Math.abs(value);
  
  if (absValue >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  } else if (absValue >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  } else if (absValue >= 1000) {
    return `₹${(value / 1000).toFixed(0)}k`;
  } else {
    return `₹${value}`;
  }
};
