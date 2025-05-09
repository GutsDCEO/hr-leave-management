import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, SignupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Code Step by Step';
  name = 'Human Resource Management System';
  handleClickEvent() {
    alert("Button Clicked!");
    this.otherFunction();
  }

  otherFunction() {
    // Other function logic here
    console.log("Other function executed");
  }

}
