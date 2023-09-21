import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { catchError, lastValueFrom, of, Subject, takeUntil } from 'rxjs';
import { Cache } from '../decorators/Cache.decorator';
import { Company } from '../types/Company';
import { Value } from '../types/Value';

const COMPANIES_URL = 'http://whoosnapinsurancetest2.westeurope.cloudapp.azure.com:8254/api/v1/Companies';
const VALUES_URL = 'http://whoosnapinsurancetest2.westeurope.cloudapp.azure.com:8254/api/v1/Companies';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public TOKEN =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1MkExNzdGM0JDMjU2NDBCMTQ4MkM2RDNEOTMxMTY2RkZENzhFOTciLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJCU29YZnp2Q1ZrQ3hTQ3h0UFpNUlp2X1hqcGMifQ.eyJuYmYiOjE2NjM3NDk5MjksImV4cCI6MTY2MzkyMjcyOSwiaXNzIjoiaHR0cDovL2F1dGhzZXJ2ZXItdGVzdC5henVyZXdlYnNpdGVzLm5ldCIsImF1ZCI6WyJhdXRoc2VydmVyLmFwaSIsImJhY2tvZmZpY2UuYXBpIiwiYm9va2luZy5hcGkiLCJjbGV4LmFwaSIsIm1vYmlsZS5hcGkiLCJvZC5hcGkiXSwiY2xpZW50X2lkIjoiY2xpZW50Iiwic3ViIjoiOWVhNTExODYtZjM0ZS00N2Y0LThjMTYtMjU2ODQwOTliMDE5IiwiYXV0aF90aW1lIjoxNjYzNzQ5OTI5LCJpZHAiOiJsb2NhbCIsInJvbGUiOiJJbnNwZWN0b3I7U3VwcG9ydCIsInNjb3BlIjpbImF1dGhzZXJ2ZXIuYXBpIiwiYmFja29mZmljZS5hcGkiLCJib29raW5nLmFwaSIsImNsZXguYXBpIiwibW9iaWxlLmFwaSIsIm9kLmFwaSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.V-7HTY07tkpa3DO7gdtIqYot8keKFEDn61IOY7WjUOapgdy-37OOfqv9jHM9lSPqk-c4YVeGMDJoC2jBHjDVVS28w3Y2oe6kdf7GRoEGr7Hx0RKdeB0Ee5iKox3Ez0VYTAduIXI1nccNgsjFrUgNR9_nj-BEcmZ1jLWwPkm5jeOY3lxbiQS_lx-4XxcvjFe9kgubLg2tMvEwf8zmfKJ4wNgy_Q8xSt9ezZNEcF1CO8cZGxAYZYo4fY3LahIwcndUnK6dKmzjJBYS5wDFmOot3IX19uK_AwgbKRwmNDNgqfL83BudqNmECfMztvEa7R73TU7814QrQ78RzHKhhmhsWw';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.TOKEN
    };
  }

  @Cache()
  public async getCompanies(withCache = false): Promise<Company[]> {
    const headers = this.getHeaders();
    return await lastValueFrom(
      this.http.get<Company[]>(COMPANIES_URL, {
        headers,
      })
    );
  }

  @Cache({duration: 5000})
  public async getCompaniesValues(withCache = false): Promise<Value[]> {
    const headers = this.getHeaders();
    return await lastValueFrom(this.http.get<Value[]>(VALUES_URL, { headers }));
  }
}
