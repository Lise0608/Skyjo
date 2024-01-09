package skyjoRest.dto.response;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;

import skyjo.entities.Game;

public class GameResponse {
	
	private Long id; 
	private int scoreAAtteindre;
	private String specificites;
	//private Deck deck;
	private List <PlayerResponse> players;

	public GameResponse () {

	}

	public GameResponse (Game gameEntity) {
		this(gameEntity, false);
	}

	public GameResponse (Game gameEntity, boolean loadPlayers) {
		BeanUtils.copyProperties (gameEntity, this, "players");
		if (loadPlayers) {
			if (gameEntity.getPlayers()!= null) {
				gameEntity.getPlayers().stream().map(p-> new PlayerResponse(p)).collect(Collectors.toList());		
			}
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}	

//	public Deck getDeck() {
//		return deck;
//	}
//
//	public void setDeck(Deck deck) {
//		this.deck = deck;
//	}

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

	public List<PlayerResponse> getPlayers() {
		return players;
	}

	public void setPlayers(List<PlayerResponse> players) {
		this.players = players;
	}
	
}
