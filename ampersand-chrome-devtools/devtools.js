chrome.devtools.panels.create(
    "&js",
    "icon32.png",
    "panel.html",
    function(panel) {
        /*callback*/
    }
);

//Adds a sidebar to the elements tab only
//chrome.devtools.panels.elements.createSidebarPane(
//    "My Sidebar",
//    function(sidebar) {
//        // sidebar initialization code here
//        sidebar.setObject({ some_data: "Some data to show" });
//    }
//);
