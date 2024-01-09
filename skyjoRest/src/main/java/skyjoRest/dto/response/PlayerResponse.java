package skyjoRest.dto.response;

import org.springframework.beans.BeanUtils;

import skyjo.entities.Player;

public class PlayerResponse {
	private Long userid;
	private Long gameId;
	private int score;
	
	public PlayerResponse () {
		
	}
	
	public PlayerResponse (Player playerEntity) {
		BeanUtils.copyProperties (playerEntity , this);
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
