import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daysale',
  templateUrl: './daysale.component.html',
  styleUrls: ['./daysale.component.scss']
})
export class DaysaleComponent implements OnInit {
public showTableSearch =false;
  constructor() { }

  ngOnInit() {
  }

  SearchProduct(){
    alert("asdasdasdasdasdas");
    this.showTableSearch =true;
  }
  close() {
    this.showTableSearch =false;

  }
}
