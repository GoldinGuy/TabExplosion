/**
 * Initialization
 * Sets up Local Storage if not done already
 */
function init() {
	chrome.storage.local.get(["date"], value => {
		if (!value.date) {
			chrome.storage.local.set({ date: 5 });
		}
	});
	setFuse();
}

function setFuse() {
	var now = new Date();
	var day = now.getDate();
	// Midnight already passed
	if (now.getHours() >= 24) {
		day += 1;
	}
	// '+' casts the date to a number, like [object Date].getTime();
	var timestamp = +new Date(
		now.getFullYear(),
		now.getMonth(),
		day,
		24,
		0,
		0,
		0
	);
	// YYYY   MM   DD  HH MM SS MS
	chrome.alarms.create("ExplodeTabs", {
		when: timestamp,
		periodInMinutes: 1440 // 10080 one week
	});
	console.log("set alarm for " + timestamp.toString());
}

function triggerExplosion() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.executeScript(tabs[0].id, {
			file: "inject.js"
		});
	});
}

/**
 * Close all tabs
 * @param {boolean} currentTab Whether or not to remove the current tab
 * @param {boolean} currentWindow
 *  Whether or not to only remove from the current window
 */
function closeAll(currentTab, currentWindow) {
	// Get current tab
	chrome.tabs.getSelected(selected => {
		// If currentWindow, do it if not, get from all (no options)
		let options = currentWindow ? { currentWindow: true } : {};
		// Get every tab
		chrome.tabs.query(options, tabs => {
			// Loop through each tab
			tabs.forEach(tab => {
				// If also removing current tab OR this isn't the current tab
				if (currentTab || selected.id !== tab.id) {
					// Remove it
					chrome.tabs.remove(tab.id);
				}
			});
		});
	});
}

/**
 * Close all tabs to the left of the current tab
 * @param {boolean} currentTab Whether or not to remove the current tab
 * @param {boolean} inverse Whether or not to remove from the right instead
 */
function closeLeft(currentTab, inverse) {
	// Get the current tab
	chrome.tabs.getSelected(selected => {
		// Get every tab
		chrome.tabs.query({ currentWindow: true }, tabs => {
			tabs.forEach(tab => {
				if (
					// If removing current tab
					(currentTab && tab.id === selected.id) ||
					// OR if removing to the left
					(!inverse && tab.id < selected.id) ||
					// OR if removing to the right
					(inverse && tab.id > selected.id)
				) {
					// Remove it
					chrome.tabs.remove(tab.id);
				}
			});
		});
	});
}

/**
 * Close all tabs to the right of the current tab
 * @param {boolean} currentTab Whether or not to remove the current tab
 */
function closeRight(currentTab) {
	closeLeft(currentTab, true);
}
