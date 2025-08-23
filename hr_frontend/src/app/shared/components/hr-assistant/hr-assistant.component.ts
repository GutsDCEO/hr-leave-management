import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { HrAssistantService, ChatMessage, EmployeeData } from '../../../core/services/hr-assistant.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-hr-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  template: `
    <div class="hr-assistant-container">
      <!-- Header -->
      <mat-toolbar color="primary" class="chat-header">
        <mat-icon class="mr-2">support_agent</mat-icon>
        <span>HR Assistant</span>
        <span class="spacer"></span>
        <button mat-icon-button (click)="clearChat()" matTooltip="Clear Chat">
          <mat-icon>refresh</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Quick Actions -->
      <div class="quick-actions p-4 bg-gray-50 border-b">
        <div class="flex flex-wrap gap-2">
          <button mat-stroked-button color="primary" (click)="askAboutVacationBalance()" class="quick-action-btn">
            <mat-icon>calendar_today</mat-icon>
            Vacation Balance
          </button>
          <button mat-stroked-button color="primary" (click)="askAboutLeaveRequest()" class="quick-action-btn">
            <mat-icon>add_task</mat-icon>
            Submit Leave
          </button>
          <button mat-stroked-button color="primary" (click)="askAboutSickLeave()" class="quick-action-btn">
            <mat-icon>local_hospital</mat-icon>
            Sick Leave Policy
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div #chatContainer class="chat-messages" [class.loading]="isLoading">
        <div *ngFor="let message of messages; trackBy: trackByMessageId" 
             class="message-wrapper"
             [class.user-message]="message.isUser"
             [class.ai-message]="!message.isUser">
          
          <div class="message-bubble" [class.typing]="message.isTyping">
            <div class="message-avatar">
              <mat-icon *ngIf="message.isUser" class="user-avatar">person</mat-icon>
              <mat-icon *ngIf="!message.isUser" class="ai-avatar">smart_toy</mat-icon>
            </div>
            
            <div class="message-content">
              <div class="message-text" [innerHTML]="formatMessage(message.content)"></div>
              <div class="message-time">{{ getMessageTime(message.timestamp) }}</div>
              
              <!-- Typing indicator -->
              <div *ngIf="message.isTyping" class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Ask me anything about HR policies...</mat-label>
          <textarea 
            #messageInput
            matInput 
            [(ngModel)]="currentMessage"
            (keydown)="onKeyPress($event)"
            [disabled]="isLoading"
            rows="2"
            placeholder="e.g., 'What's my vacation balance?' or 'How do I request sick leave?'">
          </textarea>
          <button 
            mat-icon-button 
            matSuffix 
            (click)="sendMessage()"
            [disabled]="!currentMessage.trim() || isLoading"
            color="primary">
            <mat-icon *ngIf="!isLoading">send</mat-icon>
            <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
          </button>
        </mat-form-field>
      </div>

      <!-- Help Text -->
      <div class="help-text p-2 text-center text-sm text-gray-500">
        💡 I can help with leave policies, balances, and HR questions. For complex issues, contact 
        <a href="mailto:hr&#64;company.com" class="text-blue-600">hr&#64;company.com</a>
      </div>
    </div>
  `,
  styles: [`
    .hr-assistant-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-height: 800px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .chat-header {
      background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 0 16px;
      min-height: 64px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .quick-actions {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .quick-action-btn {
      font-size: 12px;
      padding: 8px 12px;
      border-radius: 20px;
      transition: all 0.3s ease;
    }

    .quick-action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    }

    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }

    .message-wrapper {
      margin-bottom: 20px;
      display: flex;
      animation: fadeInUp 0.5s ease-out;
    }

    .message-wrapper.user-message {
      justify-content: flex-end;
    }

    .message-wrapper.ai-message {
      justify-content: flex-start;
    }

    .message-bubble {
      display: flex;
      max-width: 80%;
      align-items: flex-start;
      gap: 12px;
    }

    .user-message .message-bubble {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .user-avatar {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
      padding: 8px;
      border-radius: 50%;
    }

    .ai-avatar {
      background: linear-gradient(135deg, #4ecdc4, #44a08d);
      color: white;
      padding: 8px;
      border-radius: 50%;
    }

    .message-content {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 18px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      position: relative;
    }

    .user-message .message-content {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .ai-message .message-content {
      background: rgba(255, 255, 255, 0.95);
      color: #333;
    }

    .message-text {
      line-height: 1.5;
      word-wrap: break-word;
    }

    .message-text ::ng-deep a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 500;
    }

    .message-text ::ng-deep a:hover {
      text-decoration: underline;
    }

    .user-message .message-text ::ng-deep a {
      color: #fbbf24;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 4px;
      text-align: right;
    }

    .user-message .message-time {
      color: rgba(255, 255, 255, 0.8);
    }

    .ai-message .message-time {
      color: #666;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      margin-top: 8px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4f46e5;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) {
      animation-delay: -0.32s;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: -0.16s;
    }

    .chat-input-area {
      padding: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .full-width {
      width: 100%;
    }

    .help-text {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }

    @media (max-width: 768px) {
      .hr-assistant-container {
        height: 100vh;
        border-radius: 0;
      }
      
      .message-bubble {
        max-width: 90%;
      }
      
      .quick-actions {
        padding: 12px;
      }
      
      .quick-action-btn {
        font-size: 11px;
        padding: 6px 10px;
      }
    }

    @media (prefers-color-scheme: dark) {
      .message-content {
        background: rgba(30, 30, 30, 0.95);
        color: #e5e5e5;
      }
      
      .ai-message .message-content {
        background: rgba(40, 40, 40, 0.95);
        color: #e5e5e5;
      }
    }
  `]
})
export class HrAssistantComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  employeeData: EmployeeData | null = null;

  private messagesSubscription?: Subscription;

  constructor(
    private hrAssistantService: HrAssistantService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadEmployeeData();
    this.messagesSubscription = this.hrAssistantService.messages$.subscribe(
      messages => {
        this.messages = messages;
        this.isLoading = messages.some(msg => msg.isTyping);
      }
    );
  }

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private loadEmployeeData(): void {
    // Get current user data from auth service
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.employeeData = {
          id: '1', // Mock ID since user model doesn't have id
          name: user.email?.split('@')[0] || 'Employee',
          email: user.email || 'employee@company.com',
          department: 'IT Department',
          leaveBalances: {
            VACATION: { total: 20, used: 5, remaining: 15 },
            SICK: { total: 10, used: 2, remaining: 8 },
            PERSONAL: { total: 5, used: 1, remaining: 4 }
          },
          recentLeaveRequests: []
        };
      }
    });
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    const message = this.currentMessage.trim();
    this.currentMessage = '';
    this.isLoading = true;

    this.hrAssistantService.sendMessage(message, this.employeeData || undefined)
      .subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.isLoading = false;
        }
      });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.hrAssistantService.clearChat();
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        const element = this.chatContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  getMessageTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  formatMessage(content: string): SafeHtml {
    // Convert markdown-like formatting to HTML
    const formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/📋 \[(.*?)\]\((.*?)\)/g, '<a href="$2" class="action-link">📋 $1</a>');
    
    // Sanitize the HTML content for security
    return this.sanitizer.bypassSecurityTrustHtml(formattedContent);
  }

  // Quick action buttons
  askAboutVacationBalance(): void {
    this.currentMessage = "What's my vacation balance?";
    this.sendMessage();
  }

  askAboutLeaveRequest(): void {
    this.currentMessage = "How do I request vacation leave?";
    this.sendMessage();
  }

  askAboutSickLeave(): void {
    this.currentMessage = "Do I need a doctor's note for 2-day sick leave?";
    this.sendMessage();
  }
}
