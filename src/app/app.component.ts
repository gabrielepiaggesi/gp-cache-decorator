import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompanyRepository } from './repositories/CompanyRepository';
import { ApiService } from './services/api.service';
import { Company } from './types/Company';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public company$: BehaviorSubject<Company|undefined> = new BehaviorSubject<Company|undefined>(
    undefined
  );

  constructor(
    public apiService: ApiService,
    public companyRepository: CompanyRepository
  ) {}

  public async ngOnInit() {
    // await this.apiService.getCompanies();
    await this.companyRepository.add({ name: 'Insoore' });
    const companyFound = await this.companyRepository.findByName('Insoore');
    companyFound && this.company$.next(companyFound);
  }

  public async getCompanies(boo = true) {
    const res = await this.apiService.getCompanies(boo);
    console.log('Ho chiamato', res.length);
  }

  public async ngOnDestroy() {
    this.companyRepository.destroy$.next(true);
    this.companyRepository.destroy$.complete();
  }
}
