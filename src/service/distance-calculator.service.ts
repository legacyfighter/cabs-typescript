import { Injectable } from '@nestjs/common';

@Injectable()
export class DistanceCalculator {
  public static degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  public calculateByMap(
    latitudeFrom: number,
    longitudeFrom: number,
    latitudeTo: number,
    longitudeTo: number,
  ) {
    // ...
    console.log({ latitudeFrom, longitudeFrom, latitudeTo, longitudeTo });
    return 42;
  }

  public calculateByGeo(
    latitudeFrom: number,
    longitudeFrom: number,
    latitudeTo: number,
    longitudeTo: number,
  ) {
    // https://www.geeksforgeeks.org/program-distance-two-points-earth/
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    const lon1 = DistanceCalculator.degreesToRadians(longitudeFrom);
    const lon2 = DistanceCalculator.degreesToRadians(longitudeTo);
    const lat1 = DistanceCalculator.degreesToRadians(latitudeFrom);
    const lat2 = DistanceCalculator.degreesToRadians(latitudeTo);

    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    const c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956 for miles
    const r = 6371;

    // calculate the result
    const distanceInKMeters = c * r;

    return distanceInKMeters;
  }
}
