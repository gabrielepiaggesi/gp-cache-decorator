import { Repository } from './Repository';
import { catchError, lastValueFrom, takeUntil } from 'rxjs';
import { Injectable } from '@angular/core';
import { Company } from '../types/Company';
import { Value } from '../types/Value';

@Injectable({ providedIn: 'root' })
export class ValueRepository extends Repository<Value> {
  public override table = 'values';

  public async findByCompanyId(companyId: number): Promise<Value> {
    return await lastValueFrom(
      this.dbService
        .getByIndex(this.table, 'company_id', companyId)
        .pipe(catchError(this.handleAnyError.bind(this)), takeUntil(this.destroy$))
    );
  }
}
