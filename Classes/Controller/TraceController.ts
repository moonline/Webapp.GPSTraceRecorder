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
    accuracyLatElement: HTMLSpanElement;
    accuracyLonElement: HTMLSpanElement;
    accuracyAltitudeElement: HTMLSpanElement;

    trackPointsElement: HTMLElement;
    trackStepElement: HTMLInputElement;
    saveButton: HTMLButtonElement;
    controlButton: HTMLButtonElement;
    resetButton: HTMLButtonElement;
    enableHighAccuracyCheckbox: HTMLInputElement;
    statusElement: HTMLSpanElement;

    constructor() {
        this.latElement = document.getElementById("lat");
        this.lonElement = document.getElementById("lon");
        this.altitudeElement = document.getElementById("altitude");
        this.accuracyLatElement = <HTMLSpanElement>document.getElementById("accuracyLat");
        this.accuracyLonElement = <HTMLSpanElement>document.getElementById("accuracyLon");
        this.accuracyAltitudeElement = <HTMLSpanElement>document.getElementById("AccuracyAltitude");

        this.trackPointsElement = document.getElementById("trackPoints");
        this.trackStepElement = <HTMLInputElement>document.getElementById("trackStep");
        this.enableHighAccuracyCheckbox = <HTMLInputElement>document.getElementById("enableHighAccuracy");
        this.statusElement = <HTMLSpanElement>document.getElementById("statusBubble");

        this.trace = new Trace(Number(this.trackStepElement.value), this.enableHighAccuracyCheckbox.checked, navigator.geolocation);

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
            this.latElement.textContent = Number((currentPosition.coords.latitude).toFixed(7)).toString();
            this.lonElement.textContent = Number((currentPosition.coords.longitude).toFixed(7)).toString();
            this.altitudeElement.textContent = currentPosition.coords.altitude.toString();

            this.accuracyLatElement.innerHTML = '&plusmn;'+Number((currentPosition.coords.accuracy).toFixed(1)).toString()+'m';
            this.accuracyLonElement.innerHTML = '&plusmn;'+Number((currentPosition.coords.accuracy).toFixed(1)).toString()+'m';
            this.accuracyAltitudeElement.innerHTML = '&plusmn;'+Number((currentPosition.coords.altitudeAccuracy).toFixed(1)).toString()+'m';
        }
        this.trackPointsElement.textContent = this.trace.getNumberOfTrackPoints().toString();

        if(this.trace.isRecording() && this.trace.getNumberOfTrackPoints() > 0) {
            this.statusElement.setAttribute("data-status", "on");
        } else {
            this.statusElement.setAttribute("data-status", "off");
        }
    }
}
