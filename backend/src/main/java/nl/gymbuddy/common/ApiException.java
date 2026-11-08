package nl.gymbuddy.common;

import org.springframework.http.HttpStatus;

/** An error the client handles by code; the frontend shows its own Dutch or English text for it. */
public class ApiException extends RuntimeException {

	private final HttpStatus status;
	private final String code;

	public ApiException(HttpStatus status, String code) {
		super(code);
		this.status = status;
		this.code = code;
	}

	public HttpStatus status() {
		return status;
	}

	public String code() {
		return code;
	}

	public static ApiException notFound() {
		return new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND");
	}

}
