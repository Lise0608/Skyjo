package skyjo.dao;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JpaContext {
	private static EntityManagerFactory emf = null;

//	private static DaoClient daoClient = new DaoClientImpl();
	

//	public static DaoLigneCommande getDaoLigneCommande() {
//		return daoLigneCommande;
//	}
//
//	public static DaoClient getDaoClient() {
//		return daoClient;
//	}


	public static EntityManagerFactory getEntityManagerFactory() {
		if (emf == null) {
			emf = Persistence.createEntityManagerFactory("jpa");
		}
		return emf;
	}

	public static void closeJpa() {
		if (emf != null) {
			emf.close();
			emf = null;
		}
	}
}
