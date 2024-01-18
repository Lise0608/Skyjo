package formation.soprasteria.skyjoBoot.dtorequest;

import java.util.List;
import java.util.Map;

public class GameRequest {

	private int scoreAAtteindre;
	private String specificites;
	private List<Long> playerIds;
	private Map<Long, Integer> playerScores;

	public GameRequest() {

	}

	public int getScoreAAtteindre() {
		return scoreAAtteindre;
	}

	public void setScoreAAtteindre(int scoreAAtteindre) {
		this.scoreAAtteindre = scoreAAtteindre;
	}

	public String getSpecificites() {
		return specificites;
	}

	public void setSpecificites(String specificites) {
		this.specificites = specificites;
	}

	public List<Long> getPlayerIds() {
		return playerIds;
	}

	public void setPlayerIds(List<Long> playerIds) {
		this.playerIds = playerIds;
	}

	public Map<Long, Integer> getPlayerScores() {
		return playerScores;
	}

	public void setPlayerScores(Map<Long, Integer> playerScores) {
		this.playerScores = playerScores;
	}

}
