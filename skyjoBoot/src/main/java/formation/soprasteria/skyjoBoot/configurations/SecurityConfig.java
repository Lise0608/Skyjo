package formation.soprasteria.skyjoBoot.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.DispatcherType;

@Configuration
public class SecurityConfig {

	// SecurityFilterChain=>filtre
	// intercepte toute les requetes et definit ce qu'on en fait
	// 1-on laisse passer
	// 2-authentification

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// @formatter:off
		// on coupe le csrf
				http.csrf(csrf -> csrf.disable());
				// on definit les regles sur les requetes http
				http.authorizeHttpRequests(auth -> {
					auth.dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
						.requestMatchers("/inscription").permitAll()
						.requestMatchers("/api/auth").permitAll()
						.requestMatchers("/api/**").permitAll()
						.anyRequest().authenticated();
				});
				// on definit comment on va s'authentifier
				http.formLogin(Customizer.withDefaults());
				// formulaire par defaut de spring
		// @formatter:on

		return http.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}