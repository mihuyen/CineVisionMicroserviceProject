# Start CineVision Microservices
Write-Host "Starting CineVision Microservices..." -ForegroundColor Green

# Start Eureka Server
Write-Host "Starting Eureka Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd 'C:\Users\Admin\CineVisionMicroserviceProject\eureka-server'; java -Dspring.profiles.active=local -jar target/classes com.kaankaplan.eurekaserver.EurekaServerApplication"

Start-Sleep 10

# Start Movie Service  
Write-Host "Starting Movie Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd 'C:\Users\Admin\CineVisionMicroserviceProject\movieService'; java -jar target/classes com.kaankaplan.movieService.MovieServiceApplication"

Start-Sleep 5

# Start User Service
Write-Host "Starting User Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd 'C:\Users\Admin\CineVisionMicroserviceProject\userService'; java -jar target/classes com.kaankaplan.userService.UserServiceApplication"

Start-Sleep 5

# Start API Gateway
Write-Host "Starting API Gateway..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd 'C:\Users\Admin\CineVisionMicroserviceProject\api-gateway'; java -jar target/classes com.kaankaplan.apigateway.ApiGatewayApplication"

Write-Host "All services are starting up. Please wait for them to fully initialize..." -ForegroundColor Green
Write-Host "Eureka Server: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan