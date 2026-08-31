/**
 * Demo/mock addresses must never appear on the live site.
 * Set SHOW_MOCK_LISTINGS=true only for local UI development.
 */
export function isMockListingsEnabled(): boolean {
  return process.env.SHOW_MOCK_LISTINGS === "true";
}

export function isLiveMlsConfigured(): boolean {
  const provider = (process.env.MLS_PROVIDER ?? "mock").toLowerCase();
  if (provider === "mock" || !provider) return false;
  // RealtyAPI is the primary live path used in this project.
  if (provider === "realtyapi") {
    return Boolean(process.env.REALTY_API_KEY?.trim());
  }
  return true;
}
