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
  category: 'client' | 'side';
  tags: string[];
  description: string;
  screenshots?: string[];
  detail: ProjectDetail;
}

const GROUP_LABEL: Record<Project['category'], string> = {
  client: 'Selected Client Work',
  side: 'Side Projects & Automation',
};

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
      category: 'client',
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
      category: 'client',
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
    // Hidden until the order automation project is updated — uncomment to restore.
    /* {
      num: '03',
      name: 'Automated Order Intake & Fulfillment System',
      subtitle: 'Personal Project',
      category: 'side',
      tags: ['n8n', 'Google Sheets API', 'Gmail', 'Semaphore SMS API', 'Discord Webhooks'],
      description: `Two connected n8n workflows that run a small business's order pipeline end to end. An intake workflow runs every form submission through honeypot bot detection and recency-based duplicate checking before gating it behind a manual staff approval step in Gmail; a separate status workflow watches the order-tracking sheet and automatically fires the right customer notification — email receipt or SMS — the moment payment or fulfillment status changes. Every key checkpoint also posts to a Discord webhook, giving an audit trail without needing to open n8n.`,
      screenshots: [
        '/work/order-automation-01.png',
      ],
      detail: {
        role: 'Automation Builder',
        period: '2026',
        contributions: [
          'Built a honeypot-based bot filter and a recency-windowed duplicate check that tells an accidental double-click apart from a genuine repeat order.',
          'Gated every submission behind a manual Gmail Send-and-Wait approval step, so nothing reaches the order sheet without human sign-off.',
          'Built a second workflow that polls the order sheet for status changes and branches by which column changed — payment vs. fulfillment.',
          'Integrated the Semaphore SMS API via a raw HTTP Request node (no native n8n node exists for it) for pickup-ready texts, alongside Gmail for receipt emails.',
          'Added Discord webhook logging at every key checkpoint — blocked bots, saved orders, sent SMS, sent emails — for an audit trail outside of n8n, and a sent-flag column on each row to prevent duplicate notifications on the next poll.',
        ],
      },
    }, */
    {
      num: '03',
      name: 'AI Facebook Post Assistant',
      subtitle: "Nova's Farm-Fresh Eggs",
      category: 'side',
      tags: ['n8n', 'Claude API', 'OpenAI Images', 'Telegram Bot API', 'Facebook Graph API'],
      description: `A Telegram bot that works like a copywriter and designer on call for a small family egg farm in Cebu. The owner sends a plain-language message like "Father's Day post, mix of both, with image" and the bot writes a ready-to-post caption in the brand's warm, bilingual Bisaya/English voice, designs a matching poster with the real logo, and shows a preview. Nothing reaches the Facebook Page until the owner taps Approve — and change requests are just typed back into the chat, as many rounds as needed.`,
      screenshots: Array.from({ length: 5 }, (_, i) =>
        `/work/fb-assistant-${String(i + 1).padStart(2, '0')}.png`
      ),
      detail: {
        role: 'Automation Builder',
        period: '2026',
        contributions: [
          'Built natural-language intake: Claude turns a casual chat message into a structured JSON brief (topic, tone, language, image yes/no), validated in code with sensible defaults.',
          "Wrote brand-voice system prompts by studying the page's past posts — covering bilingual language modes, pronoun use, hook styles, and what to avoid — so captions read like the owners wrote them.",
          'Generated on-brand graphics by having Claude write an art-direction prompt from the finished caption, then rendering it with OpenAI gpt-image-2 using the real logo as a reference image.',
          'Built a chat-native revision loop n8n doesn\'t support out of the box: the paused run stores its resume URL in a Data Table keyed by chat, and the next Telegram message wakes it with the change notes.',
          'Used the same table as a per-chat state machine (drafting → approval → revision) to allow one draft at a time, support /cancel at any stage, and re-check ownership so a cancelled draft can never be published.',
          'Locked the bot to whitelisted Telegram users with requester-only approval — cutting post creation down to one message and one tap, with drafts ready in 30 seconds to 2 minutes.',
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

  // ── Grouping ──

  isGroupStart(index: number): boolean {
    return index === 0 || this.projects[index].category !== this.projects[index - 1].category;
  }

  groupLabel(category: Project['category']): string {
    return GROUP_LABEL[category];
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
