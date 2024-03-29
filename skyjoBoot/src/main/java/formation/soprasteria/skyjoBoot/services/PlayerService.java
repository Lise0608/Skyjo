package formation.soprasteria.skyjoBoot.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formation.soprasteria.skyjoBoot.dtoresponse.PlayerResponse;
import formation.soprasteria.skyjoBoot.entities.Player;
import formation.soprasteria.skyjoBoot.entities.PlayerId;
import formation.soprasteria.skyjoBoot.exceptions.PlayerException;
import formation.soprasteria.skyjoBoot.exceptions.PlayerNotFoundException;
import formation.soprasteria.skyjoBoot.repositories.PlayerRepositories;

@Service
public class PlayerService {
	
	@Autowired
	PlayerRepositories playerRepo;

	public Player create(Player player) {
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

	public List<PlayerResponse> findAll() {
		return playerRepo.findAll().stream().map(p -> new PlayerResponse(p)).collect(Collectors.toList());
	}

	public List<PlayerResponse> findByUserId(Long userId) {
		return playerRepo.findByidUserId(userId).stream().map(p -> new PlayerResponse(p)).collect(Collectors.toList());
	}

	public List<PlayerResponse> findByGameId(Long gameId) {
		return playerRepo.findByidGameId(gameId).stream().map(p -> new PlayerResponse(p)).collect(Collectors.toList());
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

	public void deletePlayerByGameId(Long id) {
		List<Player> playersToDelete = playerRepo.findByidGameId(id);

		for (Player player : playersToDelete) {
			playerRepo.delete(player);
		}
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
