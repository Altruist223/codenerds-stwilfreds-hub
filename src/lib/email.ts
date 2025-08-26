import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
// TODO: Replace with your actual EmailJS public key
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface EmailData {
  from_name: string;
  from_email: string;
  department?: string;
  message: string;
  to_email: string;
}

export const sendContactEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const templateParams = {
      from_name: data.from_name,
      from_email: data.from_email,
      department: data.department || '',
      message: data.message,
      to_email: data.to_email
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Fallback function to send email via mailto if EmailJS fails
export const sendEmailViaMailto = (data: EmailData): void => {
  const subject = encodeURIComponent('Contact from Code Nerds');
  const body = encodeURIComponent(
    `Name: ${data.from_name}\nEmail: ${data.from_email}\nDepartment: ${data.department || ''}\n\nMessage:\n${data.message}`
  );
  
  const mailtoLink = `mailto:${data.to_email}?subject=${subject}&body=${body}`;
  window.open(mailtoLink, '_blank');
};