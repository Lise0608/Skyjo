package formation.soprasteria.skyjoBoot.restController;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import formation.soprasteria.skyjoBoot.dtorequest.JoinGameRequest;
import formation.soprasteria.skyjoBoot.dtoresponse.CompteResponse;
import formation.soprasteria.skyjoBoot.entities.ChatMessage;
import formation.soprasteria.skyjoBoot.entities.LocalGame;

@RestController
@CrossOrigin(origins = "*")
public class ChatRestController {

	private List<LocalGame> activeGames = new ArrayList<LocalGame>();
	private static final Logger logger = LoggerFactory.getLogger(ChatRestController.class);

	@MessageMapping("/chat.sendMessage")
	@SendTo("/topic/public")
	public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
		return chatMessage;
	}

	@MessageMapping("/chat.addUser")
	@SendTo("/topic/public")
	public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
		// Ajouter l'utilisateur au canal de discussion
		headerAccessor.getSessionAttributes().put("login", chatMessage.getSender());
		return chatMessage;
	}

	@MessageMapping("/game.create")
	@SendTo("/topic/public")
	public LocalGame createGame(@Payload JoinGameRequest joinGameRequest) {
		logger.info("inside createGame");
		
		List<CompteResponse>listeCompteResponses = new ArrayList<CompteResponse>();
		listeCompteResponses.add(joinGameRequest.getCompteResponse());
		
		LocalGame localGame = new LocalGame(joinGameRequest.getToken(), listeCompteResponses);
		
		logger.info("valeurs game token: "+localGame.getToken());
		for(CompteResponse compteResponse : localGame.getCompteResponses()) {
			logger.info("compte :" + compteResponse.getUsername());
		}
		activeGames.add(localGame);
		return localGame;
	}

	@MessageMapping("/game.join")
	@SendTo("/topic/public")
	public LocalGame joinGame(@Payload JoinGameRequest joinGameRequest) {
		logger.info("inside joinGame");
		
		String token = joinGameRequest.getToken();
	    CompteResponse compteResponse = joinGameRequest.getCompteResponse();

	    
		for (LocalGame game : activeGames) {
			logger.info("Comparing token: existingGame = " + game.getToken() + ", token = " + token);
		}
		LocalGame existingGame = activeGames.stream().filter(game -> game.getToken().equals(token)).findFirst()
				.orElse(null);

		if (existingGame != null) {
			logger.info("game trouvée");
			existingGame.getCompteResponses().add(compteResponse);
			return existingGame;
		} else {
			logger.info("game pas trouvée");
			return null;
		}
	}
}