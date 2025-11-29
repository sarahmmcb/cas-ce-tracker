import { Component, computed, input, OnInit, Signal } from '@angular/core';
import { ProgressWheelComponent } from "./progress-wheel/progress-wheel.component";

@Component({
  selector: 'progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss'],
  imports: [ProgressWheelComponent],
})
export class ProgressIndicatorComponent implements OnInit {

  public maxProgress = input<number>(1); // no more than this
  public minProgress = input<number>(1); // at least this many
  public completed = input<number>(0);
  public title = input<string>("");
  public unitSingular = input<string>("");
  public unitPlural = input<string>("");

  constructor() { }

  ngOnInit() {

  }

 
}
