---
name: ck:media-processing
description: Process media with FFmpeg (video/audio), ImageMagick (images), RMBG (AI background removal). Use for encoding, format conversion, filters, thumbnails, batch processing, HLS/DASH streaming.
license: MIT
argument-hint: "[input-file] [operation]"
---

# Media Processing Skill

Process video, audio, and images using FFmpeg, ImageMagick, and RMBG CLI tools.

## Tool Selection

| Task | Tool | Reason |
|------|------|--------|
| Video encoding/conversion | FFmpeg | Native codec support, streaming |
| Audio extraction/conversion | FFmpeg | Direct stream manipulation |
| Image resize/effects | ImageMagick | Optimized for still images |
| Background removal | RMBG | AI-powered, local processing |
| Batch images | ImageMagick | mogrify for in-place edits |
| Video thumbnails | FFmpeg | Frame extraction built-in |
| GIF creation | FFmpeg/ImageMagick | FFmpeg for video, ImageMagick for images |

## Installation

```bash
# macOS
brew install ffmpeg imagemagick
npm install -g rmbg-cli

# Ubuntu/Debian
sudo apt-get install ffmpeg imagemagick
npm install -g rmbg-cli

# Verify
ffmpeg -version && magick -version && rmbg --version
```

## Essential Commands

```bash
# Video: Convert/re-encode
ffmpeg -i input.mkv -c copy output.mp4
ffmpeg -i input.avi -c:v libx264 -crf 22 -c:a aac output.mp4

# Video: Extract audio
ffmpeg -i video.mp4 -vn -c:a copy audio.m4a

# Image: Convert/resize
magick input.png output.jpg
magick input.jpg -resize 800x600 output.jpg

# Image: Batch resize
mogrify -resize 800x -quality 85 *.jpg

# Background removal
rmbg input.jpg                          # Basic (modnet)
rmbg input.jpg -m briaai -o output.png  # High quality
rmbg input.jpg -m u2netp -o output.png  # Fast
```

## Key Parameters

**FFmpeg:**
- `-c:v libx264` - H.264 codec
- `-crf 22` - Quality (0-51, lower=better)
- `-preset slow` - Speed/compression balance
- `-c:a aac` - Audio codec

**ImageMagick:**
- `800x600` - Fit within (maintains aspect)
- `800x600^` - Fill (may crop)
- `-quality 85` - JPEG quality
- `-strip` - Remove metadata

**RMBG:**
- `-m briaai` - High quality model
- `-m u2netp` - Fast model
- `-r 4096` - Max resolution

## References

Detailed guides in `references/`:
- `ffmpeg-encoding.md` - Codecs, quality, hardware acceleration
- `ffmpeg-streaming.md` - HLS/DASH, live streaming
- `ffmpeg-filters.md` - Filters, complex filtergraphs
- `imagemagick-editing.md` - Effects, transformations
- `imagemagick-batch.md` - Batch processing, parallel ops
- `rmbg-background-removal.md` - AI models, CLI usage
- `common-workflows.md` - Video optimization, responsive images, GIF creation
- `troubleshooting.md` - Error fixes, performance tips
- `format-compatibility.md` - Format support, codec recommendations


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### common workflows

# Common Media Processing Workflows

## Video Optimization

### Optimize for Web
```bash
# H.264 with good compression
ffmpeg -i input.mp4 \
  -c:v libx264 -preset slow -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  output.mp4
```

### Multi-Pass Encoding
```bash
# Pass 1 (analysis)
ffmpeg -y -i input.mkv -c:v libx264 -b:v 2600k -pass 1 -an -f null /dev/null

# Pass 2 (encoding)
ffmpeg -i input.mkv -c:v libx264 -b:v 2600k -pass 2 -c:a aac output.mp4
```

### Hardware-Accelerated Encoding
```bash
# NVIDIA NVENC
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc -preset fast -crf 22 output.mp4

# Intel QuickSync
ffmpeg -hwaccel qsv -c:v h264_qsv -i input.mp4 -c:v h264_qsv output.mp4
```

### Extract Video Segment
```bash
# From 1:30 to 3:00 (re-encode for precision)
ffmpeg -i input.mp4 -ss 00:01:30 -to 00:03:00 \
  -c:v libx264 -c:a aac output.mp4
```

## Image Workflows

### Create Responsive Images
```bash
# Generate multiple sizes
for size in 320 640 1024 1920; do
  magick input.jpg -resize ${size}x -quality 85 "output-${size}w.jpg"
done
```

### Batch Image Optimization
```bash
# Convert PNG to optimized JPEG
mogrify -path ./optimized -format jpg -quality 85 -strip *.png
```

### Complex Image Pipeline
```bash
# Resize, crop, border, adjust
magick input.jpg \
  -resize 1000x1000^ \
  -gravity center \
  -crop 1000x1000+0+0 +repage \
  -bordercolor black -border 5x5 \
  -brightness-contrast 5x10 \
  -quality 90 \
  output.jpg
```

## GIF Creation

### Video to GIF
```bash
# High quality GIF with palette
ffmpeg -i input.mp4 -vf "fps=15,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif
```

### Animated GIF from Images
```bash
# Create with delay
magick -delay 100 -loop 0 frame*.png animated.gif

# Optimize size
magick animated.gif -fuzz 5% -layers Optimize optimized.gif
```

## Background Removal Workflows

### Batch Background Removal
```bash
# Process all images in directory
for img in *.jpg; do
  rmbg "$img" -m modnet -o "${img%.jpg}-no-bg.png"
done
```

### Product Photography
```bash
# 1. Remove background
rmbg product.jpg -m u2net-cloth -o product-no-bg.png

# 2. Resize to multiple sizes
magick product-no-bg.png -resize 800x800 product-800.png
magick product-no-bg.png -resize 400x400 product-400.png

# 3. Add white background if needed
magick product-no-bg.png -background white -flatten product-white-bg.jpg
```

## Media Analysis

### Inspect Video Properties
```bash
# Detailed JSON output
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4

# Get resolution
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height \
  -of csv=s=x:p=0 input.mp4
```

### Image Information
```bash
# Basic info
identify image.jpg

# Detailed format
identify -verbose image.jpg

# Custom format
identify -format "%f: %wx%h %b\n" image.jpg
```


### ffmpeg encoding

# FFmpeg Video & Audio Encoding

Complete guide to codec selection, quality optimization, and hardware acceleration.

## Video Codecs

### H.264 (libx264)
Most widely supported codec, excellent compression/quality balance.

**Best for:** Universal compatibility, streaming, web video

**Quality range:** CRF 17-28 (lower = better)

```bash
# High quality
ffmpeg -i input.mkv -c:v libx264 -preset slow -crf 18 -c:a copy output.mp4

# Standard quality (recommended)
ffmpeg -i input.mkv -c:v libx264 -preset medium -crf 23 -c:a copy output.mp4

# Fast encoding
ffmpeg -i input.mkv -c:v libx264 -preset fast -crf 23 -c:a copy output.mp4
```

### H.265/HEVC (libx265)
25-50% better compression than H.264, slower encoding.

**Best for:** 4K video, file size reduction, archival

```bash
# High quality 4K
ffmpeg -i input.mkv -c:v libx265 -preset medium -crf 24 -c:a copy output.mp4

# Balanced quality
ffmpeg -i input.mkv -c:v libx265 -preset fast -crf 26 -c:a copy output.mp4
```

### VP9 (libvpx-vp9)
Royalty-free, WebM format, good for YouTube and open-source projects.

**Best for:** YouTube, Chrome/Firefox, open platforms

```bash
# Quality-based (recommended)
ffmpeg -i input.mkv -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm

# Two-pass for better quality
ffmpeg -i input.mkv -c:v libvpx-vp9 -b:v 2M -pass 1 -an -f null /dev/null
ffmpeg -i input.mkv -c:v libvpx-vp9 -b:v 2M -pass 2 -c:a libopus output.webm
```

### AV1 (libaom-av1, libsvtav1)
Next-generation codec, best compression, very slow encoding.

**Best for:** Future-proofing, maximum compression, low bandwidth

```bash
# Using libaom (slow, highest quality)
ffmpeg -i input.mkv -c:v libaom-av1 -crf 30 -b:v 0 -strict experimental output.mp4

# Using SVT-AV1 (faster)
ffmpeg -i input.mkv -c:v libsvtav1 -crf 30 -preset 5 output.mp4
```

## Audio Codecs

### AAC (Industry Standard)
Best quality for streaming, universal support.

```bash
# High quality
ffmpeg -i input.mp4 -c:a aac -b:a 192k output.mp4

# Standard quality
ffmpeg -i input.mp4 -c:a aac -b:a 128k output.mp4

# Low bitrate
ffmpeg -i input.mp4 -c:a aac -b:a 96k output.mp4
```

### MP3 (libmp3lame)
Universal compatibility, good quality.

```bash
# Variable bitrate (best quality)
ffmpeg -i input.wav -c:a libmp3lame -q:a 0 output.mp3

# Constant bitrate
ffmpeg -i input.wav -c:a libmp3lame -b:a 192k output.mp3
```

### Opus (libopus)
Best quality at low bitrates, ideal for voice and streaming.

```bash
# Voice (mono)
ffmpeg -i input.mp4 -c:a libopus -b:a 32k -ac 1 output.webm

# Music (stereo)
ffmpeg -i input.mp4 -c:a libopus -b:a 128k output.webm
```

### FLAC (Lossless)
No quality loss, archival quality, larger files.

```bash
# Lossless audio
ffmpeg -i input.wav -c:a flac output.flac

# Extract audio losslessly
ffmpeg -i video.mp4 -c:a flac audio.flac
```

## Quality Optimization

### CRF (Constant Rate Factor)
Best for quality-focused encoding. Single-pass, adjusts bitrate for complexity.

**CRF Scale:**
- 0 = Lossless (huge files)
- 17-18 = Visually lossless
- 20-23 = High quality (recommended)
- 24-28 = Medium quality
- 30+ = Low quality
- 51 = Worst quality

```bash
# Visually lossless
ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset slow output.mp4

# High quality (recommended)
ffmpeg -i input.mp4 -c:v libx264 -crf 22 -preset medium output.mp4

# Balanced quality/size
ffmpeg -i input.mp4 -c:v libx264 -crf 25 -preset fast output.mp4
```

### Bitrate-Based Encoding
Target specific file size or quality. Two-pass recommended.

```bash
# Calculate target bitrate
# bitrate = (target_size_MB * 8192) / duration_seconds - audio_bitrate

# Two-pass encoding (2600k video, 128k audio)
ffmpeg -y -i input.mkv -c:v libx264 -b:v 2600k -pass 1 -an -f null /dev/null
ffmpeg -i input.mkv -c:v libx264 -b:v 2600k -pass 2 -c:a aac -b:a 128k output.mp4
```

### Presets (Speed vs Compression)
Trade-off between encoding speed and file size.

**Available presets:**
- `ultrafast` - Fastest, largest files
- `superfast`
- `veryfast`
- `faster`
- `fast`
- `medium` - Default balance
- `slow` - Better compression
- `slower`
- `veryslow` - Best compression
- `placebo` - Not recommended (minimal gains)

```bash
# Fast encoding (real-time)
ffmpeg -i input.mp4 -c:v libx264 -preset ultrafast -crf 23 output.mp4

# Balanced
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 22 output.mp4

# Best compression (slow)
ffmpeg -i input.mp4 -c:v libx264 -preset veryslow -crf 20 output.mp4
```

## Hardware Acceleration

### NVIDIA NVENC
5-10x faster encoding, slightly larger files than software encoding.

**Requirements:** NVIDIA GPU (GTX 10xx or newer)

```bash
# H.264 with NVENC
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc -preset fast -crf 22 output.mp4

# H.265 with NVENC
ffmpeg -hwaccel cuda -i input.mp4 -c:v hevc_nvenc -preset slow -crf 24 output.mp4

# Quality levels (instead of CRF)
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc -preset slow -rc vbr -cq 22 output.mp4
```

**NVENC Presets:**
- `default` - Balanced
- `slow` - Better quality
- `medium`
- `fast`
- `hp` - High performance
- `hq` - High quality
- `bd` - Bluray disk
- `ll` - Low latency
- `llhq` - Low latency high quality
- `llhp` - Low latency high performance

### Intel QuickSync (QSV)
Fast hardware encoding on Intel CPUs with integrated graphics.

**Requirements:** Intel CPU with Quick Sync Video support

```bash
# H.264 with QSV
ffmpeg -hwaccel qsv -c:v h264_qsv -i input.mp4 \
  -c:v h264_qsv -preset fast -global_quality 22 output.mp4

# H.265 with QSV
ffmpeg -hwaccel qsv -c:v hevc_qsv -i input.mp4 \
  -c:v hevc_qsv -preset medium -global_quality 24 output.mp4

# Quality levels
ffmpeg -hwaccel qsv -i input.mp4 -c:v h264_qsv -global_quality 20 output.mp4
```

### AMD VCE/VCN
Hardware encoding on AMD GPUs.

**Requirements:** AMD GPU with VCE/VCN support

```bash
# H.264 with AMF
ffmpeg -hwaccel auto -i input.mp4 \
  -c:v h264_amf -quality balanced -rc cqp -qp 22 output.mp4

# H.265 with AMF
ffmpeg -hwaccel auto -i input.mp4 \
  -c:v hevc_amf -quality quality -rc cqp -qp 24 output.mp4
```

### Apple VideoToolbox (macOS)
Hardware encoding on macOS devices.

```bash
# H.264 with VideoToolbox
ffmpeg -i input.mp4 -c:v h264_videotoolbox -b:v 2M output.mp4

# H.265 with VideoToolbox
ffmpeg -i input.mp4 -c:v hevc_videotoolbox -b:v 1.5M output.mp4
```

## Performance Tuning

### Multi-Threading
FFmpeg automatically uses multiple cores. Override if needed:

```bash
# Limit threads
ffmpeg -threads 4 -i input.mp4 -c:v libx264 output.mp4

# Auto (default)
ffmpeg -threads 0 -i input.mp4 -c:v libx264 output.mp4
```

### Tune Options
Optimize encoder for specific content types:

```bash
# Film content
ffmpeg -i input.mp4 -c:v libx264 -tune film -crf 22 output.mp4

# Animation
ffmpeg -i input.mp4 -c:v libx264 -tune animation -crf 22 output.mp4

# Grain (film with noise)
ffmpeg -i input.mp4 -c:v libx264 -tune grain -crf 22 output.mp4

# Low latency streaming
ffmpeg -i input.mp4 -c:v libx264 -tune zerolatency -crf 22 output.mp4

# Screen content (sharp edges)
ffmpeg -i input.mp4 -c:v libx264 -tune stillimage -crf 22 output.mp4
```

## Codec Selection Guide

### Use Cases

| Use Case | Codec | Settings |
|----------|-------|----------|
| Web video | H.264 | CRF 23, preset medium |
| 4K streaming | H.265 | CRF 24, preset fast |
| YouTube upload | VP9 or H.264 | CRF 23 |
| Archive | H.265 or H.264 | CRF 18, preset slow |
| Low bandwidth | AV1 or H.265 | CRF 30 |
| Fast encoding | H.264 NVENC | preset fast |
| Maximum compatibility | H.264 | profile main, level 4.0 |

### Platform Compatibility

| Platform | Recommended | Supported |
|----------|------------|-----------|
| Web browsers | H.264 | H.264, VP9, AV1 |
| Mobile devices | H.264 | H.264, H.265 |
| Smart TVs | H.264 | H.264, H.265 |
| YouTube | VP9, H.264 | All |
| Social media | H.264 | H.264 |

## Best Practices

1. **Use CRF for most tasks** - Better than bitrate for variable content
2. **Start with CRF 23** - Good balance, adjust based on results
3. **Use slow preset** - For archival and final delivery
4. **Use fast preset** - For previews and testing
5. **Hardware acceleration** - When speed is critical
6. **Two-pass encoding** - When file size is fixed
7. **Match source frame rate** - Don't increase FPS
8. **Don't upscale resolution** - Keep original or downscale
9. **Test on short clips** - Verify settings before full encode
10. **Keep source files** - Original quality for re-encoding

## Troubleshooting

### Poor Quality Output
```bash
# Lower CRF value
ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset slow output.mp4

# Use slower preset
ffmpeg -i input.mp4 -c:v libx264 -crf 22 -preset veryslow output.mp4

# Increase bitrate (two-pass)
ffmpeg -y -i input.mp4 -c:v libx264 -b:v 5M -pass 1 -an -f null /dev/null
ffmpeg -i input.mp4 -c:v libx264 -b:v 5M -pass 2 -c:a aac output.mp4
```

### Slow Encoding
```bash
# Use faster preset
ffmpeg -i input.mp4 -c:v libx264 -preset ultrafast output.mp4

# Use hardware acceleration
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc output.mp4

# Reduce resolution
ffmpeg -i input.mp4 -vf scale=1280:-1 -c:v libx264 output.mp4
```

### Large File Size
```bash
# Increase CRF
ffmpeg -i input.mp4 -c:v libx264 -crf 26 output.mp4

# Use better codec
ffmpeg -i input.mp4 -c:v libx265 -crf 26 output.mp4

# Two-pass with target bitrate
ffmpeg -y -i input.mp4 -c:v libx264 -b:v 1M -pass 1 -an -f null /dev/null
ffmpeg -i input.mp4 -c:v libx264 -b:v 1M -pass 2 -c:a aac output.mp4
```


### ffmpeg filters

# FFmpeg Filters & Effects

Complete guide to video and audio filters, complex filtergraphs, and effect chains.

## Filter Basics

### Filter Syntax
Filters are applied with `-vf` (video) or `-af` (audio).

```bash
# Single filter
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4

# Chain filters with comma
ffmpeg -i input.mp4 -vf "scale=1280:720,hqdn3d" output.mp4

# Complex filtergraph with -filter_complex
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[0:v][1:v]overlay=10:10" \
  output.mp4
```

## Video Filters

### Scale (Resize)
Change video dimensions.

```bash
# Specific dimensions
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4

# Maintain aspect ratio (auto height)
ffmpeg -i input.mp4 -vf scale=1280:-1 output.mp4

# Maintain aspect ratio (auto width)
ffmpeg -i input.mp4 -vf scale=-1:720 output.mp4

# Scale to half
ffmpeg -i input.mp4 -vf scale=iw/2:ih/2 output.mp4

# Scale with algorithm
ffmpeg -i input.mp4 -vf scale=1280:-1:flags=lanczos output.mp4
```

**Scaling algorithms:**
- `bilinear` - Fast, default
- `bicubic` - Better quality
- `lanczos` - Best quality, slower

### Crop
Extract portion of video.

```bash
# Crop width:height:x:y
ffmpeg -i input.mp4 -vf crop=1280:720:0:0 output.mp4

# Crop from center
ffmpeg -i input.mp4 -vf crop=1280:720:(iw-1280)/2:(ih-720)/2 output.mp4

# Auto-detect black borders
ffmpeg -i input.mp4 -vf cropdetect -f null -

# Apply detected crop
ffmpeg -i input.mp4 -vf crop=1920:800:0:140 output.mp4
```

### Rotate & Flip
Change video orientation.

```bash
# Rotate 90° clockwise
ffmpeg -i input.mp4 -vf transpose=1 output.mp4

# Rotate 90° counter-clockwise
ffmpeg -i input.mp4 -vf transpose=2 output.mp4

# Rotate 180°
ffmpeg -i input.mp4 -vf transpose=1,transpose=1 output.mp4

# Flip horizontal
ffmpeg -i input.mp4 -vf hflip output.mp4

# Flip vertical
ffmpeg -i input.mp4 -vf vflip output.mp4

# Rotate arbitrary angle
ffmpeg -i input.mp4 -vf rotate=45*PI/180 output.mp4
```

### Overlay (Watermark)
Composite images over video.

```bash
# Top-left corner
ffmpeg -i video.mp4 -i logo.png \
  -filter_complex overlay=10:10 output.mp4

# Top-right corner
ffmpeg -i video.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:10" output.mp4

# Bottom-right corner
ffmpeg -i video.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:H-h-10" output.mp4

# Center
ffmpeg -i video.mp4 -i logo.png \
  -filter_complex "overlay=(W-w)/2:(H-h)/2" output.mp4

# With transparency
ffmpeg -i video.mp4 -i logo.png \
  -filter_complex "[1:v]format=rgba,colorchannelmixer=aa=0.5[logo];[0:v][logo]overlay=10:10" \
  output.mp4
```

### Denoise
Reduce video noise.

```bash
# High-quality denoise (hqdn3d)
ffmpeg -i input.mp4 -vf hqdn3d output.mp4

# Stronger denoise
ffmpeg -i input.mp4 -vf hqdn3d=4:3:6:4.5 output.mp4

# Temporal denoise (nlmeans - slow but best)
ffmpeg -i input.mp4 -vf nlmeans output.mp4

# Fast denoise
ffmpeg -i input.mp4 -vf dctdnoiz output.mp4
```

### Deinterlace
Remove interlacing artifacts.

```bash
# YADIF (fast, good quality)
ffmpeg -i input.mp4 -vf yadif output.mp4

# YADIF with frame doubling
ffmpeg -i input.mp4 -vf yadif=1 output.mp4

# Bwdif (better quality)
ffmpeg -i input.mp4 -vf bwdif output.mp4
```

### Speed & Slow Motion
Change playback speed.

```bash
# 2x speed (video + audio)
ffmpeg -i input.mp4 -vf setpts=0.5*PTS -af atempo=2.0 output.mp4

# 0.5x speed (slow motion)
ffmpeg -i input.mp4 -vf setpts=2.0*PTS -af atempo=0.5 output.mp4

# 4x speed (chain atempo)
ffmpeg -i input.mp4 -vf setpts=0.25*PTS -af atempo=2.0,atempo=2.0 output.mp4
```

### Pad (Add Borders)
Add borders or letterbox.

```bash
# Add black borders to make 16:9
ffmpeg -i input.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2" output.mp4

# Add colored borders
ffmpeg -i input.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=white" output.mp4

# Letterbox for Instagram (1:1)
ffmpeg -i input.mp4 -vf "scale=1080:-1,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=black" output.mp4
```

### Sharpen & Blur
Adjust image sharpness.

```bash
# Sharpen (unsharp mask)
ffmpeg -i input.mp4 -vf unsharp=5:5:1.0 output.mp4

# Stronger sharpen
ffmpeg -i input.mp4 -vf unsharp=7:7:2.5 output.mp4

# Gaussian blur
ffmpeg -i input.mp4 -vf gblur=sigma=8 output.mp4

# Box blur
ffmpeg -i input.mp4 -vf boxblur=5:1 output.mp4
```

### Color Adjustments
Modify colors and exposure.

```bash
# Brightness (+/- 1.0)
ffmpeg -i input.mp4 -vf eq=brightness=0.1 output.mp4

# Contrast (+/- 2.0)
ffmpeg -i input.mp4 -vf eq=contrast=1.2 output.mp4

# Saturation (0-3)
ffmpeg -i input.mp4 -vf eq=saturation=1.5 output.mp4

# Gamma (0.1-10)
ffmpeg -i input.mp4 -vf eq=gamma=1.2 output.mp4

# Combined adjustments
ffmpeg -i input.mp4 -vf eq=brightness=0.05:contrast=1.1:saturation=1.2 output.mp4

# Curves (color grading)
ffmpeg -i input.mp4 -vf curves=vintage output.mp4

# Hue shift
ffmpeg -i input.mp4 -vf hue=h=90 output.mp4
```

### Grayscale & Effects
Convert to monochrome or apply effects.

```bash
# Grayscale
ffmpeg -i input.mp4 -vf hue=s=0 output.mp4

# Sepia tone
ffmpeg -i input.mp4 -vf colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131 output.mp4

# Negative
ffmpeg -i input.mp4 -vf negate output.mp4

# Edge detection
ffmpeg -i input.mp4 -vf edgedetect output.mp4

# Vignette
ffmpeg -i input.mp4 -vf vignette output.mp4
```

### Fade In/Out
Smooth transitions.

```bash
# Fade in from black (2 seconds)
ffmpeg -i input.mp4 -vf fade=in:0:60 output.mp4

# Fade out to black (last 2 seconds)
ffmpeg -i input.mp4 -vf fade=out:st=28:d=2 output.mp4

# Both fade in and out
ffmpeg -i input.mp4 -vf "fade=in:0:30,fade=out:st=28:d=2" output.mp4
```

### Stabilization
Reduce camera shake.

```bash
# Two-pass stabilization
# Pass 1: detect motion
ffmpeg -i input.mp4 -vf vidstabdetect=shakiness=10:accuracy=15 -f null -

# Pass 2: stabilize
ffmpeg -i input.mp4 -vf vidstabtransform=smoothing=30:input="transforms.trf" output.mp4
```

### Text Overlay
Add text to video.

```bash
# Simple text
ffmpeg -i input.mp4 -vf "drawtext=text='Hello World':fontsize=24:x=10:y=10" output.mp4

# With styling
ffmpeg -i input.mp4 -vf "drawtext=text='Title':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=50:box=1:boxcolor=black@0.5:boxborderw=5" output.mp4

# Timestamp
ffmpeg -i input.mp4 -vf "drawtext=text='%{pts\:hms}':fontsize=20:x=10:y=10:fontcolor=white" output.mp4
```

## Audio Filters

### Volume
Adjust audio level.

```bash
# Increase by 10dB
ffmpeg -i input.mp4 -af volume=10dB output.mp4

# Decrease to 50%
ffmpeg -i input.mp4 -af volume=0.5 output.mp4

# Double volume
ffmpeg -i input.mp4 -af volume=2.0 output.mp4
```

### Normalize
Balance audio levels.

```bash
# Loudness normalization (EBU R128)
ffmpeg -i input.mp4 -af loudnorm output.mp4

# With specific target
ffmpeg -i input.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11 output.mp4

# Two-pass normalization (better quality)
# Pass 1: analyze
ffmpeg -i input.mp4 -af loudnorm=print_format=json -f null -

# Pass 2: normalize with measured values
ffmpeg -i input.mp4 -af loudnorm=measured_I=-23:measured_LRA=7:measured_TP=-2:measured_thresh=-33 output.mp4
```

### Equalizer
Adjust frequency bands.

```bash
# Bass boost
ffmpeg -i input.mp4 -af equalizer=f=100:width_type=h:width=200:g=10 output.mp4

# Treble boost
ffmpeg -i input.mp4 -af equalizer=f=10000:width_type=h:width=2000:g=5 output.mp4

# Multiple bands
ffmpeg -i input.mp4 -af "equalizer=f=100:g=5,equalizer=f=1000:g=-3" output.mp4
```

### Compressor
Dynamic range compression.

```bash
# Basic compression
ffmpeg -i input.mp4 -af acompressor output.mp4

# Custom settings
ffmpeg -i input.mp4 -af acompressor=threshold=-20dB:ratio=4:attack=200:release=1000 output.mp4
```

### Noise Reduction
Remove background noise.

```bash
# High-pass filter (remove low frequency noise)
ffmpeg -i input.mp4 -af highpass=f=200 output.mp4

# Low-pass filter (remove high frequency noise)
ffmpeg -i input.mp4 -af lowpass=f=3000 output.mp4

# Band-pass filter
ffmpeg -i input.mp4 -af "highpass=f=200,lowpass=f=3000" output.mp4
```

### Fade Audio
Smooth audio transitions.

```bash
# Fade in (2 seconds)
ffmpeg -i input.mp4 -af afade=t=in:st=0:d=2 output.mp4

# Fade out (last 3 seconds)
ffmpeg -i input.mp4 -af afade=t=out:st=27:d=3 output.mp4

# Both
ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=2,afade=t=out:st=27:d=3" output.mp4
```

### Audio Mixing
Combine multiple audio tracks.

```bash
# Mix two audio files
ffmpeg -i audio1.mp3 -i audio2.mp3 \
  -filter_complex amix=inputs=2:duration=longest output.mp3

# Mix with volume adjustment
ffmpeg -i audio1.mp3 -i audio2.mp3 \
  -filter_complex "[0:a]volume=0.8[a1];[1:a]volume=0.5[a2];[a1][a2]amix=inputs=2" \
  output.mp3
```

## Complex Filtergraphs

### Multiple Outputs
Create multiple versions simultaneously.

```bash
# Generate 3 resolutions at once
ffmpeg -i input.mp4 \
  -filter_complex "[0:v]split=3[v1][v2][v3]; \
    [v1]scale=1920:1080[out1]; \
    [v2]scale=1280:720[out2]; \
    [v3]scale=640:360[out3]" \
  -map "[out1]" -c:v libx264 -crf 22 output_1080p.mp4 \
  -map "[out2]" -c:v libx264 -crf 23 output_720p.mp4 \
  -map "[out3]" -c:v libx264 -crf 24 output_360p.mp4 \
  -map 0:a -c:a copy
```

### Picture-in-Picture
Overlay small video on main video.

```bash
ffmpeg -i main.mp4 -i small.mp4 \
  -filter_complex "[1:v]scale=320:180[pip]; \
    [0:v][pip]overlay=W-w-10:H-h-10" \
  output.mp4
```

### Side-by-Side Comparison
Compare two videos.

```bash
# Horizontal
ffmpeg -i left.mp4 -i right.mp4 \
  -filter_complex "[0:v][1:v]hstack=inputs=2" \
  output.mp4

# Vertical
ffmpeg -i top.mp4 -i bottom.mp4 \
  -filter_complex "[0:v][1:v]vstack=inputs=2" \
  output.mp4
```

### Crossfade Transition
Smooth transition between videos.

```bash
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=2:offset=8" \
  output.mp4
```

**Transition types:** fade, wipeleft, wiperight, wipeup, wipedown, slideleft, slideright, slideup, slidedown, circlecrop, rectcrop, distance, fadeblack, fadewhite, radial, smoothleft, smoothright, smoothup, smoothdown

### Color Correction Pipeline
Professional color grading.

```bash
ffmpeg -i input.mp4 \
  -filter_complex "[0:v]eq=contrast=1.1:brightness=0.05:saturation=1.2[v1]; \
    [v1]curves=vintage[v2]; \
    [v2]vignette[v3]; \
    [v3]unsharp=5:5:1.0[out]" \
  -map "[out]" -c:v libx264 -crf 18 output.mp4
```

## Filter Performance

### GPU Acceleration
Use hardware filters when available.

```bash
# NVIDIA CUDA scale
ffmpeg -hwaccel cuda -i input.mp4 \
  -vf scale_cuda=1280:720 \
  -c:v h264_nvenc output.mp4

# Multiple GPU filters
ffmpeg -hwaccel cuda -i input.mp4 \
  -vf "scale_cuda=1280:720,hwdownload,format=nv12" \
  -c:v h264_nvenc output.mp4
```

### Optimize Filter Order
More efficient filter chains.

```bash
# Bad: scale after complex operations
ffmpeg -i input.mp4 -vf "hqdn3d,unsharp=5:5:1.0,scale=1280:720" output.mp4

# Good: scale first (fewer pixels to process)
ffmpeg -i input.mp4 -vf "scale=1280:720,hqdn3d,unsharp=5:5:1.0" output.mp4
```

## Common Filter Recipes

### YouTube Optimized
```bash
ffmpeg -i input.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k \
  output.mp4
```

### Instagram Portrait
```bash
ffmpeg -i input.mp4 \
  -vf "scale=1080:1350:force_original_aspect_ratio=decrease,pad=1080:1350:(ow-iw)/2:(oh-ih)/2:color=white" \
  -c:v libx264 -preset fast -crf 23 -c:a aac \
  output.mp4
```

### Vintage Film Look
```bash
ffmpeg -i input.mp4 \
  -vf "curves=vintage,vignette=angle=PI/4,eq=saturation=0.8,noise=alls=10:allf=t" \
  -c:v libx264 -crf 20 output.mp4
```

### Clean & Enhance
```bash
ffmpeg -i input.mp4 \
  -vf "hqdn3d=4:3:6:4.5,unsharp=5:5:1.0,eq=contrast=1.05:saturation=1.1" \
  -c:v libx264 -crf 20 output.mp4
```


### ffmpeg streaming

# FFmpeg Streaming & Live Video

Complete guide to HLS/DASH streaming, live streaming platforms, and adaptive bitrate encoding.

## HLS (HTTP Live Streaming)

### Basic HLS Stream
Generate playlist for on-demand streaming.

```bash
# Simple HLS with default settings
ffmpeg -i input.mp4 \
  -c:v libx264 -c:a aac \
  -f hls -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "segment_%03d.ts" \
  playlist.m3u8
```

**Key parameters:**
- `-hls_time` - Segment duration (seconds, default 2)
- `-hls_playlist_type` - `vod` (on-demand) or `event` (live)
- `-hls_segment_filename` - Naming pattern for segments

### Optimized HLS
Better quality and compatibility.

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -g 48 -sc_threshold 0 \
  -c:a aac -b:a 128k \
  -f hls -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "segment_%03d.ts" \
  playlist.m3u8
```

**Parameters explained:**
- `-g 48` - Keyframe every 48 frames (2s @ 24fps)
- `-sc_threshold 0` - Disable scene detection (consistent segments)

### Multi-Bitrate HLS (Adaptive)
Create multiple quality levels for adaptive streaming.

```bash
ffmpeg -i input.mp4 \
  -map 0:v -map 0:a -map 0:v -map 0:a -map 0:v -map 0:a \
  -c:v libx264 -crf 22 -c:a aac -b:a 128k \
  -b:v:0 800k  -s:v:0 640x360   -maxrate:v:0 856k  -bufsize:v:0 1200k \
  -b:v:1 1400k -s:v:1 842x480   -maxrate:v:1 1498k -bufsize:v:1 2100k \
  -b:v:2 2800k -s:v:2 1280x720  -maxrate:v:2 2996k -bufsize:v:2 4200k \
  -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" \
  -master_pl_name master.m3u8 \
  -f hls -hls_time 6 -hls_list_size 0 \
  -hls_segment_filename "stream_%v/segment_%03d.ts" \
  stream_%v/playlist.m3u8
```

**Creates:**
- `master.m3u8` - Master playlist (entry point)
- `stream_0/playlist.m3u8` - 360p stream
- `stream_1/playlist.m3u8` - 480p stream
- `stream_2/playlist.m3u8` - 720p stream

### HLS with Encryption
Protect content with AES-128 encryption.

```bash
# Generate encryption key
openssl rand 16 > enc.key
echo "enc.key" > enc.keyinfo
echo "enc.key" >> enc.keyinfo
openssl rand -hex 16 >> enc.keyinfo

# Encode with encryption
ffmpeg -i input.mp4 \
  -c:v libx264 -c:a aac \
  -f hls -hls_time 6 \
  -hls_key_info_file enc.keyinfo \
  -hls_segment_filename "segment_%03d.ts" \
  playlist.m3u8
```

## DASH (Dynamic Adaptive Streaming)

### Basic DASH
MPEG-DASH format for adaptive streaming.

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -c:a aac \
  -f dash -seg_duration 6 \
  -use_template 1 -use_timeline 1 \
  manifest.mpd
```

### Multi-Bitrate DASH
Multiple quality levels.

```bash
ffmpeg -i input.mp4 \
  -map 0:v -map 0:a -map 0:v -map 0:a \
  -c:v libx264 -c:a aac \
  -b:v:0 800k  -s:v:0 640x360 \
  -b:v:1 1400k -s:v:1 1280x720 \
  -b:a:0 128k -b:a:1 128k \
  -f dash -seg_duration 6 \
  -use_template 1 -use_timeline 1 \
  manifest.mpd
```

## RTMP Live Streaming

### Stream to Twitch
```bash
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k \
  -pix_fmt yuv420p -g 50 -c:a aac -b:a 128k -ar 44100 \
  -f flv rtmp://live.twitch.tv/app/STREAM_KEY
```

### Stream to YouTube
```bash
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -maxrate 2500k -bufsize 5000k \
  -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k \
  -f flv rtmp://a.rtmp.youtube.com/live2/STREAM_KEY
```

### Stream to Facebook
```bash
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -maxrate 4000k -bufsize 8000k \
  -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k \
  -f flv rtmps://live-api-s.facebook.com:443/rtmp/STREAM_KEY
```

### Custom RTMP Server
```bash
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -maxrate 2500k -bufsize 5000k \
  -pix_fmt yuv420p -g 50 \
  -c:a aac -b:a 128k -ar 44100 \
  -f flv rtmp://your-server.com/live/stream-key
```

## Screen Capture + Stream

### Linux (X11)
```bash
ffmpeg -f x11grab -s 1920x1080 -framerate 30 -i :0.0 \
  -f pulse -ac 2 -i default \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ar 44100 \
  -f flv rtmp://live.twitch.tv/app/STREAM_KEY
```

### macOS (AVFoundation)
```bash
# List devices
ffmpeg -f avfoundation -list_devices true -i ""

# Capture and stream
ffmpeg -f avfoundation -framerate 30 -i "1:0" \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -f flv rtmp://live.twitch.tv/app/STREAM_KEY
```

### Windows (DirectShow)
```bash
ffmpeg -f dshow -i video="screen-capture-recorder":audio="Stereo Mix" \
  -c:v libx264 -preset ultrafast -tune zerolatency \
  -maxrate 750k -bufsize 3000k \
  -f flv rtmp://live.twitch.tv/app/STREAM_KEY
```

## Thumbnail Generation

### Single Thumbnail
Extract frame at specific time.

```bash
# At 5 seconds
ffmpeg -ss 00:00:05 -i input.mp4 -vframes 1 -vf scale=320:-1 thumb.jpg

# At 10% duration
ffmpeg -ss $(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 input.mp4 | \
  awk '{print $1*0.1}') -i input.mp4 -vframes 1 thumb.jpg
```

### Multiple Thumbnails
Generate thumbnails at intervals.

```bash
# One per minute
ffmpeg -i input.mp4 -vf fps=1/60,scale=320:-1 thumb_%03d.jpg

# One per 10 seconds
ffmpeg -i input.mp4 -vf fps=1/10,scale=320:-1 thumb_%03d.jpg

# First 10 frames
ffmpeg -i input.mp4 -vframes 10 -vf scale=320:-1 thumb_%02d.jpg
```

### Thumbnail Sprite Sheet
Create single image with multiple thumbnails.

```bash
# Generate frames
ffmpeg -i input.mp4 -vf fps=1/10,scale=160:90 frames/thumb_%03d.jpg

# Combine into sprite (requires ImageMagick)
montage frames/thumb_*.jpg -tile 5x -geometry +0+0 sprite.jpg
```

## Preview Generation

### Video Preview (Trailer)
Extract multiple short clips.

```bash
# Extract 3 segments
ffmpeg -i input.mp4 \
  -ss 00:00:30 -t 00:00:10 -c copy segment1.mp4
ffmpeg -i input.mp4 \
  -ss 00:05:00 -t 00:00:10 -c copy segment2.mp4
ffmpeg -i input.mp4 \
  -ss 00:10:00 -t 00:00:10 -c copy segment3.mp4

# Concatenate segments
echo "file 'segment1.mp4'" > concat.txt
echo "file 'segment2.mp4'" >> concat.txt
echo "file 'segment3.mp4'" >> concat.txt
ffmpeg -f concat -safe 0 -i concat.txt -c copy preview.mp4
```

### Fast Preview (Low Quality)
Quick preview for review.

```bash
ffmpeg -i input.mp4 \
  -vf scale=640:-1 \
  -c:v libx264 -preset ultrafast -crf 28 \
  -c:a aac -b:a 64k \
  preview.mp4
```

## Streaming Parameters

### Important RTMP Parameters

**Real-time reading:**
- `-re` - Read input at native frame rate

**Low latency:**
- `-tune zerolatency` - Optimize for minimal latency
- `-preset ultrafast` or `veryfast` - Fast encoding

**Keyframes:**
- `-g 50` - Keyframe interval (GOP size)
- Recommended: 2 seconds (fps * 2)

**Rate control:**
- `-maxrate` - Maximum bitrate (e.g., 3000k)
- `-bufsize` - Buffer size (typically 2x maxrate)

**Compatibility:**
- `-pix_fmt yuv420p` - Compatible pixel format

### Bitrate Recommendations

**1080p 60fps:**
- 4500-6000 kbps video
- 160 kbps audio

**1080p 30fps:**
- 3000-4500 kbps video
- 128 kbps audio

**720p 60fps:**
- 2500-4000 kbps video
- 128 kbps audio

**720p 30fps:**
- 1500-2500 kbps video
- 128 kbps audio

**480p:**
- 500-1000 kbps video
- 128 kbps audio

## UDP/RTP Streaming

### UDP Stream
Simple network streaming.

```bash
# Sender
ffmpeg -re -i input.mp4 -c copy -f mpegts udp://192.168.1.100:1234

# Receiver
ffplay udp://192.168.1.100:1234
```

### RTP Stream
Real-Time Protocol for low latency.

```bash
# Audio only
ffmpeg -re -i audio.mp3 -c:a libopus -f rtp rtp://192.168.1.100:5004

# Video + audio
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset ultrafast \
  -c:a aac -f rtp rtp://192.168.1.100:5004
```

### Multicast Stream
Stream to multiple receivers.

```bash
# Sender (multicast address)
ffmpeg -re -i input.mp4 -c copy -f mpegts udp://239.255.0.1:1234

# Receiver
ffplay udp://239.255.0.1:1234
```

## Advanced Streaming

### Hardware-Accelerated Streaming
Use GPU for faster encoding.

```bash
# NVIDIA NVENC
ffmpeg -re -i input.mp4 \
  -c:v h264_nvenc -preset fast -maxrate 3000k -bufsize 6000k \
  -c:a aac -b:a 128k \
  -f flv rtmp://live.twitch.tv/app/STREAM_KEY

# Intel QSV
ffmpeg -re -hwaccel qsv -i input.mp4 \
  -c:v h264_qsv -preset fast -maxrate 3000k -bufsize 6000k \
  -c:a aac -b:a 128k \
  -f flv rtmp://live.twitch.tv/app/STREAM_KEY
```

### Stream with Overlay
Add graphics during stream.

```bash
ffmpeg -re -i input.mp4 -i logo.png \
  -filter_complex "[0:v][1:v]overlay=10:10" \
  -c:v libx264 -preset veryfast -maxrate 3000k \
  -c:a copy \
  -f flv rtmp://live.twitch.tv/app/STREAM_KEY
```

### Loop Stream
Continuously loop video for 24/7 stream.

```bash
ffmpeg -stream_loop -1 -re -i input.mp4 \
  -c:v libx264 -preset veryfast -maxrate 2500k \
  -c:a aac -b:a 128k \
  -f flv rtmp://live.twitch.tv/app/STREAM_KEY
```

## Troubleshooting

### Buffering Issues
```bash
# Reduce buffer size
ffmpeg -re -i input.mp4 -maxrate 2000k -bufsize 2000k -c:v libx264 -f flv rtmp://...

# Use faster preset
ffmpeg -re -i input.mp4 -preset ultrafast -c:v libx264 -f flv rtmp://...
```

### Audio/Video Desync
```bash
# Force constant frame rate
ffmpeg -re -i input.mp4 -r 30 -c:v libx264 -f flv rtmp://...

# Use -vsync 1
ffmpeg -re -i input.mp4 -vsync 1 -c:v libx264 -f flv rtmp://...
```

### Connection Drops
```bash
# Increase timeout
ffmpeg -timeout 5000000 -re -i input.mp4 -c:v libx264 -f flv rtmp://...

# Reconnect on failure (use wrapper script)
while true; do
  ffmpeg -re -i input.mp4 -c:v libx264 -f flv rtmp://...
  sleep 5
done
```


### format compatibility

# Format Compatibility & Conversion Guide

Complete guide to media format support, codec recommendations, and conversion best practices.

## Image Format Support

### ImageMagick Formats

**Raster Formats (Full Support):**
- JPEG (.jpg, .jpeg) - Lossy, universal
- PNG (.png) - Lossless, transparency
- WebP (.webp) - Modern, lossy/lossless
- GIF (.gif) - Animation, limited colors
- TIFF (.tif, .tiff) - Professional, lossless
- BMP (.bmp) - Uncompressed, legacy
- ICO (.ico) - Icons, multi-size

**Raw Formats (Read Support):**
- CR2, NEF, ARW, DNG (Canon, Nikon, Sony, Adobe RAW)
- Requires dcraw or ufraw-batch

**Vector Formats (Limited):**
- SVG (.svg) - Read only, converts to raster
- PDF (.pdf) - Read/write, may have policy restrictions

**Other Formats:**
- HEIC (.heic) - Apple format, requires libheif
- AVIF (.avif) - Next-gen, requires libavif
- PSD (.psd) - Photoshop, basic support

### FFmpeg Image Support

**Input Formats:**
- JPEG, PNG, BMP, TIFF, WebP, GIF
- Image sequences (frame_%04d.png)

**Output Formats:**
- JPEG, PNG, BMP, TIFF
- Video from images

## Video Format Support

### Container Formats

**Universal Containers:**
- MP4 (.mp4) - Most compatible, streaming
- MKV (.mkv) - Feature-rich, flexible
- WebM (.webm) - Web-optimized, open
- AVI (.avi) - Legacy, broad support
- MOV (.mov) - Apple, professional

**Streaming Containers:**
- TS (.ts) - Transport stream, HLS segments
- M3U8 (.m3u8) - HLS playlist
- MPD (.mpd) - DASH manifest
- FLV (.flv) - Flash (legacy)

**Professional Formats:**
- ProRes (.mov) - Apple professional
- DNxHD/DNxHR (.mxf, .mov) - Avid professional
- MXF (.mxf) - Broadcast

### Video Codecs

**Modern Codecs:**
- H.264/AVC (libx264) - Universal, excellent balance
- H.265/HEVC (libx265) - Better compression, 4K
- VP9 (libvpx-vp9) - Open, YouTube
- AV1 (libaom-av1, libsvtav1) - Next-gen, best compression

**Legacy Codecs:**
- MPEG-4 (mpeg4) - Older devices
- MPEG-2 (mpeg2video) - DVD, broadcast
- VP8 (libvpx) - WebM predecessor

**Professional Codecs:**
- ProRes (prores) - Apple post-production
- DNxHD (dnxhd) - Avid editing
- Uncompressed (rawvideo) - Maximum quality

### Audio Codecs

**Modern Codecs:**
- AAC (aac) - Universal, streaming
- Opus (libopus) - Best low-bitrate
- MP3 (libmp3lame) - Universal compatibility

**Lossless Codecs:**
- FLAC (flac) - Open, archival
- ALAC (alac) - Apple lossless
- WAV (pcm_s16le) - Uncompressed

**Other Codecs:**
- Vorbis (libvorbis) - Open, WebM
- AC-3 (ac3) - Dolby Digital, surround
- DTS (dts) - Cinema surround

## Format Recommendations

### Use Case Matrix

| Use Case | Image Format | Video Container | Video Codec | Audio Codec |
|----------|--------------|-----------------|-------------|-------------|
| Web general | JPEG 85% | MP4 | H.264 | AAC 128k |
| Web transparency | PNG | - | - | - |
| Web modern | WebP | WebM | VP9 | Opus |
| Social media | JPEG 85% | MP4 | H.264 | AAC 128k |
| 4K streaming | - | MP4 | H.265 | AAC 192k |
| Archive | PNG/TIFF | MKV | H.265 CRF 18 | FLAC |
| Email | JPEG 75% | - | - | - |
| Print | TIFF/PNG | - | - | - |
| YouTube | - | MP4/WebM | H.264/VP9 | AAC/Opus |
| Live stream | - | FLV | H.264 | AAC |
| Editing | - | MOV/MXF | ProRes/DNxHD | PCM |

### Platform Compatibility

**Web Browsers (2025):**
- Images: JPEG, PNG, WebP, GIF, SVG
- Video: MP4 (H.264), WebM (VP9), MP4 (AV1)
- Audio: AAC, MP3, Opus, Vorbis

**Mobile Devices:**
- iOS: JPEG, PNG, HEIC, MP4 (H.264/H.265), AAC
- Android: JPEG, PNG, WebP, MP4 (H.264/H.265), AAC

**Smart TVs:**
- Most: MP4 (H.264), AAC
- Modern: MP4 (H.265), AC-3

**Social Media:**
- All platforms: JPEG, MP4 (H.264), AAC

## Quality vs Size Trade-offs

### Image Quality Comparison

**JPEG Quality Levels:**
- 95-100: ~5-10 MB (large image), minimal artifacts
- 85-94: ~1-3 MB, imperceptible loss
- 75-84: ~500 KB-1 MB, slight artifacts
- 60-74: ~200-500 KB, visible artifacts
- Below 60: <200 KB, poor quality

**Format Comparison (Same quality):**
- WebP: 25-35% smaller than JPEG
- HEIC: 40-50% smaller than JPEG
- AVIF: 50-60% smaller than JPEG
- PNG: 2-5x larger than JPEG (lossless)

### Video Quality Comparison

**H.264 CRF Values:**
- CRF 18: Visually lossless, ~8-15 Mbps (1080p)
- CRF 23: High quality, ~4-8 Mbps (1080p)
- CRF 28: Medium quality, ~2-4 Mbps (1080p)

**Codec Comparison (Same quality):**
- H.265: 40-50% smaller than H.264
- VP9: 30-40% smaller than H.264
- AV1: 50-60% smaller than H.264

### Audio Quality Comparison

**AAC Bitrates:**
- 320 kbps: Transparent, archival
- 192 kbps: High quality, music
- 128 kbps: Good quality, streaming
- 96 kbps: Acceptable, low bandwidth
- 64 kbps: Poor, voice only

**Codec Efficiency (Same quality):**
- Opus: Best at low bitrates (<128k)
- AAC: Best overall balance
- MP3: Less efficient but universal

## Conversion Best Practices

### Image Conversions

**PNG to JPEG:**
```bash
# Standard conversion
magick input.png -quality 85 -strip output.jpg

# With transparency handling
magick input.png -background white -flatten -quality 85 output.jpg
```

**JPEG to WebP:**
```bash
# FFmpeg
ffmpeg -i input.jpg -quality 80 output.webp

# ImageMagick
magick input.jpg -quality 80 output.webp
```

**RAW to JPEG:**
```bash
# Requires dcraw
magick input.CR2 -quality 90 output.jpg
```

**HEIC to JPEG:**
```bash
# Requires libheif
magick input.heic -quality 85 output.jpg
```

### Video Conversions

**MKV to MP4:**
```bash
# Copy streams (fast)
ffmpeg -i input.mkv -c copy output.mp4

# Re-encode if needed
ffmpeg -i input.mkv -c:v libx264 -crf 23 -c:a aac output.mp4
```

**AVI to MP4:**
```bash
# Modern codecs
ffmpeg -i input.avi -c:v libx264 -crf 23 -c:a aac output.mp4
```

**MOV to MP4:**
```bash
# Copy if H.264 already
ffmpeg -i input.mov -c copy output.mp4

# Convert ProRes to H.264
ffmpeg -i input.mov -c:v libx264 -crf 18 -c:a aac output.mp4
```

**Any to WebM:**
```bash
# VP9 encoding
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

### Audio Conversions

**Extract Audio from Video:**
```bash
# Keep original codec
ffmpeg -i video.mp4 -vn -c:a copy audio.m4a

# Convert to MP3
ffmpeg -i video.mp4 -vn -q:a 0 audio.mp3

# Convert to FLAC (lossless)
ffmpeg -i video.mp4 -vn -c:a flac audio.flac
```

**Audio Format Conversion:**
```bash
# WAV to MP3
ffmpeg -i input.wav -c:a libmp3lame -b:a 192k output.mp3

# MP3 to AAC
ffmpeg -i input.mp3 -c:a aac -b:a 192k output.m4a

# Any to Opus
ffmpeg -i input.wav -c:a libopus -b:a 128k output.opus
```

## Codec Selection Guide

### Choose H.264 When:
- Maximum compatibility needed
- Targeting older devices
- Streaming to unknown devices
- Social media upload
- Fast encoding required

### Choose H.265 When:
- 4K video encoding
- Storage space limited
- Modern device targets
- Archival quality needed
- Bandwidth constrained

### Choose VP9 When:
- YouTube upload
- Open-source requirement
- Chrome/Firefox primary
- Royalty-free needed

### Choose AV1 When:
- Future-proofing content
- Maximum compression needed
- Encoding time not critical
- Modern platform targets

## Format Migration Strategies

### Archive to Web

```bash
# High-res archive -> Web-optimized
for img in archive/*.tif; do
  base=$(basename "$img" .tif)
  magick "$img" -resize 2000x2000\> -quality 85 -strip "web/${base}.jpg"
  magick "$img" -resize 2000x2000\> -quality 85 "web/${base}.webp"
done
```

### Legacy to Modern

```bash
# Convert old formats to modern codecs
for video in legacy/*.avi; do
  base=$(basename "$video" .avi)
  ffmpeg -i "$video" \
    -c:v libx264 -crf 23 -preset slow \
    -c:a aac -b:a 128k \
    "modern/${base}.mp4"
done
```

### Multi-Format Publishing

```bash
# Create multiple formats for compatibility
input="source.mp4"

# Modern browsers
ffmpeg -i "$input" -c:v libx264 -crf 23 -c:a aac output.mp4
ffmpeg -i "$input" -c:v libvpx-vp9 -crf 30 -c:a libopus output.webm

# Images
ffmpeg -ss 5 -i "$input" -vframes 1 poster.jpg
magick poster.jpg -quality 80 poster.webp
```

## Troubleshooting

### Unsupported Format

```bash
# Check FFmpeg formats
ffmpeg -formats

# Check ImageMagick formats
magick identify -list format

# Install missing codec support
sudo apt-get install libx264-dev libx265-dev libvpx-dev
```

### Compatibility Issues

```bash
# Force compatible encoding
ffmpeg -i input.mp4 \
  -c:v libx264 -profile:v high -level 4.0 \
  -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  output.mp4
```

### Quality Loss

```bash
# Avoid multiple conversions
# Bad: source -> edit -> web -> social
# Good: source -> final (single conversion)

# Use lossless intermediate
ffmpeg -i source.mp4 -c:v ffv1 intermediate.mkv
# Edit intermediate
ffmpeg -i intermediate.mkv -c:v libx264 final.mp4
```


### imagemagick batch

# ImageMagick Batch Processing

Complete guide to batch operations, mogrify command, parallel processing, and automation.

## Mogrify Command

### Basic Mogrify
Modify files in-place (overwrites originals).

```bash
# Resize all JPEGs
mogrify -resize 800x600 *.jpg

# Convert format (creates new files)
mogrify -format png *.jpg

# Apply effect to all images
mogrify -quality 85 -strip *.jpg
```

**Warning:** mogrify modifies files in-place. Always backup originals or use `-path` to output to different directory.

### Output to Different Directory
Preserve originals.

```bash
# Create output directory first
mkdir output

# Process to output directory
mogrify -path ./output -resize 800x600 *.jpg

# With format conversion
mogrify -path ./optimized -format webp -quality 80 *.png
```

## Common Batch Operations

### Resize All Images

```bash
# Resize to width 800
mogrify -resize 800x *.jpg

# Resize to height 600
mogrify -resize x600 *.jpg

# Fit within 800×600
mogrify -resize 800x600 *.jpg

# Resize to exact dimensions
mogrify -resize 800x600! *.jpg

# Only shrink, never enlarge
mogrify -resize 800x600\> *.jpg
```

### Format Conversion

```bash
# PNG to JPEG
mogrify -path ./jpg -format jpg -quality 85 *.png

# JPEG to WebP
mogrify -path ./webp -format webp -quality 80 *.jpg

# Any format to PNG
mogrify -path ./png -format png *.{jpg,gif,bmp}
```

### Optimize Images

```bash
# Strip metadata from all JPEGs
mogrify -strip *.jpg

# Optimize JPEGs for web
mogrify -quality 85 -strip -interlace Plane *.jpg

# Compress PNGs
mogrify -quality 95 *.png

# Combined optimization
mogrify -quality 85 -strip -interlace Plane -sampling-factor 4:2:0 *.jpg
```

### Apply Effects

```bash
# Add watermark to all images
mogrify -gravity southeast -draw "image over 10,10 0,0 'watermark.png'" *.jpg

# Convert all to grayscale
mogrify -colorspace Gray *.jpg

# Apply sepia tone
mogrify -sepia-tone 80% *.jpg

# Sharpen all images
mogrify -sharpen 0x1 *.jpg
```

### Thumbnail Generation

```bash
# Create square thumbnails
mogrify -path ./thumbnails -resize 200x200^ -gravity center -extent 200x200 *.jpg

# Create thumbnails with max dimension
mogrify -path ./thumbs -thumbnail 300x300 *.jpg

# Thumbnails with quality control
mogrify -path ./thumbs -thumbnail 200x200 -quality 80 -strip *.jpg
```

## Shell Loops

### Basic For Loop
More control than mogrify.

```bash
# Resize with custom naming
for img in *.jpg; do
  magick "$img" -resize 800x600 "resized_$img"
done

# Process to subdirectory
mkdir processed
for img in *.jpg; do
  magick "$img" -resize 1920x1080 "processed/$img"
done
```

### Multiple Operations

```bash
# Complex processing pipeline
for img in *.jpg; do
  magick "$img" \
    -resize 1920x1080^ \
    -gravity center \
    -crop 1920x1080+0+0 +repage \
    -unsharp 0x1 \
    -quality 85 -strip \
    "processed_$img"
done
```

### Format Conversion with Rename

```bash
# Convert PNG to JPEG with new names
for img in *.png; do
  magick "$img" -quality 90 "${img%.png}.jpg"
done

# Add prefix during conversion
for img in *.jpg; do
  magick "$img" -resize 800x "web_${img}"
done
```

### Conditional Processing

```bash
# Only process large images
for img in *.jpg; do
  width=$(identify -format "%w" "$img")
  if [ $width -gt 2000 ]; then
    magick "$img" -resize 2000x "resized_$img"
  fi
done

# Skip existing output files
for img in *.jpg; do
  output="output_$img"
  if [ ! -f "$output" ]; then
    magick "$img" -resize 800x "$output"
  fi
done
```

## Parallel Processing

### GNU Parallel
Process multiple images simultaneously.

```bash
# Install GNU Parallel
# Ubuntu/Debian: sudo apt-get install parallel
# macOS: brew install parallel

# Basic parallel resize
parallel magick {} -resize 800x600 resized_{} ::: *.jpg

# Parallel with function
resize_image() {
  magick "$1" -resize 1920x1080 -quality 85 "processed_$1"
}
export -f resize_image
parallel resize_image ::: *.jpg

# Limit concurrent jobs
parallel -j 4 magick {} -resize 800x {} ::: *.jpg

# Progress indicator
parallel --progress magick {} -resize 800x {} ::: *.jpg
```

### Xargs Parallel

```bash
# Using xargs for parallel processing
ls *.jpg | xargs -I {} -P 4 magick {} -resize 800x processed_{}

# With find
find . -name "*.jpg" -print0 | \
  xargs -0 -I {} -P 4 magick {} -resize 800x {}
```

## Advanced Batch Patterns

### Recursive Processing

```bash
# Process all JPEGs in subdirectories
find . -name "*.jpg" -exec magick {} -resize 800x {} \;

# With output directory structure
find . -name "*.jpg" -type f | while read img; do
  outdir="output/$(dirname "$img")"
  mkdir -p "$outdir"
  magick "$img" -resize 800x "$outdir/$(basename "$img")"
done
```

### Batch with Different Sizes

```bash
# Generate multiple sizes
for size in 320 640 1024 1920; do
  mkdir -p "output/${size}w"
  for img in *.jpg; do
    magick "$img" -resize ${size}x -quality 85 "output/${size}w/$img"
  done
done

# Parallel version
for size in 320 640 1024 1920; do
  mkdir -p "output/${size}w"
  parallel magick {} -resize ${size}x -quality 85 "output/${size}w/{}" ::: *.jpg
done
```

### Responsive Image Set

```bash
# Create responsive image set with srcset
mkdir -p responsive
for img in *.jpg; do
  base="${img%.jpg}"
  for width in 320 640 1024 1920; do
    magick "$img" -resize ${width}x -quality 85 \
      "responsive/${base}-${width}w.jpg"
  done
done
```

### Watermark Batch

```bash
# Add watermark to all images
for img in *.jpg; do
  magick "$img" watermark.png \
    -gravity southeast -geometry +10+10 \
    -composite "watermarked_$img"
done

# Different watermark positions for portrait vs landscape
for img in *.jpg; do
  width=$(identify -format "%w" "$img")
  height=$(identify -format "%h" "$img")

  if [ $width -gt $height ]; then
    # Landscape
    magick "$img" watermark.png -gravity southeast -composite "marked_$img"
  else
    # Portrait
    magick "$img" watermark.png -gravity south -composite "marked_$img"
  fi
done
```

## Error Handling

### Check Before Processing

```bash
# Verify image before processing
for img in *.jpg; do
  if identify "$img" > /dev/null 2>&1; then
    magick "$img" -resize 800x "processed_$img"
  else
    echo "Skipping corrupt image: $img"
  fi
done
```

### Log Processing

```bash
# Log successful and failed operations
log_file="batch_process.log"
error_log="errors.log"

for img in *.jpg; do
  if magick "$img" -resize 800x "output/$img" 2>> "$error_log"; then
    echo "$(date): Processed $img" >> "$log_file"
  else
    echo "$(date): Failed $img" >> "$error_log"
  fi
done
```

### Dry Run Mode

```bash
# Test without modifying files
dry_run=true

for img in *.jpg; do
  cmd="magick $img -resize 800x processed_$img"
  if [ "$dry_run" = true ]; then
    echo "Would run: $cmd"
  else
    eval $cmd
  fi
done
```

## Optimization Workflows

### Web Publishing Pipeline

```bash
# Complete web optimization workflow
mkdir -p web/{original,optimized,thumbnails}

# Copy originals
cp *.jpg web/original/

# Create optimized versions
mogrify -path web/optimized \
  -resize 1920x1080\> \
  -quality 85 \
  -strip \
  -interlace Plane \
  web/original/*.jpg

# Create thumbnails
mogrify -path web/thumbnails \
  -thumbnail 300x300 \
  -quality 80 \
  -strip \
  web/original/*.jpg
```

### Archive to Web Conversion

```bash
# Convert high-res archives to web formats
for img in archives/*.jpg; do
  base=$(basename "$img" .jpg)

  # Full size web version
  magick "$img" -resize 2048x2048\> -quality 90 -strip "web/${base}.jpg"

  # Thumbnail
  magick "$img" -thumbnail 400x400 -quality 85 "web/${base}_thumb.jpg"

  # WebP version
  magick "$img" -resize 2048x2048\> -quality 85 "web/${base}.webp"
done
```

### Print to Web Workflow

```bash
# Convert print-ready images to web
for img in print/*.tif; do
  base=$(basename "$img" .tif)

  # Convert colorspace and optimize
  magick "$img" \
    -colorspace sRGB \
    -resize 2000x2000\> \
    -quality 90 \
    -strip \
    -interlace Plane \
    "web/${base}.jpg"
done
```

## Batch Reporting

### Generate Report

```bash
# Create processing report
report="batch_report.txt"
echo "Batch Processing Report - $(date)" > "$report"
echo "================================" >> "$report"

total=0
success=0
failed=0

for img in *.jpg; do
  ((total++))
  if magick "$img" -resize 800x "output/$img" 2>/dev/null; then
    ((success++))
    echo "✓ $img" >> "$report"
  else
    ((failed++))
    echo "✗ $img" >> "$report"
  fi
done

echo "" >> "$report"
echo "Total: $total, Success: $success, Failed: $failed" >> "$report"
```

### Image Inventory

```bash
# Create inventory of images
inventory="image_inventory.csv"
echo "Filename,Width,Height,Format,Size,ColorSpace" > "$inventory"

for img in *.{jpg,png,gif}; do
  [ -f "$img" ] || continue
  info=$(identify -format "%f,%w,%h,%m,%b,%[colorspace]" "$img")
  echo "$info" >> "$inventory"
done
```

## Performance Tips

### Optimize Loop Performance

```bash
# Bad: Launch mogrify for each file
for img in *.jpg; do
  mogrify -resize 800x "$img"
done

# Good: Process all files in one mogrify call
mogrify -resize 800x *.jpg

# Best: Use parallel processing for complex operations
parallel magick {} -resize 800x -quality 85 processed_{} ::: *.jpg
```

### Memory Management

```bash
# Limit memory for batch processing
for img in *.jpg; do
  magick -limit memory 2GB -limit map 4GB \
    "$img" -resize 50% "output/$img"
done
```

### Progress Tracking

```bash
# Show progress for long batch operations
total=$(ls *.jpg | wc -l)
current=0

for img in *.jpg; do
  ((current++))
  echo "Processing $current/$total: $img"
  magick "$img" -resize 800x "output/$img"
done
```

## Automation Scripts

### Complete Bash Script

```bash
#!/bin/bash

# Configuration
INPUT_DIR="./input"
OUTPUT_DIR="./output"
QUALITY=85
MAX_WIDTH=1920
THUMBNAIL_SIZE=300

# Create output directories
mkdir -p "$OUTPUT_DIR"/{full,thumbnails}

# Process images
echo "Processing images..."
for img in "$INPUT_DIR"/*.{jpg,jpeg,png}; do
  [ -f "$img" ] || continue

  filename=$(basename "$img")
  base="${filename%.*}"

  # Full size
  magick "$img" \
    -resize ${MAX_WIDTH}x\> \
    -quality $QUALITY \
    -strip \
    "$OUTPUT_DIR/full/${base}.jpg"

  # Thumbnail
  magick "$img" \
    -thumbnail ${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE} \
    -quality 80 \
    -strip \
    "$OUTPUT_DIR/thumbnails/${base}_thumb.jpg"

  echo "✓ $filename"
done

echo "Done!"
```

### Python Batch Script

```python
#!/usr/bin/env python3
import os
import subprocess
from pathlib import Path

INPUT_DIR = Path("./input")
OUTPUT_DIR = Path("./output")
SIZES = [320, 640, 1024, 1920]

# Create output directories
for size in SIZES:
    (OUTPUT_DIR / f"{size}w").mkdir(parents=True, exist_ok=True)

# Process images
for img in INPUT_DIR.glob("*.jpg"):
    for size in SIZES:
        output = OUTPUT_DIR / f"{size}w" / img.name
        subprocess.run([
            "magick", str(img),
            "-resize", f"{size}x",
            "-quality", "85",
            "-strip",
            str(output)
        ])
        print(f"✓ {img.name} -> {size}w")
```

## Common Batch Recipes

### Social Media Sizes

```bash
# Generate social media image sizes
for img in *.jpg; do
  base="${img%.jpg}"

  # Instagram square (1080×1080)
  magick "$img" -resize 1080x1080^ -gravity center -extent 1080x1080 "${base}_ig_square.jpg"

  # Instagram portrait (1080×1350)
  magick "$img" -resize 1080x1350^ -gravity center -extent 1080x1350 "${base}_ig_portrait.jpg"

  # Facebook post (1200×630)
  magick "$img" -resize 1200x630^ -gravity center -extent 1200x630 "${base}_fb_post.jpg"

  # Twitter post (1200×675)
  magick "$img" -resize 1200x675^ -gravity center -extent 1200x675 "${base}_tw_post.jpg"
done
```

### Email Newsletter Images

```bash
# Optimize images for email
mogrify -path ./email \
  -resize 600x\> \
  -quality 75 \
  -strip \
  -interlace Plane \
  *.jpg
```

### Backup and Archive

```bash
# Create web versions and keep originals
mkdir -p {originals,web}

# Move originals
mv *.jpg originals/

# Create optimized copies
for img in originals/*.jpg; do
  base=$(basename "$img")
  magick "$img" -resize 2000x2000\> -quality 85 -strip "web/$base"
done
```


### imagemagick editing

# ImageMagick Image Editing

Complete guide to format conversion, resizing, effects, transformations, and composition.

## Format Conversion

### Basic Conversion
Convert between image formats.

```bash
# PNG to JPEG
magick input.png output.jpg

# JPEG to WebP
magick input.jpg output.webp

# Multiple outputs simultaneously
magick input.png output.jpg output.webp output.gif

# Convert with quality setting
magick input.png -quality 85 output.jpg
```

### Quality Settings

**JPEG Quality (0-100):**
- 95-100: Archival, minimal compression
- 85-94: High quality, web publishing
- 75-84: Medium quality, web optimized
- 60-74: Lower quality, smaller files
- Below 60: Visible artifacts

```bash
# High quality
magick input.png -quality 95 output.jpg

# Web optimized (recommended)
magick input.png -quality 85 -strip output.jpg

# Smaller file size
magick input.png -quality 75 -sampling-factor 4:2:0 -strip output.jpg
```

**PNG Quality (0-9 = compression level):**
```bash
# Maximum compression (slower)
magick input.jpg -quality 95 output.png

# Faster compression
magick input.jpg -quality 75 output.png
```

**WebP Quality:**
```bash
# Lossy with quality
magick input.jpg -quality 80 output.webp

# Lossless
magick input.png -define webp:lossless=true output.webp
```

### Progressive & Optimization

```bash
# Progressive JPEG (better web loading)
magick input.png -quality 85 -interlace Plane output.jpg

# Strip metadata (reduce file size)
magick input.jpg -strip output.jpg

# Combined optimization
magick input.png -quality 85 -interlace Plane -strip output.jpg
```

## Resizing Operations

### Basic Resize
Maintain aspect ratio.

```bash
# Fit within 800×600
magick input.jpg -resize 800x600 output.jpg

# Resize to specific width (auto height)
magick input.jpg -resize 800x output.jpg

# Resize to specific height (auto width)
magick input.jpg -resize x600 output.jpg

# Scale by percentage
magick input.jpg -resize 50% output.jpg
```

### Advanced Resize

```bash
# Resize only if larger (shrink only)
magick input.jpg -resize 800x600\> output.jpg

# Resize only if smaller (enlarge only)
magick input.jpg -resize 800x600\< output.jpg

# Force exact dimensions (ignore aspect ratio)
magick input.jpg -resize 800x600! output.jpg

# Fill dimensions (may crop)
magick input.jpg -resize 800x600^ output.jpg

# Minimum dimensions
magick input.jpg -resize 800x600^ output.jpg
```

### Resize Algorithms

```bash
# High quality (Lanczos)
magick input.jpg -filter Lanczos -resize 50% output.jpg

# Fast resize (Box)
magick input.jpg -filter Box -resize 50% output.jpg

# Mitchel filter (good balance)
magick input.jpg -filter Mitchell -resize 50% output.jpg
```

**Filter comparison:**
- `Lanczos` - Highest quality, slower
- `Mitchell` - Good quality, fast
- `Catrom` - Sharp, good for downscaling
- `Box` - Fastest, acceptable quality
- `Cubic` - Smooth results

## Cropping

### Basic Crop
Extract region from image.

```bash
# Crop width×height+x+y
magick input.jpg -crop 400x400+100+100 output.jpg

# Remove virtual canvas after crop
magick input.jpg -crop 400x400+100+100 +repage output.jpg

# Crop from center
magick input.jpg -gravity center -crop 400x400+0+0 output.jpg

# Crop to aspect ratio
magick input.jpg -gravity center -crop 16:9 +repage output.jpg
```

### Smart Crop
Content-aware cropping.

```bash
# Trim transparent/same-color borders
magick input.png -trim +repage output.png

# Trim with fuzz tolerance
magick input.jpg -fuzz 10% -trim +repage output.jpg
```

### Thumbnail Generation
Create square thumbnails from any aspect ratio.

```bash
# Resize and crop to square
magick input.jpg -resize 200x200^ -gravity center -extent 200x200 thumb.jpg

# Alternative method
magick input.jpg -thumbnail 200x200^ -gravity center -crop 200x200+0+0 +repage thumb.jpg

# With background (no crop)
magick input.jpg -resize 200x200 -background white -gravity center -extent 200x200 thumb.jpg
```

## Effects & Filters

### Blur Effects

```bash
# Standard blur (radius 0 = auto)
magick input.jpg -blur 0x8 output.jpg

# Gaussian blur (radius×sigma)
magick input.jpg -gaussian-blur 5x3 output.jpg

# Motion blur (angle)
magick input.jpg -motion-blur 0x20+45 output.jpg

# Radial blur
magick input.jpg -radial-blur 10 output.jpg
```

### Sharpen

```bash
# Basic sharpen
magick input.jpg -sharpen 0x1 output.jpg

# Stronger sharpen
magick input.jpg -sharpen 0x3 output.jpg

# Unsharp mask (advanced)
magick input.jpg -unsharp 0x1 output.jpg
```

### Color Effects

```bash
# Grayscale
magick input.jpg -colorspace Gray output.jpg

# Sepia tone
magick input.jpg -sepia-tone 80% output.jpg

# Negate (invert colors)
magick input.jpg -negate output.jpg

# Posterize (reduce colors)
magick input.jpg -posterize 8 output.jpg

# Solarize
magick input.jpg -solarize 50% output.jpg
```

### Artistic Effects

```bash
# Edge detection
magick input.jpg -edge 3 output.jpg

# Emboss
magick input.jpg -emboss 2 output.jpg

# Oil painting
magick input.jpg -paint 4 output.jpg

# Charcoal drawing
magick input.jpg -charcoal 2 output.jpg

# Sketch
magick input.jpg -sketch 0x20+120 output.jpg

# Swirl
magick input.jpg -swirl 90 output.jpg
```

## Adjustments

### Brightness & Contrast

```bash
# Increase brightness
magick input.jpg -brightness-contrast 10x0 output.jpg

# Increase contrast
magick input.jpg -brightness-contrast 0x20 output.jpg

# Both
magick input.jpg -brightness-contrast 10x20 output.jpg

# Negative values to decrease
magick input.jpg -brightness-contrast -10x-10 output.jpg
```

### Color Adjustments

```bash
# Adjust saturation (HSL modulation)
# Format: brightness,saturation,hue
magick input.jpg -modulate 100,150,100 output.jpg

# Adjust hue
magick input.jpg -modulate 100,100,120 output.jpg

# Combined adjustments
magick input.jpg -modulate 105,120,100 output.jpg

# Adjust specific color channels
magick input.jpg -channel Red -evaluate multiply 1.2 output.jpg
```

### Auto Corrections

```bash
# Auto level (normalize contrast)
magick input.jpg -auto-level output.jpg

# Auto gamma correction
magick input.jpg -auto-gamma output.jpg

# Normalize (stretch histogram)
magick input.jpg -normalize output.jpg

# Enhance (digital enhancement)
magick input.jpg -enhance output.jpg

# Equalize (histogram equalization)
magick input.jpg -equalize output.jpg
```

## Transformations

### Rotation

```bash
# Rotate 90° clockwise
magick input.jpg -rotate 90 output.jpg

# Rotate 180°
magick input.jpg -rotate 180 output.jpg

# Rotate counter-clockwise
magick input.jpg -rotate -90 output.jpg

# Rotate with background
magick input.jpg -background white -rotate 45 output.jpg

# Auto-orient based on EXIF
magick input.jpg -auto-orient output.jpg
```

### Flip & Mirror

```bash
# Flip vertically
magick input.jpg -flip output.jpg

# Flip horizontally (mirror)
magick input.jpg -flop output.jpg

# Both
magick input.jpg -flip -flop output.jpg
```

## Borders & Frames

### Simple Borders

```bash
# Add 10px black border
magick input.jpg -border 10x10 output.jpg

# Colored border
magick input.jpg -bordercolor red -border 10x10 output.jpg

# Different width/height
magick input.jpg -bordercolor blue -border 20x10 output.jpg
```

### Advanced Frames

```bash
# Raised frame
magick input.jpg -mattecolor gray -frame 10x10+5+5 output.jpg

# Shadow effect
magick input.jpg \
  \( +clone -background black -shadow 80x3+5+5 \) \
  +swap -background white -layers merge +repage \
  output.jpg

# Rounded corners
magick input.jpg \
  \( +clone -threshold -1 -draw "fill black polygon 0,0 0,15 15,0 fill white circle 15,15 15,0" \
  \( +clone -flip \) -compose multiply -composite \
  \( +clone -flop \) -compose multiply -composite \
  \) -alpha off -compose copy_opacity -composite \
  output.png
```

## Text & Annotations

### Basic Text

```bash
# Simple text overlay
magick input.jpg -pointsize 30 -fill white -annotate +10+30 "Hello" output.jpg

# Positioned text
magick input.jpg -gravity south -pointsize 20 -fill white \
  -annotate +0+10 "Copyright 2025" output.jpg

# Text with background
magick input.jpg -gravity center -pointsize 40 -fill white \
  -undercolor black -annotate +0+0 "Watermark" output.jpg
```

### Advanced Text

```bash
# Semi-transparent watermark
magick input.jpg \
  \( -background none -fill "rgba(255,255,255,0.5)" \
  -pointsize 50 label:"DRAFT" \) \
  -gravity center -compose over -composite \
  output.jpg

# Text with stroke
magick input.jpg -gravity center \
  -stroke black -strokewidth 2 -fill white \
  -pointsize 60 -annotate +0+0 "Title" \
  output.jpg

# Custom font
magick input.jpg -font Arial-Bold -pointsize 40 \
  -gravity center -fill white -annotate +0+0 "Text" \
  output.jpg
```

## Image Composition

### Overlay Images

```bash
# Basic overlay (top-left)
magick input.jpg overlay.png -composite output.jpg

# Position with gravity
magick input.jpg watermark.png -gravity southeast -composite output.jpg

# Position with offset
magick input.jpg watermark.png -gravity southeast \
  -geometry +10+10 -composite output.jpg

# Center overlay
magick input.jpg logo.png -gravity center -composite output.jpg
```

### Composite Modes

```bash
# Over (default)
magick input.jpg overlay.png -compose over -composite output.jpg

# Multiply
magick input.jpg texture.png -compose multiply -composite output.jpg

# Screen
magick input.jpg light.png -compose screen -composite output.jpg

# Overlay blend mode
magick input.jpg pattern.png -compose overlay -composite output.jpg
```

### Side-by-Side

```bash
# Horizontal append
magick image1.jpg image2.jpg +append output.jpg

# Vertical append
magick image1.jpg image2.jpg -append output.jpg

# With spacing
magick image1.jpg image2.jpg -gravity center \
  -background white -splice 10x0 +append output.jpg
```

## Transparency

### Create Transparency

```bash
# Make color transparent
magick input.jpg -transparent white output.png

# Make similar colors transparent (with fuzz)
magick input.jpg -fuzz 10% -transparent white output.png

# Alpha channel operations
magick input.png -alpha set -channel A -evaluate multiply 0.5 +channel output.png
```

### Remove Transparency

```bash
# Flatten with white background
magick input.png -background white -flatten output.jpg

# Flatten with custom color
magick input.png -background "#ff0000" -flatten output.jpg
```

## Advanced Techniques

### Vignette Effect

```bash
# Default vignette
magick input.jpg -vignette 0x20 output.jpg

# Custom vignette
magick input.jpg -background black -vignette 0x25+10+10 output.jpg
```

### Depth of Field Blur

```bash
# Radial blur from center
magick input.jpg \
  \( +clone -blur 0x8 \) \
  \( +clone -fill white -colorize 100 \
  -fill black -draw "circle %[fx:w/2],%[fx:h/2] %[fx:w/2],%[fx:h/4]" \
  -blur 0x20 \) \
  -composite output.jpg
```

### HDR Effect

```bash
magick input.jpg \
  \( +clone -colorspace gray \) \
  \( -clone 0 -auto-level -modulate 100,150,100 \) \
  -delete 0 -compose overlay -composite \
  output.jpg
```

### Tilt-Shift Effect

```bash
magick input.jpg \
  \( +clone -sparse-color Barycentric '0,%[fx:h*0.3] gray0 0,%[fx:h*0.5] white 0,%[fx:h*0.7] gray0' \) \
  \( +clone -blur 0x20 \) \
  -compose blend -define compose:args=100 -composite \
  output.jpg
```

## Color Management

### Color Profiles

```bash
# Strip color profile
magick input.jpg -strip output.jpg

# Assign color profile
magick input.jpg -profile sRGB.icc output.jpg

# Convert between profiles
magick input.jpg -profile AdobeRGB.icc -profile sRGB.icc output.jpg
```

### Color Space Conversion

```bash
# Convert to sRGB
magick input.jpg -colorspace sRGB output.jpg

# Convert to CMYK (print)
magick input.jpg -colorspace CMYK output.tif

# Convert to LAB
magick input.jpg -colorspace LAB output.jpg
```

## Performance Optimization

### Memory Management

```bash
# Limit memory usage
magick -limit memory 2GB -limit map 4GB input.jpg -resize 50% output.jpg

# Set thread count
magick -limit thread 4 input.jpg -resize 50% output.jpg

# Streaming for large files
magick -define stream:buffer-size=0 huge.jpg -resize 50% output.jpg
```

### Quality vs Size

```bash
# Maximum quality (large file)
magick input.jpg -quality 95 output.jpg

# Balanced (recommended)
magick input.jpg -quality 85 -strip output.jpg

# Smaller file (acceptable quality)
magick input.jpg -quality 70 -sampling-factor 4:2:0 -strip output.jpg

# Progressive JPEG
magick input.jpg -quality 85 -interlace Plane -strip output.jpg
```

## Common Recipes

### Avatar/Profile Picture

```bash
# Square thumbnail
magick input.jpg -resize 200x200^ -gravity center -extent 200x200 avatar.jpg

# Circular avatar (PNG)
magick input.jpg -resize 200x200^ -gravity center -extent 200x200 \
  \( +clone -threshold -1 -negate -fill white -draw "circle 100,100 100,0" \) \
  -alpha off -compose copy_opacity -composite avatar.png
```

### Responsive Images

```bash
# Generate multiple sizes
for size in 320 640 1024 1920; do
  magick input.jpg -resize ${size}x -quality 85 -strip "output-${size}w.jpg"
done
```

### Photo Enhancement

```bash
# Auto-enhance workflow
magick input.jpg \
  -auto-level \
  -unsharp 0x1 \
  -brightness-contrast 5x10 \
  -modulate 100,110,100 \
  -quality 90 -strip \
  output.jpg
```


### rmbg background removal

# RMBG - Background Removal CLI

Local AI-powered background removal tool. Repository: https://github.com/mrgoonie/rmbg

## Installation

```bash
npm install -g rmbg-cli
# or
pnpm install -g rmbg-cli
```

## Usage

```bash
# Basic usage (uses modnet model)
rmbg input.jpg

# Specify output path
rmbg input.jpg -o output.png

# Choose model
rmbg input.jpg -m briaai -o high-quality.png

# Set max resolution
rmbg image.jpg -r 4096 -o image-4k.png
```

## CLI Options

- `-o, --output <path>` - Output path (default: `input-no-bg.png`)
- `-m, --model <model>` - Model name (default: `modnet`)
- `-r, --max-resolution <n>` - Max resolution in pixels (default: `2048`)

## Available Models

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| `u2netp` | 4.5MB | ⚡⚡⚡ Fastest | Fair | Batch processing |
| `modnet` | 25MB | ⚡⚡ Fast | Good | Default, balanced |
| `briaai` | 44MB | ⚡ Slower | Excellent | High-quality |
| `isnet-anime` | 168MB | ⚡ Slower | Specialized | Anime/manga |
| `silueta` | 43MB | ⚡⚡⚡ Fast | Good | Portraits |
| `u2net-cloth` | 170MB | ⚡ Slower | Specialized | Fashion/clothing |

## Examples

```bash
# Fast processing
rmbg photo.jpg -m u2netp -o fast-result.png

# High quality output
rmbg photo.jpg -m briaai -r 4096 -o hq-result.png

# Batch processing
for img in *.jpg; do
  rmbg "$img" -m u2netp -o "output/${img%.jpg}.png"
done
```

## Notes

- Models download automatically on first use (~4-170MB depending on model)
- Cache location: `macOS: /var/folders/.../T/rmbg-cache/` | `Linux: /tmp/rmbg-cache/` | `Windows: %TEMP%\rmbg-cache\`
- Supported formats: JPEG, PNG, WebP
- Max file size: 50MB


### troubleshooting

# Media Processing Troubleshooting

## FFmpeg Issues

### Unknown Encoder Error
```bash
# Check available encoders
ffmpeg -encoders | grep h264

# Install codec libraries (Ubuntu/Debian)
sudo apt-get install libx264-dev libx265-dev libvpx-dev
```

### Memory Errors
```bash
# Limit thread usage
ffmpeg -threads 4 input.mp4 output.mp4

# Process in segments for large files
ffmpeg -i large.mp4 -ss 0 -t 600 segment1.mp4
ffmpeg -i large.mp4 -ss 600 -t 600 segment2.mp4
```

### Slow Encoding
```bash
# Use faster preset (trades compression for speed)
ffmpeg -i input.mp4 -c:v libx264 -preset ultrafast output.mp4

# Use hardware acceleration
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc output.mp4
```

## ImageMagick Issues

### "Not Authorized" Error
```bash
# Edit policy file
sudo nano /etc/ImageMagick-7/policy.xml

# Change from:
# <policy domain="coder" rights="none" pattern="PDF" />

# To:
# <policy domain="coder" rights="read|write" pattern="PDF" />
```

### Memory Limit Errors
```bash
# Increase memory limits
magick -limit memory 2GB -limit map 4GB input.jpg output.jpg

# Process in batches for large sets
ls *.jpg | xargs -n 10 -P 4 mogrify -resize 800x
```

### Slow Batch Processing
```bash
# Use parallel processing with GNU Parallel
ls *.jpg | parallel -j 4 magick {} -resize 800x resized-{}

# Or use mogrify for in-place edits (faster)
mogrify -resize 800x *.jpg
```

## RMBG Issues

### Model Download Failures
```bash
# Check network connectivity
curl https://unpkg.com/@rmbg/model-modnet/modnet-256.onnx

# Use custom cache directory
RMBG_CACHE_DIR=/tmp/rmbg-cache rmbg input.jpg

# Clear cache and retry
rm -rf /tmp/rmbg-cache
rmbg input.jpg
```

### Out of Memory
```bash
# Use smaller model
rmbg input.jpg -m u2netp -o output.png

# Reduce resolution
rmbg input.jpg -r 1024 -o output.png
```

### Slow Processing
```bash
# Use fastest model
rmbg input.jpg -m u2netp -o output.png

# Process smaller resolution
rmbg input.jpg -r 1024 -o output.png
```

## Performance Tips

1. **Use CRF for quality control** - Better than bitrate for video encoding
2. **Copy streams when possible** - Avoid re-encoding with `-c copy`
3. **Hardware acceleration** - GPU encoding 5-10x faster than CPU
4. **Appropriate presets** - Balance speed vs compression (`fast`, `medium`, `slow`)
5. **Batch with mogrify** - In-place image processing faster than individual commands
6. **Strip metadata** - Reduce file size with `-strip` flag
7. **Progressive JPEG** - Better web loading with `-interlace Plane`
8. **Test on samples** - Verify settings before processing large batches
9. **Parallel processing** - Use GNU Parallel for multiple files
10. **Limit memory** - Prevent crashes on large batches with `-limit` flags




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
