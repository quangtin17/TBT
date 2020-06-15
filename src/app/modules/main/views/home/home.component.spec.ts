import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { SharedModule } from '../../../@shared/shared.module';
import { MainModule } from '../../main.module';
import {HttpClientModule } from '@angular/common/http';

import { RouterTestingModule } from '@angular/router/testing';
import { StorageServiceModule } from 'angular-webstorage-service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [SharedModule, MainModule, HttpClientModule, RouterTestingModule, StorageServiceModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('check create content into class wrap in p tag', () => {
    const pendingDiv = fixture.nativeElement.querySelector('.btn-group');
    expect(pendingDiv).toBeTruthy();

    const pendingSpan1 = pendingDiv.querySelector('a');
    expect(pendingSpan1).toBeTruthy();
    expect(pendingSpan1.textContent).toBe('Terry Pratchett');
    });
});


