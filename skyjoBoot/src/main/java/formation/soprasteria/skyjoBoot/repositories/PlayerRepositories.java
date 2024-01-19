package formation.soprasteria.skyjoBoot.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import formation.soprasteria.skyjoBoot.entities.Player;
import formation.soprasteria.skyjoBoot.entities.PlayerId;

public interface PlayerRepositories extends JpaRepository<Player, PlayerId> {
	List<Player> findByidGameId(Long gameId);
}
