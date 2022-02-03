import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientNotificationService {
  public notifyClientAboutRefund(claimNo: string, clientId: string) {
    // ...
    console.log(`To implement...`);
    console.log({ claimNo, clientId });
  }

  public askForMoreInformation(claimNo: string, clientId: string) {
    // ...
    console.log(`To implement...`);
    console.log({ claimNo, clientId });
  }
}
