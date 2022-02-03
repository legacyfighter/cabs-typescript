import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractRepository } from '../repository/contract.repository';
import { ContractAttachmentRepository } from '../repository/contract-attachment.repository';
import { ContractDto } from '../dto/contract.dto';
import { Contract, ContractStatus } from '../entity/contract.entity';
import {
  ContractAttachment,
  ContractAttachmentStatus,
} from '../entity/contract-attachment.entity';
import { ContractAttachmentDto } from '../dto/contract-attachment.dto';
import { CreateContractDto } from '../dto/create-contract.dto';
import { CreateContractAttachmentDto } from '../dto/create-contract-attachment.dto';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractRepository)
    private contractRepository: ContractRepository,
    @InjectRepository(ContractAttachmentRepository)
    private contractAttachmentRepository: ContractAttachmentRepository,
  ) {}

  public async createContract(createContractDto: CreateContractDto) {
    const contract = new Contract();
    contract.setPartnerName(createContractDto.partnerName);
    contract.setCreationDate(Date.now());
    const partnerContractsCount =
      (
        await this.contractRepository.findByPartnerName(
          createContractDto.partnerName,
        )
      ).length + 1;
    contract.setSubject(createContractDto.subject);
    contract.setContractNo(
      'C/' + partnerContractsCount + '/' + createContractDto.partnerName,
    );
    return this.contractRepository.save(contract);
  }

  public async acceptContract(id: string) {
    const contract = await this.find(id);
    const attachments = await this.contractAttachmentRepository.findByContract(
      contract,
    );
    if (
      attachments.every(
        (a) =>
          a.getStatus() === ContractAttachmentStatus.ACCEPTED_BY_BOTH_SIDES,
      )
    ) {
      contract.setStatus(ContractStatus.ACCEPTED);
      contract.setAcceptedAt(Date.now());
      await this.contractAttachmentRepository.save(attachments);
      await this.contractRepository.save(contract);
    } else {
      throw new NotAcceptableException(
        'Not all attachments accepted by both sides',
      );
    }
  }

  public async rejectContract(id: string) {
    const contract = await this.find(id);
    contract.setStatus(ContractStatus.REJECTED);
    await this.contractRepository.save(contract);
  }

  public async rejectAttachment(attachmentId: string) {
    const contractAttachment = await this.contractAttachmentRepository.findOne(
      attachmentId,
    );
    if (!contractAttachment) {
      throw new NotFoundException('Contract attachment does not exist');
    }
    contractAttachment.setStatus(ContractAttachmentStatus.REJECTED);
    contractAttachment.setRejectedAt(Date.now());
    await this.contractAttachmentRepository.save(contractAttachment);
  }

  public async acceptAttachment(attachmentId: string) {
    const contractAttachment = await this.contractAttachmentRepository.findOne(
      attachmentId,
    );
    if (!contractAttachment) {
      throw new NotFoundException('Contract attachment does not exist');
    }

    if (
      contractAttachment.getStatus() ===
        ContractAttachmentStatus.ACCEPTED_BY_ONE_SIDE ||
      contractAttachment.getStatus() ===
        ContractAttachmentStatus.ACCEPTED_BY_BOTH_SIDES
    ) {
      contractAttachment.setStatus(
        ContractAttachmentStatus.ACCEPTED_BY_BOTH_SIDES,
      );
    } else {
      contractAttachment.setStatus(
        ContractAttachmentStatus.ACCEPTED_BY_ONE_SIDE,
      );
    }

    contractAttachment.setAcceptedAt(Date.now());

    await this.contractAttachmentRepository.save(contractAttachment);
  }

  public async find(id: string) {
    const contract = await this.contractRepository.findOne(id);
    if (!contract) {
      throw new NotFoundException('Contract does not exist');
    }
    return contract;
  }

  public async findDto(id: string) {
    return new ContractDto(await this.find(id));
  }

  public async proposeAttachment(
    contractId: string,
    contractAttachmentDto: CreateContractAttachmentDto,
  ) {
    const contract = await this.find(contractId);
    const contractAttachment = new ContractAttachment();
    contractAttachment.setContract(contract);
    contractAttachment.setData(contractAttachmentDto.data);
    await this.contractAttachmentRepository.save(contractAttachment);
    contract.getAttachments().push(contractAttachment);
    await this.contractRepository.save(contract);
    return new ContractAttachmentDto(contractAttachment);
  }

  public async removeAttachment(contractId: string, attachmentId: string) {
    //TODO sprawdzenie czy nalezy do kontraktu (JIRA: II-14455)
    await this.contractAttachmentRepository.delete(attachmentId);
  }
}
