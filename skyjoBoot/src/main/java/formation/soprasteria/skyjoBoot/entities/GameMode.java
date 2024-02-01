package formation.soprasteria.skyjoBoot.entities;

import jakarta.persistence.Embeddable;

@Embeddable
public class GameMode {
	
	
private int scoreAAtteindre;
private int nombreDeTours;
private String specificites;




public GameMode() {
}

public GameMode(int scoreAAtteindre) {
	this.scoreAAtteindre = scoreAAtteindre;
}

public GameMode(int scoreAAtteindre, String specificites) {
	this.scoreAAtteindre = scoreAAtteindre;
	this.specificites = specificites;
}



public GameMode(int scoreAAtteindre, int nombreDeTours, String specificites) {
	this.scoreAAtteindre = scoreAAtteindre;
	this.nombreDeTours = nombreDeTours;
	this.specificites = specificites;
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

}
