(function ($) {
    "use strict";
    
    // Replace with your ES host
    var queryUrl = 'http://eshost:9200';

    var $esHostInput = $("#es-host");
    $esHostInput.val(queryUrl);

    var queryContainer = document.getElementById("query-editor");
    var queryEditor = new JSONEditor(queryContainer);

    // Sample JSON
    var json = {
        "query": {
            "match": {
                "_all": "hello"
            }
        }
    };

    queryEditor.set(json);
    queryEditor.expandAll();

    var resultContainer = document.getElementById("query-result-content");
    var resultEditor = new JSONEditor(resultContainer, {
        mode: 'view'
    });

    $("#run-query").on('click', function () {
        $.ajax($esHostInput.val() + '/_search', {
            data: JSON.stringify(queryEditor.get()),
            processData: false,
            type: 'POST',
            success: function (result) {
                resultEditor.set(result);
            },
            error: function (error) {
                resultEditor.set(error);
            },
            complete: function () {
                resultEditor.expandAll();
            }
        });
    });
})(jQuery);