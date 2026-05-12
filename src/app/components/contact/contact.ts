import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { setupReveal, killReveal } from '../../utils/reveal';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit, OnDestroy {
  year = new Date().getFullYear();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    setupReveal(this.el.nativeElement);
  }

  ngOnDestroy() {
    killReveal(this.el.nativeElement);
  }
}
