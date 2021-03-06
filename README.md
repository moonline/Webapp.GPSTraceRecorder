GPS Trace Recorder
==================

Record GPS Traces in GPX format.

![Recording screenshot](Documentation/screen1.png)

![Saving to file screenshot](Documentation/screen2.png)

The recorded traces will be saved as gpx (xml) file in the root directory of the memory card.


Requirements
------------

### Interfaces

* navigator.getDeviceStorage
* navigator.geolocation


Version history
---------------

Version | Date          | Dependencies      | Features	| Bugfixes   | Tested with
---	    |---		    |---				|---		|---         |---
1.0	| 2015-03-25		|                   | &bull; Record GPS Traces<br />&bull; Save recorded traces as gpx<br />&bull; Configure tracking interval<br />&bull; Reset recorded positions | | **FxOS Simulator**<br /> &bull; 1.3, 1.4, 2.0 (stable)<br />&bull; 2.1, 2.2, 3.0<br />**Devices**<br />&bull; Mozilla Flame (2.0 pre release)
1.1	| 2015-04-03		|                   | &bull; Accuracy<br />&bull; Recording status visibility | &bull; Localization problem if gps is slow | **FxOS Simulator**<br /> &bull; 1.3, 1.4, 2.0 (stable)<br />&bull; 2.1, 2.2, 3.0<br />**Devices**<br />&bull; Mozilla Flame (2.0 pre release)


Compile from source
-------------------

Run build.sh to compile code and styles using tsc and lessc of node.js.

### Required tools

* lessc 2.2.0
* tsc 1.4.1.0
* (node 0.10.25)


### Compile styles by hand

```shell
lessc ./Resources/Styles/styles.less ./Resources/Styles/styles.css --source-map
```


### Compile TypeScript by hand

```shell
tsc --target ES5 ./Main.ts --module AMD --out ./Main.js
```


### Package release

```shell
zip -r GPSTraceRecorder-x.y.z.zip * -x ".git" -x "*.odg" -x "*.ts" -x "*.less" -x "*.sh" -x "*.~" -x ".gitignore"
```


Todo
----

* **Feature**: Localization
