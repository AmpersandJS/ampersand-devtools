var debug = {};
debug.log = function () {
    var args = [].slice.call(arguments);
    var message;
    if (args.length === 1 && args[0].name && args[0].data) {
        message = args[0];
    } else {
        message = {name: 'log', data: args, level: 'info'};
    }

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, message, function(response) {});
    });
};

var contentScriptReady = {};
var pendingLogs = [];
var connections = {};

//Handle request from devtools
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name !== 'ampersand-panel') return;

    //Messages from devtools
    port.onMessage.addListener(function (message) {
        if (message.name === 'init') {
            connections[message.tabId] = port;

            if (contentScriptReady[message.tabId]) {
                port.postMessage({ name: 'tabLoaded' });
            }
        }

        if (message.name === 'log') {
            if (contentScriptReady) {
                debug.log(message);
            } else {
                pendingLogs.push(message);
            }
        }
    });

});

// Handle messages from content script
chrome.runtime.onMessage.addListener(function (message, sender) {
    var tabId = sender && sender.tab && sender.tab.id;

    if (!tabId) return;

    var devtoolsPort = connections[tabId];

    if (message.name === 'tabLoaded' && message.source === 'content') {
        contentScriptReady[tabId] = true;

        pendingLogs.forEach(function (message) {
            debug.log(message);
        });

        if (devtoolsPort) {
            devtoolsPort.postMessage({ name: 'tabLoaded' });
        }
    }
});
