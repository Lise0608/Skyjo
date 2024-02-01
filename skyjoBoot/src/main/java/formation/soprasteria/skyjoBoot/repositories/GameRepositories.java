package formation.soprasteria.skyjoBoot.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import formation.soprasteria.skyjoBoot.entities.Game;

public interface GameRepositories extends JpaRepository<Game, Long>{
	
}

