package skyjo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import skyjo.entities.Game;



public interface GameRepositories extends JpaRepository<Game, Long>{

}

