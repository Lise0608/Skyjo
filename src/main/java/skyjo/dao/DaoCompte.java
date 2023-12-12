package skyjo.dao;

import java.util.List;

import skyjo.entities.Admin;
import skyjo.entities.Compte;
import skyjo.entities.User;

public interface DaoCompte extends DaoGeneric<Compte, Long>{
	public List<Admin> findAdmin();
	public List<User> findSecretaire();
}
