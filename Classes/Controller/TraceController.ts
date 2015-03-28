/// <reference path="../../Resources/Libraries/FxOS/fxos.d.ts" />

/// <reference path="../../Classes/Domain/Model/GPSPosition.ts" />
/// <reference path="../../Classes/Domain/Model/Observer.ts" />
/// <reference path="../../Classes/Domain/Model/Trace.ts" />

/// <reference path="../../Classes/Factory/TraceFactory.ts" />


class TraceController implements Observer {
    trace: Trace;

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

        this.trace = new Trace(Number(this.trackStepElement.value), navigator.geolocation);

        this.saveButton = <HTMLButtonElement>document.getElementById("save");
        this.controlButton = <HTMLButtonElement>document.getElementById("control");
        this.resetButton = <HTMLButtonElement>document.getElementById("reset");

        this.controlButton.addEventListener("click", function(event){
            if(this.trace.isRecording() === true) {
                this.trace.stopRecording();
                this.controlButton.textContent = "Start";
                this.setSaveButtonState();
                this.resetButton.removeAttribute("disabled");
            } else {
                this.trace.startRecording();
                this.controlButton.textContent = "Stop";
                this.setSaveButtonState();
                this.resetButton.setAttribute("disabled", "disabled");
            }
        }.bind(this));

        this.resetButton.addEventListener("click", function(event){
            this.trace.resetTraceList();
        }.bind(this));

        this.trackStepElement.addEventListener("change", function(event) {
            this.trace.setTrackStep(Number(this.trackStepElement.value));
        }.bind(this));

        this.saveButton.addEventListener("click", function(event){
            var traceFactory = new TraceFactory(this.trace.getTraceList());
            traceFactory.saveTrace(function() {
                this.trace.resetTraceList();
            }.bind(this));
        }.bind(this));

        this.trace.addObserver(this);
    }


    setSaveButtonState(): void {
        if(this.trace.isRecording() === false && this.trace.getNumberOfTrackPoints() > 0) {
            this.saveButton.removeAttribute("disabled");
        } else {
            this.saveButton.setAttribute("disabled", "disabled");
        }
    }

    notify(): void {
        var currentPosition: Position = this.trace.getCurrentPosition();
        if(currentPosition) {
            this.latElement.textContent = currentPosition.coords.latitude.toString();
            this.lonElement.textContent = currentPosition.coords.longitude.toString();
            this.altitudeElement.textContent = currentPosition.coords.altitude.toString();
        }
        this.trackPointsElement.textContent = this.trace.getNumberOfTrackPoints().toString();
    }
}
