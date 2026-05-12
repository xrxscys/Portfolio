import {
  Component, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, HostListener, signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupReveal, killReveal } from '../../utils/reveal';

interface ProjectDetail {
  role: string;
  period: string;
  contributions: string[];
}

interface Project {
  num: string;
  name: string;
  subtitle: string;
  status?: string;
  tags: string[];
  description: string;
  screenshots?: string[];
  detail: ProjectDetail;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements AfterViewInit, OnDestroy {
  @ViewChild('projBackdrop', { static: true }) projBackdrop!: ElementRef<HTMLElement>;
  @ViewChild('projExpanded',  { static: true }) projExpanded!:  ElementRef<HTMLElement>;

  constructor(private el: ElementRef) {}

  currentIndex: Record<string, number> = {};
  fadingOut:    Record<string, boolean> = {};
  activeProject = signal<Project | null>(null);
  private isOverlayBusy = false;

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
      detail: {
        role: 'Full Stack Developer',
        period: 'Sep 2025 — Present',
        contributions: [
          'Built admin UI and CRUD API for role-based module access across 40+ modules, supporting 11 business-scoped roles on a multi-tenant platform.',
          'Wired real-time timesheet updates end-to-end — RTC event queuing on the backend and SignalR subscriptions on the Angular frontend.',
          'Developed batch approval/rejection endpoints with a status rollup transitioning timesheets between Draft, PartiallyApproved, and Approved states.',
          'Built full chat room management with room renaming, emoji reactions, and migrated the chat panel to a Quill Delta rich text editor across 9 real-time entities.',
          'Integrated Azure Maps for live employee and device geolocation, consuming batched location logs for remote workforce visibility.',
          'Delivered full contact management across 6 entity types using a reusable GenericLocator component with server-side filtering and a pending-changes guard.',
        ],
      },
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
      detail: {
        role: 'Lead Developer',
        period: 'Jan 2024 — May 2024',
        contributions: [
          'Led the full-stack implementation and coordinated a team through planning, design, development, and delivery to a live institutional client.',
          'Built a student financial ledger with progressive credit consumption and real-time balance notifications.',
          'Implemented enrollment tracking across academic periods with live progress indicators.',
          'Developed a grading module with CSV bulk upload, dynamic search, and automated document-request fee generation.',
          'Built a full notification system with email delivery, in-app alerts via a custom React hook, and role-based filtering.',
        ],
      },
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

  // ── Image switcher ──

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

  // ── Detail overlay ──

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.activeProject() && !this.isOverlayBusy) this.closeDetail();
  }

  openDetail(project: Project) {
    if (this.isOverlayBusy) return;
    this.isOverlayBusy = true;

    const backdrop = this.projBackdrop.nativeElement;
    const expanded  = this.projExpanded.nativeElement;

    this.activeProject.set(project);

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(
      expanded,
      { opacity: 0, y: 28, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out',
        onComplete: () => {
          backdrop.style.pointerEvents = 'auto';
          this.isOverlayBusy = false;
        },
      }
    );
  }

  closeDetail() {
    if (this.isOverlayBusy) return;
    this.isOverlayBusy = true;

    const backdrop = this.projBackdrop.nativeElement;
    const expanded  = this.projExpanded.nativeElement;

    backdrop.style.pointerEvents = 'none';
    gsap.to(backdrop, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(expanded, {
      opacity: 0, y: 16, scale: 0.97, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        this.activeProject.set(null);
        this.isOverlayBusy = false;
      },
    });
  }

  ngOnDestroy() {
    killReveal(this.el.nativeElement);
    if (this.projBackdrop?.nativeElement) gsap.killTweensOf(this.projBackdrop.nativeElement);
    if (this.projExpanded?.nativeElement)  gsap.killTweensOf(this.projExpanded.nativeElement);
  }
}
