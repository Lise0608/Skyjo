package skyjoRest.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CompteRequest {
	private Long id;
	@NotBlank
	private String login;
	@NotBlank
	private String password;
	
	public CompteRequest() {

	}

	public synchronized Long getId() {
		return id;
	}

	public synchronized void setId(Long id) {
		this.id = id;
	}

	public synchronized String getLogin() {
		return login;
	}

	public synchronized void setLogin(String login) {
		this.login = login;
	}

	public synchronized String getPassword() {
		return password;
	}

	public synchronized void setPassword(String password) {
		this.password = password;
	}
}
