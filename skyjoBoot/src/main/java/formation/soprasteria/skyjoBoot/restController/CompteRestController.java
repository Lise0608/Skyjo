package formation.soprasteria.skyjoBoot.restController;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.annotation.JsonView;

import formation.soprasteria.skyjoBoot.dtorequest.CompteRequest;
import formation.soprasteria.skyjoBoot.dtoresponse.CompteResponse;
import formation.soprasteria.skyjoBoot.dtoresponse.JsonViews;
import formation.soprasteria.skyjoBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.entities.Role;
import formation.soprasteria.skyjoBoot.services.CompteService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins= "*")
public class CompteRestController {
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private CompteService compteSrv;
	
	@GetMapping ("/api/comptes")
	public List<CompteResponse> listeDesComptes () {
		return compteSrv.findAll().stream().map(c -> new CompteResponse(c)).collect(Collectors.toList());
	}
	
	@GetMapping("/{id}")
	public CompteResponse compteById (@PathVariable Long id) {
		return new CompteResponse(compteSrv.findById(id));
	}
	
	@DeleteMapping ("/{id}")
	@ResponseStatus (code = HttpStatus.NO_CONTENT)
	public void deleteCompte (@PathVariable Long id) {
		compteSrv.deleteById(id);
	}
	
	@PutMapping ("/{id}")
	public CompteResponse updateCompte (@PathVariable Long id, @Valid @RequestBody CompteRequest compteRequest, BindingResult br) {
		if (br.hasErrors()) {
    		throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    	}
		Compte compteAModifier = compteSrv.findById (id);
		if (compteAModifier == null) {
			 throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte inconnu");
		}
		BeanUtils.copyProperties (compteRequest, compteAModifier);
		return new CompteResponse(compteSrv.update(compteAModifier));
	}
	

	@GetMapping("/api/auth")
	@SecurityRequirement(name = "basicAuth")
	@JsonView(JsonViews.Compte.class)
	public CompteResponse auth(@AuthenticationPrincipal Compte compte) {
		return new CompteResponse(compte);
	}

	@PostMapping("/api/inscription")
	@JsonView(JsonViews.Compte.class)
	public CompteResponse inscription(@Valid @RequestBody CompteRequest compteRequest, BindingResult br) {
		if (br.hasErrors()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
		Compte compte = new Compte();
		compte.setUsername(compteRequest.getLogin());
		compte.setPassword(passwordEncoder.encode(compteRequest.getPassword()));
		compte.setEmail(compteRequest.getEmail());
		compte.setRole(Role.ROLE_USER);
		return new CompteResponse(compteSrv.create(compte));
	}
}
