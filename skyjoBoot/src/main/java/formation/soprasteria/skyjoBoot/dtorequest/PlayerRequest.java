package formation.soprasteria.skyjoBoot.dtorequest;

import jakarta.validation.constraints.Min;

public class PlayerRequest {

	private Long userid;
	private Long gameId;

	@Min(value = 0)
	private int score;

	public PlayerRequest() {
		// TODO Auto-generated constructor stub
	}

	public Long getUserid() {
		return userid;
	}

	public void setUserid(Long userid) {
		this.userid = userid;
	}

	public Long getGameId() {
		return gameId;
	}

	public void setGameId(Long gameId) {
		this.gameId = gameId;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

}
