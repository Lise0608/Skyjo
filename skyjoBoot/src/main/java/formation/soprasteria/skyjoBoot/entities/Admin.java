package formation.soprasteria.skyjoBoot.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("A")
public class Admin extends Compte {

	public Admin() {
		// TODO Auto-generated constructor stub
	}
	
	public Admin(String login, String password) {
		super(login, password);
	}
}
