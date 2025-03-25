chrome.commands.onCommand.addListener((command) => {
    if (command === "open_meet") {
        chrome.tabs.create({ url: "https://meet.google.com/new" }, (tab) => {
            // Wait for the tab to update to the final meeting URL
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener); // Stop listening after copying

                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: copyMeetURL
                    });
                }
            });
        });
    }
});

function copyMeetURL() {
    const meetURL = window.location.href;
    navigator.clipboard.writeText(meetURL)
        .then(() => {
            alert("Google Meet link copied to clipboard:\n" + meetURL);
        })
        .catch(err => console.error("Error copying URL: ", err));
}
