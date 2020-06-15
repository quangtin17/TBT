import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  SimpleChanges
} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'k-multi-select-item',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
  @Input() items: any[];
  @Input() defaultItems: any[];
  @Input() title: string;
  @Input() itemsShowLimit: number;
  @Input() allowSearchFilter: boolean;
  @Input() enableCheckAll: boolean;
  @Input() singleSelection: boolean;
  @Output() OnSelectedItems: EventEmitter<any>;

  isMobile: boolean;
  public selectedItem: any;
  dropdownOptions = [];
  selectedItems = [];
  config = {};
  dropdownList = [];
  dropdownSettings = {};
  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
    this.OnSelectedItems = new EventEmitter();
    this.title = 'Please Select';
    this.itemsShowLimit = 3;
    this.allowSearchFilter = false;
    this.singleSelection = false;
    this.enableCheckAll = false;
  }
  ngOnInit() {
    // console.log('items', this.items);
    // console.log('default items', this.defaultItems);
    this.selectedItems = this.defaultItems;
    this.dropdownList = this.items;
    this.dropdownSettings = {
      singleSelection: this.singleSelection,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: this.itemsShowLimit,
      allowSearchFilter: this.allowSearchFilter,
      enableCheckAll: this.enableCheckAll
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    this.selectedItems = this.defaultItems;
    // console.log('this.selectedItems', this.selectedItems);
  }

  onCloseDropDown() {
    // console.log('onCloseDropDown', this.selectedItems);
    this.OnSelectedItems.emit(this.selectedItems);
  }
  // onItemSelect(item: any) {
  //   console.log('onItemSelect', item, this.selectedItems);
  // }
  // onItemDeSelect(item: any) {
  //   // this.selectedItems = this.selectedItems.filter(o => {
  //   //            return o.id !== item.id;
  //   //     });
  //   console.log('onItemDeSelect', item, this.selectedItems);
  // }
  // onSelectAll(items: any) {
  //   // this.selectedItems = items;
  //   console.log('onSelectAll', items, this.selectedItems);

  // }
  // onDeSelectAll(items: any) {
  //   // this.selectedItems  = [];
  //   console.log('onDeSelectAll', items, this.selectedItems );
  // }
}
