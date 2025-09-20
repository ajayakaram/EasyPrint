# EasyPrint

Easy Print is a secure, fast, and user-friendly web-based document printing system. It allows users to upload documents without creating an account or sharing personal information. Uploaded documents can be printed directly by admins and are automatically deleted after a user-defined timer, ensuring privacy and convenience.

Features:-

Anonymous Uploads: Users can upload documents using a shop-specific QR code, no account required.

Privacy-first: Documents are auto-deleted after a set timer; nothing is stored permanently.

Admin Dashboard: Print documents directly from the dashboard without saving them locally.

Printer Integration: Connects directly with printers for seamless operation.

Scalable: Built to handle multiple shops and users simultaneously.

Technologies Used

Frontend: React.js

Backend: Node.js + Express

Database:MongoDB

Installation

Clone the repository:

git clone https://github.com/ajayakaram/EasyPrint.git


Navigate to the project directory:

cd EasyPrint


Install backend dependencies:

cd backend
npm install


Install frontend dependencies:

cd ../frontend
npm install

Running the Project
Backend
cd backend
nodemon server.js

Frontend
cd frontend
npm run dev


It Runs On http://localhost:5000 (or your configured port).
http://localhost:5000 ->> This Basically Contains Home Page.
http://localhost:5173/admin/register ->> This Basically Contains Admin Register Page.
http://localhost:5173/admin/login ->> This contains Login Page.
http://localhost:5173/admin/dashboard ->> This contains admin dashboard.
http://localhost:5173/user_name --> This user_name changes According To the shop, this page acts as file uploading to that specific shop.


Usage

Scan the shop-specific QR code.

Upload your document.

Set a timer for auto-deletion.

Admin prints the document directly from the dashboard.
