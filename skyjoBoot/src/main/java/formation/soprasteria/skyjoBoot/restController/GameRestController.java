package formation.soprasteria.skyjoBoot.restController;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import formation.soprasteria.skyjoBoot.dtorequest.GameRequest;
import formation.soprasteria.skyjoBoot.dtoresponse.GameResponse;
import formation.soprasteria.skyjoBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.entities.Game;
import formation.soprasteria.skyjoBoot.entities.GameMode;
import formation.soprasteria.skyjoBoot.entities.Player;
import formation.soprasteria.skyjoBoot.entities.PlayerId;
import formation.soprasteria.skyjoBoot.services.CompteService;
import formation.soprasteria.skyjoBoot.services.GameService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameRestController {

	@Autowired
	GameService gameSrv;

	@Autowired
	CompteService compteSrv;

	@PostMapping
	public GameResponse saveGame(@Valid @RequestBody GameRequest gameRequest, BindingResult br) {
		if (br.hasErrors()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
		return new GameResponse(gameSrv.create(convertGameRequestToGameEntity(gameRequest)));

	}

	public Game convertGameRequestToGameEntity(GameRequest gameRequest) {
		Game gameEntity = new Game();

		// Création du GameMode
		gameEntity.setGameMode(new GameMode(gameRequest.getScoreAAtteindre(), gameRequest.getNombreDeTours() ,gameRequest.getSpecificites()));
		
		gameEntity.setDate(gameRequest.getDate());

		// Création de la liste des players de la game
		// Pour chaque Id de la liste dans gameRequest, on créé un playerId à partir de
		// L'id du compte trouvé, afin de créer un Player.
		// On obtient le score du player à partir de la map playerScores dans
		// gameRequest
		List<Player> players = new ArrayList<Player>();

		for (Long playerId : gameRequest.getPlayerIds()) {
			Compte user = compteSrv.findById(playerId);

			PlayerId playerIdEntity = new PlayerId();
			playerIdEntity.setUser(user);
			playerIdEntity.setGame(gameEntity);

			Player player = new Player();
			player.setId(playerIdEntity);
			player.setScore(gameRequest.getPlayerScores().get(playerId));

			players.add(player);
		}

		gameEntity.setPlayers(players);

		return gameEntity;
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void deleteGameById(@PathVariable Long id) {
		gameSrv.deleteById(id);
	}

	@GetMapping("/allGames")
	public List<GameResponse> getAllGames() {
		return gameSrv.findAll();
	}

	@GetMapping("/userGames")
	public List<GameResponse> getUserGames(@RequestParam Long userId) {
		return gameSrv.findByUserId(userId);
	}

}
