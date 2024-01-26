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

import formation.soprasteria.skyjoBoot.dtoresponse.GameResponse;
import formation.soprasteria.skyjoBoot.entities.Game;
import formation.soprasteria.skyjoBoot.entities.GameMode;
import formation.soprasteria.skyjoBoot.exceptions.GameException;
import formation.soprasteria.skyjoBoot.exceptions.GameNotFoundException;
import formation.soprasteria.skyjoBoot.repositories.GameRepositories;
import formation.soprasteria.skyjoBoot.services.GameService;
import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
@Rollback
public class GameServiceTest {

	@Autowired
	private GameRepositories gameRepository;

	@Autowired
	private GameService gameService;

	@Test
	void testCreate() {
		Game game = new Game();
		gameService.create(game);

		Game savedGame = gameRepository.findById(game.getId()).orElseThrow();
		assertNotNull(savedGame);
		assertEquals(game.getId(), savedGame.getId());
	}

	@Test
	void testCreateWithExistingId() {
		Game game = new Game();
		game.setId(1L);

		assertThrows(GameException.class, () -> gameService.create(game));
	}

	@Test
	void testFindById() {
		Game game = new Game();
		gameService.create(game);

		Game foundGame = gameService.findById(game.getId());
		assertNotNull(foundGame);
		assertEquals(game.getId(), foundGame.getId());
	}

	@Test
	void testFindByIdNotFound() {
		assertThrows(GameNotFoundException.class, () -> gameService.findById(999L));
	}

	@Test
	void testFindAll() {
		Game game1 = new Game();
		Game game2 = new Game();
		gameService.create(game1);
		gameService.create(game2);

		List<GameResponse> allGames = gameService.findAll();
		assertNotNull(allGames);
	}

	@Test
	void testDeleteById() {
		Game game = new Game();
		gameService.create(game);

		gameService.deleteById(game.getId());

		assertFalse(gameRepository.existsById(game.getId()));
	}

	@Test
	void testDeleteByIdNotFound() {
		assertThrows(GameNotFoundException.class, () -> gameService.deleteById(999L));
	}

	@Test
	void testUpdate() {
		Game game = new Game();
		gameService.create(game);

		game.setGameMode(new GameMode(10, "spécificité"));

		Game updatedGame = gameService.update(game);

		Game savedGame = gameRepository.findById(updatedGame.getId()).orElseThrow();
		assertNotNull(savedGame);
		assertEquals(game.getGameMode(), savedGame.getGameMode());
	}

	@Test
	void testUpdateWithNullId() {
		Game game = new Game();

		assertThrows(IllegalArgumentException.class, () -> gameService.update(game));
	}

	@Test
	void testUpdateNotFound() {
		Game game = new Game();
		gameService.create(game);

		gameRepository.deleteById(game.getId());

		assertThrows(GameNotFoundException.class, () -> gameService.update(game));
	}
}
