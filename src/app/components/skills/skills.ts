import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupReveal, killReveal } from '../../utils/reveal';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef) {}

  skillGroups = [
    {
      num: '01',
      label: 'Frontend',
      skills: ['Angular', 'TypeScript', 'RxJS', 'Angular Signals', 'GSAP', 'Tailwind CSS', 'React', 'Next.js', 'JavaScript', 'HTML', 'CSS', 'Figma'],
    },
    {
      num: '02',
      label: 'Backend & APIs',
      skills: ['ASP.NET Core', 'C#', 'Node.js', 'REST APIs', 'Swagger / OpenAPI'],
    },
    {
      num: '03',
      label: 'Data & ORM',
      skills: ['Entity Framework Core', 'LINQ', 'SQL Server', 'MySQL'],
    },
    {
      num: '04',
      label: 'Real-time',
      skills: ['SignalR', 'WebSockets', 'Background Services'],
    },
    {
      num: '05',
      label: 'Cloud & Infrastructure',
      skills: ['Azure DevOps', 'Azure Blob Storage', 'Azure Maps', 'Firebase', 'Docker'],
    },
    {
      num: '06',
      label: 'Automation & Integrations',
      skills: ['n8n', 'Workflow Automation', 'Webhooks', 'REST API Integration', 'Google Sheets API', 'Gmail API', 'Discord Webhooks', 'Semaphore SMS API'],
    },
    {
      num: '07',
      label: 'Workflow',
      skills: ['Git', 'Jira', 'Trello', 'Agile / Scrum', 'Kanban'],
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
