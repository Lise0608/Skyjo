package skyjo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import skyjo.entities.Compte;

public interface CompteRepositories extends JpaRepository<Compte, Long> {
	List<Compte> findByLogin(String login);

	Optional<Compte> findByLoginAndIdNot(String login, Long id);
}
