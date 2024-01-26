<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Formulaire d'inscription</title>
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
	rel="stylesheet" />

<style>
body {
	background-color: #ececec;
}

.navbar {
	background: #007BFF;
	background: linear-gradient(to right, #007BFF, #00FFB0);
}
</style>

<script>
	function validatePassword() {
		var passwordInput = document.getElementById("mdp");
		var confirmPasswordInput = document.getElementById("confirmMdp");

		if (passwordInput.value !== confirmPasswordInput.value) {
			alert("Les mots de passe ne correspondent pas.");
			return false;
		}
		return true;
	}
	function togglePassword() {
		var passwordInput = document.getElementById("mdp");
		var eyeIcon = document.getElementById("eye-icon");

		if (passwordInput.type === "password") {
			passwordInput.type = "text";
			eyeIcon.classList.remove("fa-eye");
			eyeIcon.classList.add("fa-eye-slash");
		} else {
			passwordInput.type = "password";
			eyeIcon.classList.remove("fa-eye-slash");
			eyeIcon.classList.add("fa-eye");
		}
	}
</script>
</head>
<body>
	<nav class="navbar navbar-expand-lg navbar-light custom-navbar">
		<div class="container-fluid">
			<div class="navbar-nav me-auto">
				<a class="nav-link text-light" href="#">Rules of the game</a>
			</div>
			<div class="navbar-nav ms-auto">
				<a class="nav-link text-light" href="#">Log In</a>
			</div>
		</div>
	</nav>

	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card shadow p-3 mb-5 bg-body-tertiary rounded-4">
					<div class="card-body">
						<h2 class="text-center mb-4 text-dark">Create Your Account</h2>

						<form id="registrationForm"
							action="${pageContext.request.contextPath}/inscription"
							method="post" onsubmit="return validatePassword();">
							<div>
								<label for="login" class="text-dark">Choose your login :</label>
								<input type="text" class="form-control rounded-pill mb-3"
									id="login" name="login" required>
							</div>
							<div>
								<label for="mdp">Choose your password :</label>
								<div class="input-group">
									<input type="password" class="form-control rounded-pill mb-3"
										id="mdp" name="mdp" required>
									<button type="button" class="btn btn-outline-secondary"
										onclick="togglePassword()">
										<i id="eye-icon" class="fas fa-eye"></i>
									</button>
								</div>
							</div>
							<div>
								<label for="confirmMdp">Confirm your password :</label> <input
									type="password" class="form-control rounded-pill mb-3"
									id="confirmMdp" name="confirmMdp" required>
							</div>
							<div>
								<label for="email">Enter your email address :</label> <input
									type="email" class="form-control rounded-pill mb-3" id="email"
									name="email" required>
							</div>
							<div class="d-grid">
								<button type="submit" class="btn rounded-pill mb-3"
									style="background: linear-gradient(to right, #007BFF, #00FFB0); color: white">S'inscrire</button>
							</div>
						</form>

						<div id="successMessage" style="display: none; margin-top: 10px;">
							<p class="text-success">Merci pour votre inscription !</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
