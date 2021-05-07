import React from "react";
import { Link, withRouter } from "react-router-dom";

function Navigation(props) {
  let token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    alert("You have been logged out");
  }

  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Image Repo
          </Link>

          <div>
            <ul className="navbar-nav ml-auto">
              <li
                className={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </Link>
              </li>
              { !token &&
                <li
                  className={`nav-item  ${
                    props.location.pathname === "/signup" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              }
              
              { !token &&
                <li
                  className={`nav-item  ${
                    props.location.pathname === "/signin" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to="/signin">
                    Login
                  </Link>
                </li>
              }

              { token && 
                <li
                  className={`nav-item  ${
                    props.location.pathname === "/myimages" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to="/myimages">
                    My Images
                  </Link>
                </li>
              }

              { token && 
                <li
                  className={`nav-item  ${
                    props.location.pathname === "/upload" ? "active" : ""
                  }`}
                >
                  <Link className="nav-link" to="/upload">
                    Upload
                  </Link>
                </li>
              }

              { token &&
                <Link className="nav-link" to="/" onClick={logout}>
                  Logout
                </Link>
              }
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);