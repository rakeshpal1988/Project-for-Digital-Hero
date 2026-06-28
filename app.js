/* ============================================
   GST Invoice Calculator - Application Logic
   ============================================ */

// --- Item Descriptions Catalogue ---
const ITEM_CATALOGUE = [
    "Web Development Services",
    "Mobile App Development",
    "UI/UX Design Services",
    "Cloud Hosting (Monthly)",
    "Software License (Annual)",
    "IT Consulting Services",
    "Digital Marketing Services",
    "SEO Optimization Package",
    "Content Writing Services",
    "Data Analytics Services",
    "Cybersecurity Audit",
    "API Integration Services",
    "Database Management",
    "Hardware Maintenance",
    "Training & Workshop",
    "Technical Support (Monthly)",
    "Custom Software Development",
    "E-commerce Setup",
    "Domain & SSL Certificate",
    "Graphic Design Services"
];

// --- State ---
let items = [];
let itemIdCounter = 0;

// --- DOM References ---
const itemsTbody = document.getElementById('items-tbody');
const btnAddItem = document.getElementById('btn-add-item');
const btnReset = document.getElementById('btn-reset');
const btnPrint = document.getElementById('btn-print');
const gstRateSelect = document.getElementById('gst-rate');
const invoiceDateInput = document.getElementById('invoice-date');

// Summary elements
const subtotalEl = document.getElementById('subtotal');
const cgstAmountEl = document.getElementById('cgst-amount');
const sgstAmountEl = document.getElementById('sgst-amount');
const grandTotalEl = document.getElementById('grand-total');
const cgstPercentEl = document.getElementById('cgst-percent');
const sgstPercentEl = document.getElementById('sgst-percent');
const cgstRateEl = document.getElementById('cgst-rate');
const sgstRateEl = document.getElementById('sgst-rate');
const amountInWordsEl = document.getElementById('amount-in-words');

// --- Initialization ---
function init() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    invoiceDateInput.value = today;

    // Generate initial invoice number
    const invoiceNum = 'INV-' + String(Math.floor(Math.random() * 9000) + 1000);
    document.getElementById('invoice-number').value = invoiceNum;

    // Add first item row
    addItem();

    // Event Listeners
    btnAddItem.addEventListener('click', addItem);
    btnReset.addEventListener('click', resetInvoice);
    btnPrint.addEventListener('click', () => window.print());
    gstRateSelect.addEventListener('change', () => {
        updateGSTDisplay();
        recalculate();
    });

    updateGSTDisplay();
}

// --- Add Item Row ---
function addItem() {
    const id = ++itemIdCounter;
    items.push({ id, description: '', quantity: 1, price: 0 });
    renderItems();
    recalculate();
}

// --- Remove Item Row ---
function removeItem(id) {
    if (items.length <= 1) return; // Keep at least one row
    items = items.filter(item => item.id !== id);
    renderItems();
    recalculate();
}

// --- Render All Items ---
function renderItems() {
    itemsTbody.innerHTML = '';
    items.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', item.id);

        const total = item.quantity * item.price;

        tr.innerHTML = `
            <td class="col-sno">${index + 1}</td>
            <td class="col-desc">
                <select class="form-select item-desc" data-id="${item.id}">
                    <option value="" disabled ${!item.description ? 'selected' : ''}>Select item...</option>
                    ${ITEM_CATALOGUE.map(desc =>
                        `<option value="${desc}" ${item.description === desc ? 'selected' : ''}>${desc}</option>`
                    ).join('')}
                </select>
            </td>
            <td class="col-qty">
                <input type="number" class="form-input item-qty" data-id="${item.id}" 
                       value="${item.quantity}" min="1" step="1" placeholder="Qty">
            </td>
            <td class="col-price">
                <input type="number" class="form-input item-price" data-id="${item.id}" 
                       value="${item.price}" min="0" step="0.01" placeholder="₹ Price">
            </td>
            <td class="col-total">
                <span class="row-total">₹${formatNumber(total)}</span>
            </td>
            <td class="col-action">
                <button class="btn-delete" onclick="removeItem(${item.id})" title="Remove item"
                        ${items.length <= 1 ? 'disabled style="opacity:0.3;cursor:not-allowed"' : ''}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </td>
        `;

        itemsTbody.appendChild(tr);
    });

    // Attach input listeners
    document.querySelectorAll('.item-desc').forEach(el => {
        el.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = items.find(i => i.id === id);
            if (item) item.description = e.target.value;
        });
    });

    document.querySelectorAll('.item-qty').forEach(el => {
        el.addEventListener('input', (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = items.find(i => i.id === id);
            if (item) {
                item.quantity = Math.max(1, parseInt(e.target.value) || 1);
                updateRowTotal(id);
                recalculate();
            }
        });
    });

    document.querySelectorAll('.item-price').forEach(el => {
        el.addEventListener('input', (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = items.find(i => i.id === id);
            if (item) {
                item.price = Math.max(0, parseFloat(e.target.value) || 0);
                updateRowTotal(id);
                recalculate();
            }
        });
    });
}

// --- Update Single Row Total ---
function updateRowTotal(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const total = item.quantity * item.price;
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        const totalSpan = row.querySelector('.row-total');
        totalSpan.textContent = `₹${formatNumber(total)}`;

        // Add a small pulse animation
        totalSpan.style.transform = 'scale(1.08)';
        totalSpan.style.transition = 'transform 200ms ease';
        setTimeout(() => {
            totalSpan.style.transform = 'scale(1)';
        }, 200);
    }
}

// --- Recalculate Summary ---
function recalculate() {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const gstRate = parseFloat(gstRateSelect.value) || 0;
    const halfRate = gstRate / 2;
    const cgst = subtotal * (halfRate / 100);
    const sgst = subtotal * (halfRate / 100);
    const grandTotal = subtotal + cgst + sgst;

    // Update display with animation
    animateValue(subtotalEl, subtotal);
    animateValue(cgstAmountEl, cgst);
    animateValue(sgstAmountEl, sgst);
    animateValue(grandTotalEl, grandTotal);

    // Amount in words
    amountInWordsEl.textContent = numberToWords(Math.round(grandTotal)) + ' Rupees Only';
}

// --- Animate value change ---
function animateValue(element, value) {
    element.textContent = `₹${formatNumber(value)}`;
}

// --- Update GST Display ---
function updateGSTDisplay() {
    const gstRate = parseFloat(gstRateSelect.value) || 0;
    const halfRate = gstRate / 2;
    cgstPercentEl.textContent = halfRate;
    sgstPercentEl.textContent = halfRate;
    cgstRateEl.textContent = `${halfRate}%`;
    sgstRateEl.textContent = `${halfRate}%`;
}

// --- Reset Invoice ---
function resetInvoice() {
    if (!confirm('Are you sure you want to reset the invoice? All data will be cleared.')) return;

    document.getElementById('company-name').value = '';
    document.getElementById('gstin').value = '';
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-gstin').value = '';
    document.getElementById('customer-address').value = '';

    const today = new Date().toISOString().split('T')[0];
    invoiceDateInput.value = today;

    const invoiceNum = 'INV-' + String(Math.floor(Math.random() * 9000) + 1000);
    document.getElementById('invoice-number').value = invoiceNum;

    gstRateSelect.value = '18';
    updateGSTDisplay();

    items = [];
    itemIdCounter = 0;
    addItem();
}

// --- Format Number ---
function formatNumber(num) {
    return num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// --- Number to Words (Indian Numbering) ---
function numberToWords(num) {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                  'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function convertBelowHundred(n) {
        if (n < 20) return ones[n];
        return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    }

    function convertBelowThousand(n) {
        if (n < 100) return convertBelowHundred(n);
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertBelowHundred(n % 100) : '');
    }

    if (num >= 10000000) {
        const crore = Math.floor(num / 10000000);
        const remainder = num % 10000000;
        return convertBelowThousand(crore) + ' Crore' + (remainder ? ' ' + numberToWords(remainder) : '');
    }

    if (num >= 100000) {
        const lakh = Math.floor(num / 100000);
        const remainder = num % 100000;
        return convertBelowHundred(lakh) + ' Lakh' + (remainder ? ' ' + numberToWords(remainder) : '');
    }

    if (num >= 1000) {
        const thousand = Math.floor(num / 1000);
        const remainder = num % 1000;
        return convertBelowHundred(thousand) + ' Thousand' + (remainder ? ' ' + numberToWords(remainder) : '');
    }

    return convertBelowThousand(num);
}

// --- Launch ---
document.addEventListener('DOMContentLoaded', init);
