document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkout-form');
  const citySelect = document.getElementById('shipping-city');
  const shippingCostDisplay = document.getElementById('shipping-cost-display');
  const totalAmountDisplay = document.getElementById('total-amount-display');
  const submitBtn = document.getElementById('submit-btn');
  const submitBtnText = submitBtn.querySelector('.btn-text');
  const submitBtnSpinner = submitBtn.querySelector('.spinner');
  
  const formContainer = document.querySelector('.checkout-form-container');
  const successCard = document.getElementById('success-message');
  const successOrderId = document.getElementById('success-order-id');
  const successDeliveryTime = document.getElementById('success-delivery-time');
  const successTotalAmount = document.getElementById('success-total-amount');
  const orderAnotherBtn = document.getElementById('order-another-btn');
  
  const basePrice = 4499;
  let shippingCost = 0;
  
  // Shipping Cost Config
  const shippingRates = {
    'Dhaka': 60,
    'Chittagong': 120,
    'Sylhet': 120,
    'Rajshahi': 120,
    'Khulna': 120,
    'Barisal': 120,
    'Rangpur': 120,
    'Mymensingh': 120,
    'Outside': 150
  };

  // Update totals based on selected district
  citySelect.addEventListener('change', () => {
    const selectedCity = citySelect.value;
    shippingCost = shippingRates[selectedCity] || 0;
    
    // Display values
    shippingCostDisplay.textContent = `৳${shippingCost}`;
    const totalAmount = basePrice + shippingCost;
    totalAmountDisplay.textContent = `৳${totalAmount.toLocaleString('en-US')}`;
    
    // Update button text
    submitBtnText.textContent = `Confirm Order (৳${totalAmount.toLocaleString('en-US')})`;
  });

  // Handle Checkout Form Submission
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Fetch values
    const name = document.getElementById('customer-name').value.trim();
    const phoneInput = document.getElementById('customer-phone').value.trim();
    const phone = `+880${phoneInput}`;
    const district = citySelect.value;
    const address = document.getElementById('customer-address').value.trim();
    const notes = document.getElementById('order-notes').value.trim();
    
    if (!name || !phoneInput || !district || !address) {
      alert('Please fill in all required fields.');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtnText.classList.add('hidden');
    submitBtnSpinner.classList.remove('hidden');
    
    // Simulate server request delay
    setTimeout(() => {
      // Generate Order Details
      const timestamp = new Date().toISOString();
      const orderId = `HY-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalAmount = basePrice + shippingCost;
      
      const newOrder = {
        id: orderId,
        date: timestamp,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        customerDistrict: district,
        notes: notes,
        product: "Magcubic HY 300 Smart Projector",
        price: basePrice,
        shipping: shippingCost,
        total: totalAmount,
        status: "Pending" // Status options: Pending, Processing, Shipped, Delivered, Cancelled
      };

      // Retrieve existing orders from localStorage
      let orders = JSON.parse(localStorage.getItem('magcubic_orders')) || [];
      orders.unshift(newOrder); // Add new order to the start of the list
      localStorage.setItem('magcubic_orders', JSON.stringify(orders));

      // Hide form, show success
      formContainer.classList.add('hidden');
      successCard.classList.remove('hidden');
      
      // Populate success card
      successOrderId.textContent = `#${orderId}`;
      successTotalAmount.textContent = `৳${totalAmount.toLocaleString('en-US')}`;
      successDeliveryTime.textContent = district === 'Dhaka' ? 'Within 24 Hours' : 'Within 2-3 Days';
      
      // Reset button loading state
      submitBtn.disabled = false;
      submitBtnText.classList.remove('hidden');
      submitBtnSpinner.classList.add('hidden');
      
      // Scroll to pricing card smoothly
      document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  });

  // Handle Order Another Button click
  orderAnotherBtn.addEventListener('click', () => {
    // Reset form
    checkoutForm.reset();
    shippingCost = 0;
    shippingCostDisplay.textContent = '৳0';
    totalAmountDisplay.textContent = `৳${basePrice.toLocaleString('en-US')}`;
    submitBtnText.textContent = `Confirm Order (৳${basePrice.toLocaleString('en-US')})`;
    
    // Toggle views
    successCard.classList.add('hidden');
    formContainer.classList.remove('hidden');
    
    // Scroll to section
    document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth' });
  });

  // "Order Now" quick scrolls
  const quickScrolls = document.querySelectorAll('.trigger-checkout');
  quickScrolls.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Interactive Thumbnail Gallery
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const mainImg = document.getElementById('gallery-main-img');
  const galleryBadge = document.getElementById('gallery-badge');
  
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Remove active class from all thumbnails
      thumbs.forEach(t => t.classList.remove('active'));
      // Add active to clicked thumbnail
      thumb.classList.add('active');
      // Set main image source
      mainImg.src = thumb.getAttribute('data-target');
      // Set descriptive badge
      galleryBadge.textContent = thumb.getAttribute('data-badge');
    });
  });
});
