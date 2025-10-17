import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    imports: [IonicModule]
})
export class ErrorComponent implements OnInit {

  @Input()
  public errorText: string;

  constructor() {}

  public ngOnInit(): void {}
}

