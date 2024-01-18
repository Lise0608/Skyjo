package formation.soprasteria.skyjoBoot.services;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formation.soprasteria.skyjoBoot.entities.Game;
import formation.soprasteria.skyjoBoot.exceptions.GameException;
import formation.soprasteria.skyjoBoot.exceptions.GameNotFoundException;
import formation.soprasteria.skyjoBoot.repositories.GameRepositories;

@Service
public class GameService {
	@Autowired
	private GameRepositories gameRepo;
	
	public Game create(Game game) {
		if (game.getId() != null) {
			throw new GameException("Partie déjà existante");
		}

		return gameRepo.save(game);
	}

	public Game findById(Long id) {
		if (id == null) {
			throw new GameException("Id null");
		}
		return gameRepo.findById(id).orElseThrow(() -> {
			throw new GameNotFoundException("Game avec Id" + id + " non trouvée");
		});
	}
	
	public List<Game> findAll() {
		return gameRepo.findAll();
	}
	
	public void deleteById(Long id) {
		Game gameToDelete = findById(id);
		if(gameToDelete == null) {
			throw new GameNotFoundException("Game avec l'ID :" + id + " non trouvée");
		}
		try {
			gameRepo.delete(gameToDelete);			
		} catch (Exception e) {
			e.printStackTrace();
			throw new GameException(e.getMessage());
		}
	}

	public void delete(Game game) {
		if(game.getId() == null) {
			throw new IllegalArgumentException("Game ID est null");
		}
		deleteById(game.getId());
	}
	
	public Game update(Game game) {
		if(game.getId() == null) {
			throw new IllegalArgumentException("Game ID est null");
		}
		
		Game gameEnBase = findById(game.getId());
		
		if(gameEnBase == null) {
			throw new GameNotFoundException("Game avec l'ID :" + game.getId() + " non trouvée");
		}
		
		BeanUtils.copyProperties(game, gameEnBase, "id");
		
		return gameRepo.save(gameEnBase);
		
	}
}
