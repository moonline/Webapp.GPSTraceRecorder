/// <reference path="../../../Resources/Libraries/FxOS/fxos.d.ts" />

/// <reference path="../../../Classes/Domain/Model/GPSPosition.ts" />
/// <reference path="../../../Classes/Domain/Model/Observer.ts" />


class TraceFactory {
    state: boolean = false;
    positionList: GPSPosition[];
    trackStep: number;
    observers: Observer[];

    constructor(trackStep: number) {
        this.trackStep = trackStep;
    }

    addObserver(observer: Observer) {
        this.observers.push(observer);
    }

    notifyObservers(): void {
        this.observers.forEach(function(observer: Observer) {
            observer.notify();
        })
    }

    getNumberOfTrackPoints(): number {
        return this.positionList.length;
    }

    getCurrentPosition(): GPSPosition {
        if(this.positionList.length > 0) {
            return this.positionList[this.positionList.length-1];
        } else {
            return null;
        }
    }

    createXMLDocument(positionList: GPSPosition[]): XMLDocument {
        var parser = new DOMParser();
        var gpxDocument = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.0"></gpx>', "text/xml");
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

            console.log(position);
            var trackPoint = gpxDocument.createElement("trkpt");
            trackPoint.setAttribute("lat", lat);
            trackPoint.setAttribute("lon", lon);

            var elevation = gpxDocument.createElement("elevation");
            elevation.appendChild(gpxDocument.createTextNode(elevation));
            trackPoint.appendChild(elevation);

            var timeElement = gpxDocument.createElement("time");
            timeElement.appendChild(gpxDocument.createTextNode(timestamp));
            trackPoint.appendChild(timeElement);

            track.appendChild(trackPoint);
        });

        gpxRootElement.appendChild(track);
        return gpxDocument;
    }

    resetTraceList(): void {
        this.positionList = [];
    }

    saveTrace(): void {
        var gpxDocument = createXMLDocument(positionList);
        var serializer = new XMLSerializer();
        var resetTraceList = this.resetTraceList;
        var positionList = this.positionList;
        var notifyObservers = this.notifyObservers;
        console.log(serializer.serializeToString(gpxDocument));

        var fileName = prompt("File name", "trace"+(new Date()).getTime()+".gpx");

        if(fileName) {
            var sdcard = navigator.getDeviceStorage("sdcard");
            var file   = new Blob([serializer.serializeToString(gpxDocument)], {type: "application/gpx+xml"});

            var request = sdcard.addNamed(file, fileName);

            request.onsuccess = function () {
                var name = this.result;
                console.log('File "' + name + '" successfully wrote on the sdcard storage area');
                resetTraceList();
                notifyObservers();
                document.getElementById("trackPoints").textContent = positionList.length.toString();
            }

            // An error typically occur if a file with the same name already exist
            request.onerror = function () {
                console.warn('Unable to write the file: ' + this.error);
            }
        }
    }


    findMyCurrentLocation(geoService): void{
        var positionList = this.positionList;
        var findMyCurrentLocation = this.findMyCurrentLocation;
        var notifyObservers = this.notifyObservers;

        if(this.state === true) {
            if (geoService) {
                geoService.getCurrentPosition(
                    function(position) {
                        setTimeout(findMyCurrentLocation(geoService), delayTime*1000);
                        console.log(position);
                        positionList.push(
                            new GPSPosition(
                                position.coords.latitude,
                                position.coords.longitude,
                                position.coords.altitude,
                                (new Date(position.timestamp)).toJSON().toString()
                            )
                        );
                        notifyObservers();
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

}
