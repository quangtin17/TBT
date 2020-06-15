import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ApiService } from '../../@core';
import { environment } from '../../../../environments/environment';
import { NbMenuItem } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class FooterMenuService {
  private menuSubject = new BehaviorSubject<boolean>(false); // Declace subject to handle menu state : open/close
  public menuState = this.menuSubject.asObservable(); // Assign Observable to subject, use to access subject's state.

  // private menuItemsSubject: BehaviorSubject<NbMenuItem[]>; // Declace
  private menuItemsSubject = new BehaviorSubject<NbMenuItem[]>([]); // Declace and Init with empty array
  public menuItems = this.menuItemsSubject.asObservable();
  constructor(
    @Inject(DOCUMENT) private document: Document, // Inject current page as object with name 'document'
    private APIService: ApiService
  ) {
    this.getMenuItems().subscribe(rs => {
      this.menuItemsSubject.next(rs);
    });
  }

  /**
   * Funct Call API get List Menu Items
   */
  getMenuItems(): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIMenuFooter}`
    );
  }
}
