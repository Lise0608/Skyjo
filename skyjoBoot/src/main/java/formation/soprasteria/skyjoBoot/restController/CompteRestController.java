package formation.soprasteria.skyjoBoot.restController;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
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

import formation.soprasteria.skyBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.dtorequest.CompteRequest;
import formation.soprasteria.skyjoBoot.dtoresponse.CompteResponse;
import formation.soprasteria.skyjoBoot.services.CompteService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/compte")
public class CompteRestController {

	@Autowired
	private CompteService compteService;
	
	@GetMapping ("")
	public List<CompteResponse> listeDesComptes () {
		return compteService.findAll().stream().map(c -> new CompteResponse(c)).collect(Collectors.toList());
	}
	
	@GetMapping("/{id}")
	public CompteResponse compteById (@PathVariable Long id) {
		return new CompteResponse(compteService.findById(id));
	}
	
	@DeleteMapping ("/{id}")
	@ResponseStatus (code = HttpStatus.NO_CONTENT)
	public void deleteCompte (@PathVariable Long id) {
		compteService.deleteById(id);
	}
	
	@PostMapping("")
	@ResponseStatus (code = HttpStatus.CREATED)
	public CompteResponse createCompte (@Valid @RequestBody CompteRequest compteRequest, BindingResult br) {
		if (br.hasErrors()) {
    		throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    	}
		Compte compte = new Compte ();
		BeanUtils.copyProperties (compteRequest, compte);
		return new CompteResponse(compteService.create(compte));
	}
	
	@PutMapping ("/{id}")
	public CompteResponse updateCompte (@PathVariable Long id, @Valid @RequestBody CompteRequest compteRequest, BindingResult br) {
		if (br.hasErrors()) {
    		throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    	}
		Compte compteAModifier = compteService.findById (id);
		if (compteAModifier == null) {
			 throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte inconnu");
		}
		BeanUtils.copyProperties (compteRequest, compteAModifier);
		return new CompteResponse(compteService.update(compteAModifier));
	}
}
