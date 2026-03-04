import { Component, input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-date-block',
  templateUrl: './date-block.component.html',
  styleUrls: ['./date-block.component.scss'],
  standalone: true
})
export class DateBlockComponent implements OnInit {

  public dateInput = input<string>();

  public month = signal<string>('');
  public day = signal<string>('');
  public year = signal<string>('');
  private date = signal<Date>(null);

  private months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August", "September",
    "October", "November", "December"
  ];

  constructor() { }

  ngOnInit() {
    if(this.dateInput()) {
      this.date.set(new Date(this.dateInput()));
      this.month.set(this.getMonthShortName(this.date()));
      this.day.set(this.date().getDate().toString());
      this.year.set(this.date().getFullYear().toString());
    }
  }

  private getMonthShortName(date: Date): string {
    return this.months[date.getMonth()].slice(0,3);
  }
}
