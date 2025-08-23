# HR Assistant Integration

## Overview
The HR Assistant is an AI-powered chat interface integrated into your Angular HR Management application. It provides employees with instant access to HR policies, leave balance information, and guidance on HR processes.

## Features

### ✨ Core Functionality
- **Policy Knowledge**: Answers questions about sick leave, vacation policies, and HR procedures
- **Data Integration**: Accesses employee leave balances and request history
- **Action Guidance**: Provides step-by-step instructions for HR processes
- **Smart Responses**: Uses AI (Ollama/llama3) for intelligent, context-aware answers

### 🎯 Quick Actions
- Check vacation balance
- Learn about leave submission process
- Understand sick leave policies
- Get HR contact information

## Technical Implementation

### Components Created
1. **HrAssistantService** (`core/services/hr-assistant.service.ts`)
   - Handles AI communication with Ollama
   - Manages chat state and message history
   - Provides specific HR policy responses

2. **HrAssistantComponent** (`shared/components/hr-assistant/hr-assistant.component.ts`)
   - Main chat interface with Material Design
   - Real-time messaging with typing indicators
   - Quick action buttons for common queries

3. **HrAssistantDialogComponent** (`shared/components/hr-assistant-dialog/hr-assistant-dialog.component.ts`)
   - Modal dialog wrapper for the chat interface

4. **HrAssistantPageComponent** (`shared/components/hr-assistant/hr-assistant-page.component.ts`)
   - Full-page view for the HR Assistant

### Integration Points
- **Navbar**: Added HR Assistant icon for logged-in users
- **Routing**: Added `/hr-assistant` route with authentication guard
- **Auth Service**: Integrated with existing user authentication

## Setup Requirements

### 1. AI Backend (Ollama)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the llama3 model
ollama pull llama3

# Start Ollama server (runs on localhost:11434)
ollama serve
```

### 2. Angular Dependencies
Ensure these Angular Material modules are available:
- MatCardModule
- MatButtonModule
- MatIconModule
- MatInputModule
- MatFormFieldModule
- MatProgressSpinnerModule
- MatToolbarModule
- MatDialogModule

### 3. Font Awesome (for robot icon)
Add to your `index.html`:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
```

## Usage Examples

### Employee Queries
- "What's my vacation balance?"
- "Do I need a doctor's note for 2-day sick leave?"
- "How do I request vacation leave?"
- "What are the company's leave policies?"

### Expected Responses
- **Vacation Balance**: "You have 15 vacation days remaining out of 20 total days. You've used 5 days so far this year."
- **Sick Leave Policy**: "No, doctor's notes are only required for sick leaves exceeding 3 days. For a 2-day sick leave, no documentation is needed."
- **Leave Request Process**: Step-by-step instructions with deep links to the leave request form.

## Customization

### HR Policies
Update the `HR_POLICIES` object in `hr-assistant.service.ts`:
```typescript
private readonly HR_POLICIES = {
  sickLeave: {
    doctorNoteRequired: 3,
    maxDays: 10,
    description: 'Sick leave requires doctor\'s note after 3 days'
  },
  // Add more policies...
};
```

### Employee Data Integration
Replace the mock data in `loadEmployeeData()` method with actual API calls to your backend:
```typescript
private loadEmployeeData(): void {
  this.employeeService.getCurrentEmployeeData().subscribe(data => {
    this.employeeData = data;
  });
}
```

### Styling
The component uses a modern gradient design with:
- Purple/blue gradient background
- Glass-morphism effects
- Smooth animations
- Responsive design for mobile devices

## Error Handling
- Fallback responses when AI service is unavailable
- Graceful degradation to static HR policy responses
- Contact information for complex queries

## Security Considerations
- All routes protected by authentication guards
- Employee data access restricted to authenticated users
- AI responses filtered for appropriate content
- No sensitive data exposed in prompts

## Future Enhancements
- Integration with company knowledge base
- Multi-language support
- Voice input/output capabilities
- Integration with HR ticketing system
- Advanced analytics on common queries

## Troubleshooting

### Common Issues
1. **AI Service Unavailable**: Ensure Ollama is running on localhost:11434
2. **Import Errors**: Verify all Angular Material modules are imported
3. **Routing Issues**: Check that authentication guards are properly configured
4. **Styling Problems**: Ensure Tailwind CSS classes are available

### Development Tips
- Use browser dev tools to monitor API calls to Ollama
- Check console for any TypeScript compilation errors
- Test with different user roles (ADMIN vs EMPLOYEE)
- Verify responsive design on mobile devices

## Contact
For technical support or feature requests, contact the development team or create an issue in the project repository.
