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

    constructor() {
        this.latElement = document.getElementById("lat");
        this.lonElement = document.getElementById("lon");
        this.altitudeElement = document.getElementById("altitude");
        this.trackPointsElement = document.getElementById("trackPoints");
        this.trackStepElement = <HTMLInputElement>document.getElementById("trackStep");

        this.traceFactory = new TraceFactory(Number(this.trackStepElement.value));

        this.saveButton = <HTMLButtonElement>document.getElementById("save");
        this.controlButton = <HTMLButtonElement>document.getElementById("control");

        var traceFactory = this.traceFactory;
        var setSaveButtonState = this.setSaveButtonState;
        var setSaveButtonState = this.setSaveButtonState;

        this.controlButton.addEventListener("click", function(event){
            if(traceFactory.state === true) {
                traceFactory.state = false;
                this.textContent = "Start";
                setSaveButtonState();
            } else {
                traceFactory.state = true;
                traceFactory.findMyCurrentLocation(navigator.geolocation);
                this.textContent = "Stop";
                setSaveButtonState();
            }
        }.bind(this));

        this.saveButton.addEventListener("click", function(event){
            this.traceFactory.saveTrace();
        });
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

        this.latElement.textContent = currentPosition.lat;
        this.lonElement.textContent = currentPosition.lon;
        this.altitudeElement.textContent = currentPosition.elevation;
        this.trackPointsElement.textContent = this.traceFactory.getNumberOfTrackPoints();
    }
}
