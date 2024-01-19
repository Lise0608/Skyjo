package formation.soprasteria.skyjoBoot.restController;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formation.soprasteria.skyjoBoot.dtoresponse.PlayerResponse;
import formation.soprasteria.skyjoBoot.entities.Player;
import formation.soprasteria.skyjoBoot.services.PlayerService;

@RestController
@RequestMapping("/api/player")
public class PlayerRestController {
	
	@Autowired
	private PlayerService playerService;
	
	@GetMapping ("")
	public List<PlayerResponse> playersList (){
		return playerService.findAll().stream().map(pl -> new PlayerResponse(pl)).collect(Collectors.toList());
	}
	
	@GetMapping("/{userid}")
	public PlayerResponse playerByUserId (@PathVariable Long userid) {
		return new PlayerResponse(playerService.findByUserId(userid));
	}
	
	@GetMapping("/{gameid}")
	public PlayerResponse playerByGameId (@PathVariable Long gameid) {
		return new PlayerResponse(playerService.findByGameId(gameid));
	}
	
//	@DeleteMapping
	
	@PostMapping
	public PlayerResponse savePlayer(Player player) {
		return new PlayerResponse(playerService.create(player));
	}
	
//	@PutMapping
}
