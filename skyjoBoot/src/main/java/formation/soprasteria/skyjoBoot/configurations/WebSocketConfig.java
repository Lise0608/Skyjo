package formation.soprasteria.skyjoBoot.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
	
	@Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Configure le préfixe des canaux de publication (où le serveur envoie des messages)
        config.enableSimpleBroker("/topic");
        // Configure le préfixe des canaux d'application (où les clients envoient des messages)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Configure l'endpoint WebSocket pour les connexions des clients
        
    	registry.addEndpoint("/websocket").setAllowedOrigins("http://localhost:4200").withSockJS();
    }
}