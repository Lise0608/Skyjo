package skyjo.entities;

public class GameMode {
private int scoreAAtteindre;
private String specificites;

public GameMode(int scoreAAtteindre, String specificites) {
	super();
	this.scoreAAtteindre = scoreAAtteindre;
	this.specificites = specificites;
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

}
