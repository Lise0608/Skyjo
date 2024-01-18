package formation.soprasteria.skyjoBoot.dtoresponse;

import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonView;

import formation.soprasteria.skyjoBoot.entities.Player;

public class PlayerResponse {

	@JsonView(JsonViews.Player.class)
	private Long userid;
	@JsonView(JsonViews.Player.class)
	private Long gameId;
	@JsonView(JsonViews.Player.class)
	private int score;

	public PlayerResponse() {

	}

	public PlayerResponse(Player playerEntity) {
		BeanUtils.copyProperties(playerEntity, this);
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
