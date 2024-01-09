package skyjoRest.dto.request;

import java.util.List;

import skyjo.entities.Player;

public class GameRequest {
		private Long id; 
		private GameMode gameMode;
		private Deck deck;
		private List <Player> players;
		
		public GameRequest() {

		}

		public synchronized Long getId() {
			return id;
		}

		public synchronized void setId(Long id) {
			this.id = id;
		}

		public synchronized GameMode getGameMode() {
			return gameMode;
		}

		public synchronized void setGameMode(GameMode gameMode) {
			this.gameMode = gameMode;
		}

		public synchronized Deck getDeck() {
			return deck;
		}

		public synchronized void setDeck(Deck deck) {
			this.deck = deck;
		}

		public synchronized Long getPlayerId() {
			return playerId;
		}

		public synchronized void setPlayerId(Long playerId) {
			this.playerId = playerId;
		}
}
