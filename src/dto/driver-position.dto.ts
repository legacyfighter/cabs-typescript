export class DriverPositionDto {
  private driverId: string;

  private latitude: number;

  private longitude: number;

  private seenAt: number;

  constructor(
    driverId: string,
    latitude: number,
    longitude: number,
    seenAt: number,
  ) {
    this.driverId = driverId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.seenAt = seenAt;
  }
}
