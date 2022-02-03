import { Between, EntityRepository, Repository } from 'typeorm';
import { DriverPosition } from '../entity/driver-position.entity';
import { Driver } from '../entity/driver.entity';
import { DriverPositionV2Dto } from '../dto/driver-position-v2.dto';

@EntityRepository(DriverPosition)
export class DriverPositionRepository extends Repository<DriverPosition> {
  public async findAverageDriverPositionSince(
    latitudeMin: number,
    latitudeMax: number,
    longitudeMin: number,
    longitudeMax: number,
    date: number,
  ): Promise<DriverPositionV2Dto[]> {
    const driverPosition = await this.createQueryBuilder('driverPosition')
      .leftJoinAndSelect('driverPosition.driver', 'p')
      .select(`AVG(p.latitude), AVG(p.longitude), MAX(p.seenAt)`)
      .where('p.longitude between :longitudeMin and :longitudeMax')
      .andWhere('p.longitude between :longitudeMin and :longitudeMax')
      .andWhere('p.seenAt >= :seenAt')
      .groupBy('p.driver.id')
      .setParameters({
        longitudeMin,
        longitudeMax,
        seenAt: date,
      })
      .getMany();

    return driverPosition.map(
      (dp) =>
        new DriverPositionV2Dto(
          dp.driver,
          dp.latitude,
          dp.longitude,
          dp.seenAt,
        ),
    );
  }

  public async findByDriverAndSeenAtBetweenOrderBySeenAtAsc(
    driver: Driver,
    from: number,
    to: number,
  ): Promise<DriverPosition[]> {
    return this.find({
      where: {
        driver,
        seenAt: Between(from, to),
      },
      order: {
        seenAt: 'ASC',
      },
    });
  }
}
