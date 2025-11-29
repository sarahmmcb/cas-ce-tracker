import { AfterViewInit, Component, computed, ElementRef, input, OnInit, Signal, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-progress-wheel',
  templateUrl: './progress-wheel.component.html',
  styleUrls: ['./progress-wheel.component.scss'],
})
export class ProgressWheelComponent  implements OnInit, AfterViewInit {

  public maxProgress = input<number>(1);
  public minProgress = input<number>(1);
  public completed = input<number>(0);

  @ViewChild("myCanvas")
  private canvas: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D;
  private progressAngle = signal(0);
  private extraAngle = signal(0);
  private twoPi = 2*Math.PI;
  private maxIterations = 50;
  private animationId = 0;
  private i = 0;
  private j = 0;
  private width = 0;

  ngOnInit() {
    this.initializeAngles();
  }
  
  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.width = this.canvas.nativeElement.width;
    this.canvas.nativeElement.setAttribute('height', this.width.toString() + 'px');
    this.animationId = requestAnimationFrame(this.animate);
  }

    ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initializeAngles(): void {
    
    if (this.minProgress() > 0 || this.maxProgress() > 0) {
      const goal = Math.max(this.minProgress(), this.maxProgress());
      const extraCompleted = computed(() => Math.max(this.completed() - goal, 0));
      const amountCompletedFraction = computed(() => (this.completed() - extraCompleted())/goal) ;
      const extraCompletedFraction = computed(() => extraCompleted()/goal) ;
      this.progressAngle.update(() => amountCompletedFraction() * this.twoPi);
      this.extraAngle.update(() => extraCompletedFraction() * this.twoPi);

      console.log(`amountCompletedFraction: ${amountCompletedFraction()}`);
    }
    else {
      this.extraAngle.update(() => this.twoPi);
    }


    console.log(`MinProgress: ${this.minProgress()}`);
    console.log(`MaxProgress: ${this.maxProgress()}`);
    console.log(`completed: ${this.completed()}`);
    console.log(`progressAngle: ${this.progressAngle()}`);
    console.log(`extraAngle: ${this.extraAngle()}`);
  }

  private animate = () => {
    const ctx = this.context;
    const lineWidth = 60;
    const extraLineWidth = 10;
    const arcSpacing = 2;
    const maxIterations = this.maxIterations;
    const width = this.width;
    const radius = width/2 - (lineWidth/2) - 2 * (extraLineWidth + arcSpacing);

    if (this.i <= maxIterations || this.j <= maxIterations) {
      
      ctx.save();
      ctx.clearRect(0, 0, width, width);
      ctx.translate(width/2, width/2);
      ctx.rotate(-Math.PI / 2);
      ctx.lineWidth = lineWidth;

      if (this.i <= maxIterations) {
        ctx.beginPath();
        ctx.strokeStyle = "#00A1E4";
        ctx.arc(0, 0, radius, 0, (this.progressAngle())*(this.i/maxIterations), false);
        ctx.stroke();
        this.i++;
      }
      else {
        ctx.beginPath();
        ctx.strokeStyle = "#00A1E4";
        ctx.arc(0, 0, radius, 0, (this.progressAngle())*(this.i/maxIterations), false);
        ctx.stroke();
      
        ctx.beginPath();
        ctx.strokeStyle = "#f0bf0e";
        ctx.lineWidth = extraLineWidth;
        const extraRadius = radius + lineWidth/2 + arcSpacing + (extraLineWidth/2);
        ctx.arc(0, 0, extraRadius, this.progressAngle(), this.progressAngle() + (this.extraAngle())*(this.j/maxIterations), false);
        ctx.stroke();
        this.j++;
      }

      ctx.restore();
      this.animationId = requestAnimationFrame(this.animate);
    }
  };

}
