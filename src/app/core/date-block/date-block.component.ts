import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-block',
  templateUrl: './date-block.component.html',
  styleUrls: ['./date-block.component.scss'],
  standalone: true
})
export class DateBlockComponent implements OnInit {

  public dateInput = input<string>();

  public month: string;
  public day: string;
  public year: string;
  private date: Date;

  private months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August", "September",
    "October", "November", "December"
  ];

  constructor() { }

  ngOnInit() {
    if(this.dateInput()) {
      this.date = new Date(this.dateInput());
      this.month = this.getMonthShortName(this.date);
      this.day = this.date.getDate().toString();
      this.year = this.date.getFullYear().toString();
    }
  }

  private getMonthShortName(date: Date): string {
    return this.months[date.getMonth()].slice(0,3);
  }
}
