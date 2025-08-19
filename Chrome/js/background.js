// Service worker for Manifest V3
// Note: Service workers don't maintain persistent state, so we load redirects on-demand

const PERM_REDIRECTS = {
	"http://m/": "https://mail.google.com",
	"http://c/": "https://calendar.google.com"
};

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
	// Only handle main frame navigations (not subframes)
	if (details.frameId !== 0) return;

	const url = details.url;

	// Load redirects fresh each time (service worker may have been restarted)
	let redirects = {};
	try {
		const result = await chrome.storage.sync.get({ redirects: {} });
		redirects = { ...PERM_REDIRECTS, ...result.redirects };
	} catch (error) {
		console.error('Failed to load redirects:', error);
		return;
	}

	// Check for exact match first
	if (redirects[url]) {
		chrome.tabs.update(details.tabId, { url: redirects[url] });
		return;
	}

	// Check for prefix matches
	for (const [pattern, redirect] of Object.entries(redirects)) {
		if (pattern && redirect && url.startsWith(pattern)) {
			const newUrl = url.replace(pattern, redirect);
			chrome.tabs.update(details.tabId, { url: newUrl });
			return;
		}
	}
});