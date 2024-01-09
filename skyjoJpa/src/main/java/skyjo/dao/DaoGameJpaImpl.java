package skyjo.dao;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;
import skyjo.entities.Game;

public class DaoGameJpaImpl implements DaoGame{

	@Override
	public void insert(Game obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(obj);
		tx.commit();
		em.close();
	}

	@Override
	public void update(Game obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(obj);
		tx.commit();
		em.close();
	}

	@Override
	public void delete(Game obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.remove(em.merge(obj));
		tx.commit();
		em.close();
	}

	@Override
	public void deleteByKey(Long key) {
	}

	@Override
	public Game findByKey(Long key) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		Game g = em.find(Game.class, key);
		em.close();
		return g;
	}

	@Override
	public List<Game> findAll() {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();	
		TypedQuery<Game> query = em.createQuery("FROM Game g", Game.class);
		List<Game> games = query.getResultList();
		em.close();
		return games;
	}

}
