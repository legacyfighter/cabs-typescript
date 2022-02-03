import {
  ContractAttachment,
  ContractAttachmentStatus,
} from '../entity/contract-attachment.entity';

export class ContractAttachmentDto {
  private id: string;

  private contractId: string;

  private data: string;

  private creationDate: number;

  private acceptedAt: number | null;

  private rejectedAt: number | null;

  private changeDate: number | null;

  private status: ContractAttachmentStatus;

  constructor(attachment: ContractAttachment, contractId?: string) {
    this.id = attachment.getId();
    this.data = attachment.getData().toString();
    this.contractId = contractId || attachment.getContract().getId();
    this.creationDate = attachment.getCreationDate();
    this.rejectedAt = attachment.getRejectedAt();
    this.acceptedAt = attachment.getAcceptedAt();
    this.changeDate = attachment.getChangeDate();
    this.status = attachment.getStatus();
  }

  public getData() {
    return this.data;
  }
}
