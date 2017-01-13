var errorhandler = function() {
    alert("Unable to fetch map. Check your connection and try again!");
};

// The model of the app. It contains all the info about the locations.

var model = [{
        title: "Janeshwar Mishra Park, Lucknow",
        lat: 26.8382,
        lng: 80.9953
    },
    {
        title: "Ambedkar Memorial Park",
        lat: 26.8479,
        lng: 80.9758
    },
    {
        title: "Hazratganj",
        lat: 26.8564,
        lng: 80.9457
    },
    {
        title: "Kukrail Reserve Forest",
        lat: 26.9100,
        lng: 80.9833
    },
    {
        title: "Bara Imambara",
        lat: 26.8690,
        lng: 80.9131
    },
    {
        title: "Lucknow Zoo",
        lat: 26.8457,
        lng: 80.9546
    },
    {
        title: "The Residency, Lucknow",
        lat: 26.8606,
        lng: 80.9268
    }
];

//Declaring the necessary variables

var map, marker, infowindow, x;
var markerArray = [];

//The ViewModel of the MVVM approach of Knockout.js

var ViewModel = function() {
    this.model = ko.observableArray(model);
    this.markerArray = ko.observableArray([]);
    this.query = ko.observable('');
    //Function to filter the list according to the user
    this.searchResults = ko.computed(function() {
        var query = this.query().toLowerCase();
        //Utils function used to sort the model array and display the list accordingly.
        return ko.utils.arrayFilter(this.model(), function(list) {
            var result = list.title.toLowerCase().indexOf(query) > -1;
            list.marker.setVisible(result);
            return result;
        });
    }, this);
};

// This function is called when the google maps API is initiated. 

function initmap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 26.8467,
            lng: 80.9462
        },
        zoom: 12
    });
    infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < model.length; i++) {
        this.marker = new google.maps.Marker({
            position: {
                lat: model[i].lat,
                lng: model[i].lng
            },
            animation: google.maps.Animation.DROP,
            map: map,
            title: model[i].title,
            icon: "img/test.gif"
        });
        model[i].marker = marker;
        markerArray.push(marker);
        google.maps.event.addListener(marker, 'click', function(marker) {
            return function() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.DROP);
                }

                // MediaWiki API is called to get info about the locations.

                var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                    marker.title + '&format=json&callback=wikiCallback';
                $.ajax(wikiUrl, {
                    dataType: "jsonp",
                    success: function(response) {
                        infowindow.setContent('<h3>' + response[1] + '</h3><p>' + response[2] + '</p><a href="' + response[3] + '">' + response[1] + '</a>');
                        infowindow.open(map, marker);
                    }
                });
            }
        }(marker));
    }

    // This is triggered when the location is clicked on the list.

    this.trigger = function(place) {
        google.maps.event.trigger(place.marker, 'click');
    };

    // Applying the bindings to the viewmode

    ko.applyBindings(new ViewModel());
}