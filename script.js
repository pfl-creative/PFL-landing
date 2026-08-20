document.addEventListener('DOMContentLoaded', () => {
  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after showing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');
    
    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all open items first
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        // Set dynamic max-height based on scroll height
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- STICKY MOBILE CTA DISPLAY ---
  const stickyCta = document.getElementById('stickyMobileCta');
  const heroSection = document.getElementById('hero');
  const footerSection = document.querySelector('footer');

  window.addEventListener('scroll', () => {
    if (!stickyCta || !heroSection) return;

    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    
    // Show sticky CTA after scrolling past Hero
    let shouldShow = scrollY > (heroHeight - 100);

    // Hide sticky CTA if near the bottom footer
    if (footerSection) {
      const footerTop = footerSection.offsetTop;
      const windowHeight = window.innerHeight;
      if (scrollY + windowHeight > footerTop + 20) {
        shouldShow = false;
      }
    }

    if (shouldShow) {
      stickyCta.classList.add('visible');
    } else {
      stickyCta.classList.remove('visible');
    }
  });

  // --- DYNAMIC CONVERSION & UPGRADE MODAL FLOW ---
  const modal = document.getElementById('checkoutModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('selectedProductName');
  const modalBasePrice = document.getElementById('modalBasePrice');
  const modalTotalPrice = document.getElementById('modalTotalPrice');
  const upgradeCheckbox = document.getElementById('upgradeCheckbox');
  const modalCheckoutBtn = document.getElementById('modalCheckoutBtn');
  const modalSkip = document.getElementById('modalSkip');

  let currentProduct = {
    id: '',
    name: '',
    price: 0
  };

  const upgradeOption = {
    name: 'PFL Photoshoot Generator',
    price: 499,
    selected: false
  };

  // Open checkout modal for selected product
  window.openCheckout = function(productId, productName, basePrice) {
    currentProduct.id = productId;
    currentProduct.name = productName;
    currentProduct.price = parseInt(basePrice);
    
    // Reset upgrade state
    upgradeOption.selected = false;
    upgradeCheckbox.classList.remove('checked');
    
    // Update Modal DOM
    modalTitle.textContent = currentProduct.name;
    modalBasePrice.textContent = `${currentProduct.price} THB`;
    
    updateTotalPrice();
    
    // Open Modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  // Update total price based on upgrade checkbox state
  function updateTotalPrice() {
    let total = currentProduct.price;
    if (upgradeOption.selected) {
      total += upgradeOption.price;
    }
    modalTotalPrice.textContent = `${total} THB`;
  }

  // Handle upgrade checkbox toggle
  upgradeCheckbox.addEventListener('click', () => {
    upgradeOption.selected = !upgradeOption.selected;
    if (upgradeOption.selected) {
      upgradeCheckbox.classList.add('checked');
    } else {
      upgradeCheckbox.classList.remove('checked');
    }
    updateTotalPrice();
  });

  // Close modal functions
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Checkout actions (Mock payment screen)
  modalCheckoutBtn.addEventListener('click', () => {
    let message = `🎉 ขอบคุณที่เลือกซื้อสินค้า!\n\nรายการของคุณ:\n- ${currentProduct.name} (${currentProduct.price} THB)`;
    if (upgradeOption.selected) {
      message += `\n- + ${upgradeOption.name} Upgrade (${upgradeOption.price} THB)`;
    }
    const finalPrice = currentProduct.price + (upgradeOption.selected ? upgradeOption.price : 0);
    message += `\n\nยอดรวมทั้งสิ้น: ${finalPrice} THB\n\n(กำลังพาคุณไปยังหน้าระบบชำระเงินจำลอง...)`;
    
    alert(message);
    closeModal();
  });

  modalSkip.addEventListener('click', () => {
    upgradeOption.selected = false;
    upgradeCheckbox.classList.remove('checked');
    updateTotalPrice();
    
    alert(`🎉 ขอบคุณที่เลือกซื้อสินค้า!\n\nรายการของคุณ:\n- ${currentProduct.name} (${currentProduct.price} THB)\n\nยอดรวมทั้งสิ้น: ${currentProduct.price} THB\n\n(กำลังพาคุณไปยังหน้าระบบชำระเงินจำลอง...)`);
    closeModal();
  });
});
