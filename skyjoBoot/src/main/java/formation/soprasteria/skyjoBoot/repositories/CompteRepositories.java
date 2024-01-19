package formation.soprasteria.skyjoBoot.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import formation.soprasteria.skyjoBoot.entities.Compte;


public interface CompteRepositories extends JpaRepository<Compte, Long> {
	Optional<Compte> findByLogin(String login);
	
	Optional<Compte> findByLoginAndIdNot(String login, Long id);

}

