# ampersand-devtools

**This is very much a work in progress.**

The docs below pertain to the chrome-devtools version.

## Install

Until this is released, install the "ampersand-chrome-devtools" directory as an "unpacked extension" from [chrome://extensions](chrome://extensions)

## Features

So far:

* prints out the versions of all ampersand modules that are using ampersand-version

## Architecture

Very much a work in progress. Chrome extensions are kinda funky.

* [background.js](./ampersand-chrome-devtools/background.js) - the core extension file. Mostly just facilitates communication between content.js and devtools.js/panel.js
* [content.js](./ampersand-chrome-devtools/content.js) - this is injected into the currently running browser page. At the moment it mostly just listens to messages from devtools/panel via background to log output to the main console, so you can debug things. Not much code should go here.
* [devtools.js](./ampersand-chrome-devtools/devtools.js) - mostly just bootstraps panel.js
* [panel.js](./ampersand-chrome-devtools/panel.js) & [panel.html](./ampersand-chrome-devtools/panel.html) - this is where most things happen. panel.html is the html that loads in the devtools panel, and panel.js is obviously the currently running code.

## More reading

* [https://developer.chrome.com/extensions/devtools](https://developer.chrome.com/extensions/devtools)
