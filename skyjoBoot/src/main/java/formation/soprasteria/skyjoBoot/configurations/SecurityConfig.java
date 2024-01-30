package formation.soprasteria.skyjoBoot.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import jakarta.servlet.DispatcherType;

@Configuration
@SecurityScheme(type = SecuritySchemeType.HTTP, name = "basicAuth", scheme = "basic")
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
					auth.requestMatchers("/swagger-ui/**","/v3/**","/swagger-ui.html", "/api/check/**").permitAll()
	//				auth.dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
					.requestMatchers(HttpMethod.POST,"/api/inscription").anonymous()
					.requestMatchers(HttpMethod.GET,"/api/auth").authenticated()
					.requestMatchers("/api/**").permitAll()
					.anyRequest().denyAll();
				});
				// on definit comment on va s'authentifier
				http.httpBasic(Customizer.withDefaults());
				// formulaire par defaut de spring
		// @formatter:on

		return http.build();
	}

	@Bean
	
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}