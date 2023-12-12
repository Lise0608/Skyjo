package skyjo.classe;

import java.util.Objects;

public class Game {
private Long id; 
private GameMode gameMode;
private Deck deck;

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
