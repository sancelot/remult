
import { ColumnCollection, ColumnSetting, Entity, Column, StringColumn } from '../../core/utils';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
@Component({
  selector: 'data-control2',
  templateUrl: './data-control2.component.html',
  styleUrls:['./data-control2.component.scss']
})
export class DataControl2Component {
  @Input() map: ColumnSetting<any>;
  @Input() set column(value: Column<any>) {
    this.map = {
      column: value
    };
    this.map.column.__decorateDataSettings(this.map);
  }
  theId:any;
  @Input() record: Entity<any>;
  @Input() notReadonly: false;
  @Input() settings: ColumnCollection<any> = new ColumnCollection<any>(undefined, () => true, undefined, undefined);
  showDescription() {

    return (this.map.column) && this.map.getValue||!this._getEditable();
  }
  dataControlStyle() {
    return this.settings.__dataControlStyle(this.map);
  }
  _getColumn() {
    if (!this.map.column)
    return new StringColumn();
    return this.settings.__getColumn(this.map, this.record);

  }
  _getEditable() {
    if (this.notReadonly)
      return true;
    return this.settings._getEditable(this.map);
  }
  ngOnChanges(): void {

  }
  isSelect(): boolean {
    if (this.map.dropDown)
      return true;
    return false;
  }
  showTextBox() {
    return !this.isSelect() && !this.showCheckbox();
  }
  showCheckbox() {
    return this.settings._getColDataType(this.map) == 'checkbox'
  }
  getError() {
    return this.settings._getError(this.map, this.record);
  }
  getStyle() {
    if (this.showDescription()) {
      if (this.map.hideDataOnInput||!this._getEditable()) {
        return { display: 'none' };
      }
      return  {width:'50px'};
    }
    return {};
  }
  getFloatLabel(){
    if (this.showDescription()){
      if (this.settings._getColDisplayValue(this.map,this.record))
      return 'always';
    }
    return'';
  }


  ngErrorStateMatches = new class extends ErrorStateMatcher {
    constructor(public parent: DataControl2Component) {
      super();
    }
    isErrorState() {
      return !!this.parent.getError();
    }
  }(this);
}

