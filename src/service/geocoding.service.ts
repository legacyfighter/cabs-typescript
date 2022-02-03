import { Injectable } from '@nestjs/common';
import { Address } from '../entity/address.entity';

@Injectable()
export class GeocodingService {
  public geocodeAddress(address: Address) {
    //TODO ... call do zewnętrznego serwisu
    console.log('To implement', address);
    const geocoded = [0, 1];

    geocoded[0] = 1; //latitude
    geocoded[1] = 1; //longitude

    return geocoded;
  }
}
