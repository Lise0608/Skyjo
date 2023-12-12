package skyjo.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("U")
public class User extends Compte{

	public User() {
		// TODO Auto-generated constructor stub
	}
	
	public User(String login, String password) {
		super(login, password);
	}
}
