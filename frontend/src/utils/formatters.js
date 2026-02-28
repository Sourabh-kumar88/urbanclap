// Format time from 24-hour (HH:mm) to 12-hour AM/PM format
export const formatTime12Hour = (time24) => {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};

// Format currency to Indian Rupees
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '';
  return `₹${amount.toLocaleString('en-IN')}`;
};
