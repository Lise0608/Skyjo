package skyjo;

import skyjo.dao.DaoCompte;
import skyjo.dao.DaoGame;
import skyjo.dao.DaoPlayer;
import skyjo.dao.JpaContext;
import skyjo.entities.Admin;
import skyjo.entities.Game;
import skyjo.entities.GameMode;
import skyjo.entities.Player;
import skyjo.entities.PlayerId;
import skyjo.entities.User;

public class MainTest {

	public static void main(String[] args) {

		DaoCompte daoCompte = JpaContext.getDaoCompte();
		DaoPlayer daoPlayer = JpaContext.getDaoPlayer();
		DaoGame daoGame = JpaContext.getDaoGame();
		
		daoCompte.insert(new User("test", "test"));
		daoCompte.insert(new Admin("Admin", "Admin"));

		User Utilisateur1 = new User("Test", "Test"); 
		Game Game1 = new Game(new GameMode(100, null)); 
		PlayerId playerId1 = new PlayerId(Utilisateur1, Game1);
		Player player1 = new Player(playerId1,50);
		
		daoCompte.insert(Utilisateur1);
		daoGame.insert(Game1);		
		daoPlayer.insert(player1);
		
		
		
		
		
		
		JpaContext.closeJpa();
	}
}