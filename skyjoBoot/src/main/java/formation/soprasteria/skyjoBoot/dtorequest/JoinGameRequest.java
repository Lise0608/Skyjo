package formation.soprasteria.skyjoBoot.dtorequest;

import formation.soprasteria.skyjoBoot.dtoresponse.CompteResponse;

public class JoinGameRequest {
	private String token;
	private CompteResponse compteResponse;

	public JoinGameRequest() {
		super();
	}

	public JoinGameRequest(String token, CompteResponse compteResponse) {
		super();
		this.token = token;
		this.compteResponse = compteResponse;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public CompteResponse getCompteResponse() {
		return compteResponse;
	}

	public void setCompteResponse(CompteResponse compteResponse) {
		this.compteResponse = compteResponse;
	}

}
