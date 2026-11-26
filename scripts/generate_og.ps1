Add-Type -AssemblyName System.Drawing

$logoPath = "public\brand\uc-logo-white.png"
$outPath = "public\brand\og-preview.jpg"

$width = 1200
$height = 630

$bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background Gradient
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(18, 5, 22), [System.Drawing.Color]::FromArgb(35, 12, 42), 45.0)
$g.FillRectangle($brush, $rect)

# Draw central glow ellipse
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(200, 40, 800, 550)
$pBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
$pBrush.CenterColor = [System.Drawing.Color]::FromArgb(120, 192, 132, 252)
$pBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 18, 5, 22))
$g.FillPath($pBrush, $path)

# Draw Logo
$logo = [System.Drawing.Image]::FromFile((Resolve-Path $logoPath))
$logoW = 160
$logoH = [int]($logo.Height * ($logoW / $logo.Width))
$logoX = [int](($width - $logoW) / 2)
$logoY = 120
$g.DrawImage($logo, $logoX, $logoY, $logoW, $logoH)

# Draw Title
$fontTitle = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255))
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('ULTRA CREATOR', $fontTitle, $brushWhite, [float]($width / 2), [float]($logoY + $logoH + 25), $sf)

# Draw Tagline
$fontTag = New-Object System.Drawing.Font('Segoe UI', 18, [System.Drawing.FontStyle]::Bold)
$brushAccent = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(232, 121, 249))
$g.DrawString('PRODUCTION & EDITING STUDIO', $fontTag, $brushAccent, [float]($width / 2), [float]($logoY + $logoH + 85), $sf)

# Draw Subtitle
$fontSub = New-Object System.Drawing.Font('Tahoma', 16, [System.Drawing.FontStyle]::Regular)
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(215, 205, 230))
$g.DrawString('สตูดิโอตัดต่อวิดีโอ & ผลิตคอนเทนต์ครบวงจร • ขับเคลื่อนช่องและแบรนด์ของคุณสู่ยอดวิวระดับล้าน', $fontSub, $brushMuted, [float]($width / 2), [float]($logoY + $logoH + 130), $sf)

# Save high quality JPEG
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92)
$bmp.Save($outPath, $codec, $encParams)

$logo.Dispose()
$bmp.Dispose()
$g.Dispose()
Write-Output "Generated $outPath successfully"
