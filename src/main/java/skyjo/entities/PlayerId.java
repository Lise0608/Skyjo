package skyjo.entities;

import java.util.Objects;

import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ForeignKey;

@Embeddable
public class PlayerId {
	@ManyToOne //(fetch = FetchType.EAGER) // EAGER/LAZY
	@JoinColumn(name = "user_player_id", foreignKey = @ForeignKey(name = "user_player_id_fk"))
	private User user;
	@ManyToOne
	@JoinColumn(name = "game_player_id", foreignKey = @ForeignKey(name = "game_player_id_fk"))
	private Game game;
	
	public PlayerId() {
	    }
	
	public PlayerId(User user, Game game) {
		this.user = user;
		this.game = game;
	}
	
	public User getUser() {
		return user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public Game getGame() {
		return game;
	}
	
	public void setGame(Game game) {
		this.game = game;
	}

	public int hashCode() {
		return Objects.hash(user, game);
	}

	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PlayerId other = (PlayerId) obj;
		return Objects.equals(user, other.user) && Objects.equals(game, other.game);
	}

}
