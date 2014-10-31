//Created a port with background page for continous message communication
var port = chrome.runtime.connect({
    name: "ampersand-panel"
});

var debug = {
    log: function() {
        var args = [].slice.call(arguments);
        port.postMessage({name: 'log', data: args});
    },

    error: function () {
        var args = [].slice.call(arguments);
        port.postMessage({name: 'error', data: args});
    }
};

function wrapError(syncFn) {
    try {
        syncFn();
    } catch (e) {
        debug.error(e);
    }
}

port.onMessage.addListener(function (message) {
    if (message.source === 'content' && message.event === 'ready') {
        wrapError(go);
    }
});

function go () {
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
