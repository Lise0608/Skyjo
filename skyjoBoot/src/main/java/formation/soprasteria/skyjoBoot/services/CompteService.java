package formation.soprasteria.skyjoBoot.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import formation.soprasteria.skyjoBoot.dtoresponse.GameResponse;
import formation.soprasteria.skyjoBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.exceptions.CompteException;
import formation.soprasteria.skyjoBoot.repositories.CompteRepositories;
import jakarta.persistence.EntityNotFoundException;

@Service
public class CompteService implements UserDetailsService {

	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	private CompteRepositories compteRepositories;

	@Autowired
	private GameService gameSrv;

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
		compteRepositories.findByLoginAndIdNot(compte.getUsername(), compte.getId()).ifPresent(existingCompte -> {
			throw new CompteException("Login déjà utilisé par un autre compte");
		});

		// Sauvegarder le compte mis à jour
		return compteRepositories.save(compte);
	}

	// Méthode pour supprimer un compte par son ID
	public void deleteById(Long id) {
		List<GameResponse> games = gameSrv.findByUserId(id);

		for (GameResponse g : games) {
			gameSrv.deleteById(g.getId());
		}

		compteRepositories.deleteById(id);
	}

	public Compte create(Compte compte) {
		return compteRepositories.save(compte);
	}

	// Méthode privée pour valider les champs d'un compte
	private void validateCompteFields(Compte compte) {
		if (compte.getUsername() == null || compte.getUsername().isBlank()) {
			throw new CompteException("Login obligatoire");
		}

		if (compte.getPassword() == null || compte.getPassword().length() < 8 || compte.getPassword().contains(" ")) {
			throw new CompteException("Le mot de passe doit avoir au moins 8 caractères et ne pas contenir d'espaces");
		}
	}

		public void sendResetPasswordEmail(String email) {
		Optional<Compte> optionalCompte = compteRepositories.findByEmail(email);
		
		if (optionalCompte.isPresent()) {
			Compte compte = optionalCompte.get();
			// Créer un message d'e-mail avec le nouveau mot de passe
			String frontendUrlString = "http://localhost:4200/reset-password";
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom("skyjoassistance@gmail.com");
			message.setTo(email);
			message.setSubject("Skyjo - Votre demande de réinitialisation de votre mot de passe");
			message.setText("Cher(e) utilisateur(trice),\n\n"
					 + "Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.\n"
					 + "Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : " + frontendUrlString +"?compteId="+ compte.getId() + ".\n"  
					 + "Si vous n'avez pas effectué cette demande, veuillez ignorer ce message.\n\n"
					 + "Cordialement,\n L'équipe de support - Skyjo"); 

			System.out.println("message : " + message);

			// Envoyer l'e-mail
			javaMailSender.send(message);
		} else {
			throw new EntityNotFoundException("Compte introuvable pour cet e-mail");
		}
	}
		
	public void resetPassword(String newPassword) {
		
	}
	
	public boolean checkLogin(String login) {
		return compteRepositories.existsByLogin(login);
	}
	
	public boolean checkEmail(String email) {
		return compteRepositories.existsByEmail(email);
	}
}