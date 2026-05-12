import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  @ViewChild('playingCard',     { static: false }) playingCard!:     ElementRef<HTMLElement>;
  @ViewChild('heroSheen',       { static: false }) heroSheen!:       ElementRef<HTMLElement>;
  @ViewChild('scrollIndicator', { static: false }) scrollIndicator!: ElementRef<HTMLElement>;

  private tl!: gsap.core.Timeline;
  private floatTween?: gsap.core.Tween;
  private returnTween?: gsap.core.Tween;
  private isHovering = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    setTimeout(() => this.buildEntrance(), 0);
  }

  private buildEntrance() {
    const card     = this.playingCard?.nativeElement;
    const reveals  = this.el.nativeElement.querySelectorAll('.reveal');

    this.tl = gsap.timeline({
      delay: 0.15,
      onComplete: () => this.startIdleFloat(),
    });

    this.tl.to(reveals, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
    });

    if (card) {
      this.tl.fromTo(
        card,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.45'
      );
    }

    const indicator = this.scrollIndicator?.nativeElement;
    if (indicator) {
      this.tl.fromTo(
        indicator,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );
    }
  }

  private startIdleFloat() {
    const card = this.playingCard?.nativeElement;
    if (!card) return;

    gsap.set(card, { transformPerspective: 900 });

    this.floatTween = gsap.to(card, {
      y: -14,
      rotation: 1.1,
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  onMouseMove(e: MouseEvent) {
    const card  = this.playingCard?.nativeElement;
    const sheen = this.heroSheen?.nativeElement;
    if (!card) return;

    this.returnTween?.kill();

    if (!this.isHovering) {
      this.isHovering = true;
      this.floatTween?.pause();
    }

    const rect = card.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top)  / rect.height;

    gsap.to(card, {
      rotateX: (relY - 0.5) * -22,
      rotateY: (relX - 0.5) *  28,
      scale: 1.04,
      duration: 0.08,
      ease: 'none',
      overwrite: 'auto',
    });

    if (sheen) {
      sheen.style.background =
        `radial-gradient(ellipse 60% 50% at ${relX * 100}% ${relY * 100}%, rgba(242,237,228,0.11) 0%, transparent 65%)`;
      sheen.style.opacity = '1';
    }
  }

  onMouseLeave() {
    const card  = this.playingCard?.nativeElement;
    const sheen = this.heroSheen?.nativeElement;
    if (!card) return;

    this.isHovering = false;

    this.returnTween = gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.75,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
      onComplete: () => {
        if (!this.isHovering && this.floatTween) {
          gsap.set(card, { rotation: 0, y: 0 });
          this.floatTween.restart();
        }
      },
    });

    if (sheen) {
      gsap.to(sheen, { opacity: 0, duration: 0.35, ease: 'power2.out' });
    }
  }

  ngOnDestroy() {
    this.tl?.kill();
    this.floatTween?.kill();
    this.returnTween?.kill();
    if (this.playingCard?.nativeElement) {
      gsap.killTweensOf(this.playingCard.nativeElement);
    }
  }

  scrollTo(e: Event, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
