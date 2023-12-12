package skyjo.dao;

import java.util.List;

import skyjo.dao.JpaContext;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import skyjo.entities.Game;
import skyjo.entities.PlayerId;
import skyjo.entities.User;

public class DaoPlayerIdJpaImpl implements DaoPlayerId{

	@Override
	public void insert(PlayerId obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(obj);
		tx.commit();
		em.close();
	}

	@Override
	public void update(PlayerId obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(obj);
		tx.commit();
		em.close();
	}

	@Override
	public void delete(PlayerId obj) {
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
	public PlayerId findByKey(Long key) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		PlayerId playerId = em.find(PlayerId.class, key);
		em.close();
		return playerId;
	}

	@Override
	public List<PlayerId> findAll() {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		TypedQuery<PlayerId> query = em.createQuery("from PlayerId c", PlayerId.class);
		List<PlayerId> playerId = query.getResultList();
		em.close();
		return playerId;
	}
	
//	public PlayerId getPlayerIdByUserAndGame(User user, Game game) {
//		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
//		TypedQuery<PlayerId> query = em.createQuery("SELECT pi FROM PlayerId pi WHERE pi.user = :user AND pi.game = :game", PlayerId.class);
//	    query.setParameter("user", user);
//	    query.setParameter("game", game);
//	    PlayerId playerId = null;
//		try {
//			playerId = query.getSingleResult();
//		} catch (NoResultException ex) {
//
//		}
//		em.close();
//		return playerId;
//	}
//	
//	public List<PlayerId> getPlayerIdByUser(User user) {
//		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
//		TypedQuery<PlayerId> query = em.createQuery("SELECT pi FROM PlayerId pi WHERE pi.user = :user", PlayerId.class);
//	    query.setParameter("user", user);
//		List<PlayerId> list = query.getResultList();
//		em.close();
//		return list;
//	}
}
