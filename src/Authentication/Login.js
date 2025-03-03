import React, { useState } from "react";
import LoginAnimation from "./Animation/LoginAnimation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        user_email: email,
        password: password,
      });

      if (response.data.token) {
        alert(response.data.empName);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("emp_id", response.data.emp_id); // Save emp_id
        localStorage.setItem("user_name", response.data.empName); // Save user_name
        alert("Login successful!");
        navigate("/"); // Redirect to dashboard
      }
    } catch (err) {
      console.log(err,"show error")
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <div>
        <div>
          <img
            src="/Assets/Logo/logo.png"
            alt="logo"
            style={{ position: "absolute", width: "15%", top: "5%", right: "5%" }}
          />
          <div className="row">
            <div className="col-md-6">
              <div
                className="bg-primary"
                style={{
                  height: "100vh",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopRightRadius: "10%",
                  borderBottomRightRadius: "10%",
                }}
              >
                <LoginAnimation />
              </div>
            </div>

            <div className="col-md-6">
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  right: "0",
                  top: "15%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%", textAlign: "left" }}>
                  <h1>LOGIN</h1>
                </div>
              </div>
              <div
                className="h-100"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "Left",
                }}
              >
                <form onSubmit={handleLogin} style={{ width: "80%" }}>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <div className="form-group">
                    <label htmlFor="email">Email address:</label>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        className="form-control"
                        style={{ borderRight: "none" }}
                        placeholder="USERNAME"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div
                        className="input-group-append"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #ced4da",
                          padding: "0px 10px",
                          borderRadius: "0px 5px 5px 0px",
                          borderLeft: "none",
                        }}
                      >
                        <i className="fa-solid fa-user"></i>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pwd">Password:</label>
                    <div className="input-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        style={{ borderRight: "none" }}
                        placeholder="PASSWORD"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div
                        className="input-group-append"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #ced4da",
                          padding: "0px 10px",
                          borderRadius: "0px 5px 5px 0px",
                          borderLeft: "none",
                        }}
                      >
                        <i className="fa-solid fa-eye-slash"></i>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-2">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
