\# 💰 SpendSmart — AI-Powered Expense Tracker



!\[SpendSmart](https://img.shields.io/badge/Status-Live-brightgreen) !\[MERN Stack](https://img.shields.io/badge/Stack-MERN-blue) !\[AI Powered](https://img.shields.io/badge/AI-Groq%20Llama%203-orange) !\[Deployed](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-purple)



A full-stack personal finance web application with AI-powered spending insights, receipt upload, savings goals, and spending report card grading.



🔗 \*\*Live Demo\*\* → https://expense-tracker-t2dq.vercel.app



\---



\## ✨ Features



| Feature | Description |

|---|---|

| 🔐 JWT Authentication | Secure register \& login with bcrypt password hashing |

| 📊 Dashboard \& Charts | Real-time income vs expense bar chart + category pie chart |

| 💸 Transactions | Add, edit, delete income and expense transactions |

| 📸 Receipt Upload | Upload bill photos stored on Cloudinary cloud storage |

| 🎯 Savings Goals | Set goals with progress bar tracking and deadline |

| 📈 Spending Grade | Automatic A/B/C/D/F grade based on savings rate |

| 🤖 AI Spending Tips | Personalized tips powered by Groq Llama 3 (Generative AI) |

| 🚀 Deployed Live | Frontend on Vercel, Backend on Render, DB on MongoDB Atlas |



\---



\## 🛠 Tech Stack



| Layer | Technology |

|---|---|

| Frontend | React, Recharts, React Router, Axios |

| Backend | Node.js, Express.js, REST API |

| Database | MongoDB Atlas, Mongoose |

| Authentication | JWT (JSON Web Token), bcrypt |

| AI Integration | Groq API (Llama 3 — Generative AI / LLM) |

| File Storage | Cloudinary (receipt image upload) |

| Deployment | Vercel (frontend) + Render (backend) |



\---



\## 📁 Project Structure



```

expense-tracker/

├── backend/

│   ├── controllers/

│   │   ├── authController.js       # Register, Login logic

│   │   ├── transactionController.js # CRUD + spending summary

│   │   ├── goalController.js       # Savings goals logic

│   │   └── aiController.js         # Groq AI tips integration

│   ├── middleware/

│   │   └── authMiddleware.js       # JWT token verification

│   ├── models/

│   │   ├── User.js                 # User schema

│   │   ├── Transaction.js          # Transaction schema

│   │   └── Goal.js                 # Savings goal schema

│   ├── routes/

│   │   ├── authRoutes.js

│   │   ├── transactionRoutes.js

│   │   ├── goalRoutes.js

│   │   └── aiRoutes.js

│   ├── server.js                   # Main entry point

│   └── .env                        # Environment variables (not committed)

└── frontend/

&#x20;   └── src/

&#x20;       ├── pages/

&#x20;       │   ├── Dashboard.js

&#x20;       │   ├── Transactions.js

&#x20;       │   ├── Goals.js

&#x20;       │   ├── Login.js

&#x20;       │   └── Register.js

&#x20;       ├── components/

&#x20;       │   └── Navbar.js

&#x20;       ├── context/

&#x20;       │   └── AuthContext.js

&#x20;       ├── services/

&#x20;       │   └── api.js

&#x20;       └── App.js

```



\---



\## 🚀 How to Run Locally



\### Prerequisites

Make sure you have these installed:

\- \[Node.js](https://nodejs.org) (v18 or above)

\- \[Git](https://git-scm.com)

\- A \[MongoDB Atlas](https://mongodb.com/cloud/atlas) account (free)

\- A \[Groq](https://console.groq.com) account (free)

\- A \[Cloudinary](https://cloudinary.com) account (free)



\---



\### Step 1 — Clone the Repository



```bash

git clone https://github.com/Kumpatla-Gayathri/expense-tracker.git

cd expense-tracker

```



\---



\### Step 2 — Setup Backend



```bash

cd backend

npm install

```



Create a `.env` file inside the `backend` folder:



```env

PORT=5000

MONGO\_URI=your\_mongodb\_connection\_string

JWT\_SECRET=your\_secret\_key

GROQ\_API\_KEY=your\_groq\_api\_key

CLOUDINARY\_CLOUD\_NAME=your\_cloud\_name

CLOUDINARY\_API\_KEY=your\_cloudinary\_api\_key

CLOUDINARY\_API\_SECRET=your\_cloudinary\_api\_secret

```



Start the backend server:



```bash

node server.js

```



You should see:

```

✅ MongoDB Connected Successfully!

🚀 Server running on port 5000

```



\---



\### Step 3 — Setup Frontend



Open a \*\*new terminal\*\*:



```bash

cd frontend

npm install

```



Create a `.env` file inside the `frontend` folder:



```env

REACT\_APP\_API\_URL=http://localhost:5000/api

HTTPS=false

```



Start the React app:



```bash

npm start

```



The app opens at → \*\*http://localhost:3000\*\*



\---



\### Step 4 — Open the App



Go to your browser and visit:

```

http://localhost:3000

```



Register a new account and start tracking your expenses! 🎉



\---



\## 🌐 API Endpoints



| Method | Endpoint | Description | Auth Required |

|---|---|---|---|

| POST | /api/auth/register | Register new user | No |

| POST | /api/auth/login | Login user | No |

| GET | /api/transactions | Get all transactions | Yes |

| POST | /api/transactions | Add transaction | Yes |

| PUT | /api/transactions/:id | Update transaction | Yes |

| DELETE | /api/transactions/:id | Delete transaction | Yes |

| GET | /api/transactions/summary | Get spending summary + grade | Yes |

| GET | /api/goals | Get all savings goals | Yes |

| POST | /api/goals | Create new goal | Yes |

| PUT | /api/goals/:id/deposit | Add money to goal | Yes |

| DELETE | /api/goals/:id | Delete goal | Yes |

| POST | /api/ai/tips | Get AI spending tips | Yes |



\---



\## 🤖 How AI Tips Work



1\. User clicks \*\*"Get AI Tips"\*\* on Dashboard

2\. Frontend sends spending summary (income, expenses, category breakdown, grade) to `/api/ai/tips`

3\. Backend builds a prompt and sends it to \*\*Groq Llama 3 LLM\*\*

4\. LLM returns 4 personalized spending tips

5\. Tips displayed on Dashboard



\---



\## 📸 How Receipt Upload Works



1\. User selects an image when adding a transaction

2\. Frontend sends it as \*\*FormData\*\* to the backend

3\. \*\*Multer\*\* handles the file on the server temporarily

4\. \*\*Cloudinary SDK\*\* uploads the image to cloud storage

5\. Cloudinary returns a secure URL stored in MongoDB

6\. User can click \*\*"View Receipt"\*\* anytime to see the bill photo



\---



\## 🔐 Environment Variables Reference



| Variable | Where to get it |

|---|---|

| MONGO\_URI | \[MongoDB Atlas](https://cloud.mongodb.com) → Connect → Drivers |

| JWT\_SECRET | Any random string you choose |

| GROQ\_API\_KEY | \[Groq Console](https://console.groq.com) → API Keys |

| CLOUDINARY\_CLOUD\_NAME | \[Cloudinary Dashboard](https://cloudinary.com) |

| CLOUDINARY\_API\_KEY | \[Cloudinary Dashboard](https://cloudinary.com) |

| CLOUDINARY\_API\_SECRET | \[Cloudinary Dashboard](https://cloudinary.com) |



\---



\## 👩‍💻 Developer



\*\*Kumpatla Gayathri\*\*

\- GitHub: \[@Kumpatla-Gayathri](https://github.com/Kumpatla-Gayathri)

\- Email: gayathrikumpatla2357@gmail.com



\---



\## 📄 License



This project is open source and available under the \[MIT License](LICENSE).



