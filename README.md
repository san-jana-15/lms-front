# LMS – Learning Management System

A full–stack LMS application with:

- Student Dashboard  
- Tutor Dashboard  
- Admin Dashboard  
- Session Bookings  
- Tutor Availability  
- Recording Purchases  
- Reviews & Ratings  
- User Role Management  
- User Activation / Deactivation  

---

## 🔧 Tech Stack

### Frontend
- React  
- Vite  
- TailwindCSS  
- Axios  
- React Router  

## 📁 Project Structure

frontend/
    ├── src/
    ├── public/
    ├── vite.config.js
    └── package.json
```


## 🚀 Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend URL:
```
http://localhost:5173
```

---

## 🔗 API Base URL

```
http://localhost:5000/api
```

---

## 📌 Main API Endpoints

### Auth
- POST /auth/register  
- POST /auth/login  
- GET /auth/profile  

### Tutors
- GET /tutors  
- GET /tutors/profile/me  
- PUT /tutors/profile/update  

### Bookings
- POST /bookings  
- GET /bookings/student  
- GET /bookings/tutor  
- PATCH /bookings/accept/:id  
- PATCH /bookings/decline/:id  
- PATCH /bookings/reschedule/:id  
- PATCH /bookings/tutor-reschedule/:id  
- PATCH /bookings/cancel/:id  

### Recordings
- GET /recordings  
- POST /recordings/upload  

### Payments
- POST /fake-payment/pay  
- GET /fake-payment/paid  

### Reviews
- POST /reviews  
- GET /reviews/tutor/:id  

### Admin
- PUT /admin/toggle/:id  
- PUT /admin/role/:id  

---

1. Start frontend:
```
cd frontend
npm run dev
```

Your LMS system is now running.

---

## 📄 License

This project is for educational and development use.