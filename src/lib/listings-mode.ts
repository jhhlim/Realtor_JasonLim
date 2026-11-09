/**
 * Demo/mock addresses must never appear on the live site.
 * Set SHOW_MOCK_LISTINGS=true only for local UI development.
 */
export function isMockListingsEnabled(): boolean {
  return process.env.SHOW_MOCK_LISTINGS === "true";
}

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}

/** SimplyRETS public demo keys (Houston sample data — not Bay Area). */
export function isSimplyRetsDemo(): boolean {
  const provider = (process.env.MLS_PROVIDER ?? "mock").toLowerCase();
  if (provider !== "simplyrets") return false;
  const user = process.env.SIMPLYRETS_USERNAME?.trim() || "simplyrets";
  const pass = process.env.SIMPLYRETS_PASSWORD?.trim() || "simplyrets";
  return user === "simplyrets" && pass === "simplyrets";
}

/**
 * True only when a real (non-demo) MLS path is configured.
 * SimplyRETS demo credentials do NOT count — they show Texas sample data.
 */
export function isLiveMlsConfigured(): boolean {
  const provider = (process.env.MLS_PROVIDER ?? "mock").toLowerCase();
  if (provider === "mock" || !provider) return false;

  if (provider === "realtyapi") {
    return hasEnv("REALTY_API_KEY");
  }
  if (provider === "simplyrets") {
    if (isSimplyRetsDemo()) return false;
    return (
      hasEnv("SIMPLYRETS_USERNAME") &&
      hasEnv("SIMPLYRETS_PASSWORD") &&
      !isSimplyRetsDemo()
    );
  }
  if (provider === "bridge") {
    return (
      hasEnv("BRIDGE_API_KEY") ||
      (hasEnv("BRIDGE_SERVER_TOKEN") && hasEnv("BRIDGE_CLIENT_ID"))
    );
  }
  if (provider === "idx") return hasEnv("IDX_API_KEY");
  if (provider === "mls-grid") return hasEnv("MLS_GRID_TOKEN");
  if (provider === "trestle") {
    return hasEnv("TRESTLE_CLIENT_ID") && hasEnv("TRESTLE_CLIENT_SECRET");
  }
  if (provider === "estated") return hasEnv("ESTATED_API_KEY");

  return false;
}
