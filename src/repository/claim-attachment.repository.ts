import { EntityRepository, Repository } from 'typeorm';
import { ClaimAttachment } from '../entity/claim-attachment.entity';

@EntityRepository(ClaimAttachment)
export class ClaimAttachmentRepository extends Repository<ClaimAttachment> {}
