movieSearch = null;

hideDivs();
// Functions
function getNewMovies(movie) {
    var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=d53b802d30d38d0bf73c24dabc4a5c8d&language=en-US&query=" + movie;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        // for (var i = 0; i < 8; i++) {
        //     var movieId = response.results[i].id;
        //     $("#posters").append("<div><p>" + response.results[i].title + "</p><p>" + response.results[i].release_date + "</p><p><img src= https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path + "></p><p>" + response.results[i].overview + "</p></div>");
        //     makeButton(response.results[i].title, response.results[i].id);
        // }

        for (var i = 0; i < 4; i++) {
            var movieInfoDiv = $("<div>");
            movieInfoDiv.addClass("movie-info");
            movieInfoDiv.addClass("pull-left")

            var pTitle = $("<p>");
            var pReleased = $("<p>");
            var pPlot = $("<p>");
            pPlot.addClass("clear");
            var movieTitle = response.results[i].title;
            var movieRelDate = getYear(response.results[i].release_date);
            var movieId = response.results[i].id;
            var moviePoster = response.results[i].poster_path;
            var moviePlot = response.results[i].overview;

            pTitle.text("Title: " + movieTitle);
            pReleased.text("Released: " + movieRelDate);
            pPlot.text("Plot: " + moviePlot);

            var movieImg = $("<img>");
            movieImg.attr("src", "https://image.tmdb.org/t/p/w185/" + moviePoster);
            movieImg.addClass("img-responsive")
            movieImg.addClass("poster");

            movieInfoDiv.append(pTitle);
            movieInfoDiv.append(pReleased);
            movieInfoDiv.append(makeButton(movieTitle, movieId));
            movieInfoDiv.append(movieImg);
            movieInfoDiv.append(pPlot)
            $('#posters').append(movieInfoDiv);

        }

    });
    queryURL = "";
    movie = "";
};


function makeButton(title, id) {
    var newButton = $("<button>");
    newButton.addClass("btn btn-primary move-button");
    //
    newButton.addClass("float-left");
    newButton.attr("data-name", id);
    newButton.attr("title", title);
    newButton.text("click me");
    return newButton;

}


function displayGoodies() {
    clearGoodies();
    $("#review-panel").show();
    $("#trailer-panel").show();
    var title = $(this).attr("title");
    var dataName = $(this).attr("data-name");
    getTrailerId(dataName);

    getNytData(title);

    //scroll to top of trailer div
    $('html, body').animate({
        scrollTop: ($('#trailer-panel').offset().top)
    }, 500);

}


function getTrailerId(x) {
    var queryURL = "https://api.themoviedb.org/3/movie/" + x + "/videos?api_key=d53b802d30d38d0bf73c24dabc4a5c8d&language=en-US"
    // console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        var youtubeId = response.results[0].key;
        var test = response.results[0].type;
        // console.log(youtubeId);
        console.log(test);
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
            // displayVideo(results[i], i);
            //blake mods
             displayVideo(results[0]);
        }
    });
}


function clearResults() {
    $("#posters").empty();
    $("#trailers").empty();
    $("#reviews-results").empty();
    $("#movie-input").empty();
}


function clearGoodies() {
    $("#trailers").empty();
    $("#reviews-results").empty();
}


function hideDivs() {
    $("#poster-panel").hide();
    $("#review-panel").hide();
    $("#trailer-panel").hide();
}
function resetDivs() {
    // $("#poster-panel").hide();
    $("#review-panel").hide();
    $("#trailer-panel").hide();
}


function displayVideo(result, i) {
    var vid = document.createElement('div');
    vidId = 'vid' + i;
    vid.id = vidId;
    $("#trailers").append(vid);
    var player = new YT.Player(vidId, {
        // height: '360',
        // width: '480',
          // changed resolution to 480 by 720 for larger video player to compensate for there only being 1 trailer
        height: '480',
        width: '720',
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
            // console.log('Video ' + myId + ' ready to play.');
        }
    }
}


//updated form submit
$("#movie-form").submit(function(event) {
    input = $("#movie-input").val().trim();
    // not using autocomplete result
    if (input != '' && movieSearch == null) {
        event.preventDefault();
        clearResults();
        var movie = $("#movie-input").val().trim();
        getNewMovies(movie);
        getNytData(movie);
        getYtData(movie);
        $('.ui-menu').hide(); // hide autocomplete options
        scrollPoster();
        $("#poster-panel").show();
        resetDivs(); //rehide
        movieSearch = null;
        // if were are using the autcomplete recommendation
    } else if (movieSearch != null) {
        event.preventDefault();
        clearResults();
        resetDivs();
        var movie = window.movieSearch;
        getNewMovies(movie);
        getNytData(movie);
        getYtData(movie);
        $("#poster-panel").show();
        scrollPoster();
        movieSearch = null; // reset var

    } else {
        // console.log("do nothing");
    }

});

$(document).on("click", ".move-button", displayGoodies);


// validate
$("#movie-form").validate();

//Autocomplete

$(function() {
    var getAjax = function(request, response) {
        var getTitle = "https://api.themoviedb.org/3/search/movie?" + "&query=" + request.term + "&api_key=d53b802d30d38d0bf73c24dabc4a5c8d";
        $.ajax({
            url: getTitle,
            method: 'GET',
        }).done(function(data) {
            // use map to format as JQuery autocomplete expects
            response($.map(data.results, function(item) {
                return {
                    label: item.title,
                    value: item.name
                }
            }));
        })

    }
    var selectItem = function(event, ui) {
        event.preventDefault() 
        $("#movie-input").val(ui.item.value);
        // console.log(ui.item.value);
        window.movieSearch = ui.item.value;
        return false;
    }

    $("#movie-input").autocomplete({
        source: getAjax,
        // select: selectItem,
        select: function(event, ui) {
            $("#movie-input").val(ui.item.value);
            movieSearch = ui.item.value;
            $("#movie-form").submit(); // submit form on selection - mouse or enter key

        },
        autoFocus: true,
        minLength: 2, 
        change: function() {
            $("#movie-input").val("").css("display", 2);
        }
    });
});

//momentjs to get year of relesae

function getYear(date){
 var dateFormat = "YYYY-MM-DD";
 var convertedDate = moment(date, dateFormat);
 year = convertedDate.format("YYYY");
 return year;
}

function scrollPoster(){
       $('html, body').animate({
        scrollTop: ($('#poster-panel').offset().top)
    }, 500);
}

hide

