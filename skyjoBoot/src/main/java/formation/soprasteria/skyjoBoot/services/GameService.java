package formation.soprasteria.skyjoBoot.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formation.soprasteria.skyjoBoot.dtoresponse.GameResponse;
import formation.soprasteria.skyjoBoot.dtoresponse.PlayerResponse;
import formation.soprasteria.skyjoBoot.entities.Game;
import formation.soprasteria.skyjoBoot.entities.Player;
import formation.soprasteria.skyjoBoot.exceptions.GameException;
import formation.soprasteria.skyjoBoot.exceptions.GameNotFoundException;
import formation.soprasteria.skyjoBoot.repositories.GameRepositories;

@Service
public class GameService {
	@Autowired
	private GameRepositories gameRepo;

	@Autowired
	private PlayerService playerService;

	public Game create(Game game) {
		if (game.getId() != null) {
			throw new GameException("Partie déjà existante");
		}

		gameRepo.save(game);

		// Sauvegarder les joueurs associés à la partie
		if (game.getPlayers() != null) {
			for (Player player : game.getPlayers()) {
				playerService.create(player);
			}
		}

		return game;
	}

	public Game findById(Long id) {
		if (id == null) {
			throw new GameException("Id null");
		}
		return gameRepo.findById(id).orElseThrow(() -> {
			throw new GameNotFoundException("Game avec Id" + id + " non trouvée");
		});
	}

	public List<GameResponse> findAll() {
		List<Game> games = gameRepo.findAll();
		List<GameResponse> gameResponses = new ArrayList<GameResponse>();
		for (Game game : games) {
			GameResponse gameResponse = new GameResponse(game);
			List<PlayerResponse> players = playerService.findByGameId(game.getId());
			gameResponse.setPlayers(players);
			gameResponses.add(gameResponse);
		}
		return gameResponses;
	}

	public List<GameResponse> findByUserId(Long userId) {
		List<PlayerResponse> playerResponses = playerService.findByUserId(userId);
		List<GameResponse> gameResponses = new ArrayList<>();

		for (PlayerResponse playerResponse : playerResponses) {

			GameResponse gameResponse = new GameResponse(findById(playerResponse.getGameId()));
			List<PlayerResponse> players = playerService.findByGameId(playerResponse.getGameId());
			gameResponse.setPlayers(players);
			gameResponses.add(gameResponse);
		}
		return gameResponses;
	}

	public void deleteById(Long id) {
		Game gameToDelete = findById(id);
		if (gameToDelete == null) {
			throw new GameNotFoundException("Game avec l'ID :" + id + " non trouvée");
		}
		try {
			playerService.deletePlayerByGameId(id);
			gameRepo.delete(gameToDelete);
		} catch (Exception e) {
			e.printStackTrace();
			throw new GameException(e.getMessage());
		}
	}

	public void delete(Game game) {
		if (game.getId() == null) {
			throw new IllegalArgumentException("Game ID est null");
		}
		deleteById(game.getId());
	}

	public Game update(Game game) {
		if (game.getId() == null) {
			throw new IllegalArgumentException("Game ID est null");
		}

		Game gameEnBase = findById(game.getId());

		if (gameEnBase == null) {
			throw new GameNotFoundException("Game avec l'ID :" + game.getId() + " non trouvée");
		}

		BeanUtils.copyProperties(game, gameEnBase, "id");

		return gameRepo.save(gameEnBase);

	}

}
