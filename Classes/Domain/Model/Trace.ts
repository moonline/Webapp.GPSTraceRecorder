/// <reference path="../../../Resources/Libraries/FxOS/fxos.d.ts" />

/// <reference path="../../../Classes/Domain/Model/GPSPosition.ts" />
/// <reference path="../../../Classes/Domain/Model/Observer.ts" />


class Trace {
    state: boolean = false;
    positionList: GPSPosition[] = [];
    trackStep: number = 1;
    observers: Observer[] = [];

    constructor(trackStep: number) {
        this.trackStep = trackStep;
    }

    addObserver(observer: Observer) {
        this.observers.push(observer);
    }

    notifyObservers(): void {
        this.observers.forEach(function(observer: Observer) {
            observer.notify();
        });
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

    getTraceList(): GPSPosition[] {
        return this.positionList;
    }

    resetTraceList(): void {
        this.positionList = [];
        this.notifyObservers();
    }

    findMyCurrentLocation(geoService): void{
        var positionList = this.positionList;
        var delayTime = this.trackStep*1000;

        var findMyCurrentLocation = this.findMyCurrentLocation.bind(this);
        var notifyObservers = this.notifyObservers.bind(this);

        if(this.state === true) {
            if (geoService) {
                setTimeout(function() {
                    var geoServiceClousure = geoService;
                    findMyCurrentLocation(geoServiceClousure);
                }, delayTime);
                geoService.getCurrentPosition(
                    function(position) {
                        positionList.push(
                            new GPSPosition(
                                // call by value
                                <number>(new Number(position.coords.latitude)),
                                <number>(new Number(position.coords.longitude)),
                                <number>(new Number(position.coords.altitude)),
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
