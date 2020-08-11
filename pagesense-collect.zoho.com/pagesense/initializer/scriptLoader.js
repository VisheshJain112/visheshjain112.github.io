//$Id:$
/*
    Send postmessage event to load the specified script.

    {
        scripts:["script_name1", "script_name2"]
    }

    This script also sends PostMessage on readyStateChange event to intereactive. 

 */

(function(window){

    var ps_loader = {};

    ps_loader.scriptLoaderReady = function() {
        window.parent.postMessage({ 'id': 'pagesense_scriptloader', 'event': 'loaded' }, "*");
    };

    if (document.readyState == 'complete' || document.readyState == 'interactive') {
        ps_loader.scriptLoaderReady();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            ps_loader.scriptLoaderReady();
        });
    }

    var SERVER_DOMAIN = "pagesense-collect.zoho.com"; //NO I18N

    ps_loader.messageListener = function(event) {
        var scripts = event.data.scripts;

        if (!scripts || !scripts instanceof Array) {
            return false;
        }

        for (var i = 0; i < scripts.length; i++) {
            ps_loader.loadScript(scripts[i]);
        }
    };

    ps_loader.loadScript = function(keyname) {
        var scriptMap = {
            editor: SERVER_DOMAIN + "/pagesense/initializer/editor.js", //NO I18N
            heatmap: SERVER_DOMAIN + "/pagesense/initializer/heatmap.js" //NO I18N
        };

        if(keyname == "heatmap" && window.pagemap){
            window.pagemap.reInitPagemap();
            keyname = null;
        }

        if(keyname == "editor" && window.zab_editor){
            window.zab_editor.onReady();
            keyname = null;
        }

        var script_url = scriptMap[keyname];
        if (!script_url) {
            return false;
        }

        var h = "http"; //NO I18N
        var http = ((window.location.protocol.indexOf("https") === -1) ? h + "://" : h + "s://"); // NO I18N
        var script = document.createElement("script"); //NO I18N
        script.src = "https" + "://" + script_url;
        document.documentElement.appendChild(script);
        return true;
    };
    
    ps_loader.statusReporter = function(){
        var data = {
            id:"pagesense_status_reporter",    //No I18N
            document_url: document.location.href
        };

        window.parent.postMessage(data,'*');
    };

    var reportInterval = window.setInterval(ps_loader.statusReporter,1000);

    window.addEventListener("message", ps_loader.messageListener); //NO I18N
})(window);
