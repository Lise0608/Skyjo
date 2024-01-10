package skyjo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import skyjo.entities.Compte;

public interface CompteRepositories extends JpaRepository<Compte, Long> {

}
