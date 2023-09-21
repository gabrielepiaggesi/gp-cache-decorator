import { Injectable } from '@angular/core';
import { NgxIndexedDBService, WithID } from 'ngx-indexed-db';
import { catchError, lastValueFrom, of, Subject, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Repository<T> {
  public table = '';
  public destroy$ = new Subject();

  constructor(public dbService: NgxIndexedDBService) {}

  public async add<T>(row: T): Promise<(T & WithID) | null> {
    return await lastValueFrom(
      this.dbService
        .add<T>(this.table, row)
        .pipe(catchError(this.handleAnyError.bind(this)), takeUntil(this.destroy$))
    );
  }

  public async findById(id: number): Promise<T|null> {
    return await lastValueFrom(
      this.dbService
        .getByKey<T>(this.table, id)
        .pipe(catchError(this.handleAnyError.bind(this)), takeUntil(this.destroy$))
    );
  }

  public async findAll(): Promise<T[]|unknown> {
    return await lastValueFrom(
      this.dbService
        .getAll('companies')
        .pipe(catchError(this.handleAnyError.bind(this)), takeUntil(this.destroy$))
    );
  }

  public handleAnyError(e: any) {
    console.error('error', e);
    return of(null as any)
  }

}
