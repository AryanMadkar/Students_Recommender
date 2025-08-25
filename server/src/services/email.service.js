const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Send welcome email
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Welcome to PathPilot - Your Career Journey Begins!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Welcome to PathPilot, ${name}!</h2>
          <p>Thank you for joining PathPilot, your AI-powered career navigator.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Take your first assessment</li>
            <li>Get personalized career recommendations</li>
            <li>Explore colleges and courses</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Get Started
          </a>
          <p style="margin-top: 30px; color: #666;">
            Best regards,<br>
            The PathPilot Team
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Reset Your PathPilot Password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #dc2626;">Password Reset Request</h2>
          <p>You requested a password reset for your PathPilot account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" 
             style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p style="color: #666; margin-top: 20px;">
            This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
          </p>
          <p style="margin-top: 30px; color: #666;">
            Best regards,<br>
            The PathPilot Team
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }

  // Send assessment completion email
  async sendAssessmentCompletionEmail(email, name, assessmentTitle, results) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `${assessmentTitle} Results - PathPilot`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #059669;">Assessment Completed! 🎉</h2>
          <p>Hi ${name},</p>
          <p>You've successfully completed the <strong>${assessmentTitle}</strong>!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Your Results Summary:</h3>
            <p><strong>Overall Score:</strong> ${results.overall}%</p>
            <p><strong>Top Strength:</strong> ${this.getTopStrength(results)}</p>
            <p><strong>Recommended Focus Area:</strong> ${this.getWeakestArea(results)}</p>
          </div>
          
          <p>Based on your results, we've generated personalized recommendations for you.</p>
          
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Detailed Results
          </a>
          
          <p style="margin-top: 30px; color: #666;">
            Keep exploring and growing!<br>
            The PathPilot Team
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Assessment completion email sent successfully');
    } catch (error) {
      console.error('Error sending assessment completion email:', error);
    }
  }

  // Send recommendation email
  async sendRecommendationEmail(email, name, recommendations) {
    const topRecommendations = recommendations.slice(0, 3);
    
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Your Personalized Career Recommendations - PathPilot',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #7c3aed;">Your Personalized Recommendations 🚀</h2>
          <p>Hi ${name},</p>
          <p>Based on your assessments and profile, we've generated personalized recommendations just for you!</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Top Recommendations:</h3>
            ${topRecommendations.map(rec => `
              <div style="border-left: 4px solid #7c3aed; padding-left: 15px; margin: 15px 0;">
                <h4 style="margin: 0; color: #374151;">${rec.title}</h4>
                <p style="margin: 5px 0; color: #6b7280;">${rec.description}</p>
                <span style="background: #ddd6fe; color: #5b21b6; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  ${rec.matchPercentage}% match
                </span>
              </div>
            `).join('')}
          </div>
          
          <a href="${process.env.FRONTEND_URL}/recommendations" 
             style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View All Recommendations
          </a>
          
          <p style="margin-top: 30px; color: #666;">
            Your future starts now!<br>
            The PathPilot Team
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Recommendation email sent successfully');
    } catch (error) {
      console.error('Error sending recommendation email:', error);
    }
  }

  // Helper methods
  getTopStrength(results) {
    const scores = { ...results };
    delete scores.overall;
    
    const topScore = Math.max(...Object.values(scores));
    const topCategory = Object.keys(scores).find(key => scores[key] === topScore);
    
    return this.formatCategoryName(topCategory);
  }

  getWeakestArea(results) {
    const scores = { ...results };
    delete scores.overall;
    
    const lowestScore = Math.min(...Object.values(scores));
    const weakestCategory = Object.keys(scores).find(key => scores[key] === lowestScore);
    
    return this.formatCategoryName(weakestCategory);
  }

  formatCategoryName(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

module.exports = new EmailService();
