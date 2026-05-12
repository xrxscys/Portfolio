import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupReveal, killReveal } from '../../utils/reveal';

interface Project {
  num: string;
  name: string;
  subtitle: string;
  status?: string;
  tags: string[];
  description: string;
  screenshots?: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef) {}

  currentIndex: Record<string, number> = {};
  fadingOut:    Record<string, boolean> = {};

  projects: Project[] = [
    {
      num: '01',
      name: 'Ulta Hub',
      subtitle: 'CSAM Philippines, Inc.',
      status: 'In Development',
      tags: ['Angular', 'ASP.NET Core', 'SignalR', 'Azure'],
      description: `Ulta Hub is a workforce management platform built for companies that operate through Virtual Assistants. It gives teams a centralized place to manage schedules, track time, monitor remote employees in real time, and communicate — all within a structured, role-based environment. Designed for multi-tenant use, each business operates independently within the platform with its own modules, roles, and workflows.`,
      screenshots: Array.from({ length: 10 }, (_, i) =>
        `/work/ultahub-${String(i + 1).padStart(2, '0')}.png`
      ),
    },
    {
      num: '02',
      name: 'EduOps',
      subtitle: 'University of San Carlos',
      tags: ['React', 'Node.js', 'Prisma', 'MySQL'],
      description: `EduOps is a school management system built for an actual institutional client. It handles the core administrative workflows of a school — student finances, enrollment, grading, and notifications — in one place. Faculty and administrators get a system built around how schools actually operate, replacing the fragmented manual processes that slow down every academic period.`,
      screenshots: Array.from({ length: 9 }, (_, i) =>
        `/work/eduops-${String(i + 1).padStart(2, '0')}.jpg`
      ),
    },
  ];

  ngAfterViewInit() {
    this.projects.forEach(p => {
      this.currentIndex[p.num] = 0;
      this.fadingOut[p.num]    = false;
    });
    setupReveal(this.el.nativeElement);
    ScrollTrigger.refresh();
  }

  prev(project: Project) {
    const len = project.screenshots?.length ?? 0;
    if (!len) return;
    this.fadeAndSet(project.num, (this.currentIndex[project.num] - 1 + len) % len);
  }

  next(project: Project) {
    const len = project.screenshots?.length ?? 0;
    if (!len) return;
    this.fadeAndSet(project.num, (this.currentIndex[project.num] + 1) % len);
  }

  goTo(project: Project, index: number) {
    if (index === this.currentIndex[project.num]) return;
    this.fadeAndSet(project.num, index);
  }

  private fadeAndSet(num: string, newIndex: number) {
    this.fadingOut[num] = true;
    setTimeout(() => {
      this.currentIndex[num] = newIndex;
      this.fadingOut[num]    = false;
    }, 180);
  }

  ngOnDestroy() {
    killReveal(this.el.nativeElement);
  }
}
