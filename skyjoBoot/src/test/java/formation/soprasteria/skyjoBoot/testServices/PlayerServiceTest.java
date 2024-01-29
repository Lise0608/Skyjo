package formation.soprasteria.skyjoBoot.testServices;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import formation.soprasteria.skyjoBoot.dtoresponse.PlayerResponse;
import formation.soprasteria.skyjoBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.entities.Game;
import formation.soprasteria.skyjoBoot.entities.Player;
import formation.soprasteria.skyjoBoot.entities.PlayerId;
import formation.soprasteria.skyjoBoot.entities.Role;
import formation.soprasteria.skyjoBoot.exceptions.PlayerNotFoundException;
import formation.soprasteria.skyjoBoot.repositories.PlayerRepositories;
import formation.soprasteria.skyjoBoot.services.CompteService;
import formation.soprasteria.skyjoBoot.services.GameService;
import formation.soprasteria.skyjoBoot.services.PlayerService;
import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
@Rollback
public class PlayerServiceTest {

	@Autowired
	private PlayerRepositories playerRepository;

	@Autowired
	private PlayerService playerService;

	@Autowired
	private CompteService compteService;

	@Autowired
	private GameService gameService;

	private Compte setupCompte() {
		Compte compte = new Compte();

		compte.setUsername("test");			
		compte.setPassword("test");
		compte.setRole(Role.ROLE_USER);
		compte.setEmail("test");

		compteService.enregistrerUtilisateur(compte);

		return compte;

	}

	private Game setupGame() {
		Game game = new Game();
		gameService.create(game);
		return game;

	}

	private Player setuPlayer() {
		Compte compte = setupCompte();
		Game game = setupGame();

		Player player = new Player();

		PlayerId playerId = new PlayerId(compte, game);

		player.setId(playerId);

		return player;
	}

	@Test
	void testCreate() {
		Player player = setuPlayer();
		playerService.create(player);

		Player savedPlayer = playerRepository.findById(player.getId()).orElseThrow();

		assertNotNull(savedPlayer);
		assertEquals(player.getId(), savedPlayer.getId());
	}

	@Test
	void testCreateWithExistingId() {

	}

	@Test
	void testFindByUserId() {
		Player player = setuPlayer();
		playerService.create(player);

		List<PlayerResponse> foundPlayers = playerService.findByUserId(player.getId().getUser().getId());

		assertNotNull(foundPlayers);
	}

	@Test
	void testFindByGameId() {
		Player player = setuPlayer();
		playerService.create(player);

		List<PlayerResponse> foundPlayers = playerService.findByGameId(player.getId().getGame().getId());

		assertNotNull(foundPlayers);
	}

	@Test
	void testFindAll() {
		Player player1 = setuPlayer();
		
		
		Compte compte = new Compte();

		compte.setUsername("deuxième compte");			
		compte.setPassword("test");
		compte.setRole(Role.ROLE_USER);
		compte.setEmail("test");

		compteService.enregistrerUtilisateur(compte);
		
		Game game = setupGame();

		Player player2 = new Player();

		PlayerId playerId = new PlayerId(compte, game);

		player2.setId(playerId);
		

		playerService.create(player1);
		playerService.create(player2);

		List<PlayerResponse> allPlayers = playerService.findAll();

		assertNotNull(allPlayers);
	}

	@Test
	void testDeleteById() {
		Player player = setuPlayer();

		playerService.create(player);
		playerService.deleteById(player.getId());

		assertFalse(playerRepository.existsById(player.getId()));
	}

	@Test
	void testDeleteByIdNotFound() {
		assertThrows(PlayerNotFoundException.class, () -> playerService.deleteById(new PlayerId()));
	}

	@Test
	void testDeleteByGameId() {
		Player player = setuPlayer();

		playerService.create(player);
		playerService.deletePlayerByGameId(player.getId().getGame().getId());

		assertFalse(playerRepository.existsById(player.getId()));
	}

	@Test
	void testUpdate() {
		Player player = setuPlayer();
		playerService.create(player);

		player.setScore(150);

		playerService.update(player);

		Player savedPlayer = playerService.findById(player.getId());

		assertNotNull(savedPlayer);
		assertEquals(savedPlayer.getScore(), player.getScore());
	}

	@Test
	void testUpdateWithNullId() {
		Player player = setuPlayer();
		player.setId(null);
		assertThrows(IllegalArgumentException.class, () -> playerService.update(player));
	}

	@Test
	void testUpdatePlayerNotFound() {
		Player player = setuPlayer();
		playerService.create(player);
		playerService.deleteById(player.getId());

		assertThrows(PlayerNotFoundException.class, () -> playerService.update(player));
	}
}
