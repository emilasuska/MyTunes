$(document).ready(function() {
    $("#searchTerm").on("change", searchTermEntered);
    $("#numberOfResults").on("change", searchTermEntered);
    $("#submitButton").on("click", searchTermEntered);
    $(document).ajaxStart(function() {
        $("#busy").show();
    });
    $(document).ajaxComplete(function() {
        $("#busy").hide();
    });

    // get query parameters (if any)
    var searchTerm = getQueryParameter("term");
    var numberOfResults = getQueryParameter("limit");

    // ensure values are valid
    numberOfResults = parseFloat(numberOfResults);
    if (numberOfResults >= 50) {
        numberOfResults = 50;
    } else if (numberOfResults >= 25) {
        numberOfResults = 25;
    } else {
        numberOfResults = 10;
    }

    // initialize inputs
    $("#searchTerm").val(searchTerm);
    $("#numberOfResults").val(numberOfResults);

    // perform the search
    search(searchTerm, numberOfResults);
});

function searchTermEntered() {
    var searchTerm = $("#searchTerm").val();
    var numberOfResults = parseInt($("#numberOfResults").val());

    // reload the page with new query parameters
    window.location = "index.html?term=" + searchTerm + "&limit=" + numberOfResults;
}

function search(searchTerm, numberOfResults) {
    if (!searchTerm || numberOfResults <= 0) {
        // nothing to search for
        return;
    }

    // clear all results and errors
    clearResults();

    // iTunes API
    var query = "?media=music&term=" + searchTerm + "&limit=" + numberOfResults;
    $.ajax({
        type: 'GET',
        url: "https://itunes.apple.com/search" + query,
        dataType: 'jsonp',
        crossDomain: true,
        success: function(response) {
            showResults(response.results, query);
        },
        error: function() {
            $("#apiError").show();
            $("#results").hide();
        }
    });
}

function clearResults() {
    // clear all results and errors
    $("#rows").empty();
    $("#results").hide();
    $("#apiError").hide();
    $("#noResultsError").hide();
}

function showResults(results, query) {
    var rows = $("#rows");
    rows.empty();

    if (results.length <= 0) {
        // no results
        $("#noResultsError").show();
        $("#results").hide();
        return;
    }

    // fill-in the table
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var row = $("<tr>").on("click", null, i, function(event) {
            window.location = "detail.html" + query + "&index=" + event.data;
        });
        row.append($("<td>").text(i + 1));
        row.append($("<td>").text(result.artistName));
        row.append($("<td>").text(result.trackName));
        row.append($("<td>")
            .append($("<audio controls>")
                .append($("<source>").attr("src", result.previewUrl))));
        row.append($("<td>").text(result.collectionName));
        row.append($("<td>")
            .append($("<img>").attr("src", result.artworkUrl60)));
        rows.append(row);
    }

    $("#results").show();
}
