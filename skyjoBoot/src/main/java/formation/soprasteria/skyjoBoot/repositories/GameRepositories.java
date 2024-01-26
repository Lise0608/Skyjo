package formation.soprasteria.skyjoBoot.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import formation.soprasteria.skyjoBoot.entities.Game;

public interface GameRepositories extends JpaRepository<Game, Long>{
	
}

