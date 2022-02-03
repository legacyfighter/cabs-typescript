import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DriverController } from './controllers/driver.controller';
import { DriverService } from './service/driver.service';
import { DriverRepository } from './repository/driver.repository';
import { AppProperties } from './config/app-properties.config';
import { CarTypeRepository } from './repository/car-type.repository';
import { CarTypeController } from './controllers/car-type.controller';
import { CarTypeService } from './service/car-type.service';
import { DistanceCalculator } from './service/distance-calculator.service';
import { InvoiceRepository } from './repository/invoice.repository';
import { InvoiceGenerator } from './service/invoice-generator.service';
import { DriverNotificationService } from './service/driver-notification.service';
import { GeocodingService } from './service/geocoding.service';
import { ClaimNumberGenerator } from './service/claim-number-generator.service';
import { ClaimRepository } from './repository/claim.repository';
import { ClientNotificationService } from './service/client-notification.service';
import { ClientService } from './service/client.service';
import { ClientRepository } from './repository/client.repository';
import { ClientController } from './controllers/client.controller';
import { DriverSessionService } from './service/driver-session.service';
import { DriverSessionRepository } from './repository/driver-session.repository';
import { DriverSessionController } from './controllers/driver-session.controller';
import { DriverFeeRepository } from './repository/driver-fee.repository';
import { TransitRepository } from './repository/transit.repository';
import { DriverFeeService } from './service/driver-fee.service';
import { DriverPositionRepository } from './repository/driver-position.repository';
import { DriverTrackingService } from './service/driver-tracking.service';
import { DriverTrackingController } from './controllers/driver-tracking.controller';
import { ClaimAttachmentRepository } from './repository/claim-attachment.repository';
import { AddressRepository } from './repository/address.repository';
import { DriverAttributeRepository } from './repository/driver-attribute.repository';
import { AwardedMilesRepository } from './repository/awarded-miles.repository';
import { AwardsAccountRepository } from './repository/awards-account.repository';
import { ContractAttachmentRepository } from './repository/contract-attachment.repository';
import { ContractRepository } from './repository/contract.repository';
import { TransitAnalyzerService } from './service/transit-analyzer.service';
import { AwardsService } from './service/awards.service';
import { ClaimService } from './service/claim.service';
import { ContractService } from './service/contract.service';
import { TransitService } from './service/transit.service';
import { TransitAnalyzerController } from './controllers/transit-analyzer.controller';
import { TransitController } from './controllers/transit.controller';
import { AwardsAccountController } from './controllers/awards-account.controller';
import { ClaimController } from './controllers/claim.controller';
import { ContractController } from './controllers/contract.controller';
import { DriverReportController } from './controllers/driver-report.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: process.env.DATABASE_PORT
        ? parseInt(process.env.DATABASE_PORT, 10)
        : 3456,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      DriverRepository,
      CarTypeRepository,
      InvoiceRepository,
      ClaimRepository,
      ClientRepository,
      DriverSessionRepository,
      DriverFeeRepository,
      TransitRepository,
      DriverPositionRepository,
      ClaimAttachmentRepository,
      AddressRepository,
      DriverAttributeRepository,
      AwardedMilesRepository,
      AwardsAccountRepository,
      ContractAttachmentRepository,
      ContractRepository,
    ]),
  ],
  controllers: [
    DriverController,
    CarTypeController,
    ClientController,
    DriverSessionController,
    DriverTrackingController,
    TransitAnalyzerController,
    TransitController,
    AwardsAccountController,
    ClaimController,
    ContractController,
    DriverReportController,
  ],
  providers: [
    AppProperties,
    DriverService,
    CarTypeService,
    DistanceCalculator,
    InvoiceGenerator,
    DriverNotificationService,
    GeocodingService,
    ClaimNumberGenerator,
    ClientNotificationService,
    ClientService,
    DriverSessionService,
    DriverFeeService,
    DriverTrackingService,
    TransitAnalyzerService,
    AwardsService,
    ClaimService,
    ContractService,
    TransitService,
  ],
})
export class AppModule {}
