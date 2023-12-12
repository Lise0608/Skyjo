package skyjo.entities;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "player")
public class Player {
	//@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EmbeddedId
	private PlayerId id;
	
	@Column(name = "score")
	private int score;
	
	
	// name = get_username

    // @Transient
    // private Board board;

	public Player() {

	}
	
    public Player(int score) {
		this.score = score;
	}

	public Player(PlayerId id, int score) {
		this.id = id;
		this.score = score;
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
		Player other = (Player) obj;
		return Objects.equals(id, other.id);
	}



	
}
