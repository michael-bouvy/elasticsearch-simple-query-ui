(function ($) {
    "use strict";

    var $esHostInput = $("#es-host");
    var $esMethodInput = $("#es-method");
    var queryHostKey = 'es.query-host';
    var queryMethodKey = 'es.query-method';

    // Replace with your ES host
    var queryHost = 'http://localhost:9200';
    var queryMethod = 'GET';

    if (localStorage) {
        var savedQueryHost = localStorage.getItem(queryHostKey);
        if (savedQueryHost) {
            queryHost = savedQueryHost;
        }

        $esHostInput.on('change keyup', function () {
            localStorage.setItem(queryHostKey, $(this).val());
        });

        var savedQueryMethod = localStorage.getItem(queryMethodKey);
        if (savedQueryMethod) {
            queryMethod = savedQueryMethod;
        }

        $esMethodInput.on('change keyup', function () {
            localStorage.setItem(queryMethodKey, $(this).val());
        });
    }

    $esHostInput.val(queryHost);
    $esMethodInput.find("option[value=" + queryMethod + "]").attr('selected', 'selected');

    // Query editor
    var queryContainer = document.getElementById("query-editor");
    var queryEditor = new JSONEditor(queryContainer, {
        mode: 'code',
        modes: ['code', 'tree']
    });

    // Sample JSON for query editor
    var json = {
        "query": {
            "match": {
                "_all": "hello"
            }
        }
    };

    queryEditor.set(json);

    // Result editor
    var resultContainer = document.getElementById("query-result-content");
    var resultEditor = new JSONEditor(resultContainer, {
        mode: 'view'
    });

    // Handle query
    var esHost = '';
    var esMethod = '';
    $("#run-query").on('click', function () {
        esHost = $esHostInput.val();
        esMethod = $esMethodInput.val();
        if (esHost.indexOf('/_') == -1 && esMethod == 'GET') {
            esHost += '/_search'
        }
        $.ajax(esHost, {
            data: JSON.stringify(queryEditor.get()),
            processData: false,
            type: esMethod,
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