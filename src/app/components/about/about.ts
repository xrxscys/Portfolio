import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, HostListener, signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupReveal, killReveal } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

interface CardDetail {
  num: string;
  title: string;
  desc: string;
  tags: string[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit, AfterViewInit, OnDestroy {
  // ── Education card refs ──
  @ViewChild('eduCard',    { static: false }) eduCard!:    ElementRef<HTMLElement>;
  @ViewChild('cardSheen',  { static: false }) cardSheen!:  ElementRef<HTMLElement>;

  // ── Overlay refs — static:true because overlay is always in DOM ──
  @ViewChild('widBackdrop', { static: true }) widBackdropRef!: ElementRef<HTMLElement>;
  @ViewChild('widExpanded',  { static: true }) widExpandedRef!:  ElementRef<HTMLElement>;

  private floatTween?:  gsap.core.Tween;
  private returnTween?: gsap.core.Tween;
  private cardTrigger?: ScrollTrigger;

  private isHovering    = false;
  private isOverlayBusy = false;   // prevents re-entry during animation

  // ── Capability card data ──
  readonly cards: Array<{ id: string; line1: string; line2: string; previewTags: string[] }> = [
    { id: '01', line1: 'Frontend',       line2: 'Engineering', previewTags: ['Angular 17+', 'TypeScript', 'RxJS', 'GSAP'] },
    { id: '02', line1: 'Backend',        line2: '& APIs',      previewTags: ['ASP.NET Core', 'C#', 'Entity Framework'] },
    { id: '03', line1: 'Real-time',      line2: 'Systems',     previewTags: ['SignalR', 'WebSockets', 'Background Services'] },
    { id: '04', line1: 'Infrastructure', line2: '& Tooling',   previewTags: ['Git', 'Azure DevOps', 'Docker'] },
  ];

  // Signal drives template content; GSAP drives visibility — never toggled to create/destroy DOM
  activeCard = signal<CardDetail | null>(null);

  readonly cardDetails: Record<string, CardDetail> = {
    '01': {
      num: '01', title: 'Frontend Engineering',
      desc: `Component-driven Angular applications built to scale. On Ulta Hub I designed and built 40+ module UIs — data tables with filtering and pagination, multi-step form flows, permission-gated views, a rich-text chat interface, and real-time dashboard panels. I focus on reusable component boundaries, reactive state with RxJS and Signals, and motion that earns its place. Also comfortable in React and Next.js for projects outside the .NET stack.`,
      tags: ['Angular 17+', 'TypeScript', 'RxJS', 'GSAP', 'Tailwind CSS', 'Signals', 'ReactJS', 'NextJS', 'Figma'],
    },
    '02': {
      num: '02', title: 'Backend & APIs',
      desc: `Clean, well-documented RESTful APIs with ASP.NET Core. On Ulta Hub I designed the API layer supporting 40+ modules — role-based access control, complex EF Core query patterns, background services for scheduled tasks, and file handling through Azure Blob Storage. Also worked with Node.js and MySQL for lighter backends and personal full-stack projects.`,
      tags: ['ASP.NET Core', 'C#', 'Entity Framework', 'SQL Server', 'NodeJS', 'MySQL', 'Docker', 'Swagger'],
    },
    '03': {
      num: '03', title: 'Real-time Systems',
      desc: `Live data pipelines using SignalR on top of WebSockets. On Ulta Hub I implemented 9 real-time entities — timesheet updates, live geolocation via Azure Maps, in-app notifications, and a multi-room rich-text chat system. Real-time requires careful design around connection state, reconnect logic, and client-side reconciliation when server and client drift.`,
      tags: ['SignalR', 'WebSockets', 'Background Services', 'Azure Maps'],
    },
    '04': {
      num: '04', title: 'Infrastructure & Tooling',
      desc: `Azure services for cloud infrastructure — Blob Storage for file handling, Azure Maps for live geolocation, and Azure DevOps for CI/CD pipelines. Docker for containerization, Git for version control, and Jira/Azure Boards for project tracking. Comfortable in the full delivery lifecycle from local dev to production deployment.`,
      tags: ['Git', 'Azure DevOps', 'Azure Blob Storage', 'Azure Maps', 'Firebase', 'Docker', 'Jira', 'Trello'],
    },
  };

  constructor(private el: ElementRef) {}

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.activeCard() && !this.isOverlayBusy) this.closeCard();
  }

  ngOnInit() {
    setupReveal(this.el.nativeElement);
  }

  ngAfterViewInit() {
    // Edu card scroll reveal → idle tilt
    const card = this.eduCard?.nativeElement;
    if (card) {
      gsap.set(card, { opacity: 0, y: 24 });
      this.cardTrigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
            onComplete: () => this.startIdleAndTilt(),
          });
        },
      });
    }

    // Cap-cards stagger entrance (must be here — @for elements are ready)
    const capCards = this.el.nativeElement.querySelectorAll('.cap-card');
    if (capCards.length) {
      gsap.fromTo(
        capCards,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: capCards[0], start: 'top 88%', once: true },
        }
      );
    }

    ScrollTrigger.refresh();
  }

  // ── Capability card overlay ──
  openCard(id: string) {
    if (this.isOverlayBusy) return;
    this.isOverlayBusy = true;

    const backdrop = this.widBackdropRef.nativeElement;
    const expanded  = this.widExpandedRef.nativeElement;

    this.activeCard.set(this.cardDetails[id] ?? null);

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

  closeCard() {
    if (this.isOverlayBusy) return;
    this.isOverlayBusy = true;

    const backdrop = this.widBackdropRef.nativeElement;
    const expanded  = this.widExpandedRef.nativeElement;

    backdrop.style.pointerEvents = 'none';
    gsap.to(backdrop, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(expanded, {
      opacity: 0, y: 16, scale: 0.97, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        this.activeCard.set(null);
        this.isOverlayBusy = false;
      },
    });
  }

  // ── Education card tilt ──
  private startIdleAndTilt() {
    const card = this.eduCard?.nativeElement;
    if (!card) return;

    gsap.set(card, { transformPerspective: 700 });

    this.floatTween = gsap.to(card, {
      y: -12, rotation: 1, duration: 3.5,
      ease: 'sine.inOut', repeat: -1, yoyo: true,
    });

  }

  onMouseMove(e: MouseEvent) {
    const card  = this.eduCard?.nativeElement;
    const sheen = this.cardSheen?.nativeElement;
    if (!card) return;

    this.returnTween?.kill();
    this.isHovering = true;
    this.floatTween?.pause();

    const rect = card.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top)  / rect.height;

    gsap.to(card, {
      rotateX: (relY - 0.5) * -20,
      rotateY: (relX - 0.5) *  26,
      scale: 1.04,
      duration: 0.08,
      ease: 'none',
      overwrite: 'auto',
    });

    if (sheen) {
      sheen.style.background =
        `radial-gradient(ellipse 55% 45% at ${relX * 100}% ${relY * 100}%, rgba(242,237,228,0.1) 0%, transparent 65%)`;
      sheen.style.opacity = '1';
    }
  }

  onMouseLeave() {
    const card  = this.eduCard?.nativeElement;
    const sheen = this.cardSheen?.nativeElement;
    if (!card) return;

    this.isHovering = false;
    this.returnTween = gsap.to(card, {
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.75, ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
      onComplete: () => {
        if (!this.isHovering && this.floatTween) {
          gsap.set(card, { rotation: 0, y: 0 });
          this.floatTween.restart();
        }
      },
    });

    if (sheen) gsap.to(sheen, { opacity: 0, duration: 0.35, ease: 'power2.out' });
  }

  ngOnDestroy() {
    this.floatTween?.kill();
    this.returnTween?.kill();
    this.cardTrigger?.kill();
    killReveal(this.el.nativeElement);
    if (this.eduCard?.nativeElement) gsap.killTweensOf(this.eduCard.nativeElement);
  }
}
