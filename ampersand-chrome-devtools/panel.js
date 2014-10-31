var xhr = require('xhr');

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

    //This ugly mess grabs the versions from the host window's ampersand variable
    //and renders a list of versions and links and things
    chrome.devtools.inspectedWindow.eval(
        'ampersand',
        function (result, isException) {
            wrapError(function () {
                if (!result) return;

                Object.keys(result).forEach(function (name) {
                    var el = document.createElement('li');
                    var versions = result[name];
                    var text = name + ": " + versions.join(' | ');
                    el.innerHTML = text;
                    document.querySelector('[data-hook~=versions]').appendChild(el);

                    xhr({
                        method: 'get',
                        url: 'http://www.corsproxy.com/registry.npmjs.org/' + name + '/latest',
                    }, function (err, response, body) {
                        if (err) { return debug.error(err); }
                        var json = JSON.parse(body.toString());
                        var latest = json.version;
                        var anyInvalid = false;

                        var link = json.homepage;

                        versionsValidated = versions.map(function (v) {
                            var valid = v === latest;
                            v += (valid ? " ✔" : " ✘");
                            anyInvalid = anyInvalid || !valid;
                            return v;
                        });

                        el.innerHTML = name + ": " +
                                        versionsValidated.join(' | ') +
                                        (anyInvalid ? " - latest: " + latest : "") +
                                        (link ? " <a href='" + link + "' target='_blank'>docs</a>" : "");
                    });
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
