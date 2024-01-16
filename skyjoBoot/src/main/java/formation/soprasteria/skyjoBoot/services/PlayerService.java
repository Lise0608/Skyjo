package formation.soprasteria.skyjoBoot.services;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formation.soprasteria.skyBoot.entities.Player;
import formation.soprasteria.skyBoot.entities.PlayerId;
import formation.soprasteria.skyjoBoot.exceptions.PlayerException;
import formation.soprasteria.skyjoBoot.exceptions.PlayerNotFoundException;
import formation.soprasteria.skyjoBoot.repositories.PlayerRepositories;

@Service
public class PlayerService {
	@Autowired
	PlayerRepositories playerRepo;

	public Player create(Player player) {
		if (player.getId() != null) {
			throw new PlayerException("Joueur déjà existant");
		}

		return playerRepo.save(player);
	}

	public Player findById(PlayerId playerId) {
		if (playerId == null) {
			throw new PlayerException("Id null");
		}
		return playerRepo.findById(playerId).orElseThrow(() -> {
			throw new PlayerNotFoundException("Player avec id: " + playerId + "non trouvé");
		});
	}

	public List<Player> findAll() {
		return playerRepo.findAll();
	}

	public void deleteById(PlayerId playerId) {
		Player playerToDelete = findById(playerId);
		if (playerToDelete == null) {
		    throw new PlayerNotFoundException("Player avec l'ID: " + playerId + " non trouvé");
		}
		try {
			playerRepo.delete(playerToDelete);
		} catch (Exception e) {
			e.printStackTrace();
			throw new PlayerException(e.getMessage());
		}
	}

	public void delete(Player player) {
		if (player.getId() == null) {
	        throw new IllegalArgumentException("Player ID est null");
	    }
		deleteById(player.getId());
	}

	public Player update(Player player) {
		if (player.getId() == null) {
			throw new IllegalArgumentException("Player ID est null");
		}

		Player playerEnBase = findById(player.getId());

		if (playerEnBase == null) {
			throw new PlayerNotFoundException("Player avec id: " + player.getId() + "non trouvé");
		}

		BeanUtils.copyProperties(player, playerEnBase, "id");

		return playerRepo.save(playerEnBase);

	}
}