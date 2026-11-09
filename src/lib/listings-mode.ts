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

/**
 * True when a live or demo MLS API path is configured.
 * SimplyRETS demo credentials (simplyrets/simplyrets) count as connected
 * so the UI can show real MLS-shaped listings with listing-agent attribution.
 */
export function isLiveMlsConfigured(): boolean {
  const provider = (process.env.MLS_PROVIDER ?? "simplyrets").toLowerCase();
  if (provider === "mock") return false;

  if (provider === "realtyapi") {
    return hasEnv("REALTY_API_KEY");
  }
  if (provider === "simplyrets") {
    // Demo credentials work without env; production uses SIMPLYRETS_* from MLS.
    return true;
  }
  if (provider === "bridge") return hasEnv("BRIDGE_API_KEY");
  if (provider === "idx") return hasEnv("IDX_API_KEY");
  if (provider === "mls-grid") return hasEnv("MLS_GRID_TOKEN");
  if (provider === "trestle") {
    return hasEnv("TRESTLE_CLIENT_ID") && hasEnv("TRESTLE_CLIENT_SECRET");
  }
  if (provider === "estated") return hasEnv("ESTATED_API_KEY");

  return provider !== "mock";
}

/** SimplyRETS public demo keys (not Bay Area live MLS). */
export function isSimplyRetsDemo(): boolean {
  const provider = (process.env.MLS_PROVIDER ?? "simplyrets").toLowerCase();
  if (provider !== "simplyrets") return false;
  const user = process.env.SIMPLYRETS_USERNAME?.trim() || "simplyrets";
  const pass = process.env.SIMPLYRETS_PASSWORD?.trim() || "simplyrets";
  return user === "simplyrets" && pass === "simplyrets";
}
