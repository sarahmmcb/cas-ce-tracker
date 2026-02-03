import { AfterViewInit, Component, computed, ElementRef, input, OnInit, Signal, ViewChild, signal, effect, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress-wheel',
  templateUrl: './progress-wheel.component.html',
  styleUrls: ['./progress-wheel.component.scss'],
})
export class ProgressWheelComponent  implements OnInit, AfterViewInit, OnChanges {

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
    this.runAnimation()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.canvas) {
      this.initializeAngles();
      this.runAnimation();
    }
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private runAnimation() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.width = this.canvas.nativeElement.width;
    this.canvas.nativeElement.setAttribute('height', this.width.toString() + 'px');
    this.animationId = requestAnimationFrame(this.animate);
  }

  private initializeAngles(): void {
    this.i = this.j = 0;

    if (this.minProgress() > 0 || this.maxProgress() > 0) {
      const goal = Math.max(this.minProgress(), this.maxProgress());
      const extraCompleted = computed(() => Math.max(this.completed() - goal, 0));
      const amountCompletedFraction = computed(() => (this.completed() - extraCompleted())/goal) ;
      const extraCompletedFraction = computed(() => extraCompleted()/goal) ;
      this.progressAngle.update(() => amountCompletedFraction() * this.twoPi);
      this.extraAngle.update(() => extraCompletedFraction() * this.twoPi);
    }
    else {
      this.extraAngle.update(() => this.twoPi);
    }
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
        ctx.strokeStyle = "#031ba1";
        ctx.arc(0, 0, radius, 0, (this.progressAngle())*(this.i/maxIterations), false);
        ctx.stroke();
        this.i++;
      }
      else {
        ctx.beginPath();
        ctx.strokeStyle = "#031ba1";
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
