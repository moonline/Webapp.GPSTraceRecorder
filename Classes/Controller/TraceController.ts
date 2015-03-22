/// <reference path="../../Resources/Libraries/FxOS/fxos.d.ts" />

/// <reference path="../../Classes/Domain/Model/GPSPosition.ts" />
/// <reference path="../../Classes/Domain/Model/Observer.ts" />
/// <reference path="../../Classes/Domain/Model/TraceFactory.ts" />


class TraceController implements Observer {
    traceFactory: TraceFactory;

    latElement: HTMLElement;
    lonElement: HTMLElement;
    altitudeElement: HTMLElement;
    trackPointsElement: HTMLElement;
    trackStepElement: HTMLInputElement;
    saveButton: HTMLButtonElement;
    controlButton: HTMLButtonElement;
    resetButton: HTMLButtonElement;

    constructor() {
        this.latElement = document.getElementById("lat");
        this.lonElement = document.getElementById("lon");
        this.altitudeElement = document.getElementById("altitude");
        this.trackPointsElement = document.getElementById("trackPoints");
        this.trackStepElement = <HTMLInputElement>document.getElementById("trackStep");

        this.traceFactory = new TraceFactory(Number(this.trackStepElement.value));

        this.saveButton = <HTMLButtonElement>document.getElementById("save");
        this.controlButton = <HTMLButtonElement>document.getElementById("control");
        this.resetButton = <HTMLButtonElement>document.getElementById("reset");

        this.controlButton.addEventListener("click", function(event){
            if(this.traceFactory.state === true) {
                this.traceFactory.state = false;
                this.controlButton.textContent = "Start";
                this.setSaveButtonState();
                this.resetButton.removeAttribute("disabled");
            } else {
                this.traceFactory.state = true;
                this.traceFactory.findMyCurrentLocation(navigator.geolocation);
                this.controlButton.textContent = "Stop";
                this.setSaveButtonState();
                this.resetButton.setAttribute("disabled", "disabled");
            }
        }.bind(this));

        this.resetButton.addEventListener("click", function(event){
            this.traceFactory.resetTraceList();
        }.bind(this));

        this.trackStepElement.addEventListener("change", function(event) {
            this.traceFactory.trackStep = Number(this.trackStepElement.value);
        }.bind(this));

        this.saveButton.addEventListener("click", function(event){
            this.traceFactory.saveTrace();
        }.bind(this));

        this.traceFactory.addObserver(this);
    }


    setSaveButtonState(): void {
        if(this.traceFactory.state === false && this.traceFactory.getNumberOfTrackPoints() > 0) {
            this.saveButton.removeAttribute("disabled");
        } else {
            this.saveButton.setAttribute("disabled", "disabled");
        }
    }

    notify(): void {
        var currentPosition: GPSPosition = this.traceFactory.getCurrentPosition();
        if(currentPosition) {
            this.latElement.textContent = currentPosition.lat.toString();
            this.lonElement.textContent = currentPosition.lon.toString();
            this.altitudeElement.textContent = currentPosition.elevation.toString();
        }
        this.trackPointsElement.textContent = this.traceFactory.getNumberOfTrackPoints().toString();
    }
}
