# AI Resume Screener 🤖

![ARS Banner](https://img.shields.io/badge/AI-Resume%20Screener-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

An intelligent resume screening system that automatically analyzes uploaded resumes, matches them against job postings, and categorizes candidates based on their qualifications.

## 🌟 Features

- **Automated Resume Analysis**: Upload resumes through a sleek web interface
- **AI-Powered Matching**: Intelligent comparison with job postings stored in Airtable
- **Smart Categorization**: Automatically sorts candidates into:
  - ✅ **Shortlisted** - Top candidates matching job requirements
  - ❌ **Rejected** - Candidates not meeting criteria
  - 🔍 **Under Review** - Borderline candidates requiring human review
- **Automated Email Notifications**: Sends status updates to both HR and candidates
- **Beautiful UI**: Modern, responsive interface with animated background and custom ARS branding
- **Real-time Processing**: Instant webhook trigger and processing via n8n workflow
- **User-Friendly Feedback**: Clear submission confirmations and processing status updates

## 🚀 Live Demo

**Try it now:** [AI Resume Screener Live Demo](https://ai-resume-screenerr.netlify.app/)

### How to Test:
1. Visit the live demo link
2. Upload a sample resume (PDF, DOC, or DOCX format)
3. Click "Submit Resume"
4. You'll see a confirmation message: "Resume submitted! You will be informed through mail."
5. Check your email for the automated response with your application status

## 🏗️ Architecture

```
User Interface (HTML/CSS/JS)
         ↓
Resume Upload
         ↓
Railway Webhook URL
         ↓
n8n Workflow Trigger
         ↓
AI Resume Analysis
         ↓
Airtable Job Postings Comparison
         ↓
Categorization (Shortlist/Reject/Review)
         ↓
Email Notifications (HR + Candidate)
```

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
  - Custom gradient backgrounds
  - Glassmorphism effects
  - Animated cursor
  - Responsive design
- **JavaScript** - Interactive functionality
  - Galaxy background animation
  - File upload handling
  - Form validation

### Backend & Automation
- **n8n** - Workflow automation platform
- **Railway** - Cloud deployment and hosting
- **Airtable** - Job postings database
- **Webhook Integration** - Real-time trigger mechanism

### Design Elements
- **Google Fonts** - Orbitron, Rajdhani, Exo 2
- **Purple Gradient Theme** - Modern, professional color scheme
- **Custom ARS Branding** - Unique brand identity

## 📋 Prerequisites

- n8n instance (deployed on Railway)
- Airtable account with job postings database
- Railway account for hosting
- Email service configured in n8n

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/PankajKumar-11/AI-Resume-Screener.git
cd AI-Resume-Screener
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password
N8N_ENCRYPTION_KEY=your_32_char_encryption_key

# Webhook Configuration
WEBHOOK_TUNNEL_URL=https://your-railway-app.railway.app

# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_key
AIRTABLE_BASE_ID=your_base_id

# Google/Gemini API (for AI processing)
GOOGLE_API_KEY=your_google_api_key
```

⚠️ **Important**: Never commit `.env` file. It's in `.gitignore` for security.

### 3. Configure Webhook URL

Use the helper script to set your webhook URL:

**Windows (Command Prompt):**
```cmd
set-webhook.cmd prod https://your-railway-app.railway.app/webhook/ai-resume-upload
```

**For local development:**
```cmd
set-webhook.cmd local https://your-ngrok-id.ngrok-free.app/webhook/ai-resume-upload
```

### 4. Deploy to Railway

The repository includes `railway.toml` for easy deployment:

1. Push to GitHub
2. Connect repository to Railway
3. Set environment variables in Railway dashboard
4. Deploy automatically

### 5. Configure Airtable

Create an Airtable base with the following structure:

**Job Postings Table:**
- Job Title (Single line text)
- Required Skills (Multiple select)
- Experience Level (Single select: Entry/Mid/Senior)
- Department (Single select)
- Job Description (Long text)
- Status (Single select: Active/Closed)

**Candidates Table (auto-populated):**
- Name (Single line text)
- Email (Email)
- Resume URL (URL)
- Status (Single select: Shortlisted/Rejected/Under Review)
- Match Score (Number)
- Matched Job (Link to Job Postings)

## 📊 How It Works

### 1. Resume Upload
Users visit the web interface and upload their resume (PDF/DOC/DOCX format).

**User Experience:**
- User selects resume file
- Clicks "Submit Resume" button
- **Instant feedback**: Popup message appears: "📤 Resume submitted! Please wait while we process your application..."
- Loading animation displays with purple gradient theme
- Form submission is confirmed immediately

### 2. Webhook Trigger
Upon submission, the form sends the resume to the Railway-hosted webhook URL, initiating the n8n workflow.

### 3. Resume Processing
The n8n workflow:
- Receives the resume file
- Extracts text using AI (Google/Gemini API)
- Analyzes skills, experience, and qualifications
- Parses candidate information (name, email, contact)

### 4. Job Matching
The system:
- Fetches active job postings from Airtable
- Compares resume data with job requirements
- Uses AI to calculate match scores for each job
- Identifies the best-fit position

### 5. Categorization
Based on match scores, candidates are automatically sorted:
- **Shortlisted**: High match (>80% compatibility)
- **Under Review**: Moderate match (50-80% compatibility)
- **Rejected**: Low match (<50% compatibility)

### 6. Email Notifications
Automated emails are sent via n8n:
- **To HR Team**: Candidate summary with status and matched job
- **To Candidate**: Personalized response based on selection status

**Final User Feedback:**
- Success message: "✅ Resume submitted successfully! You will be informed through mail. Thank you for applying!"
- User knows exactly what to expect next
- Professional confirmation improves trust and user experience

## 📁 Project Structure

```
AI-Resume-Screener/
├── index.html          # Main application page
├── screener.css        # Styling and animations
├── galaxy.js           # Background animation
├── config.js           # Webhook configuration
├── favicon.svg         # ARS favicon (purple gradient)
├── Dockerfile          # n8n container for Railway
├── railway.toml        # Railway deployment config
├── set-webhook.cmd     # Helper script for webhook URL
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🎨 UI Features

- **Animated Galaxy Background**: Dynamic starfield with shooting stars and parallax
- **Custom Cursor**: Interactive particle trail cursor with blend modes
- **Glassmorphism Design**: Modern frosted glass card effects
- **Responsive Layout**: Mobile-first design (works on all devices)
- **ARS Branding**: Gradient purple "ARS" text logo with glow effects
- **Loading Animations**: Smooth transitions and real-time feedback
- **Purple Gradient Theme**: Consistent color scheme throughout (#c084fc → #e879f9 → #a78bfa)

## 🔐 Security

- **File Type Validation**: Only accepts resume formats (PDF, DOC, DOCX)
- **Size Limits**: Upload size restrictions to prevent abuse
- **Secure Webhook**: Protected Railway endpoints
- **Environment Variables**: Sensitive data stored securely
- **GitHub Secret Scanning**: Automatic detection of committed secrets
- **Data Sanitization**: Input validation and sanitization

### Security Best Practices

1. Never commit `.env` file
2. Use strong basic auth credentials for n8n
3. Rotate API keys if accidentally exposed
4. Keep workflow exports private (remove credentials before sharing)
5. Use Railway's environment variables for production secrets

## 📧 Email Templates

The system sends customized emails based on candidate status:

### Shortlisted
- Congratulations message
- Matched job details
- Next steps in hiring process
- Interview scheduling information

### Under Review
- Application received confirmation
- Expected timeline for review
- What to expect next

### Rejected
- Polite rejection message
- Encouragement for future applications
- Skills gap feedback (optional)

## 🚧 Future Enhancements

- [ ] Multi-language resume support
- [ ] Bulk resume upload functionality
- [ ] Candidate dashboard for application tracking
- [ ] Advanced analytics and reporting
- [ ] Interview scheduling integration
- [ ] Skills gap analysis and recommendations
- [ ] Resume scoring breakdown with explanations
- [ ] Video resume support
- [ ] Integration with LinkedIn
- [ ] Candidate pool management

## 🐛 Troubleshooting

### Pushes Blocked by Secret Scanning
1. Replace any real keys with `YOUR_KEY_VALUE` placeholders
2. Remove sensitive files and add to `.gitignore`
3. If secret was committed, rotate the key and rewrite Git history

### Webhook Not Triggering
1. Verify Railway deployment is active
2. Check webhook URL in `config.js`
3. Ensure n8n workflow is activated
4. Check Railway logs for errors

### Resume Upload Failing
1. Check file size (should be under limit)
2. Verify file format (PDF/DOC/DOCX only)
3. Check browser console for JavaScript errors
4. Verify webhook URL is accessible

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pankaj Kumar**
- GitHub: [@PankajKumar-11](https://github.com/PankajKumar-11)

## 🙏 Acknowledgments

- n8n for the powerful automation platform
- Railway for seamless deployment
- Airtable for flexible database solution
- Google Fonts for beautiful typography
- Open source community

## 📞 Support

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/PankajKumar-11/AI-Resume-Screener/issues)
- Check existing issues for solutions

---

<div align="center">

**Made with ❤️ by Pankaj Kumar**

⭐ Star this repo if you find it helpful!

</div>
