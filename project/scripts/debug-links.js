// Debug script for Link href issues
// Run this in browser console to check for problematic links

console.log('Checking for Link href issues...');

// Find all Link components with dynamic hrefs
const links = document.querySelectorAll('a[href*="${"]');
console.log('Found links with template literals:', links.length);

links.forEach((link, index) => {
  const href = link.getAttribute('href');
  console.log(`Link ${index + 1}:`, href);
  
  // Check if href contains [object Object]
  if (href && href.includes('[object Object]')) {
    console.error('❌ Found problematic href:', href);
    console.log('Element:', link);
  } else {
    console.log('✅ Link looks good:', href);
  }
});

// Check for any console errors related to hrefs
console.log('Check the console for any "Dynamic href" errors above.');
