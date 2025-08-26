import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sanitize user input to prevent XSS attacks
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Sanitize user data object
export function sanitizeUserData(data: any): any {
  const sanitized: any = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitizeInput(data[key]);
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      sanitized[key] = sanitizeUserData(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate URL format
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Sanitize URL for external links
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Validate the URL
  if (validateUrl(url)) {
    return url;
  }
  
  return '';
}
