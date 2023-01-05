import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>) { }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.reportsRepository.create(reportDto);
        report.user = user;
        return this.reportsRepository.save(report);
    }
}
