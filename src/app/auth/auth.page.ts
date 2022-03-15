import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  /**
   * User email.
   */
  public email: string;

  /**
   * User password.
   */
  public password: string;

  constructor() { }

  /**
   * On Init.
   */
  public ngOnInit(): void {
  }

}
