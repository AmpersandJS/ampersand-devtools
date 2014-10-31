chrome.runtime.onMessage.addListener(function (message, sender) {
    var args;

    //handle console.log sending from background and content pages
    if ('log' == message.name) {
        args = message.data;
        args.unshift('From devtools:');
        message.level = message.level || 'info';

        if (message.level === 'info') console.log.apply(console, args);
        if (message.level === 'error') console.error.apply(console, args);
    }
});

chrome.runtime.sendMessage({ name: 'tabLoaded', source: 'content' });
