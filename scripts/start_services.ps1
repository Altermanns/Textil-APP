$project = 'C:\Users\Isaac\Documents\Ingenieria Web\Login-CRUD'

function IsUp($url){
    try{
        Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3 | Out-Null
        return $true
    } catch {
        return $false
    }
}

if (-not (IsUp 'http://127.0.0.1:8000')) {
    Write-Output "Django not running — starting..."
    Start-Process -FilePath "$project\.venv\Scripts\python.exe" -ArgumentList "manage.py runserver 8000" -WorkingDirectory $project
} else {
    Write-Output "Django already running"
}

if (-not (IsUp 'http://localhost:3000')) {
    Write-Output "Next.js not running — starting..."
    Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "$project\frontend"
} else {
    Write-Output "Next.js already running"
}
