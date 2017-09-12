
// Functions
function getNewMovies (movie) {
    var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=d53b802d30d38d0bf73c24dabc4a5c8d&language=en-US&query=" + movie;
    $.ajax({
    url: queryURL,
    method: "GET"
    }).done(function (response) {
    for (var i = 0; i<8; i++) {
        var movieId = response.results[i].id;
        $("#posters").append("<p>" + response.results[i].title + "</p><p>"  + response.results[i].release_date + "</p><p><img src= https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path + "></p><p>" + response.results[i].overview + "</p>");
        makeButton(response.results[i].title, response.results[i].id);
        }
    });
    queryURL = "";
    movie = "";
};


function makeButton (title, id) {
    var newButton = $("<button>");
    newButton.addClass("btn btn-primary move-button");
    newButton.attr("data-name", id);
    newButton.attr("title", title);
    newButton.text("click me");
    $("#posters").append(newButton);
}


function displayGoodies () {
	clearGoodies();
	$("#review-panel").show();
    $("#trailer-panel").show();
    var title = $(this).attr("title");
    var dataName = $(this).attr("data-name");
    getTrailerId(dataName);
    getNytData(title);
}


function getTrailerId (x) {
    var queryURL = "https://api.themoviedb.org/3/movie/" + x + "/videos?api_key=d53b802d30d38d0bf73c24dabc4a5c8d&language=en-US"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        var youtubeId = response.results[0].key;
       getYtData(youtubeId); 
    });
}


function getNytData(title) {
    var reviewUrl = "https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=03e9ed8edb0944dbb5c1b7e983811b8b&query=" + title;
    $.ajax({
        url: reviewUrl,
        method: 'GET',
    }).done(function(result) {
        for (var i = 0; i < result.results.length; i++) {
            $("#reviews > tbody").append("<tr><td>" + result.results[i].link.suggested_link_text + "</td><td>" + "<a href='" + result.results[i].link.url + "'>" + result.results[i].link.url + "</a>" + "</td></tr>");
        }
    })
}


function getYtData(title) {
    var youTubeUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + title + " Trailer" + "&key=AIzaSyBFSTdHGhgwD7sUXEQ0UlXSKkro4SP3EnA";
    $.ajax({
        url: youTubeUrl,
        method: 'GET'
    }).done(function(response) {
        var results = response.items;
        for (var i = 0; i < results.length; i++) {
            displayVideo(results[i], i);
        }
    });
}


function clearResults() {
    $("#posters").empty();
    $("#trailers").empty();
    $("#reviews-results").empty();
    $("#movie-input").empty();
}


function clearGoodies () {
	$("#trailers").empty();
    $("#reviews-results").empty();
}


function hideDivs () {
    $("#poster-panel").hide();
    $("#review-panel").hide();
    $("#trailer-panel").hide();
}


function displayVideo(result, i) {
    var vid = document.createElement('div');
    vidId = 'vid' + i;
    vid.id = vidId;
    $("#trailers").append(vid);
    var player = new YT.Player(vidId, {
        height: '360',
        width: '480',
        videoId: result.id.videoId,
        events: {
            'onReady': onPlayerReady
        }
    });
    function onPlayerReady(e) {
        var myId = e.target.a.id;
        var duration = e.target.getDuration();
        if (duration === 0) {
            $("#trailers").empty(e.target.a);
        } else {
            var myId = e.target.a.id;
            console.log('Video ' + myId + ' ready to play.');
        }
    }
}


// Movie App
hideDivs();

$("#find-movie").on("click", function(event) {
	event.preventDefault();
	clearResults();
	hideDivs();
    var movie = $("#movie-input").val().trim();
    getNewMovies(movie);
    $("#poster-panel").show();
});

$(document).on("click", ".move-button", displayGoodies);

