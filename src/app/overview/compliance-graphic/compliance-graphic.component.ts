import { Component, input } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { CEData } from '@app/models/cedata'
import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component'

@Component({
  selector: 'app-compliance-graphic',
  templateUrl: './compliance-graphic.component.html',
  styleUrls: ['./compliance-graphic.component.scss'],
  standalone: true,
  imports: [IonicModule, ProgressIndicatorComponent],
})
export class ComplianceGraphicComponent {
  // TODO: Do we need this component?
  //public year = input<number>();
  public ceData = input<CEData>()

  constructor() {}
}
