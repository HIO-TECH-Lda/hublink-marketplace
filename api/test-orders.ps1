# Test Order Endpoints Script

# Base URL
$baseUrl = "http://localhost:3002"

# Test user credentials
$email = "testuser@example.com"
$password = "TestPass123!"

Write-Host "=== Testing Order Endpoints ===" -ForegroundColor Green

# Step 1: Login to get authentication token
Write-Host "`n1. Logging in to get authentication token..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginData.success) {
        $token = $loginData.data.accessToken
        Write-Host "✓ Login successful! Token obtained." -ForegroundColor Green
    } else {
        Write-Host "✗ Login failed: $($loginData.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Login request failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Headers for authenticated requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Test getting user's orders (should be empty initially)
Write-Host "`n2. Testing GET /api/v1/orders/my-orders (should be empty initially)..." -ForegroundColor Yellow
try {
    $myOrdersResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/orders/my-orders" -Method GET -Headers $headers
    $myOrdersData = $myOrdersResponse.Content | ConvertFrom-Json
    
    if ($myOrdersData.success) {
        Write-Host "✓ Get user orders successful!" -ForegroundColor Green
        Write-Host "  Orders count: $($myOrdersData.data.orders.Count)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Get user orders failed: $($myOrdersData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Get user orders request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Test creating an order with specific items
Write-Host "`n3. Testing POST /api/v1/orders/create..." -ForegroundColor Yellow

# Create order with a mock product ID
$orderBody = @{
    items = @(
        @{
            productId = "507f1f77bcf86cd799439011"
            quantity = 2
        }
    )
    shippingAddress = @{
        firstName = "John"
        lastName = "Doe"
        email = "john.doe@example.com"
        phone = "+258123456789"
        address = "123 Main Street"
        city = "Maputo"
        state = "Maputo"
        country = "Mozambique"
        zipCode = "1100"
        isDefault = $true
    }
    billingAddress = @{
        firstName = "John"
        lastName = "Doe"
        email = "john.doe@example.com"
        phone = "+258123456789"
        address = "123 Main Street"
        city = "Maputo"
        state = "Maputo"
        country = "Mozambique"
        zipCode = "1100"
        isDefault = $true
    }
    payment = @{
        method = "credit_card"
        paymentDetails = @{
            cardLast4 = "1234"
            cardBrand = "Visa"
        }
    }
    notes = "Test order for API testing"
} | ConvertTo-Json -Depth 10

try {
    $createOrderResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/orders/create" -Method POST -Headers $headers -Body $orderBody
    $createOrderData = $createOrderResponse.Content | ConvertFrom-Json
    
    if ($createOrderData.success) {
        Write-Host "✓ Create order successful!" -ForegroundColor Green
        Write-Host "  Order ID: $($createOrderData.data.order.orderId)" -ForegroundColor Cyan
        Write-Host "  Order Number: $($createOrderData.data.order.orderNumber)" -ForegroundColor Cyan
        Write-Host "  Status: $($createOrderData.data.order.status)" -ForegroundColor Cyan
        
        $orderId = $createOrderData.data.order.orderId
        $orderNumber = $createOrderData.data.order.orderNumber
    } else {
        Write-Host "✗ Create order failed: $($createOrderData.message)" -ForegroundColor Red
        if ($createOrderData.errors) {
            Write-Host "  Errors: $($createOrderData.errors | ConvertTo-Json)" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "✗ Create order request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Test getting order statistics
Write-Host "`n4. Testing GET /api/v1/orders/statistics/user..." -ForegroundColor Yellow
try {
    $orderStatsResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/orders/statistics/user" -Method GET -Headers $headers
    $orderStatsData = $orderStatsResponse.Content | ConvertFrom-Json
    
    if ($orderStatsData.success) {
        Write-Host "✓ Get order statistics successful!" -ForegroundColor Green
        Write-Host "  Total Orders: $($orderStatsData.data.totalOrders)" -ForegroundColor Cyan
        Write-Host "  Total Spent: $($orderStatsData.data.totalSpent)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Get order statistics failed: $($orderStatsData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Get order statistics request failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Order Endpoints Testing Complete ===" -ForegroundColor Green
