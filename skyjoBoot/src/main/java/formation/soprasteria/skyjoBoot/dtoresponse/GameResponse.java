package formation.soprasteria.skyjoBoot.dtoresponse;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonView;

import formation.soprasteria.skyjoBoot.entities.Game;

public class GameResponse {

	@JsonView(JsonViews.Game.class)
	private Long id;
	@JsonView(JsonViews.Game.class)
	private int scoreAAtteindre;
	@JsonView(JsonViews.Game.class)
	private int nombreDeTours;
	@JsonView(JsonViews.Game.class)
	private String specificites;
	@JsonView(JsonViews.Game.class)
	private LocalDate date;
	@JsonView(JsonViews.Game.class)
	private List<PlayerResponse> players;

	public GameResponse() {

	}

	public GameResponse(Game gameEntity) {
		this.id = gameEntity.getId();
		if (gameEntity.getGameMode() != null) {
			this.scoreAAtteindre = gameEntity.getGameMode().getScoreAAtteindre();
			this.nombreDeTours = gameEntity.getGameMode().getNombreDeTours();
			this.specificites = gameEntity.getGameMode().getSpecificites();
		}
		if (gameEntity.getDate() != null) {
			this.date = gameEntity.getDate();
		}
		if (gameEntity.getPlayers() != null) {
			this.players = gameEntity.getPlayers().stream().map(p -> new PlayerResponse(p))
					.collect(Collectors.toList());
		}
	}

	public GameResponse(Game gameEntity, boolean loadPlayers) {
		BeanUtils.copyProperties(gameEntity, this, "players");
		if (loadPlayers) {
			if (gameEntity.getPlayers() != null) {
				gameEntity.getPlayers().stream().map(p -> new PlayerResponse(p)).collect(Collectors.toList());
			}
		}
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
	

	public int getNombreDeTours() {
		return nombreDeTours;
	}

	public void setNombreDeTours(int nombreDeTours) {
		this.nombreDeTours = nombreDeTours;
	}

	public String getSpecificites() {
		return specificites;
	}

	public void setSpecificites(String specificites) {
		this.specificites = specificites;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public List<PlayerResponse> getPlayers() {
		return players;
	}

	public void setPlayers(List<PlayerResponse> players) {
		this.players = players;
	}

}
