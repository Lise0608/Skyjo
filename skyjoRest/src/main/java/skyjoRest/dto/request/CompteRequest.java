package skyjoRest.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CompteRequest {
	private Long id;
	@NotBlank
	private String login;
	@NotBlank
	private String password;
	@NotBlank
	private String type;
	
	public CompteRequest() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
