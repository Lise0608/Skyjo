package formation.soprasteria.skyjoBoot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
@SecurityScheme(type = SecuritySchemeType.HTTP, name = "basicAuth", scheme = "basic")
public class SecurityConfig {

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// @formatter:off
			http.csrf(csrf->csrf.disable());
			
			http.sessionManagement(sessionManagement->sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

			http.authorizeHttpRequests(auth->{
				auth.requestMatchers("/swagger-ui/**","/v3/**","/swagger-ui.html").permitAll()
					.anyRequest().permitAll();
//					.requestMatchers(HttpMethod.POST,"/api/inscription").anonymous()
//					.requestMatchers(HttpMethod.GET,"/api/employe/**","/api/departement/**","/api/auth").authenticated()
//					.requestMatchers("/api/employe/**","/api/departement/**").hasAnyRole("ADMIN")
//					.anyRequest().denyAll();
			});
			
			http.httpBasic(Customizer.withDefaults());
			// @formatter:on
		return http.build();
	}

//		@Bean
//		PasswordEncoder passwordEncoder() {
//			return new BCryptPasswordEncoder();
//		}

}
