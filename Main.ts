interface Navigator {
    getDeviceStorage: any;
}

var state = null;
var positionList = [];
var trackPoints = 0;

function createXMLDocument(positionList) {
    var parser = new DOMParser();
    var gpxDocument = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.0"></gpx>', "text/xml");
    var gpxRootElement = gpxDocument.getElementsByTagName("gpx")[0];

    /*var gpxDocument = document.implementation.createDocument("", "", null);
    var gpxRootElement = gpxDocument.createElement("gpx");
    gpxRootElement.setAttribute("version", "1.0");*/

    var nameElement = gpxDocument.createElement("name");
    nameElement.appendChild(gpxDocument.createTextNode("GPS Trace"));
    gpxRootElement.appendChild(nameElement);

    var track = gpxDocument.createElement("trk");
    var trackName = gpxDocument.createElement("name");
    trackName.appendChild(gpxDocument.createTextNode("GPS Trace"));
    track.appendChild(trackName);

    var trackNumber = gpxDocument.createElement("number");
    trackNumber.appendChild(gpxDocument.createTextNode("1"));
    track.appendChild(trackNumber);

    var trackSegment = gpxDocument.createElement("trkseg");
    track.appendChild(trackSegment);

    positionList.forEach(function(position) {
        var lat = position.lat;
        var lon = position.lon;
        var elevation = position.elevation;
        var timestamp = position.timestamp;

        console.log(position);
        var trackPoint = gpxDocument.createElement("trkpt");
        trackPoint.setAttribute("lat", lat);
        trackPoint.setAttribute("lon", lon);

        elevation = gpxDocument.createElement("elevation");
        elevation.appendChild(gpxDocument.createTextNode(elevation));
        trackPoint.appendChild(elevation);

        var timeElement = gpxDocument.createElement("time");
        timeElement.appendChild(gpxDocument.createTextNode(timestamp));
        trackPoint.appendChild(timeElement);

        track.appendChild(trackPoint);
    });

    gpxRootElement.appendChild(track);
    /*gpxDocument.appendChild(gpxRootElement);*/

    return gpxDocument;
}

function saveTrace() {
    var gpxDocument = createXMLDocument(positionList);
    var serializer = new XMLSerializer();
    console.log(serializer.serializeToString(gpxDocument));

    var sdcard = navigator.getDeviceStorage("sdcard");
    var file   = new Blob([serializer.serializeToString(gpxDocument)], {type: "application/gpx+xml"});

    var request = sdcard.addNamed(file, "trace"+(new Date()).toString()+".gpx");

    request.onsuccess = function () {
      var name = this.result;
      console.log('File "' + name + '" successfully wrote on the sdcard storage area');
    }

    // An error typically occur if a file with the same name already exist
    request.onerror = function () {
      console.warn('Unable to write the file: ' + this.error);
    }
}


function findMyCurrentLocation(geoService){
    if(state === true) {
        if (geoService) {
            geoService.getCurrentPosition(
                function(position) {
                    trackPoints++;
                    console.log(position);
                    positionList.push({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        elevation: position.coords.altitude,
                        timestamp: (new Date(position.timestamp)).toJSON().toString()
                    });

                    document.getElementById("lat").textContent = position.coords.latitude;
                    document.getElementById("lon").textContent = position.coords.longitude;
                    document.getElementById("altitude").textContent = position.coords.altitude;
                    document.getElementById("trackPoints").textContent = trackPoints.toString();

                    var element:HTMLInputElement = <HTMLInputElement>document.getElementById("trackStep");
                    var delayTime: number = Number(element.value);
                    console.log(HTMLInputElement, delayTime);
                    setTimeout(findMyCurrentLocation(geoService), delayTime*1000);
                },
                function(error) {
                    console.log(error);
                }
            );
        } else {
            console.log("Geolocation not supported!");
        }
    }
}

window.onload = function() {
    document.getElementById("start").addEventListener("click", function(event){
        state = true;
        findMyCurrentLocation(navigator.geolocation);
    });
    document.getElementById("stop").addEventListener("click", function(event){
        state = false;
    });

    document.getElementById("save").addEventListener("click", function(event){
        saveTrace();
    });
}
