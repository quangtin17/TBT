import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagerService {
  constructor() {}

  getPager(totalItems: number, currentPage: number = 0, pageSize: number = 5) {
    let totalPages = Math.ceil(totalItems / pageSize); // Calculate Total Pages

    // console.log('[PagerService] getPager');
    // ensure current page isn't out of range
    if (currentPage < 0) {
      currentPage = 0;
    } else if (currentPage > totalPages - 1) {
      currentPage = totalPages - 1;
    }

    let startPage: number, endPage: number;

    if (totalPages <= 4) {
      // less than 5 total pages so show all
      startPage = 0;
      endPage = totalPages - 1;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (currentPage <= 2) {
        // Case anchor is start page
        startPage = 0;
        endPage = 4;
      } else if (currentPage + 2 >= totalPages) {
        // Case anchor is end page
        startPage = totalPages - 4; // DM Drupal
        endPage = totalPages - 1;
      } else {
        // Case anchor is current
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // calculate start and end item indexes
    let startIndex = currentPage * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      i => startPage + i
    );

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
}
