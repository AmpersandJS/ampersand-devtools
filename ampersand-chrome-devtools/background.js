var debug = {};
debug.log = function () {
    var args = [].slice.call(arguments);
    var message;
    if (args.length === 1 && args[0].name && args[0].data) {
        message = args[0];
    } else {
        message = {name: 'log', data: args};
    }

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, message, function(response) {});
    });
};

var contentScriptReady = false;
var pendingLogs = [];
var devtoolsPort;

//Handle request from devtools
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name !== 'ampersand-panel') return;

    devtoolsPort = port;

    //Messages from devtools
    port.onMessage.addListener(function (message) {
        if (contentScriptReady) {
            debug.log(message);
        } else {
            pendingLogs.push(message);
        }
    });

    if (contentScriptReady) {
        devtoolsPort.postMessage({ source: 'content', event: 'ready' });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener(function (message) {
    if (message.source === 'content' && message.event === 'ready') {
        contentScriptReady = true;

        pendingLogs.forEach(function (message) {
            debug.log(message);
        });

        devtoolsPort.postMessage({ source: 'content', event: 'ready' });
    }
});
