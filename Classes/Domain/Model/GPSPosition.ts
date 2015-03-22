class GPSPosition {
    lat: number;
    lon: number;
    elevation: number;
    timestamp: string;

    constructor(lat: number, lon: number, elevation: number, timestamp: string) {
        this.lat = lat;
        this.lon = lon;
        this.elevation = elevation;
        this.timestamp = timestamp;
    }
}
