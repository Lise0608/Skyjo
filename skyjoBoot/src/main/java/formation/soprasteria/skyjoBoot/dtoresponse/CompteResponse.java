package formation.soprasteria.skyjoBoot.dtoresponse;

import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonView;

import formation.soprasteria.skyjoBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.entities.Role;

public class CompteResponse {

	@JsonView(JsonViews.Compte.class)
	private Long id;
	@JsonView(JsonViews.Compte.class)
	private String login;
	private String password;
	@JsonView(JsonViews.Compte.class)
	private String email;
	@JsonView(JsonViews.Compte.class)
	private Role role;
	
	public CompteResponse() {

	}
	
	public CompteResponse(Compte compteEntity) {
		BeanUtils.copyProperties(compteEntity, this);
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
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
	
	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

}
