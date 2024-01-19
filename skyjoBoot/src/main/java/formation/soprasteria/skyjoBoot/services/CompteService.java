package formation.soprasteria.skyjoBoot.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formation.soprasteria.skyjoBoot.entities.Compte;
import formation.soprasteria.skyjoBoot.exceptions.CompteException;
import formation.soprasteria.skyjoBoot.repositories.CompteRepositories;

@Service
public class CompteService {

    @Autowired
    private CompteRepositories compteRepo;

    // Méthode pour créer un compte
    public Compte create(Compte compte) {
        validateCompteFields(compte);

        // Vérifier si le login est déjà utilisé
        if (compteRepo.findByLogin(compte.getLogin()) != null) {
            throw new CompteException("Login déjà utilisé");
        }

        // Sauvegarder le compte
        return compteRepo.save(compte);
    }

    // Méthode pour trouver un compte par son ID
    public Compte findById(Long id) {
        return compteRepo.findById(id)
                .orElseThrow(() -> new CompteException("Compte avec l'ID " + id + " introuvable"));
    }

    // Méthode pour récupérer tous les comptes
    public List<Compte> findAll() {
        return compteRepo.findAll();
    }

    // Méthode pour mettre à jour un compte
    public Compte update(Compte compte) {
        validateCompteFields(compte);

        // Vérifier si le login est déjà utilisé par un autre compte
        compteRepo.findByLoginAndIdNot(compte.getLogin(), compte.getId()).ifPresent(existingCompte -> {
            throw new CompteException("Login déjà utilisé par un autre compte");
        });

        // Sauvegarder le compte mis à jour
        return compteRepo.save(compte);
    }

    // Méthode pour supprimer un compte par son ID
    public void deleteById(Long id) {
        compteRepo.deleteById(id);
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
