export default (string, limit) =>
	`${string.substring(0, limit)}${string.length > limit ? "…" : ""}`;
