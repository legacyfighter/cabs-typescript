import { ContractService } from '../service/contract.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ContractDto } from '../dto/contract.dto';
import { CreateContractDto } from '../dto/create-contract.dto';
import { CreateContractAttachmentDto } from '../dto/create-contract-attachment.dto';

@Controller('contracts')
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post()
  public async create(@Body() createContractDto: CreateContractDto) {
    const created = await this.contractService.createContract(
      createContractDto,
    );
    return new ContractDto(created);
  }

  @Get(':contractId')
  public async find(@Param('contractId') contractId: string) {
    const contract = await this.contractService.findDto(contractId);
    return contract;
  }

  @Post(':contractId/attachment')
  public async proposeAttachment(
    @Param('contractId') contractId: string,
    @Body() createContractAttachmentDto: CreateContractAttachmentDto,
  ) {
    const dto = await this.contractService.proposeAttachment(
      contractId,
      createContractAttachmentDto,
    );
    return dto;
  }

  @Post(':contractId/attachment/:attachmentId/reject')
  public async rejectAttachment(
    @Param('contractId') contractId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    await this.contractService.rejectAttachment(attachmentId);
  }

  @Post(':contractId/attachment/:attachmentId/accept')
  public async acceptAttachment(
    @Param('contractId') contractId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    await this.contractService.acceptAttachment(attachmentId);
  }

  @Delete(':contractId/attachment/:attachmentId')
  public async removeAttachment(
    @Param('contractId') contractId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    await this.contractService.removeAttachment(contractId, attachmentId);
  }

  @Post(':contractId/accept')
  public async acceptContract(@Param('contractId') contractId: string) {
    await this.contractService.acceptContract(contractId);
  }

  @Post(':contractId/reject')
  public async rejectContract(@Param('contractId') contractId: string) {
    await this.contractService.rejectContract(contractId);
  }
}
