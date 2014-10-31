//Created a port with background page for continous message communication
var port = chrome.runtime.connect({
    name: "ampersand-panel"
});

var debug = {
    log: function() {
        var args = [].slice.call(arguments);
        port.postMessage({name: 'log', data: args, level: 'info'});
    },

    error: function () {
        var args = [].slice.call(arguments);
        port.postMessage({name: 'error', data: args, level: 'error'});
    }
};

function wrapError(syncFn) {
    try {
        syncFn();
    } catch (e) {
        debug.error(e);
    }
}

function refresh () {
    document.querySelector('[data-hook~=versions]').innerHTML = '';

    chrome.devtools.inspectedWindow.eval(
        'ampersand',
        function (result, isException) {
            wrapError(function () {
                if (!result) return;

                Object.keys(result).forEach(function (name) {
                    var el = document.createElement('li');
                    el.innerHTML = name + "@" + result[name].join(', ');
                    document.querySelector('[data-hook~=versions]').appendChild(el);
                });
            });
        }
    );
}


//Everytime the current tab is refreshed, we'll get a tabLoaded event
port.onMessage.addListener(function (message) {
    if (message.name === 'tabLoaded') {
        wrapError(refresh);
    }
});

//Tell background.js that we're ready, and our tabId
port.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});
