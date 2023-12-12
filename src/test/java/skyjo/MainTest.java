package skyjo;

import skyjo.dao.DaoCompte;
import skyjo.dao.JpaContext;
import skyjo.entities.Admin;
import skyjo.entities.Compte;
import skyjo.entities.User;

public class MainTest {

	public static void main(String[] args) {
		
		DaoCompte daoCompte = JpaContext.getDaoCompte();
		
		daoCompte.insert(new User("test", "test"));
		daoCompte.insert(new Admin("Admin", "Admin"));
		
		
		
		
		
		JpaContext.closeJpa();
	}
}