package skyjoRest.dto.request;

import java.util.List;

public class GameRequest {
		private Long id; 
		private int scoreAAtteindre;
		private String specificites;
		private List <Long> playerIds;
		
		public GameRequest() {

		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
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
}
