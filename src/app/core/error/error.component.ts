import { Component, input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    standalone: true,
    imports: [IonicModule]
})
export class ErrorComponent implements OnInit {

  public errorText = input<string>();

  constructor() {}

  public ngOnInit(): void {}
}
