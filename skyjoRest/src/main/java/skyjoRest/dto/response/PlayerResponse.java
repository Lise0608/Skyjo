package skyjoRest.dto.response;

import org.springframework.beans.BeanUtils;

public class PlayerResponse {
	private PlayerId id; 
	private int score;
	
	public PlayerResponse () {
		
	}
	
	public PlayerResponse (Player playerEntity) {
		BeanUtils.copyProperties (playerEntity , this);
	}

	public PlayerId getId() {
		return id;
	}

	public void setId(PlayerId id) {
		this.id = id;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

}
