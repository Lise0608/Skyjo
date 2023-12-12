package skyjo.dao;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;
import skyjo.entities.Admin;
import skyjo.entities.Compte;
import skyjo.entities.User;

public class DaoCompteJpaImpl implements DaoCompte{

	@Override
	public void insert(Compte obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(obj);
		tx.commit();
		em.close();
	}

	@Override
	public void update(Compte obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(obj);
		tx.commit();
		em.close();
	}

	@Override
	public void delete(Compte obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.remove(em.merge(obj));
		tx.commit();
		em.close();
	}

	@Override
	public void deleteByKey(Long key) {
		delete(findByKey(key));
	}

	@Override
	public Compte findByKey(Long key) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		Compte compte = em.find(Compte.class, key);
		em.close();
		return compte;
	}

	@Override
	public List<Compte> findAll() {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		TypedQuery<Compte> query = em.createQuery("from Compte c", Compte.class);
		List<Compte> comptes = query.getResultList();
		em.close();
		return comptes;
	}
	
	@Override
	public List<Admin> findAdmin() {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		TypedQuery<Admin> query = em.createQuery("from Admin a", Admin.class);
		List<Admin> comptes = query.getResultList();
		em.close();
		return comptes;
	}
	
	@Override
	public List<User> findSecretaire() {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		TypedQuery<User> query = em.createQuery("from User u", User.class);
		List<User> comptes = query.getResultList();
		em.close();
		return comptes;
	}

}
