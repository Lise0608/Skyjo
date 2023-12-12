package skyjo.dao;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;
import skyjo.entities.Player;

public class DaoPlayerJpaImpl implements DaoPlayer{

	@Override
	public void insert(Player obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(obj);
		tx.commit();
		em.close();
	}

	@Override
	public void update(Player obj) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(obj);
		tx.commit();
		em.close();
	}

	@Override
	public void delete(Player obj) {
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
	public Player findByKey(Long key) {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		Player player = em.find(Player.class, key);
		em.close();
		return player;
	}

	@Override
	public List<Player> findAll() {
		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
		TypedQuery<Player> query = em.createQuery("from Player c", Player.class);
		List<Player> players = query.getResultList();
		em.close();
		return players;
	}
	
//	public List<Player> findTop10PlayersByScore() {
//		EntityManager em = JpaContext.getEntityManagerFactory().createEntityManager();
//		TypedQuery<Player> query = em.createQuery("select p from Player p ORDER BY p.score ASC", Player.class);
//		//Rajouter prendre les 10 premiers joueurs
//		List<Player> players = query.getResultList();
//		em.close();
//		return players;
//	}

}
