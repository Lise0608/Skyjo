package formation.soprasteria.skyjoBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import formation.soprasteria.skyjoBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.entities.Role;
import formation.soprasteria.skyjoBoot.repositories.CompteRepositories;

@Controller
public class CompteController {

	@Autowired
	private CompteRepositories compteRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@GetMapping("/inscription")
	public String afficherFormulaireInscription(Model model) {
		model.addAttribute("compte", new Compte());
		return "registrationForm";
	}

	@PostMapping("/inscription")
	public String processRegistration(@ModelAttribute Compte compte) {

		compte.setLogin(compte.getLogin());
		compte.setEmail(compte.getEmail());
		compte.setMdp(passwordEncoder.encode(compte.getMdp()));

		compte.setRole(Role.ROLE_USER);

		compteRepo.save(compte);
		return "redirect:/api/auth";

	}

}
