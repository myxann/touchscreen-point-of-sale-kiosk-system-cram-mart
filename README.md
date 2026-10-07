# 🛒 CRAM MART
### Academic Emergency Self-Service Kiosk

> **Academic emergencies. Questionable solutions.**

CRAM MART is a touchscreen-oriented Point-of-Sale (POS) kiosk designed for students who need quick access to academic and everyday emergency supplies.

The system provides a simple self-service purchasing experience where users can browse products, add items to their cart, modify quantities, review their order, select a simulated payment method, and receive a digital receipt.

---

## 📌 Project Overview

CRAM MART was developed as a touchscreen self-service kiosk concept that combines a straightforward POS workflow with a humorous academic emergency-store theme.

The system focuses on providing a simple and accessible interface suitable for touchscreen interaction while demonstrating essential Point-of-Sale operations such as:

- Product selection
- Shopping cart management
- Quantity adjustment
- Subtotal and total calculation
- Order review
- Payment processing simulation
- Change calculation
- Transaction recording
- Digital receipt generation

---

## ✨ Features

### 🛍️ Product Selection

- Displays available products from the database.
- Shows product name, description, price, and emoji.
- Allows users to add products to the current order.

### 🛒 Shopping Cart

- Displays selected products.
- Allows users to increase or decrease quantities.
- Allows users to remove products.
- Automatically calculates item subtotals.
- Automatically calculates the order total.

### 🧾 Order Review

- Provides a summary of selected products.
- Allows users to review their order before payment.
- Allows users to return and modify their order.

### 💳 Payment Simulation

CRAM MART supports simulated payment workflows:

- Cash
- QR payment
- Card payment

No real payment gateway or financial transaction is processed.

### 💰 Cash Payment

For cash transactions, the system can calculate:

- Total amount
- Amount paid
- Change

### 🧾 Digital Receipt

After a successful transaction, the system displays a receipt containing the purchased items, quantities, prices, payment details, and transaction information.

### 🗄️ Supabase Database

Supabase is used for persistent storage of:

- Product information
- Completed orders
- Order items

---

# 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | Frontend application and user interface |
| **Vite 7** | Development server and build tool |
| **JavaScript** | Application logic |
| **CSS** | Interface styling and responsive layout |
| **Supabase** | Database and backend services |
| **PostgreSQL** | Database engine used by Supabase |
| **GitHub** | Source code management and collaboration |
| **Codex / AI-assisted development** | Development assistance, debugging, documentation, and UI refinement |

---

# 📋 System Requirements

Before running CRAM MART locally, make sure the following are installed:

- Node.js
- npm
- Git
- A modern web browser
- A Supabase account for database functionality

---

# 🚀 Installation

## 1. Clone the Repository

Clone the project using Git:

```bash
git clone https://github.com/myxann/touchscreen-point-of-sale-kiosk-system-cram-mart.git

# Navigate to the project directory:
cd touchscreen-point-of-sale-kiosk-system-cram-mart

2. Install Dependencies
Install the required Node.js packages:
npm install

The project uses React, Vite, and the Supabase JavaScript client.
🔐 Supabase Configuration
CRAM MART uses Supabase as its database and backend service.
The project database schema is located at:
supabase/schema.sql

To configure the database:
1. Create or open the CRAM MART project in Supabase.
2. Open the SQL Editor.
3. Open the project's supabase/schema.sql file.
4. Copy the SQL commands.
5. Paste them into the Supabase SQL Editor.
6. Run the SQL script.
7. Verify that the required tables have been created.
The database contains the following main tables:
- products
- orders
- order_items
🔑 Environment Variables
Create a local .env file in the project root.
You can use .env.example as a reference.
The environment file should contain:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

The values can be obtained from the Supabase project settings.
Important: Do not commit your .env file or private credentials to GitHub.

🗄️ Database Structure
CRAM MART uses three main Supabase tables.
products
The products table stores the products displayed in the kiosk.
Column	Description
id	Unique product identifier
name	Product name
description	Product description
price	Product price
emoji	Product visual/icon
active	Determines whether the product is currently available
sort_order	Determines the display order of products
created_at	Date and time the product record was created


Current Sample Products
Product	Price
Coffee — Academic Comeback	₱45
Sandwich — Deadline Fuel	₱50
Soft Drink — Denial Edition	₱35
Cookies — Cram Session Pack	₱25
Bottled Water — Hydration Before Recitation	₱20
Chocolate — Group Project Therapy	₱25
Emergency Yellow Pad	₱20
1% Battery Survival Cable	₱79


orders
The orders table stores completed transactions.
Column	Description
id	Unique order identifier
transaction_ref	Unique transaction reference
total	Total amount of the order
payment_method	Payment method selected by the customer
amount_paid	Amount provided by the customer
change	Change returned to the customer
created_at	Date and time the transaction was created


order_items
The order_items table stores the individual products included in each order.
Column	Description
id	Unique order-item identifier
order_id	References the associated order
product_id	References the associated product
product_name	Product name recorded at the time of purchase
quantity	Number of units purchased
unit_price	Price of one unit
subtotal	Quantity multiplied by unit price


🔗 Database Relationship
The main relationship between the tables can be represented as:
┌──────────────┐
│   products   │
│              │
│ id           │
│ name         │
│ price        │
│ description  │
└──────┬───────┘
       │
       │ product_id
       ▼
┌──────────────────┐
│   order_items    │
│                  │
│ id               │
│ order_id         │
│ product_id       │
│ quantity         │
│ unit_price       │
│ subtotal         │
└────────┬─────────┘
         │
         │ order_id
         ▼
┌──────────────┐
│    orders    │
│              │
│ id           │
│ total        │
│ payment      │
│ amount_paid  │
│ change       │
└──────────────┘

This structure allows a single order to contain multiple products while preserving the details of each purchased item.
▶️ Running the Application
After installation and Supabase configuration, start the development server:
npm run dev

Vite will provide a local development URL, normally:
http://localhost:5173

Open the provided URL in a modern web browser.
🏗️ Production Build
To create a production build:
npm run build

To preview the production build locally:
npm run preview

📁 Project Structure
touchscreen-point-of-sale-kiosk-system-cram-mart/
│
├── src/
│   ├── lib/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── supabase/
│   └── schema.sql
│
├── docs/
│   └── AI-DEVELOPMENT-LOG.md
│
├── public/
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md

🔄 System Flow
The main transaction flow of CRAM MART is:
┌─────────────────────┐
│  Product Selection  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     Add to Cart     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    Order Summary    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Payment Method    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Payment Processing  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Payment Successful  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Digital Receipt   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  New Transaction    │
└─────────────────────┘

The frontend manages the active shopping cart and transaction flow, while completed orders and their corresponding order items are stored in Supabase.
💳 Payment Disclaimer
CRAM MART uses simulated payment methods for demonstration and academic purposes.
The system does not process real:
- Credit or debit card payments
- QR payments
- GCash transactions
- Banking transactions
- Electronic money transfers
No actual financial transaction takes place through the application.
🖥️ Touchscreen Design
CRAM MART is designed primarily as a touchscreen self-service kiosk.
The interface emphasizes:
- Large touch targets
- Readable typography
- Clear product cards
- Large action buttons
- Simple navigation
- Minimal steps during checkout
- Easy-to-understand payment screens
The design uses a warm cream background with dark green and orange accents to create a playful academic-store identity.
🧪 Testing and Evaluation
The application is evaluated based on the following core workflows:
Product Management
- Product information is displayed correctly.
- Products can be selected.
- Products can be added to the cart.
Cart Management
- Product quantities can be increased.
- Product quantities can be decreased.
- Products can be removed.
- Item subtotals are calculated correctly.
- The total amount is calculated correctly.
Order Processing
- Users can review their order.
- Users can modify their order before payment.
- The selected payment method is recorded.
Payment
- Cash payment can be simulated.
- Amount tendered can be entered.
- Change can be calculated.
- QR payment can be simulated.
- Card payment can be simulated.
Transaction
- Completed transactions generate an order record.
- Purchased products are stored as order items.
- A digital receipt is displayed after successful payment.
User Interface
- Buttons are suitable for touchscreen interaction.
- Text is readable.
- Product cards are clearly organized.
- The checkout process is easy to understand.
🤖 AI-Assisted Development
CRAM MART was developed with the assistance of AI-based development tools.
AI assistance was used during different stages of development, including:
- Initial application generation
- UI and layout development
- Code generation
- Debugging
- Error analysis
- Refactoring
- UI/UX improvement
- Documentation assistance
- Code evaluation
- Testing support
AI-generated suggestions and code were reviewed, tested, and modified by the development team to ensure that the application met the project's requirements.
A detailed record of AI-assisted development activities is maintained in:
docs/AI-DEVELOPMENT-LOG.md

🔀 Git and GitHub Workflow
The project uses Git and GitHub for source code management and team collaboration.
Repository:
https://github.com/myxann/touchscreen-point-of-sale-kiosk-system-cram-mart
The development workflow uses separate branches for individual features and tasks before changes are integrated into the main branch.
Example:
main
│
├── feature/UI
│
├── feature/documentation
│
└── feature/[other-task]

Team members are expected to use branches for their assigned tasks and create commits describing their changes.
Pull requests may be used to review and merge completed work into the main branch.
👥 Development Team
Member	GitHub Account	Branch	Main Contribution
Member 1	@username	feature/...	TBD
Member 2	@username	feature/...	TBD
Member 3	@username	feature/...	TBD
Member 4	@username	feature/...	TBD


Detailed team contributions, GitHub branches, commits, pull requests, reviews, and merge evidence are documented separately in:
TEAM-CONTRIBUTIONS.md

📚 Documentation
Project documentation includes:
Document	Description
README.md	Project overview, setup instructions, technologies, database, and usage
docs/AI-DEVELOPMENT-LOG.md	Record of AI-assisted development activities
TEAM-CONTRIBUTIONS.md	Team member and GitHub contribution records
supabase/schema.sql	Database schema and sample data


⚠️ Important Development Notes
- Do not commit .env files containing private credentials.
- Use .env.example as the template for required environment variables.
- Do not modify generated files inside dist/ manually.
- Source code changes should be made inside the appropriate source files.
- Test the application after making changes to ensure existing POS functionality remains operational.
- Database changes should be made through the Supabase SQL schema or appropriate database migrations.
🎓 Academic Purpose
CRAM MART was developed as an academic project to demonstrate the design and development of a functional touchscreen Point-of-Sale kiosk.
The project demonstrates practical implementation of:
- Frontend development
- Database integration
- POS transaction processing
- User interface design
- Touchscreen interaction
- Git and GitHub collaboration
- AI-assisted software development
- Software testing and evaluation

📄 License
This project was developed for academic and educational purposes.
© 2026 CRAM MART Development Team.

