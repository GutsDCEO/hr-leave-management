import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrAssistantComponent } from './hr-assistant.component';

@Component({
  selector: 'app-hr-assistant-page',
  standalone: true,
  imports: [CommonModule, HrAssistantComponent],
  template: `
    <div class="hr-assistant-page">
      <div class="container">
        <h1 class="page-title">HR Assistant</h1>
        <p class="page-description">
          Get instant help with HR policies, leave requests, and workplace questions.
        </p>
        <div class="assistant-container">
          <app-hr-assistant></app-hr-assistant>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hr-assistant-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-title {
      text-align: center;
      color: white;
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 300;
    }

    .page-description {
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.1rem;
      margin-bottom: 30px;
    }

    .assistant-container {
      max-width: 800px;
      margin: 0 auto;
      height: 600px;
    }

    .assistant-container app-hr-assistant {
      height: 100%;
      display: block;
    }

    @media (max-width: 768px) {
      .hr-assistant-page {
        padding: 10px;
      }
      
      .page-title {
        font-size: 2rem;
      }
      
      .assistant-container {
        height: calc(100vh - 150px);
      }
    }
  `]
})
export class HrAssistantPageComponent {}
