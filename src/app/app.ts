import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('test-app');

  protected readonly nav = ['New', 'Women', 'Men', 'Kids', 'Gifts', 'Sale'];

  protected readonly categories = [
    { name: 'Socks', color: 'var(--pink)' },
    { name: 'Underwear', color: 'var(--yellow)' },
    { name: 'Swimwear', color: 'var(--blue-light)' },
    { name: 'Gift boxes', color: 'var(--green)' },
  ];

  protected readonly products = [
    { name: 'Big Dot Sock', price: '€12.00', color: 'var(--red)', accent: 'var(--yellow)' },
    { name: 'Stripe Sock', price: '€12.00', color: 'var(--blue)', accent: 'var(--pink)' },
    { name: 'Cherry Sock', price: '€14.00', color: 'var(--pink)', accent: 'var(--red)' },
    { name: 'Sunny Sock', price: '€12.00', color: 'var(--yellow)', accent: 'var(--blue)' },
  ];

  // API Key = 82346823642342sioshdhshsiih
}
