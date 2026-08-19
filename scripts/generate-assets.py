"""
Génère les assets de l'application Reste vraiment.

Les images produites sont des placeholders de qualité acceptable pour un test
APK. Elles doivent être remplacées par des visuels finaux avant publication.
"""

from PIL import Image, ImageDraw, ImageFont
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')

GREEN = '#15803D'
CREAM = '#FAFAF8'
WHITE = '#FFFFFF'


def get_font(size: int):
    """Charge une police système, avec fallback."""
    candidates = [
        'arial.ttf',
        'Arial.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def draw_euro_badge(draw: ImageDraw.ImageDraw, size: int, cx: float, cy: float):
    """Dessine un disque crème avec un symbole € vert centré."""
    radius = size * 0.32
    draw.ellipse(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        fill=CREAM,
    )
    font = get_font(int(size * 0.38))
    text = '€'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        (cx - tw / 2, cy - th / 2 - size * 0.02),
        text,
        font=font,
        fill=GREEN,
    )


def generate_icon(size: int) -> Image.Image:
    img = Image.new('RGB', (size, size), GREEN)
    draw = ImageDraw.Draw(img)
    draw_euro_badge(draw, size, size / 2, size / 2)
    return img


def generate_adaptive_icon(size: int) -> Image.Image:
    """Identique à l'icône classique pour cette passe."""
    return generate_icon(size)


def generate_splash(width: int, height: int) -> Image.Image:
    img = Image.new('RGB', (width, height), GREEN)
    draw = ImageDraw.Draw(img)

    logo_size = min(width, height) * 0.22
    cy = height * 0.42
    draw_euro_badge(draw, logo_size, width / 2, cy)

    title_font = get_font(int(width * 0.09))
    title = 'Reste vraiment'
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        ((width - tw) / 2, cy + logo_size * 0.7),
        title,
        font=title_font,
        fill=WHITE,
    )

    subtitle_font = get_font(int(width * 0.04))
    subtitle = 'Barèmes 2026'
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        ((width - tw) / 2, cy + logo_size * 0.7 + th + width * 0.04),
        subtitle,
        font=subtitle_font,
        fill='#E5E7EB',
    )

    return img


def generate_favicon(size: int) -> Image.Image:
    img = Image.new('RGB', (size, size), GREEN)
    draw = ImageDraw.Draw(img)
    font = get_font(int(size * 0.7))
    text = '€'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        ((size - tw) / 2, (size - th) / 2 - size * 0.05),
        text,
        font=font,
        fill=CREAM,
    )
    return img


if __name__ == '__main__':
    os.makedirs(ASSETS_DIR, exist_ok=True)

    generate_icon(1024).save(os.path.join(ASSETS_DIR, 'icon.png'))
    generate_adaptive_icon(1024).save(os.path.join(ASSETS_DIR, 'adaptive-icon.png'))
    generate_splash(1242, 2436).save(os.path.join(ASSETS_DIR, 'splash.png'))
    generate_favicon(32).save(os.path.join(ASSETS_DIR, 'favicon.png'))

    print('Assets générés dans', ASSETS_DIR)
