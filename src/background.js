// Init event
chrome.runtime.onInstalled.addListener(init);

chrome.alarms.onAlarm.addListener(function (alarm) {
	console.log("alarm triggered");
	var today = new Date();
	if (alarm.name == "ExplodeTabs") {
		chrome.storage.local.get(["date"], value => {
			if (
				(today.getDay() == value.date || value.date == 7) &&
				today.getHours() == 24
			) {
				triggerExplosion();
				setTimeout(closeTabs, 4500);
			}
		});
	}
});

function closeTabs() {
	closeAllTabs(true, false);
}
