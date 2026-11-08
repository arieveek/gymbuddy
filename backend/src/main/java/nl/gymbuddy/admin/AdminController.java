package nl.gymbuddy.admin;

import java.util.List;
import java.util.UUID;

import nl.gymbuddy.admin.AdminService.AccountDto;
import nl.gymbuddy.common.CurrentUser;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Admin only (ROLE_ADMIN, enforced in SecurityConfig). */
@RestController
@RequestMapping("/api/admin/users")
public class AdminController {

	private final AdminService service;

	public AdminController(AdminService service) {
		this.service = service;
	}

	@GetMapping
	public List<AccountDto> list() {
		return service.list();
	}

	@PostMapping("/{id}/approve")
	public AccountDto approve(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
		return service.approve(id, CurrentUser.id(jwt));
	}

	@PostMapping("/{id}/block")
	public AccountDto block(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
		return service.block(id, CurrentUser.id(jwt));
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
		service.delete(id, CurrentUser.id(jwt));
	}

}
