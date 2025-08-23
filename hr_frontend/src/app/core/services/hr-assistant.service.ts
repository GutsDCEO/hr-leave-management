import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface EmployeeData {
  id: string;
  name: string;
  email: string;
  department: string;
  leaveBalances: {
    [key: string]: {
      total: number;
      used: number;
      remaining: number;
    };
  };
  recentLeaveRequests: any[];
}

@Injectable({
  providedIn: 'root'
})
export class HrAssistantService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  
  private readonly OLLAMA_URL = 'http://localhost:11434/api/generate';
  private readonly HR_POLICIES = {
    sickLeave: {
      doctorNoteRequired: 3,
      maxDays: 10,
      description: 'Sick leave requires doctor\'s note after 3 days'
    },
    vacationLeave: {
      advanceNotice: 14,
      maxConsecutive: 21,
      description: 'Vacation requests need 14 days advance notice'
    },
    personalLeave: {
      maxDays: 5,
      description: 'Personal leave up to 5 days per year'
    }
  };

  constructor(private http: HttpClient) {
    this.initializeChat();
  }

  private initializeChat(): void {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      content: "How can I help with HR queries today? 🤖\n\nI can assist you with:\n• Leave policies and balances\n• Submitting leave requests\n• HR policy questions\n• General guidance",
      isUser: false,
      timestamp: new Date()
    };
    this.messagesSubject.next([welcomeMessage]);
  }

  sendMessage(userMessage: string, employeeData?: EmployeeData): Observable<void> {
    const userMsg: ChatMessage = {
      id: this.generateId(),
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    };

    const typingMsg: ChatMessage = {
      id: this.generateId(),
      content: 'Thinking...',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };

    // Add user message and typing indicator
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMsg, typingMsg]);

    return this.getAIResponse(userMessage, employeeData).pipe(
      map(response => {
        // Remove typing indicator and add AI response
        const messages = this.messagesSubject.value.filter(msg => !msg.isTyping);
        const aiMsg: ChatMessage = {
          id: this.generateId(),
          content: response,
          isUser: false,
          timestamp: new Date()
        };
        this.messagesSubject.next([...messages, aiMsg]);
      })
    );
  }

  private getAIResponse(userMessage: string, employeeData?: EmployeeData): Observable<string> {
    // Check for specific HR queries first
    const specificResponse = this.getSpecificResponse(userMessage, employeeData);
    if (specificResponse) {
      return of(specificResponse);
    }

    // Build context for AI
    const context = this.buildContext(employeeData);
    const prompt = `You are an HR Assistant for a company. Here's the context:

${context}

HR Policies:
- Sick leave requires doctor's note after 3 days
- Vacation requests need 14 days advance notice
- Personal leave up to 5 days per year
- Maximum consecutive vacation: 21 days

Employee Question: ${userMessage}

Provide a helpful, professional response. If you can't answer something, direct them to contact HR directly at hr@company.com.`;

    return this.http.post<any>(this.OLLAMA_URL, {
      model: 'llama3',
      prompt: prompt,
      stream: false
    }).pipe(
      map(response => response.response?.trim() || 'I apologize, but I\'m having trouble processing your request right now. Please contact HR directly at hr@company.com for assistance.'),
      catchError(() => of('AI service is currently unavailable. For immediate assistance, please contact HR at hr@company.com or check the employee handbook.'))
    );
  }

  private getSpecificResponse(userMessage: string, employeeData?: EmployeeData): string | null {
    const message = userMessage.toLowerCase();

    // Leave balance queries
    if (message.includes('vacation balance') || message.includes('vacation days')) {
      if (employeeData?.leaveBalances?.['VACATION']) {
        const balance = employeeData.leaveBalances['VACATION'];
        return `You have ${balance.remaining} vacation days remaining out of ${balance.total} total days. You've used ${balance.used} days so far this year.`;
      }
      return 'I need to access your employee data to check your vacation balance. Please ensure you\'re logged in properly.';
    }

    // Sick leave doctor note query
    if (message.includes('doctor') && message.includes('note') && message.includes('sick')) {
      if (message.includes('2 day') || message.includes('two day')) {
        return 'No, doctor\'s notes are only required for sick leaves exceeding 3 days. For a 2-day sick leave, no documentation is needed.';
      }
      return 'Doctor\'s notes are required for sick leaves exceeding 3 days. For shorter periods, no documentation is needed.';
    }

    // Leave request guidance
    if (message.includes('how') && (message.includes('request') || message.includes('submit')) && message.includes('leave')) {
      return `To submit a leave request:

1. Click the "New Leave Request" button on your dashboard
2. Select the type of leave (Vacation, Sick, Personal)
3. Choose your start and end dates
4. Provide a reason/description
5. Submit for approval

📋 [Submit Leave Request](/employee/leave-requests)

Remember: Vacation requests need 14 days advance notice when possible.`;
    }

    return null;
  }

  private buildContext(employeeData?: EmployeeData): string {
    if (!employeeData) {
      return 'Employee data not available.';
    }

    let context = `Employee: ${employeeData.name} (${employeeData.email})\nDepartment: ${employeeData.department}\n\n`;
    
    if (employeeData.leaveBalances) {
      context += 'Leave Balances:\n';
      Object.entries(employeeData.leaveBalances).forEach(([type, balance]) => {
        context += `- ${type}: ${balance.remaining}/${balance.total} days remaining\n`;
      });
    }

    return context;
  }

  clearChat(): void {
    this.initializeChat();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
