chrome.runtime.onMessage.addListener(function (message, sender) {
    var args;

    //handle console.log sending from background and content pages
    if ('log' == message.name) {
        args = message.data;
        args.unshift('From devtools:');
        console.log.apply(console, args);
    }

    if ('error' == message.name) {
        args = message.data;
        args.unshift('From devtools:');
        console.error.apply(console, args);
    }
});

chrome.runtime.sendMessage({ source: 'content', event: 'ready' });
