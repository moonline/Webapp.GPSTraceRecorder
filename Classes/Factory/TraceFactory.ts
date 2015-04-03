/// <reference path="../../Resources/Libraries/FxOS/fxos.d.ts" />

/// <reference path="../../Classes/Domain/Model/GPSPosition.ts" />
/// <reference path="../../Classes/Domain/Model/Observer.ts" />


class TraceFactory {
    positions: GPSPosition[] = [];

    constructor(positions: GPSPosition[]) {
        this.positions = positions;
    }

    createXMLDocument(positionList: GPSPosition[]): XMLDocument {
        var parser = new DOMParser();
        var gpxDocument: XMLDocument = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.0"></gpx>', "text/xml");
        var gpxRootElement = gpxDocument.getElementsByTagName("gpx")[0];

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

        positionList.forEach(function(position: GPSPosition) {
            var lat = position.lat.toString();
            var lon = position.lon.toString();
            var elevation = position.elevation.toString();
            var timestamp = position.timestamp.toString();

            var trackPoint = gpxDocument.createElement("trkpt");
            trackPoint.setAttribute("lat", lat);
            trackPoint.setAttribute("lon", lon);

            var altitude = gpxDocument.createElement("elevation");
            altitude.appendChild(gpxDocument.createTextNode(elevation));
            trackPoint.appendChild(altitude);

            var timeElement = gpxDocument.createElement("time");
            timeElement.appendChild(gpxDocument.createTextNode(timestamp));
            trackPoint.appendChild(timeElement);

            track.appendChild(trackPoint);
        });

        gpxRootElement.appendChild(track);
        return gpxDocument;
    }

    saveTrace(success: () => void): void {
        var gpxDocument = this.createXMLDocument(this.positions);
        var serializer = new XMLSerializer();
        var positionList = this.positions;

        var fileName = prompt("File name", "trace"+(new Date()).getTime()+".gpx");

        if(fileName) {
            var sdcard = navigator.getDeviceStorage("sdcard");
            var file   = new Blob([serializer.serializeToString(gpxDocument)], {type: "application/gpx+xml"});

            var request = sdcard.addNamed(file, fileName);

            request.onsuccess = function () {
                var name = this.result;
                console.log('File "' + name + '" successfully wrote on the sdcard storage area');
                success();
            }

            // An error typically occur if a file with the same name already exist
            request.onerror = function () {
                console.warn('Unable to write the file: ' + this.error);
            }
        }
    }
}
