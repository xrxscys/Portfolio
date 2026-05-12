import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupReveal, killReveal } from '../../utils/reveal';

interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  type: 'work' | 'project';
  bullets: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef) {}

  jobs: Job[] = [
    {
      title: 'Full Stack Developer',
      company: 'CSAM Philippines, Inc.',
      location: 'Remote',
      period: 'Sep 2025 — Present',
      current: true,
      type: 'work',
      bullets: [
        'Built admin UI and CRUD API for role-based module access across 40+ modules, supporting 11 business-scoped roles on a multi-tenant platform.',
        'Wired real-time timesheet updates end-to-end — RTC event queuing on the backend and SignalR subscriptions on the Angular frontend.',
        'Developed batch approval/rejection endpoints with a status rollup transitioning timesheets between Draft, PartiallyApproved, and Approved states.',
        'Built full chat room management with room renaming, emoji reactions, and migrated the chat panel to a Quill Delta rich text editor across 9 real-time entities.',
        'Integrated Azure Maps for live employee and device geolocation, consuming batched location logs for remote workforce visibility.',
        'Delivered full contact management across 6 entity types using a reusable GenericLocator component with server-side filtering and a pending-changes guard.',
      ],
    },
    {
      title: 'Full Stack Developer Intern',
      company: 'CSAM Philippines, Inc.',
      location: 'Remote',
      period: 'Oct 2024 — May 2025',
      current: false,
      type: 'work',
      bullets: [
        'Developed and updated backend controllers and service layers in ASP.NET Core, tested endpoints via Swagger, and implemented frontend changes in Angular.',
        'Supported version control and Azure-hosted infrastructure, and assisted in Agile sprint operations through Kanban board and sprint visibility tracking.',
      ],
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
