import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Authentication/Login";
import Dashboard from "./Componets/deshboard/Dashboard";
import Leves from "./Componets/leaves/Leves";
import Task from "./Componets/task/Task";
import Tickets from "./Componets/Tickets/Tickets";
import PrivateRoute from "./PrivateRoute"; // Import the PrivateRoute component
import Employee from "./Componets/Employee/Employee";

function App() {
  return (
    <Router>
      <div className="App aspect-ratio-content">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/leaves" element={<PrivateRoute element={<Leves />} />} />
          <Route path="/tasks" element={<PrivateRoute element={<Task />} />} />
          <Route path="/tickets" element={<PrivateRoute element={<Tickets />} />} />
          <Route path="/employee" element={<PrivateRoute element={<Employee />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
