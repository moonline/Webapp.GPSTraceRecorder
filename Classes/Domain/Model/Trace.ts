/// <reference path="../../../Resources/Libraries/FxOS/fxos.d.ts" />

/// <reference path="../../../Classes/Domain/Model/GPSPosition.ts" />
/// <reference path="../../../Classes/Domain/Model/Observer.ts" />


class Trace {
    state: boolean = false;
    positionList: GPSPosition[] = [];
    trackStep: number = 1;
    observers: Observer[] = [];
    currentPosition: Position;
    geoService: Geolocation = null;
    watcher:number = null;
    enableHighAccuracy: boolean = true;

    constructor(trackStep: number, enableHighAccuracy: boolean, geoService) {
        this.trackStep = trackStep;
        this.enableHighAccuracy = enableHighAccuracy;
        this.geoService = geoService;
    }

    setTrackStep(step: number): void {
        this.trackStep = step;
    }

    isRecording(): boolean {
        return this.state;
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

    getCurrentPosition(): Position {
        return this.currentPosition;
    }

    getTraceList(): GPSPosition[] {
        return this.positionList;
    }

    resetTraceList(): void {
        this.positionList = [];
        this.notifyObservers();
    }

    startRecording(): void {
        this.state = true;
        if (this.geoService) {
            // find position first, start tracking after
            this.geoService.getCurrentPosition(
                function(position) {
                    this.currentPosition = position;
                    this.watcher = this.geoService.watchPosition(
                        function(position) {
                            this.currentPosition = position;
                            this.notifyObservers();
                        }.bind(this),
                        function(error) {
                            console.warn(error);
                        },
                        { enableHighAccuracy: this.enableHighAccuracy }
                    );

                    this.recordTrace(
                        this.state,
                        this.positionList,
                        this.currentPosition,
                        this.trackStep*1000,
                        this.recordTrace.bind(this),
                        this.notifyObservers.bind(this)
                    )
                }.bind(this),
                function(error) {
                    console.warn(error);
                },
                { maximumAge: Infinity }
            );
        } else {
            alert("Geolocation not supported!");
        }
    }

    stopRecording(): void {
        this.state = false;
        this.geoService.clearWatch(this.watcher);
        this.notifyObservers();
    }

    recordTrace(state, positionList, currentPosition, delayTime, recordTrace, notifyObservers): void {
        if(state === true && currentPosition) {
            setTimeout(function() {
                recordTrace(state, positionList, currentPosition, delayTime, recordTrace);
            }, delayTime);
            positionList.push(
                new GPSPosition(
                    // call by value
                    <number>(new Number(currentPosition.coords.latitude)),
                    <number>(new Number(currentPosition.coords.longitude)),
                    <number>(new Number(currentPosition.coords.altitude)),
                    (new Date(currentPosition.timestamp)).toJSON().toString()
                )
            );
            notifyObservers();
            console.log(currentPosition);
        }
    }

}
