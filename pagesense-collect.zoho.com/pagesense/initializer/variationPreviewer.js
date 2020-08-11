//$Id:$
/*

    Variation previewer 
 */

(function() {
    if (!window.opener) {
        return;
    }
    const postMessageId = "pagesense_previewer";
    window.opener.postMessage({
            id: postMessageId,
            action: "onPreviewWindowLoad"
        },
        "*"
    );

    this.postMessageListener = function(event) {
        let data = event.data;

        if (data.id !== postMessageId) {
            return;
        }

        if (data.action === "apply-ab-variation" && data.code) {
            this.applyAbVariation(data.code);
        }
    };

    this.applyAbVariation = function(code) {
        var f = new Function(code);
        f.call(window);
    };

    window.addEventListener("message", this.postMessageListener);
})();
