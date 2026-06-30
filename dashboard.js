document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tableBody = document.getElementById('orders-table-body');
  const searchInput = document.getElementById('search-input');
  const filterStatus = document.getElementById('filter-status');
  const filterDistrict = document.getElementById('filter-district');
  const btnClearFilters = document.getElementById('btn-clear-filters');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnAddMock = document.getElementById('btn-add-mock');
  
  // Stats Elements
  const statTotal = document.getElementById('stat-total-orders');
  const statPending = document.getElementById('stat-pending-orders');
  const statRevenue = document.getElementById('stat-total-revenue');
  const statShipping = document.getElementById('stat-shipping-fees');

  // Modal Elements
  const detailsModal = document.getElementById('details-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalTitleId = document.getElementById('modal-title-id');
  const modalCustName = document.getElementById('modal-cust-name');
  const modalCustPhone = document.getElementById('modal-cust-phone');
  const modalCustDistrict = document.getElementById('modal-cust-district');
  const modalCustAddress = document.getElementById('modal-cust-address');
  const modalOrderNotes = document.getElementById('modal-order-notes');
  const modalProductPrice = document.getElementById('modal-product-price');
  const modalShippingCost = document.getElementById('modal-shipping-cost');
  const modalTotalAmount = document.getElementById('modal-total-amount');
  const modalStatusSelect = document.getElementById('modal-status-select');
  const btnDeleteOrder = document.getElementById('btn-delete-order');
  const btnCopyAddress = document.getElementById('btn-copy-address');
  const btnCopySteadfast = document.getElementById('btn-copy-steadfast');
  const copyHelperArea = document.getElementById('copy-helper-area');

  let orders = [];
  let currentOrderId = null;

  // Initial Load
  loadOrders();

  function loadOrders() {
    orders = JSON.parse(localStorage.getItem('magcubic_orders')) || [];
    
    // If no orders exist, load sample data automatically for demo purposes
    if (orders.length === 0) {
      loadSampleData();
    } else {
      renderDashboard();
    }
  }

  function loadSampleData() {
    const sampleOrders = [
      {
        id: "HY-1482",
        date: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
        customerName: "Ayman Sadman",
        customerPhone: "+8801712345678",
        customerAddress: "Flat 4A, House 12, Road 8, Dhanmondi",
        customerDistrict: "Dhaka",
        notes: "Please call before coming.",
        product: "Magcubic HY 300 Smart Projector",
        price: 4499,
        shipping: 60,
        total: 4559,
        status: "Pending"
      },
      {
        id: "HY-9034",
        date: new Date(Date.now() - 28 * 3600000).toISOString(), // 28 hours ago
        customerName: "Tasnim Rahman",
        customerPhone: "+8801898765432",
        customerAddress: "Holding 104, Ward 5, Halishahar",
        customerDistrict: "Chittagong",
        notes: "Deliver in the afternoon.",
        product: "Magcubic HY 300 Smart Projector",
        price: 4499,
        shipping: 120,
        total: 4619,
        status: "Processing"
      },
      {
        id: "HY-3498",
        date: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
        customerName: "Nusrat Jahan",
        customerPhone: "+8801911223344",
        customerAddress: "Bismillah Villa, Ambarkhana",
        customerDistrict: "Sylhet",
        notes: "",
        product: "Magcubic HY 300 Smart Projector",
        price: 4499,
        shipping: 120,
        total: 4619,
        status: "Delivered"
      },
      {
        id: "HY-2104",
        date: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
        customerName: "Arif Chowdhury",
        customerPhone: "+8801555443322",
        customerAddress: "Sarkar Bari, Rajshahi University Area",
        customerDistrict: "Rajshahi",
        notes: "Keep packaging intact, it's a gift.",
        product: "Magcubic HY 300 Smart Projector",
        price: 4499,
        shipping: 120,
        total: 4619,
        status: "Cancelled"
      }
    ];

    localStorage.setItem('magcubic_orders', JSON.stringify(sampleOrders));
    orders = sampleOrders;
    renderDashboard();
  }

  function renderDashboard() {
    calculateStats();
    renderTable();
  }

  // Calculate Metrics Banner
  function calculateStats() {
    const totalCount = orders.length;
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    
    // Revenue calculations (excluding Cancelled orders)
    const validOrders = orders.filter(o => o.status !== 'Cancelled');
    const totalRevValue = validOrders.reduce((sum, o) => sum + o.price, 0);
    const shippingFeesValue = validOrders.reduce((sum, o) => sum + o.shipping, 0);

    statTotal.textContent = totalCount;
    statPending.textContent = pendingCount;
    statRevenue.textContent = `৳${totalRevValue.toLocaleString('en-US')}`;
    statShipping.textContent = `৳${shippingFeesValue.toLocaleString('en-US')}`;
  }

  // Render Table List
  function renderTable() {
    const searchVal = searchInput.value.toLowerCase().trim();
    const statusVal = filterStatus.value;
    const districtVal = filterDistrict.value;

    // Filter list
    const filteredOrders = orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchVal) ||
        order.customerName.toLowerCase().includes(searchVal) ||
        order.customerPhone.includes(searchVal);
      
      const matchesStatus = statusVal === 'All' || order.status === statusVal;
      const matchesDistrict = districtVal === 'All' || order.customerDistrict === districtVal;

      return matchesSearch && matchesStatus && matchesDistrict;
    });

    if (filteredOrders.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5" style="color: var(--text-muted);">
            No matching orders found.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filteredOrders.map(order => {
      const dateFormatted = new Date(order.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <tr>
          <td><a href="#" class="order-link" data-id="${order.id}">#${order.id}</a></td>
          <td style="color: var(--text-muted);">${dateFormatted}</td>
          <td style="font-weight: 500;">${order.customerName}</td>
          <td>${order.customerPhone}</td>
          <td>${order.customerDistrict}</td>
          <td style="font-weight: 600;">৳${order.total.toLocaleString('en-US')}</td>
          <td>
            <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
          </td>
          <td>
            <button class="btn-action-view" data-id="${order.id}">View Details</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Event Listeners to actions & order links
    tableBody.querySelectorAll('.btn-action-view, .order-link').forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const id = elem.getAttribute('data-id');
        openModal(id);
      });
    });
  }

  // Search & Filter Events
  searchInput.addEventListener('input', renderTable);
  filterStatus.addEventListener('change', renderTable);
  filterDistrict.addEventListener('change', renderTable);
  
  btnClearFilters.addEventListener('click', () => {
    searchInput.value = '';
    filterStatus.value = 'All';
    filterDistrict.value = 'All';
    renderTable();
  });

  // Modal Functionality
  function openModal(id) {
    currentOrderId = id;
    const order = orders.find(o => o.id === id);
    if (!order) return;

    modalTitleId.textContent = `#${order.id}`;
    modalCustName.textContent = order.customerName;
    modalCustPhone.textContent = order.customerPhone;
    modalCustDistrict.textContent = order.customerDistrict;
    modalCustAddress.textContent = order.customerAddress;
    modalOrderNotes.textContent = order.notes ? order.notes : 'None';
    modalProductPrice.textContent = `৳${order.price.toLocaleString('en-US')}`;
    modalShippingCost.textContent = `৳${order.shipping.toLocaleString('en-US')}`;
    modalTotalAmount.textContent = `৳${order.total.toLocaleString('en-US')}`;
    modalStatusSelect.value = order.status;

    // Show modal
    detailsModal.classList.remove('hidden');
  }

  function closeModal() {
    detailsModal.classList.add('hidden');
    currentOrderId = null;
  }

  closeModalBtn.addEventListener('click', closeModal);
  
  // Close modal clicking outside
  detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
      closeModal();
    }
  });

  // Update Status from Modal
  modalStatusSelect.addEventListener('change', () => {
    if (!currentOrderId) return;
    const newStatus = modalStatusSelect.value;
    
    orders = orders.map(o => {
      if (o.id === currentOrderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });

    localStorage.setItem('magcubic_orders', JSON.stringify(orders));
    renderDashboard();
  });

  // Delete Order
  btnDeleteOrder.addEventListener('click', () => {
    if (!currentOrderId) return;
    
    if (confirm(`Are you sure you want to delete order #${currentOrderId}? This action cannot be undone.`)) {
      orders = orders.filter(o => o.id !== currentOrderId);
      localStorage.setItem('magcubic_orders', JSON.stringify(orders));
      closeModal();
      renderDashboard();
    }
  });

  // Clipboard Helpers
  btnCopyAddress.addEventListener('click', () => {
    const order = orders.find(o => o.id === currentOrderId);
    if (!order) return;

    const textToCopy = `${order.customerName}\n${order.customerPhone}\n${order.customerAddress}\n${order.customerDistrict}`;
    copyToClipboard(textToCopy, btnCopyAddress, '📋 Copy Full Address');
  });

  btnCopySteadfast.addEventListener('click', () => {
    const order = orders.find(o => o.id === currentOrderId);
    if (!order) return;

    // Standard courier portal format: Name, Phone, Address, COD amount, note
    const textToCopy = `Name: ${order.customerName}\nPhone: ${order.customerPhone}\nAddress: ${order.customerAddress}, ${order.customerDistrict}\nCOD: ${order.total}\nNote: ${order.notes || 'None'}`;
    copyToClipboard(textToCopy, btnCopySteadfast, '🚚 Copy for Steadfast COD');
  });

  function copyToClipboard(text, buttonEl, originalText) {
    copyHelperArea.value = text;
    copyHelperArea.classList.remove('hidden');
    copyHelperArea.select();
    
    try {
      document.execCommand('copy');
      buttonEl.textContent = '✅ Copied!';
      buttonEl.style.borderColor = 'var(--color-success)';
      buttonEl.style.color = 'var(--color-success)';
      
      setTimeout(() => {
        buttonEl.textContent = originalText;
        buttonEl.style.borderColor = 'var(--border-color)';
        buttonEl.style.color = 'var(--text-main)';
      }, 2000);
    } catch (err) {
      alert('Failed to copy to clipboard.');
    }
    
    copyHelperArea.classList.add('hidden');
  }

  // Export to CSV
  btnExportCsv.addEventListener('click', () => {
    if (orders.length === 0) {
      alert('No orders to export.');
      return;
    }

    // CSV Headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Date,Customer Name,Phone,District,Address,Product,Price,Shipping,Total COD,Status,Notes\r\n";

    orders.forEach(o => {
      // Escape commas and double quotes in fields
      const nameEsc = `"${o.customerName.replace(/"/g, '""')}"`;
      const phoneEsc = `"${o.customerPhone.replace(/"/g, '""')}"`;
      const addressEsc = `"${o.customerAddress.replace(/"/g, '""')}"`;
      const notesEsc = `"${(o.notes || '').replace(/"/g, '""')}"`;
      const dateEsc = `"${new Date(o.date).toISOString()}"`;

      csvContent += `${o.id},${dateEsc},${nameEsc},${phoneEsc},${o.customerDistrict},${addressEsc},"${o.product}",${o.price},${o.shipping},${o.total},${o.status},${notesEsc}\r\n`;
    });

    // Download trigger
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aurabeam_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  });

  // Add Mock Orders Button (for manual demo expansion)
  btnAddMock.addEventListener('click', () => {
    const firstNames = ["Sabbir", "Mizan", "Rony", "Farhana", "Tanveer", "Nabila", "Imran"];
    const lastNames = ["Hasan", "Ahmed", "Hossain", "Islam", "Chowdhury", "Begum", "Ali"];
    const districts = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh", "Outside"];
    
    const randomName = `${firstNames[Math.floor(Math.random()*firstNames.length)]} ${lastNames[Math.floor(Math.random()*lastNames.length)]}`;
    const randomPhone = `+8801${Math.floor(3 + Math.random()*7)}${Math.floor(10000000 + Math.random()*90000000)}`;
    const randomDist = districts[Math.floor(Math.random()*districts.length)];
    const addresses = {
      'Dhaka': 'Flat 2B, House 48, Road 2, Mirpur 12',
      'Chittagong': 'Building 3, CDA Avenue, Nasirabad',
      'Sylhet': 'House 19, Block C, Shahjalal Uposhohor',
      'Rajshahi': 'Sopura Industrial Area, Ghoramara',
      'Khulna': 'Mujgunni Main Road, Boyra',
      'Barisal': 'Sadat Mansion, Alekanda',
      'Rangpur': 'Dhap Jail Road, Rangpur Sadar',
      'Mymensingh': 'College Road, Charpara',
      'Outside': 'Village: Sonapur, PO: Chatkhil, Noakhali'
    };
    const randomAddress = addresses[randomDist];
    const shippingRates = { 'Dhaka': 60, 'Chittagong': 120, 'Sylhet': 120, 'Rajshahi': 120, 'Khulna': 120, 'Barisal': 120, 'Rangpur': 120, 'Mymensingh': 120, 'Outside': 150 };
    const shipping = shippingRates[randomDist];
    const id = `HY-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newMock = {
      id: id,
      date: new Date().toISOString(),
      customerName: randomName,
      customerPhone: randomPhone,
      customerAddress: randomAddress,
      customerDistrict: randomDist,
      notes: Math.random() > 0.5 ? "Delivery as fast as possible." : "",
      product: "Magcubic HY 300 Smart Projector",
      price: 4499,
      shipping: shipping,
      total: 4499 + shipping,
      status: "Pending"
    };

    orders.unshift(newMock);
    localStorage.setItem('magcubic_orders', JSON.stringify(orders));
    renderDashboard();
  });
});
