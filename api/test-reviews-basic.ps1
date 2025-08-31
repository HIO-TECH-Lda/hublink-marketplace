# Basic Review Endpoints Test

$baseUrl = "http://localhost:3002"

Write-Host "=== Testing Review Endpoints ===" -ForegroundColor Green

# Test 1: Get recent reviews (public endpoint)
Write-Host "`n1. Testing GET /api/v1/reviews/recent/reviews..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/recent/reviews" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ Recent reviews endpoint works!" -ForegroundColor Green
    Write-Host "  Status: $($data.success)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Recent reviews endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get review statistics (public endpoint)
Write-Host "`n2. Testing GET /api/v1/reviews/product/test/statistics..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/reviews/product/test/statistics" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ Review statistics endpoint works!" -ForegroundColor Green
    Write-Host "  Status: $($data.success)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Review statistics endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Basic Review Endpoints Test Complete ===" -ForegroundColor Green
