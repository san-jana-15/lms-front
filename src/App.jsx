import { Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import PrivateRoute from "./components/PrivateRoute";

/* Tutor pages */
import TutorAvailability from "./pages/Tutor/TutorAvailability";
import TutorBookings from "./pages/Tutor/TutorBookings";
import TutorPayments from "./pages/Tutor/TutorPayments";
import TutorRecordings from "./pages/Tutor/TutorRecordings";
import TutorReviews from "./pages/Tutor/TutorReviews";
import TutorSetupPage from "./pages/Tutor/TutorSetupPage";

/* Student pages */
import StudentBookings from "./pages/StudentBookings";
import StudentPayments from "./pages/StudentPayments";
import StudentRecordings from "./pages/StudentRecordings";   // ➕ ADDED
import StudentProfile from "./pages/StudentProfile";         // ➕ ADDED

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<AuthPage />} />

      {/* ==================== STUDENT ROUTES ==================== */}
      <Route
        path="/dashboard/student"
        element={
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        }
      />

      {/* Student Bookings */}
      <Route
        path="/dashboard/student/bookings"
        element={
          <PrivateRoute>
            <StudentBookings />
          </PrivateRoute>
        }
      />

      {/* Student Payments */}
      <Route
        path="/dashboard/student/payments"
        element={
          <PrivateRoute>
            <StudentPayments />
          </PrivateRoute>
        }
      />

      {/* Student Recordings  ➕ ADDED */}
      <Route
        path="/dashboard/student/recordings"
        element={
          <PrivateRoute>
            <StudentRecordings />
          </PrivateRoute>
        }
      />

      {/* Student Profile  ➕ ADDED */}
      <Route
        path="/dashboard/student/profile"
        element={
          <PrivateRoute>
            <StudentProfile />
          </PrivateRoute>
        }
      />

      {/* ==================== TUTOR ROUTES ==================== */}
      <Route
        path="/dashboard/tutor"
        element={
          <PrivateRoute>
            <TutorDashboard />
          </PrivateRoute>
        }
      />

      {/* Tutor Setup Page */}
      <Route
        path="/dashboard/tutor/setup"
        element={
          <PrivateRoute>
            <TutorSetupPage />
          </PrivateRoute>
        }
      />

      {/* Tutor Availability */}
      <Route
        path="/dashboard/tutor/availability"
        element={
          <PrivateRoute>
            <TutorAvailability />
          </PrivateRoute>
        }
      />

      {/* Tutor Bookings */}
      <Route
        path="/dashboard/tutor/bookings"
        element={
          <PrivateRoute>
            <TutorBookings />
          </PrivateRoute>
        }
      />

      {/* Tutor Payments */}
      <Route
        path="/dashboard/tutor/payments"
        element={
          <PrivateRoute>
            <TutorPayments />
          </PrivateRoute>
        }
      />

      {/* Tutor Recordings */}
      <Route
        path="/dashboard/tutor/recordings"
        element={
          <PrivateRoute>
            <TutorRecordings />
          </PrivateRoute>
        }
      />

      {/* Tutor Reviews */}
      <Route
        path="/dashboard/tutor/reviews"
        element={
          <PrivateRoute>
            <TutorReviews />
          </PrivateRoute>
        }
      />

      {/* ==================== ADMIN ROUTES ==================== */}
      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
