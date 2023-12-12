package skyjo.dao;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JpaContext {
	private static EntityManagerFactory emf = null;

	private static DaoCompte daoCompte= new DaoCompteJpaImpl();
//	private static DaoFournisseur daoFournisseur = new DaoFournisseurImpl();
//	private static DaoCommande daoCommande = new DaoCommandeImpl();
//	private static DaoProduit daoProduit = new DaoProduitImpl();
//	private static DaoCategorie daoCategorie = new DaoCategorieImpl();
//	private static DaoLigneCommande daoLigneCommande = new DaoLigneCommandeJpaImpl();
//
	public static DaoCompte getDaoCompte() {
		return daoCompte;
	}
//
//	public static DaoClient getDaoClient() {
//		return daoClient;
//	}
//
//	public static DaoFournisseur getDaoFournisseur() {
//		return daoFournisseur;
//	}
//
//	public static DaoCommande getDaoCommande() {
//		return daoCommande;
//	}
//
//	public static DaoProduit getDaoProduit() {
//		return daoProduit;
//	}
//
//	public static DaoCategorie getDaoCategorie() {
//		return daoCategorie;
//	}

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
