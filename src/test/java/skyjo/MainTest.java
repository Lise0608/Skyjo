package skyjo;

import skyjo.dao.DaoCompte;
import skyjo.dao.DaoGame;
import skyjo.dao.DaoPlayer;
import skyjo.dao.JpaContext;
import skyjo.entities.Admin;
import skyjo.entities.Compte;
import skyjo.entities.Player;
import skyjo.entities.User;

public class MainTest {

	public static void main(String[] args) {

		DaoCompte daoCompte = JpaContext.getDaoCompte();
		DaoPlayer daoPlayer = JpaContext.getDaoPlayer();
		DaoGame daoGame = JpaContext.getDaoGame();
		
		daoCompte.insert(new User("test", "test"));
		daoCompte.insert(new Admin("Admin", "Admin"));
		
		daoPlayer.insert(new Player());
		
		
		
		
		
		JpaContext.closeJpa();
	}
}