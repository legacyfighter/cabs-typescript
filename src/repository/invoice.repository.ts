import { EntityRepository, Repository } from 'typeorm';
import { Invoice } from '../entity/invoice.entity';

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {}
