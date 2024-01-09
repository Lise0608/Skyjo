package skyjoRest.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import skyjo.config.JpaConfig;


@Configuration
@EnableWebMvc
@ComponentScan("skyjoRest.restController")
@Import(JpaConfig.class)
public class WebConfig {

}
