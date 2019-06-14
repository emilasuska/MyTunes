$(document).ready(function() {
    // get query parameters
    var searchTerm = getQueryParameter("term");
    var numberOfResults = getQueryParameter("limit");
    var index = parseInt(getQueryParameter("index"));

    $("#backButton").on("click", function() {
        window.location = "index.html?term=" + searchTerm + "&limit=" + numberOfResults;
    });
    $(document).ajaxStart(function() {
        $("#busy").show();
    });
    $(document).ajaxComplete(function() {
        $("#busy").hide();
    });

    // perform the search
    search(searchTerm, numberOfResults, index);
});

function search(searchTerm, numberOfResults, index) {
    // iTunes API
    var query = "?media=music&term=" + searchTerm + "&limit=" + numberOfResults;
    $.ajax({
        type: 'GET',
        url: "https://itunes.apple.com/search" + query,
        dataType: 'jsonp',
        crossDomain: true,
        success: function(response) {
            showResult(response.results, index);
        },
        error: function() {
            $("#apiError").show();
            $("#results").hide();
        }
    });
}

function showResult(results, index) {
    var result = results[index];

    var releaseDate = result.releaseDate;
    if (releaseDate) {
        releaseDate = new Date(result.releaseDate).toLocaleDateString();
    }

    var trackTime = result.trackTimeMillis;
    if (trackTime) {
        trackTime = Math.floor(trackTime / 60000) + ":"
            + (Math.floor(trackTime / 10000) % 6)
            + (Math.floor(trackTime / 1000) % 10);
    }

    var trackExplicitness = result.trackExplicitness;
    if (trackExplicitness == "notExplicit") {
        trackExplicitness = "Not Explicit";
    } else if (trackExplicitness == "explicit") {
        trackExplicitness = "Explicit";
    }

    $("#albumArt").attr("src", result.artworkUrl100);
    $("#itunesLink").attr("href", result.trackViewUrl);
    $("#songRank").text(index + 1);
    $("#artistName").text(result.artistName);
    $("#songName").text(result.trackName);
    $("#audioPreview")
        .append($("<audio controls>")
            .append($("<source>").attr("src", result.previewUrl)));
    $("#albumName").text(result.collectionName);
    $("#releaseDate").text(releaseDate);
    $("#trackTime").text(trackTime);
    $("#genre").text(result.primaryGenreName);
    $("#trackExplicitness").text(trackExplicitness);
}
