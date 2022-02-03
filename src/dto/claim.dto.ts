import { Claim, ClaimStatus, CompletionMode } from '../entity/claim.entity';
import { CreateClaimDto } from './create-claim.dto';

export class ClaimDto {
  private claimID: string;

  private clientId: string;

  private transitId: string;

  private reason: string;

  private incidentDescription: string | null;

  private _isDraft: boolean;

  private creationDate: number;

  private completionDate: number | null;

  private changeDate: number | null;

  private completionMode: CompletionMode | null;

  private status: ClaimStatus;

  private claimNo: string;

  public constructor(claim: Claim | CreateClaimDto) {
    if (!(claim instanceof Claim)) {
      this.setClaimID(claim.clientId);
      this.setReason(claim.reason);
      this.setDraft(true);
      this.setIncidentDescription(claim.incidentDescription);
    } else {
      if (claim.getStatus() === ClaimStatus.DRAFT) {
        this.setDraft(true);
      } else {
        this.setDraft(false);
      }
      this.setClaimID(claim.getId());
      this.setReason(claim.getReason());
      this.setIncidentDescription(claim.getIncidentDescription());
      this.setTransitId(claim.getTransit().getId());
      this.setClientId(claim.getOwner().getId());
      this.setCompletionDate(claim.getCompletionDate());
      this.setChangeDate(claim.getChangeDate());
      this.setClaimNo(claim.getClaimNo());
      this.setStatus(claim.getStatus());
      this.setCompletionMode(claim.getCompletionMode());
      this.setCreationDate(claim.getCreationDate());
    }
  }

  public getCreationDate() {
    return this.creationDate;
  }

  public setCreationDate(creationDate: number) {
    this.creationDate = creationDate;
  }

  public getCompletionDate() {
    return this.completionDate;
  }

  public setCompletionDate(completionDate: number | null) {
    this.completionDate = completionDate;
  }

  public getChangeDate() {
    return this.changeDate;
  }

  public setChangeDate(changeDate: number | null) {
    this.changeDate = changeDate;
  }

  public getCompletionMode() {
    return this.completionMode;
  }

  public setCompletionMode(completionMode: CompletionMode | null) {
    this.completionMode = completionMode;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: ClaimStatus) {
    this.status = status;
  }

  public getClaimNo() {
    return this.claimNo;
  }

  public setClaimNo(claimNo: string) {
    this.claimNo = claimNo;
  }

  public getClaimID() {
    return this.claimID;
  }

  public setClaimID(claimID: string) {
    this.claimID = claimID;
  }

  public getClientId() {
    return this.clientId;
  }

  public setClientId(clientId: string) {
    this.clientId = clientId;
  }

  public getTransitId() {
    return this.transitId;
  }

  public setTransitId(transitId: string) {
    this.transitId = transitId;
  }

  public getReason() {
    return this.reason;
  }

  public setReason(reason: string) {
    this.reason = reason;
  }

  public getIncidentDescription() {
    return this.incidentDescription;
  }

  public setIncidentDescription(incidentDescription: string | null) {
    this.incidentDescription = incidentDescription;
  }

  public isDraft() {
    return this._isDraft;
  }

  public setDraft(draft: boolean) {
    this._isDraft = draft;
  }
}
