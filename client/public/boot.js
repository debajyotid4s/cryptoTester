const BASE_URL = "/cryptoTester/";
const VERSION_URL = `${BASE_URL}version.json`;

async function readVersion() {
  const response = await fetch(VERSION_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${VERSION_URL}`);
  }

  const payload = await response.json();
  return payload.version || "";
}

function redirectToVersion(version) {
  const currentUrl = new URL(window.location.href);
  const currentVersion = currentUrl.searchParams.get("v");

  if (version && currentVersion !== version) {
    currentUrl.searchParams.set("v", version);
    window.location.replace(currentUrl.toString());
    return true;
  }

  return false;
}

(async () => {
  try {
    const version = await readVersion();
    redirectToVersion(version);
  } catch (error) {
    console.error("Boot loader failed:", error);
    return;
  }
})();
