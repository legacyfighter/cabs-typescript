import { Injectable } from '@nestjs/common';

@Injectable()
export class AppProperties {
  private noOfTransitsForClaimAutomaticRefund: number;

  private automaticRefundForVipThreshold: number;

  private minNoOfCarsForEcoClass: number;

  private milesExpirationInDays = 365;

  private defaultMilesBonus = 10;

  public getAutomaticRefundForVipThreshold() {
    return this.automaticRefundForVipThreshold;
  }

  public getNoOfTransitsForClaimAutomaticRefund() {
    return this.noOfTransitsForClaimAutomaticRefund;
  }

  public setNoOfTransitsForClaimAutomaticRefund(
    noOfTransitsForClaimAutomaticRefund: number,
  ) {
    this.noOfTransitsForClaimAutomaticRefund =
      noOfTransitsForClaimAutomaticRefund;
  }

  public getMinNoOfCarsForEcoClass() {
    return this.minNoOfCarsForEcoClass;
  }

  public setMinNoOfCarsForEcoClass(minNoOfCarsForEcoClass: number) {
    this.minNoOfCarsForEcoClass = minNoOfCarsForEcoClass;
  }

  public getMilesExpirationInDays() {
    return this.milesExpirationInDays;
  }

  public getDefaultMilesBonus() {
    return this.defaultMilesBonus;
  }

  public setMilesExpirationInDays(milesExpirationInDays: number) {
    this.milesExpirationInDays = milesExpirationInDays;
  }

  public setDefaultMilesBonus(defaultMilesBonus: number) {
    this.defaultMilesBonus = defaultMilesBonus;
  }
}
