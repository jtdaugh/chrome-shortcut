// Service worker for Manifest V3
let redirects = {};

// Load redirects on startup
chrome.runtime.onStartup.addListener(loadRedirects);
chrome.runtime.onInstalled.addListener(loadRedirects);

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
	if (namespace === 'sync' && changes.redirects) {
		redirects = changes.redirects.newValue || {};
	}
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
	// Only handle main frame navigations (not subframes)
	if (details.frameId !== 0) return;

	const url = details.url;

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

async function loadRedirects() {
	try {
		const result = await chrome.storage.sync.get({ redirects: {} });
		redirects = result.redirects;
		console.log('Loaded redirects:', redirects);
	} catch (error) {
		console.error('Failed to load redirects:', error);
	}
}
