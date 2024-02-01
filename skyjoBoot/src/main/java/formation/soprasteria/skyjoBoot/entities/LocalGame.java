package formation.soprasteria.skyjoBoot.entities;

import java.util.List;

import formation.soprasteria.skyjoBoot.dtoresponse.CompteResponse;

public class LocalGame {

	private String token;
	private List<CompteResponse> compteResponses;

	public LocalGame() {
		super();
	}

	public LocalGame(String token, List<CompteResponse> compteResponses) {
		super();
		this.token = token;
		this.compteResponses = compteResponses;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public List<CompteResponse> getCompteResponses() {
		return compteResponses;
	}

	public void setCompteResponses(List<CompteResponse> compteResponses) {
		this.compteResponses = compteResponses;
	}

}
