package formation.soprasteria.skyjoBoot.dtoresponse;


import org.springframework.beans.BeanUtils;

import formation.soprasteria.skyBoot.entities.Compte;



public class CompteResponse {

	private Long id;

	private String login;

	private String password;

	public CompteResponse() {

	}

	public CompteResponse(Compte compteEntity) {
		BeanUtils.copyProperties(compteEntity, this);

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

}
