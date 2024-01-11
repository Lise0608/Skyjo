package skyjo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import skyjo.entities.Player;
import skyjo.entities.PlayerId;

public interface PlayerRepositories extends JpaRepository<Player, PlayerId> {

}
