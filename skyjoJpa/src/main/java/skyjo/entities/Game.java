package skyjo.entities;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table (name = "game")
public class Game {
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id; 
	@Embedded
	private GameMode gameMode;
	@Transient
	private Deck deck;
	@OneToMany(mappedBy = "id.game")
	private List <Player> players;

public Game() {
}

public Game(GameMode gameMode) {
this.gameMode = gameMode;
}

public Game(GameMode gameMode, Deck deck) {
	super();
	this.gameMode = gameMode;
	this.deck = deck;
}

public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

public GameMode getGameMode() {
	return gameMode;
}

public void setGameMode(GameMode gameMode) {
	this.gameMode = gameMode;
}

public Deck getDeck() {
	return deck;
}

public void setDeck(Deck deck) {
	this.deck = deck;
}

public List<Player> getPlayers() {
	return players;
}

public void setPlayers(List<Player> players) {
	this.players = players;
}

@Override
public int hashCode() {
	return Objects.hash(id);
}

@Override
public boolean equals(Object obj) {
	if (this == obj)
		return true;
	if (obj == null)
		return false;
	if (getClass() != obj.getClass())
		return false;
	Game other = (Game) obj;
	return Objects.equals(id, other.id);
}

public void Start() {
	return;
}
public void StartNextGame() {
	return;
}
}
