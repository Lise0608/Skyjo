package formation.soprasteria.skyjoBoot.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import formation.soprasteria.skyBoot.entities.Player;
import formation.soprasteria.skyBoot.entities.PlayerId;

public interface PlayerRepositories extends JpaRepository<Player, PlayerId> {

}
