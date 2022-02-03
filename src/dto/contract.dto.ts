import { Contract, ContractStatus } from '../entity/contract.entity';
import { ContractAttachmentDto } from './contract-attachment.dto';

export class ContractDto {
  private id: string;

  private subject: string;

  private partnerName: string;

  private creationDate: number;

  private acceptedAt: number | null;

  private rejectedAt: number | null;

  private changeDate: number | null;

  private status: ContractStatus;

  private contractNo: string;

  private attachments: ContractAttachmentDto[] = [];

  constructor(contract: Contract) {
    this.setContractNo(contract.getContractNo());
    this.setAcceptedAt(contract.getAcceptedAt());
    this.setRejectedAt(contract.getRejectedAt());
    this.setCreationDate(contract.getCreationDate());
    this.setChangeDate(contract.getChangeDate());
    this.setStatus(contract.getStatus());
    this.setPartnerName(contract.getPartnerName());
    this.setSubject(contract.getSubject());
    for (const attachment of contract.getAttachments()) {
      this.attachments.push(
        new ContractAttachmentDto(attachment, contract.getId()),
      );
    }
    this.setId(contract.getId());
  }

  public getCreationDate() {
    return this.creationDate;
  }

  public setCreationDate(creationDate: number) {
    this.creationDate = creationDate;
  }

  public getAcceptedAt() {
    return this.acceptedAt;
  }

  public setAcceptedAt(acceptedAt: number | null) {
    this.acceptedAt = acceptedAt;
  }

  public getRejectedAt() {
    return this.rejectedAt;
  }

  public setRejectedAt(rejectedAt: number | null) {
    this.rejectedAt = rejectedAt;
  }

  public getChangeDate() {
    return this.changeDate;
  }

  public setChangeDate(changeDate: number | null) {
    this.changeDate = changeDate;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: ContractStatus) {
    this.status = status;
  }

  public getContractNo() {
    return this.contractNo;
  }

  public setContractNo(contractNo: string) {
    this.contractNo = contractNo;
  }

  public getPartnerName() {
    return this.partnerName;
  }

  public setPartnerName(partnerName: string) {
    this.partnerName = partnerName;
  }

  public getSubject() {
    return this.subject;
  }

  public setSubject(subject: string) {
    this.subject = subject;
  }

  public getId() {
    return this.id;
  }

  public setId(id: string) {
    this.id = id;
  }

  public getAttachments() {
    return this.attachments;
  }

  public setAttachments(attachments: ContractAttachmentDto[]) {
    this.attachments = attachments;
  }
}
