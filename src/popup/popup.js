document.getElementById("explodeTabs").onclick = () => {
	explodeTabsWithStyle();
};

const selectElement = document.getElementById("dateOptions");

// Get Current State from Local Storage
chrome.storage.local.get(["date"], value => {
	selectElement.value = value.date;
});

selectElement.addEventListener("change", event => {
	chrome.storage.local.set({ date: event.target.value }, () => {});
	chrome.extension.getBackgroundPage().console.log(chrome.storage.date);
});

function explodeTabsWithStyle() {
	// alert("It's Midnight!\nYou know what that means...\n\nKABOOM!!!");
	chrome.extension.getBackgroundPage().console.log("trigger explosion");
	triggerExplosion();
	setTimeout(closeTabs, 4000);
}

function closeTabs() {
	closeAllTabs(true, false);
}
