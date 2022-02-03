import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverRepository } from '../repository/driver.repository';
import { DriverPositionRepository } from '../repository/driver-position.repository';
import { DistanceCalculator } from './distance-calculator.service';
import { DriverPosition } from '../entity/driver-position.entity';
import { DriverStatus } from '../entity/driver.entity';

@Injectable()
export class DriverTrackingService {
  constructor(
    @InjectRepository(DriverRepository)
    private driverRepository: DriverRepository,
    @InjectRepository(DriverPositionRepository)
    private positionRepository: DriverPositionRepository,
    private distanceCalculator: DistanceCalculator,
  ) {}

  public async registerPosition(
    driverId: string,
    latitude: number,
    longitude: number,
  ): Promise<DriverPosition> {
    const driver = await this.driverRepository.findOne(driverId);
    if (!driver) {
      throw new NotFoundException('Driver does not exists, id = ' + driverId);
    }
    if (driver.getStatus() !== DriverStatus.ACTIVE) {
      throw new NotAcceptableException(
        'Driver is not active, cannot register position, id = ' + driverId,
      );
    }
    const position = new DriverPosition();
    position.setDriver(driver);
    position.setSeenAt(Date.now());
    position.setLatitude(latitude);
    position.setLongitude(longitude);
    return await this.positionRepository.save(position);
  }

  public async calculateTravelledDistance(
    driverId: string,
    from: number,
    to: number,
  ) {
    const driver = await this.driverRepository.findOne(driverId);
    if (!driver) {
      throw new NotFoundException('Driver does not exists, id = ' + driverId);
    }
    const positions =
      await this.positionRepository.findByDriverAndSeenAtBetweenOrderBySeenAtAsc(
        driver,
        from,
        to,
      );
    let distanceTravelled = 0;

    if (positions.length > 1) {
      let previousPosition = positions[0];

      for (const position of positions.slice(1)) {
        distanceTravelled += this.distanceCalculator.calculateByGeo(
          previousPosition.getLatitude(),
          previousPosition.getLongitude(),
          position.getLatitude(),
          position.getLongitude(),
        );

        previousPosition = position;
      }
    }

    return distanceTravelled;
  }
}
