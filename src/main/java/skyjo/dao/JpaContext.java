package skyjo.dao;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JpaContext {
	private static EntityManagerFactory emf = null;

	private static DaoCompte daoCompte= new DaoCompteJpaImpl();
	public static DaoCompte getDaoCompte() {
		return daoCompte;
	}

	public static EntityManagerFactory getEntityManagerFactory() {
		if (emf == null) {
			emf = Persistence.createEntityManagerFactory("skyjo");
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
