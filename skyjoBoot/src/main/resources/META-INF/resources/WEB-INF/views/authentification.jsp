<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
      crossorigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
      crossorigin="anonymous"
    ></script>
    <title>Document</title>
    <style>
      body {
        background-color: #ececec;
      }

      .navbar {
        background: #007bff;
        background: linear-gradient(to right, #007bff, #00ffb0);
      }
    </style>
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-light custom-navbar">
      <div class="container-fluid">
        <!-- Left-aligned items -->
        <div class="navbar-nav me-auto">
          <a class="nav-link text-light" href="#">Rules of the game</a>
        </div>

        <!-- Right-aligned items -->
        <div class="navbar-nav ms-auto">
          <a class="nav-link text-light" href="#">Log In</a>
        </div>
      </div>
    </nav>

    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="card shadow p-3 mb-5 bg-body-tertiary rounded-4">
            <div class="card-body">
              <h3 class="text-center mb-4">Skyjo</h3>
              <form>
                <div class="mb-3">
                  <label for="login" class="form-label">Username</label>
                  <input type="text" class="form-control rounded-pill mb-3" id="login" name="login" placeholder="Username" />
                </div>
                <div class="mb-3">
                  <label for="mdp" class="form-label">Password</label>
                  <input type="password" class="form-control rounded-pill mb-3" id="mdp" name="mdp" placeholder="Password" />
                </div>
                <div class="mb-3">
                  <a href="#">Forgot password?</a>
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn rounded-pill mb-3" style="background-color: #0094ff; color: white">Login</button>
                </div>
                <div class="d-grid mt-2">
                  <button type="button" class="btn rounded-pill mb-3" style="background-color: #d9d9d9">Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
