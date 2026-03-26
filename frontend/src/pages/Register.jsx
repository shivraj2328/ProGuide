import "../styles/pages/Login.css";

function Register() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        <form>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />

          <button>Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;