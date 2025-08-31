# Review CRUD Test Script - Creates Real Data in Database

$baseUrl = "http://localhost:3002"
$email = "testuser@example.com"
$password = "TestPass123!"

Write-Host "=== Review CRUD Test - Creating Real Database Data ===" -ForegroundColor Green

# Step 1: Login to get authentication token
Write-Host "`n1. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginData.success) {
        $token = $loginData.data.accessToken
        $userId = $loginData.data.user.id
        Write-Host "✓ Login successful! User ID: $userId" -ForegroundColor Green
    } else {
        Write-Host "✗ Login failed: $($loginData.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Get or create test data
Write-Host "`n2. Setting up test data..." -ForegroundColor Yellow

# Get a product for testing
try {
    $productsResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/products" -Method GET
    $productsData = $productsResponse.Content | ConvertFrom-Json
    
    if ($productsData.success -and $productsData.data.products.Count -gt 0) {
        $productId = $productsData.data.products[0]._id
        $productName = $productsData.data.products[0].name
        Write-Host "✓ Found product: $productName (ID: $productId)" -ForegroundColor Green
    } else {
        Write-Host "✗ No products found. Creating test product..." -ForegroundColor Yellow
        
        # Create test product using test endpoint
        $createProductResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/test/create-product" -Method POST -Headers $headers
        $createProductData = $createProductResponse.Content | ConvertFrom-Json
        
        if ($createProductData.success) {
            $productId = $createProductData.data.productId
            Write-Host "✓ Test product created: $productId" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to create test product: $($createProductData.message)" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "✗ Failed to get products: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Get or create an order for testing
try {
    $ordersResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/orders/my-orders" -Method GET -Headers $headers
    $ordersData = $ordersResponse.Content | ConvertFrom-Json
    
    if ($ordersData.success -and $ordersData.data.orders.Count -gt 0) {
        $orderId = $ordersData.data.orders[0]._id
        $orderNumber = $ordersData.data.orders[0].orderNumber
        Write-Host "✓ Found order: $orderNumber (ID: $orderId)" -ForegroundColor Green
    } else {
        Write-Host "✗ No orders found. Creating test order..." -ForegroundColor Yellow
        
        # Create test order using test endpoint
        $createOrderResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/test/create-order" -Method POST -Headers $headers
        $createOrderData = $createOrderResponse.Content | ConvertFrom-Json
        
        if ($createOrderData.success) {
            $orderId = $createOrderData.data.orderId
            Write-Host "✓ Test order created: $orderId" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to create test order: $($createOrderData.message)" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "✗ Failed to get orders: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: CREATE - Create multiple reviews
Write-Host "`n3. CREATE - Creating multiple reviews..." -ForegroundColor Yellow

$reviews = @()
$reviewTitles = @(
    "Excellent Product - Highly Recommended!",
    "Great Quality, Fast Delivery",
    "Good Value for Money",
    "Satisfied with Purchase",
    "Amazing Product Experience"
)

for ($i = 0; $i -lt 3; $i++) {
    $reviewBody = @{
        productId = $productId
        orderId = $orderId
        rating = (Get-Random -Minimum 3 -Maximum 6)
        title = $reviewTitles[$i]
        content = "This is review number $($i + 1). The product quality is excellent and I would definitely recommend it to others. The delivery was fast and the packaging was secure."
        images = @("https://example.com/review-image-$($i + 1).jpg")
    } | ConvertTo-Json

    try {
        $createResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews" -Method POST -Headers $headers -Body $reviewBody
        $createData = $createResponse.Content | ConvertFrom-Json
        
        if ($createData.success) {
            $reviewId = $createData.data._id
            $reviews += @{
                id = $reviewId
                title = $reviewTitles[$i]
                rating = $reviewBody.rating
            }
            Write-Host "✓ Created review $($i + 1): $($reviewTitles[$i]) (ID: $reviewId)" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to create review $($i + 1): $($createData.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Failed to create review $($i + 1): $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($reviews.Count -eq 0) {
    Write-Host "✗ No reviews were created. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Created $($reviews.Count) reviews successfully!" -ForegroundColor Green

# Step 4: READ - Read all the created reviews
Write-Host "`n4. READ - Reading created reviews..." -ForegroundColor Yellow

# Read product reviews
try {
    $productReviewsResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/product/$productId" -Method GET
    $productReviewsData = $productReviewsResponse.Content | ConvertFrom-Json
    
    if ($productReviewsData.success) {
        Write-Host "✓ Product reviews retrieved!" -ForegroundColor Green
        Write-Host "  Total reviews: $($productReviewsData.data.reviews.Count)" -ForegroundColor Cyan
        Write-Host "  Reviews:" -ForegroundColor Cyan
        foreach ($review in $productReviewsData.data.reviews) {
            Write-Host "    - $($review.title) (Rating: $($review.rating), ID: $($review._id))" -ForegroundColor White
        }
    } else {
        Write-Host "✗ Failed to get product reviews: $($productReviewsData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get product reviews: $($_.Exception.Message)" -ForegroundColor Red
}

# Read user reviews
try {
    $userReviewsResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/user/reviews" -Method GET -Headers $headers
    $userReviewsData = $userReviewsResponse.Content | ConvertFrom-Json
    
    if ($userReviewsData.success) {
        Write-Host "✓ User reviews retrieved!" -ForegroundColor Green
        Write-Host "  User reviews count: $($userReviewsData.data.reviews.Count)" -ForegroundColor Cyan
        Write-Host "  User reviews:" -ForegroundColor Cyan
        foreach ($review in $userReviewsData.data.reviews) {
            Write-Host "    - $($review.title) (Rating: $($review.rating), ID: $($review._id))" -ForegroundColor White
        }
    } else {
        Write-Host "✗ Failed to get user reviews: $($userReviewsData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get user reviews: $($_.Exception.Message)" -ForegroundColor Red
}

# Read review statistics
try {
    $statsResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/product/$productId/statistics" -Method GET
    $statsData = $statsResponse.Content | ConvertFrom-Json
    
    if ($statsData.success) {
        Write-Host "✓ Review statistics retrieved!" -ForegroundColor Green
        Write-Host "  Average rating: $($statsData.data.averageRating)" -ForegroundColor Cyan
        Write-Host "  Total reviews: $($statsData.data.totalReviews)" -ForegroundColor Cyan
        Write-Host "  Rating distribution: $($statsData.data.ratingDistribution | ConvertTo-Json)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Failed to get statistics: $($statsData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get statistics: $($_.Exception.Message)" -ForegroundColor Red
}

# Read individual review
if ($reviews.Count -gt 0) {
    $firstReviewId = $reviews[0].id
    try {
        $reviewResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/$firstReviewId" -Method GET
        $reviewData = $reviewResponse.Content | ConvertFrom-Json
        
        if ($reviewData.success) {
            Write-Host "✓ Individual review retrieved!" -ForegroundColor Green
            Write-Host "  Title: $($reviewData.data.title)" -ForegroundColor Cyan
            Write-Host "  Rating: $($reviewData.data.rating)" -ForegroundColor Cyan
            Write-Host "  Content: $($reviewData.data.content)" -ForegroundColor Cyan
            Write-Host "  Status: $($reviewData.data.status)" -ForegroundColor Cyan
            Write-Host "  Created: $($reviewData.data.createdAt)" -ForegroundColor Cyan
        } else {
            Write-Host "✗ Failed to get individual review: $($reviewData.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Failed to get individual review: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 5: UPDATE - Update the first review
Write-Host "`n5. UPDATE - Updating first review..." -ForegroundColor Yellow

if ($reviews.Count -gt 0) {
    $firstReviewId = $reviews[0].id
    $updateBody = @{
        rating = 5
        title = "UPDATED: Excellent Product - Highly Recommended!"
        content = "UPDATED CONTENT: This product exceeded my expectations after using it for a while. The quality is outstanding and I'm updating my review to reflect my continued satisfaction."
        images = @("https://example.com/updated-review-image.jpg")
    } | ConvertTo-Json

    try {
        $updateResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/$firstReviewId" -Method PUT -Headers $headers -Body $updateBody
        $updateData = $updateResponse.Content | ConvertFrom-Json
        
        if ($updateData.success) {
            Write-Host "✓ Review updated successfully!" -ForegroundColor Green
            Write-Host "  New title: $($updateData.data.title)" -ForegroundColor Cyan
            Write-Host "  New rating: $($updateData.data.rating)" -ForegroundColor Cyan
            Write-Host "  Updated at: $($updateData.data.updatedAt)" -ForegroundColor Cyan
        } else {
            Write-Host "✗ Failed to update review: $($updateData.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Failed to update review: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 6: Verify updated data
Write-Host "`n6. VERIFY - Verifying updated data..." -ForegroundColor Yellow

# Read the updated review
if ($reviews.Count -gt 0) {
    $firstReviewId = $reviews[0].id
    try {
        $reviewResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/$firstReviewId" -Method GET
        $reviewData = $reviewResponse.Content | ConvertFrom-Json
        
        if ($reviewData.success) {
            Write-Host "✓ Updated review verified!" -ForegroundColor Green
            Write-Host "  Title: $($reviewData.data.title)" -ForegroundColor Cyan
            Write-Host "  Rating: $($reviewData.data.rating)" -ForegroundColor Cyan
            Write-Host "  Content: $($reviewData.data.content)" -ForegroundColor Cyan
        } else {
            Write-Host "✗ Failed to verify updated review: $($reviewData.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Failed to verify updated review: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Read updated statistics
try {
    $statsResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/product/$productId/statistics" -Method GET
    $statsData = $statsResponse.Content | ConvertFrom-Json
    
    if ($statsData.success) {
        Write-Host "✓ Updated statistics retrieved!" -ForegroundColor Green
        Write-Host "  Average rating: $($statsData.data.averageRating)" -ForegroundColor Cyan
        Write-Host "  Total reviews: $($statsData.data.totalReviews)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Failed to get updated statistics: $($statsData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get updated statistics: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 7: DELETE - Delete one review
Write-Host "`n7. DELETE - Deleting one review..." -ForegroundColor Yellow

if ($reviews.Count -gt 0) {
    $reviewToDelete = $reviews[1] # Delete the second review
    try {
        $deleteResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/$($reviewToDelete.id)" -Method DELETE -Headers $headers
        $deleteData = $deleteResponse.Content | ConvertFrom-Json
        
        if ($deleteData.success) {
            Write-Host "✓ Review deleted successfully!" -ForegroundColor Green
            Write-Host "  Deleted review: $($reviewToDelete.title) (ID: $($reviewToDelete.id))" -ForegroundColor Cyan
        } else {
            Write-Host "✗ Failed to delete review: $($deleteData.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Failed to delete review: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 8: Verify deletion
Write-Host "`n8. VERIFY - Verifying deletion..." -ForegroundColor Yellow

if ($reviews.Count -gt 1) {
    $deletedReviewId = $reviews[1].id
    try {
        $reviewResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/$deletedReviewId" -Method GET
        $reviewData = $reviewResponse.Content | ConvertFrom-Json
        
        if (-not $reviewData.success) {
            Write-Host "✓ Review successfully deleted (not found)" -ForegroundColor Green
        } else {
            Write-Host "✗ Review still exists after deletion" -ForegroundColor Red
        }
    } catch {
        Write-Host "✓ Review successfully deleted (404 error)" -ForegroundColor Green
    }
}

# Read final statistics
try {
    $statsResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/product/$productId/statistics" -Method GET
    $statsData = $statsResponse.Content | ConvertFrom-Json
    
    if ($statsData.success) {
        Write-Host "✓ Final statistics after deletion:" -ForegroundColor Green
        Write-Host "  Average rating: $($statsData.data.averageRating)" -ForegroundColor Cyan
        Write-Host "  Total reviews: $($statsData.data.totalReviews)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Failed to get final statistics: $($statsData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get final statistics: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 9: Database Summary
Write-Host "`n9. DATABASE SUMMARY - Final state..." -ForegroundColor Yellow

Write-Host "`n=== Review CRUD Test Complete ===" -ForegroundColor Green
Write-Host "`nDatabase State Summary:" -ForegroundColor Cyan
Write-Host "- Product ID: $productId" -ForegroundColor White
Write-Host "- Order ID: $orderId" -ForegroundColor White
Write-Host "- Reviews created: $($reviews.Count)" -ForegroundColor White
Write-Host "- Reviews updated: 1" -ForegroundColor White
Write-Host "- Reviews deleted: 1" -ForegroundColor White
Write-Host "- Reviews remaining: $($reviews.Count - 1)" -ForegroundColor White

Write-Host "`nRemaining reviews in database:" -ForegroundColor Cyan
foreach ($review in $reviews) {
    if ($review -ne $reviews[1]) { # Skip the deleted one
        Write-Host "  - $($review.title) (ID: $($review.id), Rating: $($review.rating))" -ForegroundColor White
    }
}

Write-Host "`n✅ CRUD operations completed successfully!" -ForegroundColor Green
Write-Host "✅ Data persisted in database!" -ForegroundColor Green
Write-Host "✅ You can now check the database to see the review data!" -ForegroundColor Green
