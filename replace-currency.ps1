$files = Get-ChildItem -Path src -Filter *.vue -Recurse
$count = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $euroChar = [char]0x20AC
    if ($content.Contains($euroChar)) {
        $newContent = $content.Replace($euroChar, '$')
        [System.IO.File]::WriteAllText($file.FullName, $newContent)
        Write-Host "Updated: $($file.Name)"
        $count++
    }
}
Write-Host "Total files updated: $count"
