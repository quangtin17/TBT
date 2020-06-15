import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { SharedModule } from '../../../@shared/shared.module';
import { MainModule } from '../../main.module';
import {HttpClientModule } from '@angular/common/http';

import { RouterTestingModule } from '@angular/router/testing';
describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [SharedModule, MainModule, HttpClientModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create not-found component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in h4 tag', () => {
    const pendingSpan = fixture.nativeElement.querySelector('h4');
    expect(pendingSpan).toBeTruthy();
    expect(pendingSpan.textContent).toBe('People think that stories are shaped by people. In fact, it the other way around.');
    });

  it('should render title in h1 tag', () => {
      const pendingSpan = fixture.nativeElement.querySelector('h1');
      expect(pendingSpan).toBeTruthy();
      expect(pendingSpan.textContent).toBe('Page not found!');
      });

  it('check create content into class wrap in p tag', () => {
        const pendingDiv = fixture.nativeElement.querySelector('.wrap');
        expect(pendingDiv).toBeTruthy();

        const pendingSpan1 = pendingDiv.querySelector('p');
        expect(pendingSpan1).toBeTruthy();
        expect(pendingSpan1.textContent).toBe('Terry Pratchett');
        });

  it('check create content into class desc in p tag', () => {
          const pendingDiv = fixture.nativeElement.querySelector('.desc');
          expect(pendingDiv).toBeTruthy();

          const pendingSpan1 = pendingDiv.querySelector('p');
          expect(pendingSpan1).toBeTruthy();
          // tslint:disable-next-line: max-line-length
          expect(pendingSpan1.textContent).toBe('Sorry, we can’t find what you’re looking for. Try going back to our homepage. Here’s a quote from us to inspire you to keep searching!');
          });

});
