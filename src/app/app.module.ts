import { ValueRepository } from './repositories/ValueRepository';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxIndexedDBModule } from 'ngx-indexed-db';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { dbConfig } from './index-db.config';
import { CompanyRepository } from './repositories/CompanyRepository';
import { Repository } from './repositories/Repository';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    AppRoutingModule
  ],
  providers: [ApiService, Repository, CompanyRepository, ValueRepository],
  bootstrap: [AppComponent]
})
export class AppModule { }
