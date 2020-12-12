// initialize local storage and timer
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
	// YYYY   MM   DD  HH MM SS MS
	var timestamp = +new Date(
		now.getFullYear(),
		now.getMonth(),
		day,
		24,
		0,
		0,
		0
	);
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
function closeAllTabs(currentTab, currentWindow) {
	chrome.tabs.getSelected(selected => {
		let options = currentWindow ? { currentWindow: true } : {};
		chrome.tabs.query(options, tabs => {
			// Loop through and remove each tab
			tabs.forEach(tab => {
				if (currentTab || selected.id !== tab.id) {
					chrome.tabs.remove(tab.id);
				}
			});
		});
	});
}
