package skyjoRest.dto.request;

import jakarta.validation.constraints.Min;

public class PlayerRequest {
	
	private Long userid;
	private Long gameId;
	
	@Min(value = 0)
	private int score;
	
	public PlayerRequest() {
		// TODO Auto-generated constructor stub
	}
	
	
}
