# 🧾 GST Invoice Calculator

A professional, modern GST Invoice Generator built with vanilla HTML, CSS, and JavaScript. Create beautiful invoices with automatic GST calculation — no server or framework required.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

- **Item Description Dropdown** — Select from 20+ professional service/product descriptions
- **Dynamic Line Items** — Add or remove multiple invoice items
- **Auto Calculation** — Total = Quantity × Price, calculated in real-time
- **GST Rate Selection** — Choose from 5%, 18%, or 28% GST brackets via dropdown
- **CGST/SGST Split** — GST is automatically split into CGST and SGST components
- **Grand Total** — Subtotal + CGST + SGST computed instantly
- **Amount in Words** — Indian numbering system (Lakh, Crore) auto-generated
- **Print Ready** — Clean print stylesheet for paper invoices
- **Responsive Design** — Works beautifully on desktop, tablet, and mobile
- **Premium Dark UI** — Glassmorphism theme with smooth micro-animations

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gst-invoice-calculator.git
   cd gst-invoice-calculator
   ```

2. **Open in browser**
   Simply open `index.html` in any modern browser — no build step needed.

   ```bash
   # Or use a local server
   npx serve .
   ```

## 📁 Project Structure

```
├── index.html      # Main HTML structure
├── styles.css      # Premium dark theme with glassmorphism
├── app.js          # Application logic (CRUD, GST calc, print)
└── README.md       # Documentation
```

## 🧮 GST Calculation Logic

| GST Rate | CGST  | SGST  |
|----------|-------|-------|
| 5%       | 2.5%  | 2.5%  |
| 18%      | 9%    | 9%    |
| 28%      | 14%   | 14%   |

**Formula:**
```
Line Total = Quantity × Price
Subtotal   = Sum of all Line Totals
CGST       = Subtotal × (GST Rate / 2) / 100
SGST       = Subtotal × (GST Rate / 2) / 100
Grand Total = Subtotal + CGST + SGST
```

## 🖨️ Printing

Click the **Print** button in the header to generate a clean, paper-friendly version of your invoice. The print stylesheet removes all UI chrome and presents a professional black-and-white layout.

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, animations, glassmorphism, responsive grid
- **JavaScript (ES6+)** — Vanilla JS, no dependencies

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
