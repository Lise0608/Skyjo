package skyjo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import skyjo.entities.Compte;
import skyjo.exceptions.CompteException;
import skyjo.repositories.CompteRepositories;
import skyjo.repositories.CompteRepository;

@Service
public class CompteService {

    @Autowired
    private CompteRepositories compteRepo;

    public Compte create(Compte compte) {
        if (compte.getId() != null) {
            throw new CompteException("L'ID du compte doit être null pour la création");
        }

        validateCompteFields(compte);

        if (compteRepository.findByLogin(compte.getLogin()).isPresent()) {
            throw new CompteException("Login déjà utilisé");
        }

        return compteRepo.save(compte);
    }

    public Compte findById(Long id) {
        return compteRepo.findById(id)
                .orElseThrow(() -> new CompteException("Compte avec l'ID " + id + " introuvable"));
    }

    public List<Compte> findAll() {
        return compteRepo.findAll();
    }

    public Compte update(Compte compte) {
        if (compte.getId() == null) {
            throw new CompteException("L'ID du compte ne peut pas être null pour la mise à jour");
        }

        validateCompteFields(compte);

        compteRepo.findByLoginAndIdNot(compte.getLogin(), compte.getId()).ifPresent(existingCompte -> {
            throw new CompteException("Login déjà utilisé par un autre compte");
        });

        return compteRepo.save(compte);
    }

    public void deleteById(Long id) {
    	compteRepo.deleteById(id);
    }

    private void validateCompteFields(Compte compte) {
        if (compte.getLogin() == null || compte.getLogin().isBlank()) {
            throw new CompteException("Login obligatoire");
        }
        
        if (compte.getPassword() == null || compte.getPassword().length() < 8) {
            throw new CompteException("Le mot de passe doit avoir au moins 8 caractères");
        }
    }
}
