// Test script for login page
// Run this in browser console to test the login functionality

console.log('Testing login page...');

// Clear any existing tokens
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
console.log('Cleared existing tokens');

// Check if we're on the login page
if (window.location.pathname.includes('/entrar')) {
  console.log('On login page - testing form elements...');
  
  // Check if form elements exist
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const submitButton = document.querySelector('button[type="submit"]');
  
  console.log('Form elements found:', {
    emailInput: !!emailInput,
    passwordInput: !!passwordInput,
    submitButton: !!submitButton
  });
  
  // Test demo login
  if (emailInput && passwordInput) {
    console.log('Testing demo login...');
    emailInput.value = 'cliente@exemplo.com';
    passwordInput.value = 'qualquer coisa';
    
    // Trigger change events
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log('Demo credentials filled. You can now click the login button.');
  }
} else {
  console.log('Not on login page. Navigate to /entrar first.');
}
