import { Repository } from './Repository';
import { catchError, lastValueFrom, of, takeUntil } from 'rxjs';
import { Injectable } from '@angular/core';
import { Company } from '../types/Company';

@Injectable({ providedIn: 'root' })
export class CompanyRepository extends Repository<Company> {
  public override table = 'companies';

  public async findByName(name: string): Promise<Company> {
    return await lastValueFrom(
      this.dbService
        .getByIndex(this.table, 'name', name)
        .pipe(catchError(this.handleAnyError.bind(this)), takeUntil(this.destroy$))
    );
  }

  // findCompanyJoinWith() {}
}
