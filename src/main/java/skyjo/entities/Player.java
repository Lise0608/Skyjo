package skyjo.entities;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "player")
public class Player {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "player_id")
    private Long id;
	@Column(name = "score")
	private int score;
	@ManyToOne
	@JoinColumn(name = "id", foreignKey = @ForeignKey(name = "fk_player_game"))
	private Game game;
	
	// name = get_username

    // @Transient
    // private Board board;

	public Player() {

	}
	
    public Player(int score) {
		this.score = score;
	}

	public Player(Long id, int score) {
		this.id = id;
		this.score = score;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
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
