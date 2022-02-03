import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverNotificationService {
  public notifyAboutPossibleTransit(driverId: string, transitId: string) {
    // ...
    console.log(`To implement...`);
    console.log({ driverId, transitId });
  }

  public notifyAboutChangedTransitAddress(driverId: string, transitId: string) {
    // ...
    console.log(`To implement...`);
    console.log({ driverId, transitId });
  }

  public notifyAboutCancelledTransit(driverId: string, transitId: string) {
    // ...
    console.log(`To implement...`);
    console.log({ driverId, transitId });
  }

  public askDriverForDetailsAboutClaim(claimNo: string, driverId: string) {
    // ...
    console.log(`To implement...`);
    console.log({ driverId, claimNo });
  }
}
