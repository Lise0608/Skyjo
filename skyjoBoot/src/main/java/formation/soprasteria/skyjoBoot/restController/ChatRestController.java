package formation.soprasteria.skyjoBoot.restController;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import formation.soprasteria.skyjoBoot.entities.ChatMessage;

@RestController
@CrossOrigin(origins = "*")
public class ChatRestController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        // Ajouter l'utilisateur au canal de discussion
        headerAccessor.getSessionAttributes().put("login", chatMessage.getSender());
        return chatMessage;
    }
}