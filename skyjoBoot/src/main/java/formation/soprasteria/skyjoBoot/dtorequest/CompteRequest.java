package formation.soprasteria.skyjoBoot.dtorequest;

public class CompteRequest {
	private String login;
	private String password;
	private String email;

	
	public CompteRequest() {

	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}


	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
