# Multiple Images Management System

## Overview

This document explains how multiple images are managed in the e-commerce platform for both admin and seller product creation/editing forms, as well as how they are displayed in the frontend.

## Current Implementation

### Data Structure

Products have two image-related fields:
- `image: string` - Primary product image (used for cards, listings)
- `images?: string[]` - Array of additional product images (used for galleries, quick view)

```typescript
interface Product {
  id: string;
  name: string;
  image: string;           // Primary image
  images?: string[];       // Additional images array
  // ... other fields
}
```

### Mock Data Structure

In the MarketplaceContext, products have multiple images defined:

```typescript
{
  id: '1',
  name: 'Tomates Orgânicos',
  image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
  images: [
    'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
  ]
}
```

## Image Management Components

### 1. ImageUpload Component (`components/ui/image-upload.tsx`)

A reusable component that provides:
- **Drag & Drop Upload**: Users can drag images directly onto the upload area
- **File Selection**: Click to select multiple images from file system
- **Image Preview**: Grid view of uploaded images with hover effects
- **Image Reordering**: Move images up/down to change order (first image = primary)
- **Image Deletion**: Remove individual images
- **Image Preview Modal**: Full-size preview of selected images
- **Validation**: File type and size validation
- **Responsive Design**: Works on mobile and desktop

#### Features:
- Maximum 5 images per product
- 5MB file size limit per image
- Supports common image formats (JPEG, PNG, WebP, etc.)
- Primary image indicator (first image in array)
- Real-time preview and management

### 2. Integration in Forms

#### Seller Forms
- **New Product** (`app/(seller)/vendedor/produtos/novo/page.tsx`)
- **Edit Product** (`app/(seller)/vendedor/produtos/editar/[id]/page.tsx`)

#### Admin Forms
- **New Product** (`app/(admin)/admin/produtos/novo/page.tsx`)
- **Edit Product** (`app/(admin)/admin/produtos/[id]/editar/page.tsx`)

All forms now use the `ImageUpload` component instead of basic URL inputs.

## Frontend Display

### 1. Product Detail Page (`app/(shop)/produto/[id]/page.tsx`)

- **Main Image Display**: Shows selected image in large format
- **Thumbnail Gallery**: Grid of all product images for selection
- **Image Navigation**: Click thumbnails to switch main image
- **Fallback**: Uses primary `image` field if no `images` array

### 2. Quick View Popup (`components/popups/QuickViewPopup.tsx`)

- **Main Image**: Large display of selected image
- **Thumbnail Strip**: Horizontal strip of all product images
- **Image Selection**: Click thumbnails to change main image
- **Smart Fallback**: Uses `images` array if available, otherwise uses primary `image`

### 3. Product Cards (`components/common/ProductCard.tsx`)

- **Primary Image**: Always shows the main `image` field
- **Hover Effects**: Can be enhanced to show additional images on hover

## Image Processing Flow

### 1. Upload Process
```
User Upload → File Validation → Base64 Conversion → State Update → Form Submission
```

### 2. Storage Strategy
Currently using base64 encoding for demo purposes. In production:
- Upload to cloud storage (AWS S3, Cloudinary, etc.)
- Generate multiple sizes (thumbnail, medium, large)
- Store URLs in database
- Implement CDN for fast delivery

### 3. Primary Image Logic
- First image in the `images` array becomes the primary image
- Used for product cards, search results, and listings
- Can be reordered by moving images in the upload component

## Usage Examples

### Adding Images in Seller Form
1. Navigate to product creation/editing form
2. Drag images onto upload area or click "Selecionar Imagens"
3. Images appear in grid with preview
4. Reorder by clicking move buttons (first = primary)
5. Remove unwanted images with delete button
6. Preview full-size images by clicking eye icon

### Displaying Images in Frontend
```typescript
// Get all product images
const productImages = product.images && product.images.length > 0 
  ? product.images 
  : [product.image];

// Get primary image
const primaryImage = product.images?.[0] || product.image;
```

## Future Enhancements

### 1. Image Optimization
- Automatic image compression
- WebP format conversion
- Lazy loading for better performance
- Progressive image loading

### 2. Advanced Features
- Image cropping and editing
- Bulk image upload
- Image alt text management
- Image metadata (dimensions, file size)
- Image versioning

### 3. Storage Integration
- Cloud storage integration
- Image CDN setup
- Backup and recovery
- Image analytics

## Technical Notes

### File Size Limits
- Maximum 5 images per product
- 5MB per image file
- Supported formats: JPEG, PNG, WebP, GIF

### Browser Compatibility
- Modern browsers with File API support
- Drag & drop requires HTML5 support
- Fallback to file input for older browsers

### Performance Considerations
- Base64 encoding increases payload size
- Consider lazy loading for image galleries
- Implement image caching strategies
- Use appropriate image formats and sizes

## Troubleshooting

### Common Issues
1. **Images not uploading**: Check file size and format
2. **Drag & drop not working**: Ensure browser supports HTML5
3. **Images not displaying**: Verify image URLs are accessible
4. **Performance issues**: Consider image optimization

### Debug Tips
- Check browser console for errors
- Verify image file formats
- Test with different image sizes
- Monitor network requests for upload issues
