package formation.soprasteria.skyjoBoot.testServices;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import formation.soprasteria.skyjoBoot.entities.Player;
import formation.soprasteria.skyjoBoot.repositories.PlayerRepositories;
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
	
}
