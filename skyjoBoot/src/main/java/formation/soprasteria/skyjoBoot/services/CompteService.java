package formation.soprasteria.skyjoBoot.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import formation.soprasteria.skyjoBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.exceptions.CompteException;
import formation.soprasteria.skyjoBoot.repositories.CompteRepositories;

@Service
public class CompteService implements UserDetailsService {

	@Autowired
	private CompteRepositories compteRepositories;

	public Compte enregistrerUtilisateur(Compte utilisateur) {
		// Vous pouvez générer l'ID automatique dans cette méthode si nécessaire
		return compteRepositories.save(utilisateur);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return compteRepositories.findByLogin(username).orElseThrow(() -> {
			throw new UsernameNotFoundException("username" + username + "not found");
		});
	}

	// Méthode pour trouver un compte par son ID
	public Compte findById(Long id) {
		return compteRepositories.findById(id)
				.orElseThrow(() -> new CompteException("Compte avec l'ID " + id + " introuvable"));
	}

	// Méthode pour récupérer tous les comptes
	public List<Compte> findAll() {
		return compteRepositories.findAll();
	}

	// Méthode pour mettre à jour un compte
	public Compte update(Compte compte) {
		validateCompteFields(compte);

		// Vérifier si le login est déjà utilisé par un autre compte
		compteRepositories.findByLoginAndIdNot(compte.getLogin(), compte.getId()).ifPresent(existingCompte -> {
			throw new CompteException("Login déjà utilisé par un autre compte");
		});

		// Sauvegarder le compte mis à jour
		return compteRepositories.save(compte);
	}

	// Méthode pour supprimer un compte par son ID
	public void deleteById(Long id) {
		compteRepositories.deleteById(id);
	}
	
	public Compte create(Compte compte) {
		return compteRepositories.save(compte);
	}

	// Méthode privée pour valider les champs d'un compte
	private void validateCompteFields(Compte compte) {
		if (compte.getLogin() == null || compte.getLogin().isBlank()) {
			throw new CompteException("Login obligatoire");
		}

		if (compte.getPassword() == null || compte.getPassword().length() < 8 || compte.getPassword().contains(" ")) {
			throw new CompteException("Le mot de passe doit avoir au moins 8 caractères et ne pas contenir d'espaces");
		}
	}

}