// Script to clear authentication data from localStorage
// Run this in browser console if you're stuck in a login loop

if (typeof window !== 'undefined') {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  console.log('Authentication tokens cleared from localStorage');
  console.log('You can now refresh the page and try logging in again');
} else {
  console.log('This script should be run in the browser console');
}
