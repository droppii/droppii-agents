---
name: ck:ai-multimodal
description: Analyze images/audio/video with Gemini API (better vision than Claude). Generate images (Imagen 4), videos (Veo 3). Use for vision analysis, transcription, OCR, design extraction, multimodal AI.
license: MIT
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
argument-hint: "[file-path] [prompt]"
---

# AI Multimodal

Process audio, images, videos, documents, and generate images/videos using Google Gemini's multimodal API.

## Setup

```bash
export GEMINI_API_KEY="your-key"  # Get from https://aistudio.google.com/apikey
pip install google-genai python-dotenv pillow
```

### API Key Rotation (Optional)

For high-volume usage or when hitting rate limits, configure multiple API keys:

```bash
# Primary key (required)
export GEMINI_API_KEY="key1"

# Additional keys for rotation (optional)
export GEMINI_API_KEY_2="key2"
export GEMINI_API_KEY_3="key3"
```

Or in your `.env` file:
```
GEMINI_API_KEY=key1
GEMINI_API_KEY_2=key2
GEMINI_API_KEY_3=key3
```

**Features:**
- Auto-rotates on rate limit (429/RESOURCE_EXHAUSTED) errors
- 60-second cooldown per key after rate limit
- Logs rotation events with `--verbose` flag
- Backward compatible: single key still works

## Quick Start

**Verify setup**: `python scripts/check_setup.py`
**Analyze media**: `python scripts/gemini_batch_process.py --files <file> --task <analyze|transcribe|extract>`
  - TIP: When you're asked to analyze an image, check if `gemini` command is available, then use `echo "<prompt to analyze image>" | gemini -y -m <gemini.model>` command (read model from `.claude/.ck.json`: `gemini.model`). If `gemini` command is not available, use `python scripts/gemini_batch_process.py --files <file> --task analyze` command.
**Generate content**: `python scripts/gemini_batch_process.py --task <generate|generate-video> --prompt "description"`

> **Stdin support**: You can pipe files directly via stdin (auto-detects PNG/JPG/PDF/WAV/MP3).
> - `cat image.png | python scripts/gemini_batch_process.py --task analyze --prompt "Describe this"`
> - `python scripts/gemini_batch_process.py --files image.png --task analyze` (traditional)

## Models

- **Image generation**: `imagen-4.0-generate-001` (standard), `imagen-4.0-ultra-generate-001` (quality), `imagen-4.0-fast-generate-001` (speed)
- **Video generation**: `veo-3.1-generate-preview` (8s clips with audio)
- **Analysis**: `gemini-2.5-flash` (recommended), `gemini-2.5-pro` (advanced)

## Scripts

- **`gemini_batch_process.py`**: CLI orchestrator for `transcribe|analyze|extract|generate|generate-video` that auto-resolves API keys, picks sensible default models per task, streams files inline vs File API, and saves structured outputs (text/JSON/CSV/markdown plus generated assets) for Imagen 4 + Veo workflows.
- **`media_optimizer.py`**: ffmpeg/Pillow-based preflight tool that compresses/resizes/converts audio, image, and video inputs, enforces target sizes/bitrates, splits long clips into hour chunks, and batch-processes directories so media stays within Gemini limits.
- **`document_converter.py`**: Gemini-powered converter that uploads PDFs/images/Office docs, applies a markdown-preserving prompt, batches multiple files, auto-names outputs under `docs/assets`, and exposes CLI flags for model, prompt, auto-file naming, and verbose logging.
- **`check_setup.py`**: Interactive readiness checker that verifies directory layout, centralized env resolver, required Python deps, and GEMINI_API_KEY availability/format, then performs a live Gemini API call and prints remediation instructions if anything fails.

Use `--help` for options.

## References

Load for detailed guidance:

| Topic | File | Description |
|-------|------|-------------|
| Music | `references/music-generation.md` | Lyria RealTime API for background music generation, style prompts, real-time control, integration with video production. |
| Audio | `references/audio-processing.md` | Audio formats and limits, transcription (timestamps, speakers, segments), non-speech analysis, File API vs inline input, TTS models, best practices, cost and token math, and concrete meeting/podcast/interview recipes. |
| Images | `references/vision-understanding.md` | Vision capabilities overview, supported formats and models, captioning/classification/VQA, detection and segmentation, OCR and document reading, multi-image workflows, structured JSON output, token costs, best practices, and common product/screenshot/chart/scene use cases. |
| Image Gen | `references/image-generation.md` | Imagen 4 and Gemini image model overview, generate_images vs generate_content APIs, aspect ratios and costs, text/image/both modalities, editing and composition, style and quality control, safety settings, best practices, troubleshooting, and common marketing/concept-art/UI scenarios. |
| Video | `references/video-analysis.md` | Video analysis capabilities and supported formats, model/context choices, local/inline/YouTube inputs, clipping and FPS control, multi-video comparison, temporal Q&A and scene detection, transcription with visual context, token and cost guidance, and optimization/best-practice patterns. |
| Video Gen | `references/video-generation.md` | Veo model matrix, text-to-video and image-to-video quick start, multi-reference and extension flows, camera and timing control, configuration (resolution, aspect, audio, safety), prompt design patterns, performance tips, limitations, troubleshooting, and cost estimates. |

## Limits

**Formats**: Audio (WAV/MP3/AAC, 9.5h), Images (PNG/JPEG/WEBP, 3.6k), Video (MP4/MOV, 6h), PDF (1k pages)
**Size**: 20MB inline, 2GB File API
**Important:** 
- If you are going to generate a transcript of the audio, and the audio length is longer than 15 minutes, the transcript often gets truncated due to output token limits in the Gemini API response. To get the full transcript, you need to split the audio into smaller chunks (max 15 minutes per chunk) and transcribe each segment for a complete transcript.
- If you are going to generate a transcript of the video and the video length is longer than 15 minutes, use ffmpeg to extract the audio from the video, truncate the audio to 15 minutes, transcribe all audio segments, and then combine the transcripts into a single transcript.
**Transcription Output Requirements:**
- Format: Markdown
- Metadata: Duration, file size, generated date, description, file name, topics covered, etc.
- Parts: from-to (e.g., 00:00-00:15), audio chunk name, transcript, status, etc.
- Transcript format: 
  ```
  [HH:MM:SS -> HH:MM:SS] transcript content
  [HH:MM:SS -> HH:MM:SS] transcript content
  ...
  ```

## Resources

- [API Docs](https://ai.google.dev/gemini-api/docs/)
- [Pricing](https://ai.google.dev/pricing)


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### audio processing

# Audio Processing Reference

Comprehensive guide for audio analysis and speech generation using Gemini API.

## Audio Understanding

### Supported Formats

| Format | MIME Type | Best Use |
|--------|-----------|----------|
| WAV | `audio/wav` | Uncompressed, highest quality |
| MP3 | `audio/mp3` | Compressed, widely compatible |
| AAC | `audio/aac` | Compressed, good quality |
| FLAC | `audio/flac` | Lossless compression |
| OGG Vorbis | `audio/ogg` | Open format |
| AIFF | `audio/aiff` | Apple format |

### Specifications

- **Maximum length**: 9.5 hours per request
- **Multiple files**: Unlimited count, combined max 9.5 hours
- **Token rate**: 32 tokens/second (1 minute = 1,920 tokens)
- **Processing**: Auto-downsampled to 16 Kbps mono
- **File size limits**:
  - Inline: 20 MB max total request
  - File API: 2 GB per file, 20 GB project quota
  - Retention: 48 hours auto-delete
- **Important:** if you are going to generate a transcript of the audio, and the audio length is longer than 15 minutes, the transcript often gets truncated due to output token limits in the Gemini API response. To get the full transcript, you need to split the audio into smaller chunks (max 15 minutes per chunk) and transcribe each segment for a complete transcript.

## Transcription

### Basic Transcription

```python
from google import genai
import os

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

# Upload audio
myfile = client.files.upload(file='meeting.mp3')

# Transcribe
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Generate a transcript of the speech.', myfile]
)
print(response.text)
```

### With Timestamps

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Generate transcript with timestamps in MM:SS format.', myfile]
)
```

### Multi-Speaker Identification

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Transcribe with speaker labels. Format: [Speaker 1], [Speaker 2], etc.', myfile]
)
```

### Segment-Specific Transcription

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Transcribe only the segment from 02:30 to 05:15.', myfile]
)
```

## Audio Analysis

### Summarization

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Summarize key points in 5 bullets with timestamps.', myfile]
)
```

### Non-Speech Audio Analysis

```python
# Music analysis
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Identify the musical instruments and genre.', myfile]
)

# Environmental sounds
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Identify all sounds: voices, music, ambient noise.', myfile]
)

# Birdsong identification
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Identify bird species based on their calls.', myfile]
)
```

### Timestamp-Based Analysis

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['What is discussed from 10:30 to 15:45? Provide key points.', myfile]
)
```

## Input Methods

### File Upload (>20MB or Reuse)

```python
# Upload once, use multiple times
myfile = client.files.upload(file='large-audio.mp3')

# First query
response1 = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Transcribe this', myfile]
)

# Second query (reuses same file)
response2 = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Summarize this', myfile]
)
```

### Inline Data (<20MB)

```python
from google.genai import types

with open('small-audio.mp3', 'rb') as f:
    audio_bytes = f.read()

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Describe this audio',
        types.Part.from_bytes(data=audio_bytes, mime_type='audio/mp3')
    ]
)
```

## Speech Generation (TTS)

### Available Models

| Model | Quality | Speed | Cost/1M tokens |
|-------|---------|-------|----------------|
| `gemini-2.5-flash-native-audio-preview-09-2025` | High | Fast | $10 |
| `gemini-2.5-pro` TTS mode | Premium | Slower | $20 |

### Basic TTS

```python
response = client.models.generate_content(
    model='gemini-2.5-flash-native-audio-preview-09-2025',
    contents='Generate audio: Welcome to today\'s episode.'
)

# Save audio
with open('output.wav', 'wb') as f:
    f.write(response.audio_data)
```

### Controllable Voice Style

```python
# Professional tone
response = client.models.generate_content(
    model='gemini-2.5-flash-native-audio-preview-09-2025',
    contents='Generate audio in a professional, clear tone: Welcome to our quarterly earnings call.'
)

# Casual and friendly
response = client.models.generate_content(
    model='gemini-2.5-flash-native-audio-preview-09-2025',
    contents='Generate audio in a friendly, conversational tone: Hey there! Let\'s dive into today\'s topic.'
)

# Narrative style
response = client.models.generate_content(
    model='gemini-2.5-flash-native-audio-preview-09-2025',
    contents='Generate audio in a narrative, storytelling tone: Once upon a time, in a land far away...'
)
```

### Voice Control Parameters

- **Style**: Professional, casual, narrative, conversational
- **Pace**: Slow, normal, fast
- **Tone**: Friendly, serious, enthusiastic
- **Accent**: Natural language control (e.g., "British accent", "Southern drawl")

## Best Practices

### File Management

1. Use File API for files >20MB
2. Use File API for repeated queries (saves tokens)
3. Files auto-delete after 48 hours
4. Clean up manually when done:
   ```python
   client.files.delete(name=myfile.name)
   ```

### Prompt Engineering

**Effective prompts**:
- "Transcribe from 02:30 to 03:29 in MM:SS format"
- "Identify speakers and extract dialogue with timestamps"
- "Summarize key points with relevant timestamps"
- "Transcribe and analyze sentiment for each speaker"

**Context improves accuracy**:
- "This is a medical interview - use appropriate terminology"
- "Transcribe this legal deposition with precise terminology"
- "This is a technical podcast about machine learning"

**Combined tasks**:
- "Transcribe and summarize in bullet points"
- "Extract key quotes with timestamps and speaker labels"
- "Transcribe and identify action items with timestamps"

### Cost Optimization

**Token calculation**:
- 1 minute audio = 1,920 tokens
- 1 hour audio = 115,200 tokens
- 9.5 hours = 1,094,400 tokens

**Model selection**:
- Use `gemini-2.5-flash` ($1/1M tokens) for most tasks
- Upgrade to `gemini-2.5-pro` ($3/1M tokens) for complex analysis
- For high-volume: `gemini-1.5-flash` ($0.70/1M tokens)

**Reduce costs**:
- Process only relevant segments using timestamps
- Use lower-quality audio when possible
- Batch multiple short files in one request
- Cache context for repeated queries

### Error Handling

```python
import time

def transcribe_with_retry(file_path, max_retries=3):
    """Transcribe audio with exponential backoff retry"""
    for attempt in range(max_retries):
        try:
            myfile = client.files.upload(file=file_path)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=['Transcribe with timestamps', myfile]
            )
            return response.text
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt
            print(f"Retry {attempt + 1} after {wait_time}s")
            time.sleep(wait_time)
```

## Common Use Cases

### 1. Meeting Transcription

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Transcribe this meeting with:
        1. Speaker labels
        2. Timestamps for topic changes
        3. Action items highlighted
        ''',
        myfile
    ]
)
```

### 2. Podcast Summary

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Create podcast summary with:
        1. Main topics with timestamps
        2. Key quotes from each speaker
        3. Recommended episode highlights
        ''',
        myfile
    ]
)
```

### 3. Interview Analysis

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Analyze interview:
        1. Questions asked with timestamps
        2. Key responses from interviewee
        3. Overall sentiment and tone
        ''',
        myfile
    ]
)
```

### 4. Content Verification

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Verify audio content:
        1. Check for specific keywords or phrases
        2. Identify any compliance issues
        3. Note any concerning statements with timestamps
        ''',
        myfile
    ]
)
```

### 5. Multilingual Transcription

```python
# Gemini auto-detects language
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Transcribe this audio and translate to English if needed.', myfile]
)
```

## Token Costs

**Audio Input** (32 tokens/second):
- 1 minute = 1,920 tokens
- 10 minutes = 19,200 tokens
- 1 hour = 115,200 tokens
- 9.5 hours = 1,094,400 tokens

**Example costs** (Gemini 2.5 Flash at $1/1M):
- 1 hour audio: 115,200 tokens = $0.12
- Full day podcast (8 hours): 921,600 tokens = $0.92

## Limitations

- Maximum 9.5 hours per request
- Auto-downsampled to 16 Kbps mono (quality loss)
- Files expire after 48 hours
- No real-time streaming support
- Non-speech audio less accurate than speech

---

## Related References

**Current**: Audio Processing

**Related Capabilities**:
- [Video Analysis](./video-analysis.md) - Extract audio from videos
- [Video Generation](./video-generation.md) - Generate videos with native audio
- [Image Understanding](./vision-understanding.md) - Analyze audio with visual context

**Back to**: [AI Multimodal Skill](../SKILL.md)


### image generation

# Image Generation Reference

Comprehensive guide for image creation, editing, and composition using Imagen 4 and Gemini models ("Nano Banana").

> **Nano Banana** = Google's internal name for native image generation in Gemini API. Two variants: Nano Banana (Flash - speed) and Nano Banana Pro (3 Pro - quality with reasoning).

## Core Capabilities

- **Text-to-Image**: Generate images from text prompts
- **Image Editing**: Modify existing images with text instructions
- **Multi-Image Composition**: Combine up to 14 reference images (Pro model)
- **Iterative Refinement**: Multi-turn conversational refinement
- **Aspect Ratios**: 10 formats (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9)
- **Image Sizes**: 1K, 2K, 4K (uppercase K required)
- **Quality Variants**: Standard/Ultra/Fast for different needs
- **Text in Images**: Up to 25 chars optimal (4K text in Pro)
- **Search Grounding**: Real-time data integration (Pro only)
- **Thinking Mode**: Advanced reasoning for complex prompts (Pro only)

## Models

### Nano Banana (Default - Recommended)

**gemini-2.5-flash-image** - Nano Banana Flash ⭐ DEFAULT
- Best for: Speed, high-volume generation, rapid prototyping
- Quality: High
- Context: 65,536 input / 32,768 output tokens
- Speed: Fast (~5-10s per image)
- Cost: ~$1/1M input tokens
- Aspect Ratios: All 10 supported
- Image Sizes: 1K, 2K, 4K
- Status: Stable (Oct 2025)

**gemini-3-pro-image-preview** - Nano Banana Pro
- Best for: Professional assets, 4K text rendering, complex prompts
- Quality: Ultra (with advanced reasoning)
- Context: 65,536 input / 32,768 output tokens
- Speed: Medium
- Cost: ~$2/1M text input, $0.134/image (resolution-dependent)
- Multi-Image: Up to 14 reference images (6 objects + 5 humans)
- Features: Thinking mode, Google Search grounding
- Status: Preview (Nov 2025)

### Imagen 4 (Alternative - Production)

**imagen-4.0-generate-001** - Standard quality, balanced performance
- Best for: Production workflows, marketing assets
- Quality: High
- Speed: Medium (~5-10s per image)
- Cost: ~$0.02/image (estimated)
- Output: 1-4 images per request
- Resolution: 1K or 2K
- Updated: June 2025

**imagen-4.0-ultra-generate-001** - Maximum quality
- Best for: Final production, marketing assets, detailed artwork
- Quality: Ultra (highest available)
- Speed: Slow (~15-25s per image)
- Cost: ~$0.04/image (estimated)
- Output: 1-4 images per request
- Resolution: 2K preferred
- Updated: June 2025

**imagen-4.0-fast-generate-001** - Fastest generation
- Best for: Rapid iteration, bulk generation, real-time use
- Quality: Good
- Speed: Fast (~2-5s per image)
- Cost: ~$0.01/image (estimated)
- Output: 1-4 images per request
- Resolution: 1K
- Updated: June 2025

### Legacy Models

**gemini-2.0-flash-preview-image-generation** - Legacy
- Status: Deprecated (use Nano Banana or Imagen 4 instead)
- Context: 32,768 input / 8,192 output tokens

## Model Comparison

| Model | Quality | Speed | Cost | Best For |
|-------|---------|-------|------|----------|
| gemini-2.5-flash-image | ⭐⭐⭐⭐ | 🚀 Fast | 💵 Low | **DEFAULT** - General use |
| gemini-3-pro-image | ⭐⭐⭐⭐⭐ | 💡 Medium | 💰 Medium | Text/reasoning |
| imagen-4.0-generate | ⭐⭐⭐⭐ | 💡 Medium | 💰 Medium | Production (alternative) |
| imagen-4.0-ultra | ⭐⭐⭐⭐⭐ | 🐢 Slow | 💰💰 High | Marketing assets |
| imagen-4.0-fast | ⭐⭐⭐ | 🚀 Fast | 💵 Low | Bulk generation |

**Selection Guide**:
- **Default/General**: Use `gemini-2.5-flash-image` (fast, cost-effective)
- **Production Quality**: Use `imagen-4.0-generate-001` (alternative for final assets)
- **Marketing/Ultra Quality**: Use `imagen-4.0-ultra` for maximum quality
- **Text-Heavy Images**: Use `gemini-3-pro-image-preview` for 4K text rendering
- **Complex Prompts with Reasoning**: Use `gemini-3-pro-image-preview` with Thinking mode
- **Real-time Data Integration**: Use `gemini-3-pro-image-preview` with Search grounding

## Quick Start

### Basic Generation (Default - Nano Banana Flash)

```python
from google import genai
from google.genai import types
import os

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

# Nano Banana Flash - DEFAULT (fast, cost-effective)
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents='A serene mountain landscape at sunset with snow-capped peaks',
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE'],  # Uppercase required
        image_config=types.ImageConfig(
            aspect_ratio='16:9',
            image_size='2K'  # 1K, 2K, 4K - uppercase K required
        )
    )
)

# Save images
for i, part in enumerate(response.candidates[0].content.parts):
    if part.inline_data:
        with open(f'output-{i}.png', 'wb') as f:
            f.write(part.inline_data.data)
```

### Alternative - Imagen 4 (Production Quality)

```python
# Imagen 4 Standard - alternative for production workflows
response = client.models.generate_images(
    model='imagen-4.0-generate-001',
    prompt='Professional product photography of smartphone',
    config=types.GenerateImagesConfig(
        numberOfImages=1,
        aspectRatio='16:9',
        imageSize='1K'
    )
)

# Save Imagen 4 output
for i, generated_image in enumerate(response.generated_images):
    with open(f'output-{i}.png', 'wb') as f:
        f.write(generated_image.image.image_bytes)
```

### Imagen 4 Quality Variants

```python
# Ultra quality (marketing assets)
response = client.models.generate_images(
    model='imagen-4.0-ultra-generate-001',
    prompt='Professional product photography of smartphone',
    config=types.GenerateImagesConfig(
        numberOfImages=1,
        imageSize='2K'  # Use 2K for ultra (Standard/Ultra only)
    )
)

# Fast generation (bulk)
# Note: Fast model doesn't support imageSize parameter
response = client.models.generate_images(
    model='imagen-4.0-fast-generate-001',
    prompt='Quick concept sketch of robot character',
    config=types.GenerateImagesConfig(
        numberOfImages=4,  # Generate multiple variants (default: 4)
        aspectRatio='1:1'
    )
)
```

### Nano Banana Pro (4K Text, Reasoning)

```python
# Nano Banana Pro - for text rendering and complex prompts
response = client.models.generate_content(
    model='gemini-3-pro-image-preview',
    contents='A futuristic cityscape with neon lights',
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE'],  # Uppercase required
        image_config=types.ImageConfig(
            aspect_ratio='16:9',
            image_size='4K'  # 4K text rendering
        )
    )
)

# Nano Banana Pro - with Thinking mode and Search grounding
response = client.models.generate_content(
    model='gemini-3-pro-image-preview',
    contents='Current weather in Tokyo visualized as artistic infographic',
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],  # Both text and image
        image_config=types.ImageConfig(
            aspect_ratio='1:1',
            image_size='4K'
        )
    ),
    tools=[{'google_search': {}}]  # Enable search grounding
)

# Save from content parts
for i, part in enumerate(response.candidates[0].content.parts):
    if part.inline_data:
        with open(f'output-{i}.png', 'wb') as f:
            f.write(part.inline_data.data)
```

### Multi-Image Reference (Nano Banana Pro)

```python
from PIL import Image

# Up to 14 reference images (6 objects + 5 humans recommended)
img1 = Image.open('style_ref.png')
img2 = Image.open('color_ref.png')
img3 = Image.open('composition_ref.png')

response = client.models.generate_content(
    model='gemini-3-pro-image-preview',
    contents=[
        'Blend these reference styles into a cohesive hero image for a tech product',
        img1, img2, img3
    ],
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE'],
        image_config=types.ImageConfig(
            aspect_ratio='16:9',
            image_size='4K'
        )
    )
)
```

### Multi-Turn Refinement Chat

```python
# Conversational image refinement
chat = client.chats.create(
    model='gemini-2.5-flash-image',
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE']
    )
)

# Initial generation
response1 = chat.send_message('Create a minimalist logo for a coffee brand called "Brew"')

# Iterative refinement
response2 = chat.send_message('Make the text bolder and add steam rising from the cup')
response3 = chat.send_message('Change the color palette to warm earth tones')
```

## API Differences

### Imagen 4 vs Nano Banana (Gemini Native)

| Feature | Imagen 4 | Nano Banana (Gemini) |
|---------|----------|---------------------|
| Method | `generate_images()` | `generate_content()` |
| Config | `GenerateImagesConfig` | `GenerateContentConfig` |
| Prompt param | `prompt` (string) | `contents` (string/list) |
| Image count | `numberOfImages` (camelCase) | N/A (single per request) |
| Aspect ratio | `aspectRatio` (camelCase) | `aspect_ratio` (snake_case) |
| Size | `imageSize` | `image_size` |
| Response | `generated_images[i].image.image_bytes` | `candidates[0].content.parts[i].inline_data.data` |
| Multi-image input | ❌ | ✅ Up to 14 references |
| Multi-turn chat | ❌ | ✅ Conversational |
| Search grounding | ❌ | ✅ (Pro only) |
| Thinking mode | ❌ | ✅ (Pro only) |
| Text rendering | Limited | 4K (Pro) |

**Imagen 4** uses `generate_images()`:
```python
response = client.models.generate_images(
    model='imagen-4.0-generate-001',
    prompt='...',
    config=types.GenerateImagesConfig(
        numberOfImages=1,      # camelCase
        aspectRatio='16:9',    # camelCase
        imageSize='1K'         # Standard/Ultra only
    )
)
# Access: response.generated_images[0].image.image_bytes
```

**Nano Banana** uses `generate_content()`:
```python
response = client.models.generate_content(
    model='gemini-2.5-flash-image',  # or gemini-3-pro-image-preview
    contents='...',
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE'],  # Uppercase required
        image_config=types.ImageConfig(
            aspect_ratio='16:9',        # snake_case
            image_size='2K'             # 1K, 2K, 4K - uppercase K
        )
    )
)
# Access: response.candidates[0].content.parts[0].inline_data.data
```

**Critical Notes**:
1. `response_modalities` values MUST be uppercase: `'IMAGE'`, `'TEXT'`
2. `image_size` value MUST have uppercase K: `'1K'`, `'2K'`, `'4K'`
3. Imagen 4 Fast model doesn't support `imageSize` parameter

## Aspect Ratios

| Ratio | Resolution (1K) | Use Case | Token Cost |
|-------|----------------|----------|------------|
| 1:1 | 1024×1024 | Social media, avatars, icons | 1290 |
| 2:3 | 682×1024 | Vertical portraits | 1290 |
| 3:2 | 1024×682 | Horizontal portraits | 1290 |
| 3:4 | 768×1024 | Vertical posters | 1290 |
| 4:3 | 1024×768 | Traditional media | 1290 |
| 4:5 | 819×1024 | Instagram portrait | 1290 |
| 5:4 | 1024×819 | Horizontal photos | 1290 |
| 9:16 | 576×1024 | Mobile/stories/reels | 1290 |
| 16:9 | 1024×576 | Landscapes, banners, YouTube | 1290 |
| 21:9 | 1024×438 | Ultrawide/cinematic | 1290 |

All ratios cost the same: 1,290 tokens per image (Gemini models).

## Response Modalities

### Image Only

```python
config = types.GenerateContentConfig(
    response_modalities=['image'],
    aspect_ratio='1:1'
)
```

### Text Only (No Image)

```python
config = types.GenerateContentConfig(
    response_modalities=['text']
)
# Returns text description instead of generating image
```

### Both Image and Text

```python
config = types.GenerateContentConfig(
    response_modalities=['image', 'text'],
    aspect_ratio='16:9'
)
# Returns both generated image and description
```

## Image Editing

### Modify Existing Image

```python
import PIL.Image

# Load original
img = PIL.Image.open('original.png')

# Edit with instructions
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents=[
        'Add a red balloon floating in the sky',
        img
    ],
    config=types.GenerateContentConfig(
        response_modalities=['image'],
        aspect_ratio='16:9'
    )
)
```

### Style Transfer

```python
img = PIL.Image.open('photo.jpg')

response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents=[
        'Transform this into an oil painting style',
        img
    ]
)
```

### Object Addition/Removal

```python
# Add object
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents=[
        'Add a vintage car parked on the street',
        img
    ]
)

# Remove object
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents=[
        'Remove the person on the left side',
        img
    ]
)
```

## Multi-Image Composition

### Combine Multiple Images

```python
img1 = PIL.Image.open('background.png')
img2 = PIL.Image.open('foreground.png')
img3 = PIL.Image.open('overlay.png')

response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents=[
        'Combine these images into a cohesive scene',
        img1,
        img2,
        img3
    ],
    config=types.GenerateContentConfig(
        response_modalities=['image'],
        aspect_ratio='16:9'
    )
)
```

**Note**: Recommended maximum 3 input images for best results.

## Prompt Engineering

### Core Principle: Narrative > Keywords

> **Nano Banana prompting**: Write like you're briefing a photographer, not providing SEO keywords. Narrative paragraphs outperform keyword lists.

❌ **Bad**: "cat, 4k, masterpiece, trending, professional, ultra detailed, cinematic"
✅ **Good**: "A fluffy orange tabby cat with green eyes lounging on a sun-drenched windowsill. Soft morning light creates a warm glow. Shot with a 50mm lens at f/1.8 for shallow depth of field. Natural lighting, documentary photography style."

### Effective Prompt Structure

**Three key elements**:
1. **Subject**: What to generate (be specific)
2. **Context**: Environmental setting (lighting, location, time)
3. **Style**: Artistic treatment (photography, illustration, etc.)

### Quality Modifiers

**Technical terms**:
- "4K", "8K", "high resolution"
- "HDR", "high dynamic range"
- "professional photography"
- "studio lighting"
- "ultra detailed"

**Camera settings**:
- "35mm lens", "50mm lens"
- "shallow depth of field"
- "wide angle shot"
- "macro photography"
- "golden hour lighting"

### Style Keywords

**Art styles**:
- "oil painting", "watercolor", "sketch"
- "digital art", "concept art"
- "photorealistic", "hyperrealistic"
- "minimalist", "abstract"
- "cyberpunk", "steampunk", "fantasy"

**Mood and atmosphere**:
- "dramatic lighting", "soft lighting"
- "moody", "bright and cheerful"
- "mysterious", "whimsical"
- "dark and gritty", "pastel colors"

### Subject Description

**Be specific**:
- ❌ "A cat"
- ✅ "A fluffy orange tabby cat with green eyes"

**Add context**:
- ❌ "A building"
- ✅ "A modern glass skyscraper reflecting sunset clouds"

**Include details**:
- ❌ "A person"
- ✅ "A young woman in a red dress holding an umbrella"

### Composition and Framing

**Camera angles**:
- "bird's eye view", "aerial shot"
- "low angle", "high angle"
- "close-up", "wide shot"
- "centered composition"
- "rule of thirds"

**Perspective**:
- "first person view"
- "third person perspective"
- "isometric view"
- "forced perspective"

### Text in Images

**Limitations**:
- Maximum 25 characters total for optimal results
- Up to 3 distinct text phrases
- For 4K text rendering, use `gemini-3-pro-image-preview`

**Text prompt template**:
```
Image with text "[EXACT TEXT]" in [font style].
Font: [style description].
Color: [hex code like #FF5733].
Position: [top/center/bottom].
Background: [description].
Context: [poster/sign/label].
```

**Example**:
```python
response = client.models.generate_content(
    model='gemini-3-pro-image-preview',  # Use Pro for better text
    contents='''
    Create a vintage travel poster with text "EXPLORE TOKYO" at the top.
    Font: Bold retro sans-serif, slightly condensed.
    Color: #F5E6D3 (cream white).
    Position: Top third of image.
    Background: Stylized Tokyo skyline with Mt. Fuji, sunset colors.
    Style: 1950s travel poster aesthetic, muted warm colors.
    '''
)
```

**Font keywords**:
- "bold sans-serif", "handwritten script", "vintage letterpress"
- "modern minimalist", "art deco", "neon sign"

### Nano Banana Prompt Techniques

| Technique | Example | Purpose |
|-----------|---------|---------|
| ALL CAPS emphasis | `The logo MUST be centered` | Force attention to critical requirements |
| Hex colors | `#9F2B68` instead of "dark magenta" | Exact color control |
| Negative constraints | `NEVER include text/watermarks. DO NOT add labels.` | Explicit exclusions |
| Realism trigger | `Natural lighting, DOF. Captured with Canon EOS 90D DSLR.` | Photography authenticity |
| Structured edits | `Make ALL edits: - [1] - [2] - [3]` | Multi-step changes |
| Complex logic | `Kittens MUST have heterochromatic eyes matching fur colors` | Precise conditions |

**Prompt Templates**:

**Photorealistic**:
```
A [subject] in [location], [lens] lens. [Lighting] creates [mood]. [Details].
[Camera angle]. Professional photography, natural lighting.
```

**Illustration**:
```
[Art style] illustration of [subject]. [Color palette]. [Line style].
[Background]. [Mood].
```

**Product**:
```
[Product] on [surface]. Materials: [finish]. Lighting: [setup].
Camera: [angle]. Background: [type]. Style: [commercial/lifestyle].
```

## Advanced Techniques

### Iterative Refinement

```python
# Initial generation
response1 = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents='A futuristic city skyline'
)

# Save first version
with open('v1.png', 'wb') as f:
    f.write(response1.candidates[0].content.parts[0].inline_data.data)

# Refine
img = PIL.Image.open('v1.png')
response2 = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents=[
        'Add flying vehicles and neon signs',
        img
    ]
)
```

### Negative Prompts (Indirect)

```python
# Instead of "no blur", be specific about what you want
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents='A crystal clear, sharp photograph of a diamond ring with perfect focus and high detail'
)
```

### Consistent Style Across Images

```python
base_prompt = "Digital art, vibrant colors, cel-shaded style, clean lines"

prompts = [
    f"{base_prompt}, a warrior character",
    f"{base_prompt}, a mage character",
    f"{base_prompt}, a rogue character"
]

for i, prompt in enumerate(prompts):
    response = client.models.generate_content(
        model='gemini-2.5-flash-image',
        contents=prompt
    )
    # Save each character
```

## Safety Settings

### Configure Safety Filters

```python
config = types.GenerateContentConfig(
    response_modalities=['image'],
    safety_settings=[
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        ),
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        )
    ]
)
```

### Available Categories

- `HARM_CATEGORY_HATE_SPEECH`
- `HARM_CATEGORY_DANGEROUS_CONTENT`
- `HARM_CATEGORY_HARASSMENT`
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`

### Thresholds

- `BLOCK_NONE`: No blocking
- `BLOCK_LOW_AND_ABOVE`: Block low probability and above
- `BLOCK_MEDIUM_AND_ABOVE`: Block medium and above (default)
- `BLOCK_ONLY_HIGH`: Block only high probability

## Common Use Cases

### 1. Marketing Assets

```python
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents='''Professional product photography:
    - Sleek smartphone on minimalist white surface
    - Dramatic side lighting creating subtle shadows
    - Shallow depth of field, crisp focus
    - Clean, modern aesthetic
    - 4K quality
    ''',
    config=types.GenerateContentConfig(
        response_modalities=['image'],
        aspect_ratio='4:3'
    )
)
```

### 2. Concept Art

```python
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents='''Fantasy concept art:
    - Ancient floating islands connected by chains
    - Waterfalls cascading into clouds below
    - Magical crystals glowing on the islands
    - Epic scale, dramatic lighting
    - Detailed digital painting style
    ''',
    config=types.GenerateContentConfig(
        response_modalities=['image'],
        aspect_ratio='16:9'
    )
)
```

### 3. Social Media Graphics

```python
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents='''Instagram post design:
    - Pastel gradient background (pink to blue)
    - Motivational quote layout
    - Modern minimalist style
    - Clean typography
    - Mobile-friendly composition
    ''',
    config=types.GenerateContentConfig(
        response_modalities=['image'],
        aspect_ratio='1:1'
    )
)
```

### 4. Illustration

```python
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents='''Children's book illustration:
    - Friendly cartoon dragon reading a book
    - Bright, cheerful colors
    - Soft, rounded shapes
    - Whimsical forest background
    - Warm, inviting atmosphere
    ''',
    config=types.GenerateContentConfig(
        response_modalities=['image'],
        aspect_ratio='4:3'
    )
)
```

### 5. UI/UX Mockups

```python
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents='''Modern mobile app interface:
    - Clean dashboard design
    - Card-based layout
    - Soft shadows and gradients
    - Contemporary color scheme (blue and white)
    - Professional fintech aesthetic
    ''',
    config=types.GenerateContentConfig(
        response_modalities=['image'],
        aspect_ratio='9:16'
    )
)
```

## Best Practices

### Prompt Quality

1. **Be specific**: More detail = better results
2. **Order matters**: Most important elements first
3. **Use examples**: Reference known styles or artists
4. **Avoid contradictions**: Don't ask for opposing styles
5. **Test and iterate**: Refine prompts based on results

### File Management

```python
# Save with descriptive names
timestamp = int(time.time())
filename = f'generated_{timestamp}_{aspect_ratio}.png'

with open(filename, 'wb') as f:
    f.write(image_data)
```

### Cost Optimization

**Token costs**:
- 1 image: 1,290 tokens = $0.00129 (Flash Image at $1/1M)
- 10 images: 12,900 tokens = $0.0129
- 100 images: 129,000 tokens = $0.129

**Strategies**:
- Generate fewer iterations
- Use text modality first to validate concept
- Batch similar requests
- Cache prompts for consistent style

## Error Handling

### Safety Filter Blocking

```python
try:
    response = client.models.generate_content(
        model='gemini-2.5-flash-image',
        contents=prompt
    )
except Exception as e:
    # Check block reason
    if hasattr(e, 'prompt_feedback'):
        print(f"Blocked: {e.prompt_feedback.block_reason}")
        # Modify prompt and retry
```

### Token Limit Exceeded

```python
# Keep prompts concise
if len(prompt) > 1000:
    # Truncate or simplify
    prompt = prompt[:1000]
```

## Limitations

### Imagen 4 Constraints
- **Language**: English prompts only
- **Prompt length**: Maximum 480 tokens
- **Output**: 1-4 images per request
- **Watermark**: All images include SynthID watermark
- **Fast model**: No `imageSize` parameter support (fixed resolution)
- **Text rendering**: Limited to ~25 characters for optimal results
- **Regional restrictions**: Child images restricted in EEA, CH, UK
- **Cannot replicate**: Specific people or copyrighted characters

### Nano Banana (Gemini) Constraints
- **Language**: English prompts primary support
- **Context**: 32K token window
- **Multi-image**: Standard models ~3-5 refs; Pro up to 14 refs
- **Text rendering**: Standard limited; Pro supports 4K text
- **Watermark**: All images include SynthID watermark
- **Case sensitivity**: `response_modalities` must be uppercase (`'IMAGE'`, `'TEXT'`)
- **Size format**: `image_size` must have uppercase K (`'1K'`, `'2K'`, `'4K'`)

### General Limitations
- Maximum 14 input images for composition (Pro only)
- No video or animation generation (use Veo for video)
- No real-time generation

## Troubleshooting

### aspect_ratio Parameter Error

**Error**: `Extra inputs are not permitted [type=extra_forbidden, input_value='1:1', input_type=str]`

**Cause**: The `aspect_ratio` parameter must be nested inside an `image_config` object, not passed directly to `GenerateContentConfig`.

**Incorrect Usage**:
```python
# ❌ This will fail
config = types.GenerateContentConfig(
    response_modalities=['image'],
    aspect_ratio='16:9'  # Wrong - not a direct parameter
)
```

**Correct Usage**:
```python
# ✅ Correct implementation
config = types.GenerateContentConfig(
    response_modalities=['Image'],  # Note: Capital 'I'
    image_config=types.ImageConfig(
        aspect_ratio='16:9'
    )
)
```

### Response Modality Case Sensitivity

The `response_modalities` parameter expects uppercase values:
- ✅ Correct: `['IMAGE']`, `['TEXT']`, `['IMAGE', 'TEXT']`
- ❌ Wrong: `['image']`, `['text']`, `['Image']`

### Image Size Parameter Not Supported

**Error**: `400 INVALID_ARGUMENT`

**Cause**: The `image_size` parameter in `ImageConfig` is not supported by all Nano Banana models.

**Solution**: Don't pass `image_size` unless explicitly needed. The API uses sensible defaults.

```python
# ✅ Works - no image_size
config=types.GenerateContentConfig(
    response_modalities=['IMAGE'],
    image_config=types.ImageConfig(
        aspect_ratio='16:9'  # Only aspect_ratio
    )
)

# ⚠️ May fail - with image_size (model-dependent)
config=types.GenerateContentConfig(
    response_modalities=['IMAGE'],
    image_config=types.ImageConfig(
        aspect_ratio='16:9',
        image_size='2K'  # Not supported by all models
    )
)
```

### Multi-Image Reference Issues

**Problem**: Poor composition with multiple reference images

**Solutions**:
1. Limit to 3-5 reference images for standard models
2. Use Pro model for up to 14 references
3. Collage multiple style refs into single image
4. Provide clear textual descriptions of how to blend styles

---

## Related References

**Current**: Image Generation

**Related Capabilities**:
- [Image Understanding](./vision-understanding.md) - Analyzing and editing reference images
- [Video Generation](./video-generation.md) - Creating animated video content
- [Audio Processing](./audio-processing.md) - Text-to-speech for multimedia

**Back to**: [AI Multimodal Skill](../SKILL.md)


### music generation

# Music Generation Reference

Real-time music generation using Lyria RealTime via WebSocket API.

## Core Capabilities

- **Real-time streaming**: Bidirectional WebSocket for continuous generation
- **Dynamic control**: Modify music in real-time during generation
- **Style steering**: Genre, mood, instrumentation guidance
- **Audio output**: 48kHz stereo 16-bit PCM

## Model

**Lyria RealTime** (Experimental)
- WebSocket-based streaming
- Real-time parameter adjustment
- Instrumental only (no vocals)
- Watermarked output

## Quick Start

### Python

```python
from google import genai
import asyncio

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

async def generate_music():
    async with client.aio.live.music.connect() as session:
        # Set style prompts with weights (0.0-1.0)
        await session.set_weighted_prompts([
            {"prompt": "Upbeat corporate background music", "weight": 0.8},
            {"prompt": "Modern electronic elements", "weight": 0.5}
        ])

        # Configure generation parameters
        await session.set_music_generation_config(
            guidance=4.0,     # Prompt adherence (0.0-6.0)
            bpm=120,          # Tempo (60-200)
            density=0.6,      # Note density (0.0-1.0)
            brightness=0.5    # Tonal quality (0.0-1.0)
        )

        # Start playback and collect audio
        await session.play()

        audio_chunks = []
        async for chunk in session:
            audio_chunks.append(chunk.audio_data)

        return b''.join(audio_chunks)
```

### JavaScript

```javascript
const client = new GenaiClient({ apiKey: process.env.GEMINI_API_KEY });

async function generateMusic() {
    const session = await client.live.music.connect();

    await session.setWeightedPrompts([
        { prompt: "Calm ambient background", weight: 0.9 },
        { prompt: "Nature sounds influence", weight: 0.3 }
    ]);

    await session.setMusicGenerationConfig({
        guidance: 3.5,
        bpm: 80,
        density: 0.4,
        brightness: 0.6
    });

    session.onAudio((audioChunk) => {
        // Process 48kHz stereo PCM audio
        audioBuffer.push(audioChunk);
    });

    await session.play();
}
```

## Configuration Parameters

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| `guidance` | 0.0-6.0 | 4.0 | Prompt adherence (higher = stricter) |
| `bpm` | 60-200 | 120 | Tempo in beats per minute |
| `density` | 0.0-1.0 | 0.5 | Note/sound density |
| `brightness` | 0.0-1.0 | 0.5 | Tonal quality (higher = brighter) |
| `scale` | 12 keys | C Major | Musical key |
| `mute_bass` | bool | false | Remove bass elements |
| `mute_drums` | bool | false | Remove drum elements |
| `mode` | enum | QUALITY | QUALITY, DIVERSITY, VOCALIZATION |
| `temperature` | 0.0-2.0 | 1.0 | Sampling randomness |
| `top_k` | int | 40 | Sampling top-k |
| `seed` | int | random | Reproducibility seed |

## Weighted Prompts

Control generation direction with weighted prompts:

```python
await session.set_weighted_prompts([
    {"prompt": "Main style description", "weight": 1.0},    # Primary
    {"prompt": "Secondary influence", "weight": 0.5},       # Supporting
    {"prompt": "Subtle element", "weight": 0.2}             # Accent
])
```

**Weight guidelines**:
- 0.8-1.0: Dominant influence
- 0.5-0.7: Secondary contribution
- 0.2-0.4: Subtle accent
- 0.0-0.1: Minimal effect

## Style Prompts by Use Case

### Corporate/Marketing

```python
prompts = [
    {"prompt": "Professional corporate background music, modern", "weight": 0.9},
    {"prompt": "Uplifting, optimistic mood", "weight": 0.6},
    {"prompt": "Clean production, minimal complexity", "weight": 0.5}
]
config = {"bpm": 100, "brightness": 0.6, "density": 0.5}
```

### Social Media/Short-form

```python
prompts = [
    {"prompt": "Trending pop electronic beat", "weight": 0.9},
    {"prompt": "Energetic, catchy rhythm", "weight": 0.7},
    {"prompt": "Bass-heavy, punchy", "weight": 0.5}
]
config = {"bpm": 128, "brightness": 0.7, "density": 0.7}
```

### Emotional/Cinematic

```python
prompts = [
    {"prompt": "Cinematic orchestral underscore", "weight": 0.9},
    {"prompt": "Emotional, inspiring", "weight": 0.7},
    {"prompt": "Building tension and release", "weight": 0.5}
]
config = {"bpm": 70, "brightness": 0.4, "density": 0.4}
```

### Ambient/Background

```python
prompts = [
    {"prompt": "Calm ambient soundscape", "weight": 0.9},
    {"prompt": "Minimal, atmospheric", "weight": 0.6},
    {"prompt": "Lo-fi textures", "weight": 0.4}
]
config = {"bpm": 80, "brightness": 0.4, "density": 0.3}
```

## Real-time Transitions

Smoothly transition between styles during generation:

```python
async def dynamic_music_generation():
    async with client.aio.live.music.connect() as session:
        # Start with intro style
        await session.set_weighted_prompts([
            {"prompt": "Soft ambient intro", "weight": 0.9}
        ])
        await session.play()

        # Collect intro (4 seconds)
        intro_chunks = []
        for _ in range(192):  # ~4 seconds at 48kHz
            chunk = await session.__anext__()
            intro_chunks.append(chunk.audio_data)

        # Transition to main section
        await session.set_weighted_prompts([
            {"prompt": "Building energy", "weight": 0.7},
            {"prompt": "Full beat drop", "weight": 0.5}
        ])

        # Continue with new style...
```

## Output Specifications

- **Format**: Raw 16-bit PCM
- **Sample Rate**: 48,000 Hz
- **Channels**: 2 (stereo)
- **Bit Depth**: 16 bits
- **Watermarking**: Always enabled (SynthID)

### Save to WAV

```python
import wave

def save_pcm_to_wav(pcm_data, filename):
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(2)        # Stereo
        wav_file.setsampwidth(2)        # 16-bit
        wav_file.setframerate(48000)    # 48kHz
        wav_file.writeframes(pcm_data)
```

### Convert to MP3

```bash
# Using FFmpeg
ffmpeg -f s16le -ar 48000 -ac 2 -i input.pcm output.mp3
```

## Integration with Video Production

### Generate Background Music for Video

```python
async def generate_video_background(duration_seconds, mood):
    """Generate background music matching video length"""

    # Configure for video background
    prompts = [
        {"prompt": f"{mood} background music for video", "weight": 0.9},
        {"prompt": "Non-distracting, supportive underscore", "weight": 0.6}
    ]

    async with client.aio.live.music.connect() as session:
        await session.set_weighted_prompts(prompts)
        await session.set_music_generation_config(
            guidance=4.0,
            density=0.4,  # Keep sparse for background
            brightness=0.5
        )
        await session.play()

        # Calculate chunks needed (48kHz stereo = 192000 bytes/second)
        total_chunks = duration_seconds * 48000 // 512  # Chunk size estimate

        audio_data = []
        async for i, chunk in enumerate(session):
            audio_data.append(chunk.audio_data)
            if i >= total_chunks:
                break

        return b''.join(audio_data)
```

### Sync with Storyboard Timing

```python
async def generate_scene_music(scenes):
    """Generate music with transitions matching scene changes"""

    all_audio = []

    async with client.aio.live.music.connect() as session:
        for scene in scenes:
            # Update style for each scene
            await session.set_weighted_prompts([
                {"prompt": scene['mood'], "weight": 0.9},
                {"prompt": scene['style'], "weight": 0.5}
            ])

            if scene['index'] == 0:
                await session.play()

            # Collect audio for scene duration
            chunks = int(scene['duration'] * 48000 / 512)
            for _ in range(chunks):
                chunk = await session.__anext__()
                all_audio.append(chunk.audio_data)

    return b''.join(all_audio)
```

## Limitations

- **Instrumental only**: No vocal/singing generation
- **WebSocket required**: Real-time streaming connection
- **Safety filtering**: Prompts undergo safety review
- **Watermarking**: All output contains SynthID watermark
- **Experimental**: API may change

## Best Practices

1. **Buffer audio**: Implement robust buffering for smooth playback
2. **Gradual transitions**: Avoid drastic prompt changes mid-stream
3. **Sparse for backgrounds**: Lower density for video backgrounds
4. **Test prompts**: Iterate on prompt combinations
5. **Cross-fade transitions**: Blend audio at style changes
6. **Match video mood**: Align music tempo/energy with visuals

## Resources

- [Lyria RealTime Docs](https://ai.google.dev/gemini-api/docs/music-generation)
- [Audio Processing Guide](./audio-processing.md)
- [Video Generation](./video-generation.md)

---

**Related**: [Audio Processing](./audio-processing.md) | [Video Generation](./video-generation.md)

**Back to**: [AI Multimodal Skill](../SKILL.md)


### video analysis

# Video Analysis Reference

Comprehensive guide for video understanding, temporal analysis, and YouTube processing using Gemini API.

> **Note**: This guide covers video *analysis* (understanding existing videos). For video *generation* (creating new videos), see [Video Generation Reference](./video-generation.md).

## Core Capabilities

- **Video Summarization**: Create concise summaries
- **Question Answering**: Answer specific questions about content
- **Transcription**: Audio transcription with visual descriptions
- **Timestamp References**: Query specific moments (MM:SS format)
- **Video Clipping**: Process specific segments
- **Scene Detection**: Identify scene changes and transitions
- **Multiple Videos**: Compare up to 10 videos (2.5+)
- **YouTube Support**: Analyze YouTube videos directly
- **Custom Frame Rate**: Adjust FPS sampling

## Supported Formats

- MP4, MPEG, MOV, AVI, FLV, MPG, WebM, WMV, 3GPP

## Model Selection

### Gemini 3 Series (Latest)
- **gemini-3-pro-preview**: Latest, agentic workflows, 1M context, dynamic thinking

### Gemini 2.5 Series (Recommended)
- **gemini-2.5-pro**: Best quality, 1M-2M context
- **gemini-2.5-flash**: Balanced, 1M-2M context (recommended)

### Context Windows
- **2M token models**: ~2 hours (default) or ~6 hours (low-res)
- **1M token models**: ~1 hour (default) or ~3 hours (low-res)

## Basic Video Analysis

### Local Video

```python
from google import genai
import os

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

# Upload video (File API for >20MB)
myfile = client.files.upload(file='video.mp4')

# Wait for processing
import time
while myfile.state.name == 'PROCESSING':
    time.sleep(1)
    myfile = client.files.get(name=myfile.name)

if myfile.state.name == 'FAILED':
    raise ValueError('Video processing failed')

# Analyze
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Summarize this video in 3 key points', myfile]
)
print(response.text)
```

### YouTube Video

```python
from google.genai import types

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Summarize the main topics discussed',
        types.Part.from_uri(
            uri='https://www.youtube.com/watch?v=VIDEO_ID',
            mime_type='video/mp4'
        )
    ]
)
```

### Inline Video (<20MB)

```python
with open('short-clip.mp4', 'rb') as f:
    video_bytes = f.read()

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'What happens in this video?',
        types.Part.from_bytes(data=video_bytes, mime_type='video/mp4')
    ]
)
```

## Advanced Features

### Video Clipping

```python
# Analyze specific time range
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Summarize this segment',
        types.Part.from_video_metadata(
            file_uri=myfile.uri,
            start_offset='40s',
            end_offset='80s'
        )
    ]
)
```

### Custom Frame Rate

```python
# Lower FPS for static content (saves tokens)
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Analyze this presentation',
        types.Part.from_video_metadata(
            file_uri=myfile.uri,
            fps=0.5  # Sample every 2 seconds
        )
    ]
)

# Higher FPS for fast-moving content
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Analyze rapid movements in this sports video',
        types.Part.from_video_metadata(
            file_uri=myfile.uri,
            fps=5  # Sample 5 times per second
        )
    ]
)
```

### Multiple Videos (2.5+)

```python
video1 = client.files.upload(file='demo1.mp4')
video2 = client.files.upload(file='demo2.mp4')

# Wait for processing
for video in [video1, video2]:
    while video.state.name == 'PROCESSING':
        time.sleep(1)
        video = client.files.get(name=video.name)

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=[
        'Compare these two product demos. Which explains features better?',
        video1,
        video2
    ]
)
```

## Temporal Understanding

### Timestamp-Based Questions

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'What happens at 01:15 and how does it relate to 02:30?',
        myfile
    ]
)
```

### Timeline Creation

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Create a timeline with timestamps:
        - Key events
        - Scene changes
        - Important moments
        Format: MM:SS - Description
        ''',
        myfile
    ]
)
```

### Scene Detection

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Identify all scene changes with timestamps and describe each scene',
        myfile
    ]
)
```

## Transcription

### Basic Transcription

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Transcribe the audio from this video',
        myfile
    ]
)
```

### With Visual Descriptions

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Transcribe with visual context:
        - Audio transcription
        - Visual descriptions of important moments
        - Timestamps for salient events
        ''',
        myfile
    ]
)
```

### Speaker Identification

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Transcribe with speaker labels and timestamps',
        myfile
    ]
)
```

## Common Use Cases

### 1. Video Summarization

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Summarize this video:
        1. Main topic and purpose
        2. Key points with timestamps
        3. Conclusion or call-to-action
        ''',
        myfile
    ]
)
```

### 2. Educational Content

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Create educational materials:
        1. List key concepts taught
        2. Create 5 quiz questions with answers
        3. Provide timestamp for each concept
        ''',
        myfile
    ]
)
```

### 3. Action Detection

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'List all actions performed in this tutorial with timestamps',
        myfile
    ]
)
```

### 4. Content Moderation

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Review video content:
        1. Identify any problematic content
        2. Note timestamps of concerns
        3. Provide content rating recommendation
        ''',
        myfile
    ]
)
```

### 5. Interview Analysis

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Analyze interview:
        1. Questions asked (timestamps)
        2. Key responses
        3. Candidate body language and demeanor
        4. Overall assessment
        ''',
        myfile
    ]
)
```

### 6. Sports Analysis

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Analyze sports video:
        1. Key plays with timestamps
        2. Player movements and positioning
        3. Game strategy observations
        ''',
        types.Part.from_video_metadata(
            file_uri=myfile.uri,
            fps=5  # Higher FPS for fast action
        )
    ]
)
```

## YouTube Specific Features

### Public Video Requirements

- Video must be public (not private or unlisted)
- No age-restricted content
- Valid video ID required

### Usage Example

```python
# YouTube URL
youtube_uri = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Create chapter markers with timestamps',
        types.Part.from_uri(uri=youtube_uri, mime_type='video/mp4')
    ]
)
```

### Rate Limits

- **Free tier**: 8 hours of YouTube video per day
- **Paid tier**: No length-based limits
- Public videos only

## Token Calculation

Video tokens depend on resolution and FPS:

**Default resolution** (~300 tokens/second):
- 1 minute = 18,000 tokens
- 10 minutes = 180,000 tokens
- 1 hour = 1,080,000 tokens

**Low resolution** (~100 tokens/second):
- 1 minute = 6,000 tokens
- 10 minutes = 60,000 tokens
- 1 hour = 360,000 tokens

**Context windows**:
- 2M tokens ≈ 2 hours (default) or 6 hours (low-res)
- 1M tokens ≈ 1 hour (default) or 3 hours (low-res)

## Best Practices

### File Management

1. Use File API for videos >20MB (most videos)
2. Wait for ACTIVE state before analysis
3. Files auto-delete after 48 hours
4. Clean up manually:
   ```python
   client.files.delete(name=myfile.name)
   ```

### Optimization Strategies

**Reduce token usage**:
- Process specific segments using start/end offsets
- Use lower FPS for static content
- Use low-resolution mode for long videos
- Split very long videos into chunks

**Improve accuracy**:
- Provide context in prompts
- Use higher FPS for fast-moving content
- Use Pro model for complex analysis
- Be specific about what to extract

### Prompt Engineering

**Effective prompts**:
- "Summarize key points with timestamps in MM:SS format"
- "Identify all scene changes and describe each scene"
- "Extract action items mentioned with timestamps"
- "Compare these two videos on: X, Y, Z criteria"

**Structured output**:
```python
from pydantic import BaseModel
from typing import List

class VideoEvent(BaseModel):
    timestamp: str  # MM:SS format
    description: str
    category: str

class VideoAnalysis(BaseModel):
    summary: str
    events: List[VideoEvent]
    duration: str

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Analyze this video', myfile],
    config=genai.types.GenerateContentConfig(
        response_mime_type='application/json',
        response_schema=VideoAnalysis
    )
)
```

### Error Handling

```python
import time

def upload_and_process_video(file_path, max_wait=300):
    """Upload video and wait for processing"""
    myfile = client.files.upload(file=file_path)

    elapsed = 0
    while myfile.state.name == 'PROCESSING' and elapsed < max_wait:
        time.sleep(5)
        myfile = client.files.get(name=myfile.name)
        elapsed += 5

    if myfile.state.name == 'FAILED':
        raise ValueError(f'Video processing failed: {myfile.state.name}')

    if myfile.state.name == 'PROCESSING':
        raise TimeoutError(f'Processing timeout after {max_wait}s')

    return myfile
```

## Cost Optimization

**Token costs** (Gemini 2.5 Flash at $1/1M):
- 1 minute video (default): 18,000 tokens = $0.018
- 10 minute video: 180,000 tokens = $0.18
- 1 hour video: 1,080,000 tokens = $1.08

**Strategies**:
- Use video clipping for specific segments
- Lower FPS for static content
- Use low-resolution mode for long videos
- Batch related queries on same video
- Use context caching for repeated queries

## Limitations

- Maximum 6 hours (low-res) or 2 hours (default)
- YouTube videos must be public
- No live streaming analysis
- Files expire after 48 hours
- Processing time varies by video length
- No real-time processing
- Limited to 10 videos per request (2.5+)

---

## Related References

**Current**: Video Analysis

**Related Capabilities**:
- [Video Generation](./video-generation.md) - Creating videos from text/images
- [Audio Processing](./audio-processing.md) - Extract and analyze audio tracks
- [Image Understanding](./vision-understanding.md) - Analyze individual frames

**Back to**: [AI Multimodal Skill](../SKILL.md)


### video generation

# Video Generation Reference

Comprehensive guide for video creation using Veo models via Gemini API.

## Core Capabilities

- **Text-to-Video**: Generate 8-second videos from text prompts
- **Image-to-Video**: Animate images with text direction
- **Video Extension**: Continue previously generated videos
- **Frame Control**: Precise camera movements and effects
- **Native Audio**: Synchronized audio generation
- **Multiple Resolutions**: 720p and 1080p output
- **Aspect Ratios**: 16:9, 9:16, 1:1

## Models

### Veo 3.1 Preview (Latest)

**veo-3.1-generate-preview** - Latest with advanced controls
- Frame-specific generation
- Up to 3 reference images for image-to-video
- Video extension capability
- Native audio generation
- Resolution: 720p, 1080p
- Duration: 8 seconds at 24fps
- Status: Preview (API may change)
- Updated: September 2025

**veo-3.1-fast-generate-preview** - Speed-optimized
- Optimized for business use cases
- Programmatic ad creation
- Social media content
- Same features as standard but faster
- Status: Preview
- Updated: September 2025

### Veo 3.0 Stable

**veo-3.0-generate-001** - Production-ready
- Native audio generation
- Text-to-video and image-to-video
- 720p and 1080p (16:9 only)
- 8 seconds at 24fps
- Status: Stable
- Updated: July 2025

**veo-3.0-fast-generate-001** - Stable fast variant
- Speed-optimized stable version
- Same reliability as 3.0
- Status: Stable
- Updated: July 2025

## Model Comparison

| Model | Speed | Features | Audio | Status | Best For |
|-------|-------|----------|-------|--------|----------|
| veo-3.1-preview | Medium | All | ✓ | Preview | Latest features |
| veo-3.1-fast | Fast | All | ✓ | Preview | Business/speed |
| veo-3.0-001 | Medium | Standard | ✓ | Stable | Production |
| veo-3.0-fast | Fast | Standard | ✓ | Stable | Production/speed |

## Quick Start

### Text-to-Video

```python
from google import genai
from google.genai import types
import os

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

# Basic generation
response = client.models.generate_video(
    model='veo-3.1-generate-preview',
    prompt='A serene beach at sunset with gentle waves rolling onto the shore',
    config=types.VideoGenerationConfig(
        resolution='1080p',
        aspect_ratio='16:9'
    )
)

# Save video
with open('output.mp4', 'wb') as f:
    f.write(response.video.data)
```

### Image-to-Video

```python
import PIL.Image

# Load reference image
ref_image = PIL.Image.open('beach.jpg')

# Animate the image
response = client.models.generate_video(
    model='veo-3.1-generate-preview',
    prompt='Camera slowly pans across the scene from left to right',
    reference_images=[ref_image],
    config=types.VideoGenerationConfig(
        resolution='1080p'
    )
)
```

### Multiple Reference Images

```python
# Use up to 3 reference images for complex scenes
img1 = PIL.Image.open('foreground.jpg')
img2 = PIL.Image.open('background.jpg')
img3 = PIL.Image.open('subject.jpg')

response = client.models.generate_video(
    model='veo-3.1-generate-preview',
    prompt='Combine these elements into a cohesive animated scene',
    reference_images=[img1, img2, img3],
    config=types.VideoGenerationConfig(
        resolution='1080p',
        aspect_ratio='16:9'
    )
)
```

## Advanced Features

### Video Extension

```python
# Continue from previously generated video
previous_video = open('part1.mp4', 'rb').read()

response = client.models.extend_video(
    model='veo-3.1-generate-preview',
    video=previous_video,
    prompt='The scene transitions to nighttime with stars appearing'
)
```

### Frame Control

```python
# Precise camera movements
response = client.models.generate_video(
    model='veo-3.1-generate-preview',
    prompt='A mountain landscape',
    config=types.VideoGenerationConfig(
        resolution='1080p',
        camera_motion='zoom_in',  # Options: zoom_in, zoom_out, pan_left, pan_right, tilt_up, tilt_down, static
        motion_speed='slow'  # Options: slow, medium, fast
    )
)
```

## Prompt Engineering

### Effective Video Prompts

**Structure**:
1. **Subject**: What's in the scene
2. **Action**: What's happening
3. **Camera**: How it's filmed
4. **Style**: Visual treatment
5. **Timing**: Pacing details

**Example**:
```
"A hummingbird [subject] hovers near a red flower, then flies away [action].
Slow-motion close-up shot [camera] with vibrant colors and soft focus background [style].
Gentle, peaceful pacing [timing]."
```

### Action Verbs

**Movement**:
- "walks", "runs", "flies", "swims", "dances"
- "rotates", "spins", "rolls", "bounces"
- "emerges", "disappears", "transforms"

**Camera**:
- "zoom in on", "pull back from", "follow"
- "orbit around", "track alongside"
- "tilt up to reveal", "pan across"

**Transitions**:
- "gradually changes from... to..."
- "morphs into", "dissolves into"
- "cuts to", "fades to"

### Timing Control

```python
# Explicit timing in prompt
prompt = '''
0-2s: Close-up of a seed in soil
2-4s: Time-lapse of sprout emerging
4-6s: Growing into a small plant
6-8s: Zoom out to show garden context
'''
```

## Configuration Options

### Resolution

```python
config = types.VideoGenerationConfig(
    resolution='1080p'  # Options: 720p, 1080p
)
```

**Considerations**:
- 1080p: Higher quality, longer generation time, larger file
- 720p: Faster generation, smaller file, good for drafts

### Aspect Ratios

```python
config = types.VideoGenerationConfig(
    aspect_ratio='16:9'  # Options: 16:9, 9:16, 1:1
)
```

**Use Cases**:
- 16:9: Landscape, YouTube, traditional video
- 9:16: Mobile, TikTok, Instagram Stories
- 1:1: Square, Instagram feed, versatile

### Audio Control

```python
config = types.VideoGenerationConfig(
    include_audio=True  # Default: True
)
```

Native audio is generated automatically and synchronized with video content.

## Best Practices

### 1. Prompt Quality

**Be specific**:
- ❌ "A person walking"
- ✅ "A young woman in a red coat walking through a park in autumn"

**Include motion**:
- ❌ "A city street"
- ✅ "A busy city street with cars passing and people crossing"

**Specify camera**:
- ❌ "A mountain"
- ✅ "Aerial drone shot slowly ascending over a snow-capped mountain"

### 2. Reference Images

**Quality**:
- Use high-resolution images (1080p+)
- Clear, well-lit subjects
- Minimal motion blur

**Composition**:
- Match desired final aspect ratio
- Leave room for motion/movement
- Consider camera angle in prompt

### 3. Performance Optimization

**Generation Time**:
- 720p: ~30-60 seconds
- 1080p: ~60-120 seconds
- Fast models: 30-50% faster

**Strategies**:
- Use 720p for iteration/drafts
- Use fast models for rapid feedback
- Batch multiple requests
- Use async processing for UI responsiveness

## Common Use Cases

### 1. Product Demos

```python
response = client.models.generate_video(
    model='veo-3.0-fast-generate-001',
    prompt='''
    Professional product video:
    - Sleek smartphone rotating on a pedestal
    - Clean white background with soft shadows
    - Slow 360-degree rotation
    - Spotlight highlighting premium design
    - Modern, minimalist aesthetic
    ''',
    config=types.VideoGenerationConfig(
        resolution='1080p',
        aspect_ratio='1:1'
    )
)
```

### 2. Social Media Content

```python
response = client.models.generate_video(
    model='veo-3.1-fast-generate-preview',
    prompt='''
    Trendy social media clip:
    - Text overlay "NEW ARRIVAL" appears
    - Fashion product showcase
    - Quick cuts and dynamic camera
    - Vibrant colors, high energy
    - Upbeat pacing
    ''',
    config=types.VideoGenerationConfig(
        resolution='1080p',
        aspect_ratio='9:16'  # Mobile
    )
)
```

### 3. Explainer Animations

```python
response = client.models.generate_video(
    model='veo-3.1-generate-preview',
    prompt='''
    Educational animation:
    - Simple diagram illustrating data flow
    - Arrows and icons animating in sequence
    - Clean, clear visual hierarchy
    - Smooth transitions between steps
    - Professional corporate style
    ''',
    config=types.VideoGenerationConfig(
        resolution='720p',
        aspect_ratio='16:9'
    )
)
```

## Safety & Content Policy

### Safety Settings

```python
config = types.VideoGenerationConfig(
    safety_settings=[
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        )
    ]
)
```

### Prohibited Content

- Violence, gore, harm
- Sexually explicit content
- Hate speech, harassment
- Copyrighted characters/brands
- Real people (without consent)
- Misleading/deceptive content

## Limitations

- **Duration**: Fixed 8 seconds (as of Sept 2025)
- **Frame Rate**: 24fps only
- **File Size**: ~5-20MB per video
- **Generation Time**: 30s-2min depending on resolution
- **Reference Images**: Max 3 images
- **Preview Status**: API may change (3.1 models)
- **Audio**: Cannot upload custom audio (native only)
- **No real-time**: Pre-generation required

## Troubleshooting

### Long Generation Times

```python
import time

# Track generation progress
start = time.time()
response = client.models.generate_video(...)
duration = time.time() - start
print(f"Generated in {duration:.1f}s")
```

**Expected times**:
- Fast models + 720p: 30-45s
- Standard models + 720p: 45-90s
- Fast models + 1080p: 45-60s
- Standard models + 1080p: 60-120s

### Safety Filter Blocking

```python
try:
    response = client.models.generate_video(...)
except Exception as e:
    if 'safety' in str(e).lower():
        print("Video blocked by safety filters")
        # Modify prompt and retry
```

### Quota Exceeded

```python
# Implement exponential backoff
import time

def generate_with_retry(model, prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.models.generate_video(model=model, prompt=prompt)
        except Exception as e:
            if '429' in str(e):  # Rate limit
                wait = 2 ** attempt
                print(f"Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    raise Exception("Max retries exceeded")
```

## Cost Estimation

**Pricing**: TBD (preview models)

**Estimated based on compute**:
- Fast + 720p: ~$0.05-$0.10 per video
- Standard + 1080p: ~$0.15-$0.25 per video

**Monitor**: https://ai.google.dev/pricing

## Resources

- [Veo API Docs](https://ai.google.dev/gemini-api/docs/video)
- [Video Generation Guide](https://ai.google.dev/gemini-api/docs/video#model-versions)
- [Content Policy](https://ai.google.dev/gemini-api/docs/safety)
- [Get API Key](https://aistudio.google.com/apikey)

---

## Related References

**Current**: Video Generation

**Related Capabilities**:
- [Video Analysis](./video-analysis.md) - Understanding existing videos
- [Image Generation](./image-generation.md) - Creating static images
- [Image Understanding](./vision-understanding.md) - Analyzing reference images

**Back to**: [AI Multimodal Skill](../SKILL.md)


### vision understanding

# Vision Understanding Reference

Comprehensive guide for image analysis, object detection, and visual understanding using Gemini API.

## Core Capabilities

- **Captioning**: Generate descriptive text for images
- **Classification**: Categorize and identify content
- **Visual Q&A**: Answer questions about images
- **Object Detection**: Locate objects with bounding boxes (2.0+)
- **Segmentation**: Create pixel-level masks (2.5+)
- **Multi-image**: Compare up to 3,600 images
- **OCR**: Extract text from images
- **Document Understanding**: Process PDFs with vision

## Supported Formats

- **Images**: PNG, JPEG, WEBP, HEIC, HEIF
- **Documents**: PDF (up to 1,000 pages)
- **Size Limits**:
  - Inline: 20MB max total request
  - File API: 2GB per file
  - Max images: 3,600 per request

## Model Selection

### Gemini 2.5 Series
- **gemini-2.5-pro**: Best quality, segmentation + detection
- **gemini-2.5-flash**: Fast, efficient, all features
- **gemini-2.5-flash-lite**: Lightweight, all features

### Feature Requirements
- **Segmentation**: Requires 2.5+ models
- **Object Detection**: Requires 2.0+ models
- **Multi-image**: All models (up to 3,600 images)

## Basic Image Analysis

### Image Captioning

```python
from google import genai
import os

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

# Local file
with open('image.jpg', 'rb') as f:
    img_bytes = f.read()

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Describe this image in detail',
        genai.types.Part.from_bytes(data=img_bytes, mime_type='image/jpeg')
    ]
)
print(response.text)
```

### Image Classification

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Classify this image. Provide category and confidence level.',
        img_part
    ]
)
```

### Visual Question Answering

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'How many people are in this image and what are they doing?',
        img_part
    ]
)
```

## Advanced Features

### Object Detection (2.5+)

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Detect all objects in this image and provide bounding boxes',
        img_part
    ]
)

# Returns bounding box coordinates: [ymin, xmin, ymax, xmax]
# Normalized to [0, 1000] range
```

### Segmentation (2.5+)

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Create a segmentation mask for all people in this image',
        img_part
    ]
)

# Returns pixel-level masks for requested objects
```

### Multi-Image Comparison

```python
import PIL.Image

img1 = PIL.Image.open('photo1.jpg')
img2 = PIL.Image.open('photo2.jpg')

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Compare these two images. What are the differences?',
        img1,
        img2
    ]
)
```

### OCR and Text Extraction

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Extract all visible text from this image',
        img_part
    ]
)
```

## Input Methods

### Inline Data (<20MB)

```python
from google.genai import types

# From file
with open('image.jpg', 'rb') as f:
    img_bytes = f.read()

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Analyze this image',
        types.Part.from_bytes(data=img_bytes, mime_type='image/jpeg')
    ]
)
```

### PIL Image

```python
import PIL.Image

img = PIL.Image.open('photo.jpg')

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['What is in this image?', img]
)
```

### File API (>20MB or Reuse)

```python
# Upload once
myfile = client.files.upload(file='large-image.jpg')

# Use multiple times
response1 = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Describe this image', myfile]
)

response2 = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['What colors dominate this image?', myfile]
)
```

### URL (Public Images)

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Analyze this image',
        types.Part.from_uri(
            uri='https://example.com/image.jpg',
            mime_type='image/jpeg'
        )
    ]
)
```

## Token Calculation

Images consume tokens based on size:

**Small images** (≤384px both dimensions): 258 tokens

**Large images**: Tiled into 768×768 chunks, 258 tokens each

**Formula**:
```
crop_unit = floor(min(width, height) / 1.5)
tiles = (width / crop_unit) × (height / crop_unit)
total_tokens = tiles × 258
```

**Examples**:
- 256×256: 258 tokens (small)
- 512×512: 258 tokens (small)
- 960×540: 6 tiles = 1,548 tokens
- 1920×1080: 6 tiles = 1,548 tokens
- 3840×2160 (4K): 24 tiles = 6,192 tokens

## Structured Output

### JSON Schema Output

```python
from pydantic import BaseModel
from typing import List

class ObjectDetection(BaseModel):
    object_name: str
    confidence: float
    bounding_box: List[int]  # [ymin, xmin, ymax, xmax]

class ImageAnalysis(BaseModel):
    description: str
    objects: List[ObjectDetection]
    scene_type: str

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Analyze this image', img_part],
    config=genai.types.GenerateContentConfig(
        response_mime_type='application/json',
        response_schema=ImageAnalysis
    )
)

result = ImageAnalysis.model_validate_json(response.text)
```

## Multi-Image Analysis

### Batch Processing

```python
images = [
    PIL.Image.open(f'image{i}.jpg')
    for i in range(10)
]

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Analyze these images and find common themes'] + images
)
```

### Image Comparison

```python
before = PIL.Image.open('before.jpg')
after = PIL.Image.open('after.jpg')

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Compare before and after. List all visible changes.',
        before,
        after
    ]
)
```

### Visual Search

```python
reference = PIL.Image.open('target.jpg')
candidates = [PIL.Image.open(f'option{i}.jpg') for i in range(5)]

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Find which candidate images contain objects similar to the reference',
        reference
    ] + candidates
)
```

## Best Practices

### Image Quality

1. **Resolution**: Use clear, non-blurry images
2. **Rotation**: Verify correct orientation
3. **Lighting**: Ensure good contrast and lighting
4. **Size optimization**: Balance quality vs token cost
5. **Format**: JPEG for photos, PNG for graphics

### Prompt Engineering

**Specific instructions**:
- "Identify all vehicles with their colors and positions"
- "Count people wearing blue shirts"
- "Extract text from the sign in the top-left corner"

**Output format**:
- "Return results as JSON with fields: category, count, description"
- "Format as markdown table"
- "List findings as numbered items"

**Few-shot examples**:
```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Example: For an image of a cat on a sofa, respond: "Object: cat, Location: sofa"',
        'Now analyze this image:',
        img_part
    ]
)
```

### File Management

1. Use File API for images >20MB
2. Use File API for repeated queries (saves tokens)
3. Files auto-delete after 48 hours
4. Clean up manually:
   ```python
   client.files.delete(name=myfile.name)
   ```

### Cost Optimization

**Token-efficient strategies**:
- Resize large images before upload
- Use File API for repeated queries
- Batch multiple images when related
- Use appropriate model (Flash vs Pro)

**Token costs** (Gemini 2.5 Flash at $1/1M):
- Small image (258 tokens): $0.000258
- HD image (1,548 tokens): $0.001548
- 4K image (6,192 tokens): $0.006192

## Common Use Cases

### 1. Product Analysis

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Analyze this product image:
        1. Identify the product
        2. List visible features
        3. Assess condition
        4. Estimate value range
        ''',
        img_part
    ]
)
```

### 2. Screenshot Analysis

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Extract all text and UI elements from this screenshot',
        img_part
    ]
)
```

### 3. Medical Imaging (Informational Only)

```python
response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=[
        'Describe visible features in this medical image. Note: This is for informational purposes only.',
        img_part
    ]
)
```

### 4. Chart/Graph Reading

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        'Extract data from this chart and format as JSON',
        img_part
    ]
)
```

### 5. Scene Understanding

```python
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        '''Analyze this scene:
        1. Location type
        2. Time of day
        3. Weather conditions
        4. Activities happening
        5. Mood/atmosphere
        ''',
        img_part
    ]
)
```

## Error Handling

```python
import time

def analyze_image_with_retry(image_path, prompt, max_retries=3):
    """Analyze image with exponential backoff retry"""
    for attempt in range(max_retries):
        try:
            with open(image_path, 'rb') as f:
                img_bytes = f.read()

            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[
                    prompt,
                    genai.types.Part.from_bytes(
                        data=img_bytes,
                        mime_type='image/jpeg'
                    )
                ]
            )
            return response.text
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt
            print(f"Retry {attempt + 1} after {wait_time}s: {e}")
            time.sleep(wait_time)
```

## Limitations

- Maximum 3,600 images per request
- OCR accuracy varies with text quality
- Object detection requires 2.0+ models
- Segmentation requires 2.5+ models
- No video frame extraction (use video API)
- Regional restrictions on child images (EEA, CH, UK)

---

## Related References

**Current**: Image Understanding

**Related Capabilities**:
- [Image Generation](./image-generation.md) - Create and edit images
- [Video Analysis](./video-analysis.md) - Analyze video frames
- [Video Generation](./video-generation.md) - Reference images for video generation

**Back to**: [AI Multimodal Skill](../SKILL.md)




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
