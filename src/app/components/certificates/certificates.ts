import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupReveal, killReveal } from '../../utils/reveal';

interface Certificate {
  num: string;
  name: string;
  issuer: string;
  date: string;
  certificateNumber?: string;
  image?: string;
  certificateUrl?: string;
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [],
  templateUrl: './certificates.html',
  styleUrl: './certificates.css',
})
export class Certificates implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef) {}

  certificates: Certificate[] = [
    {
      num: '01',
      name: 'Essentials: Your First Workflows',
      issuer: 'n8n Academy',
      date: 'Jul 12, 2026',
      certificateNumber: 'a79503f6c2da4d13a19c2453ff624bb4',
      image: '/certificates/n8n-101.png',
      certificateUrl: 'https://learn.n8n.io/certificates/a79503f6c2da4d13a19c2453ff624bb4',
    },
    {
      num: '02',
      name: 'Integrations: APIs & Connected Workflows',
      issuer: 'n8n Academy',
      date: 'Jul 14, 2026',
      certificateNumber: '592005f099774a329ed5dab99286dc58',
      image: '/certificates/n8n-102.png',
      certificateUrl: 'https://learn.n8n.io/certificates/592005f099774a329ed5dab99286dc58',
    },
    {
      num: '03',
      name: 'In Practice: AI, Testing & Best Practices',
      issuer: 'n8n Academy',
      date: 'Sep 24, 2026',
      certificateNumber: '6416d954c41a4b6fa81b06441ee112a2',
      image: '/certificates/n8n-103.png',
      certificateUrl: 'https://learn.n8n.io/certificates/6416d954c41a4b6fa81b06441ee112a2',
    },
  ];

  ngAfterViewInit() {
    setupReveal(this.el.nativeElement);
    ScrollTrigger.refresh();
  }

  ngOnDestroy() {
    killReveal(this.el.nativeElement);
  }
}
