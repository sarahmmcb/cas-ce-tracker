import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { AppComponent } from './app.component'
import { User } from './models/user'
import { AuthService } from './auth/auth.service'
import { of } from 'rxjs'
import { Injectable } from '@angular/core'

let component: AppComponent
let fixture: ComponentFixture<AppComponent>

const mockUser = {} as User

@Injectable()
class MockAuthService extends AuthService {
  public override get user() {
    return of(mockUser)
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }, provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
  })

  it('should create the app', async () => {
    expect(component).toBeTruthy()
  })

  it('should subscribe to user', async () => {
    component.ngOnInit()
    await fixture.whenStable()
    expect(component.user).toBe(mockUser)
  })
})
