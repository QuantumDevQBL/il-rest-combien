#!/usr/bin/env python3
"""
Génère les assets graphiques de l'application avec l'identité visuelle
sombre + dorée.

Nécessite Pillow.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")

BACKGROUND = "#0B1220"
GOLD = "#F5B700"
GOLD_LIGHT = "#FEF3C7"
INK = "#F8FAFC"


def load_font(size: int, bold: bool = False):
    """Charge une police système ou retourne la police par défaut."""
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        if path and os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


def draw_gradient_circle(draw: ImageDraw.Draw, center: tuple, radius: int):
    """Dessine un cercle avec un dégradé doré simplifié."""
    x, y = center
    for r in range(radius, 0, -1):
        ratio = r / radius
        # Interpolation entre GOLD_LIGHT et GOLD
        r_color = int(245 - (245 - 245) * ratio)
        g_color = int(243 - (243 - 183) * ratio)
        b_color = int(199 - (199 - 0) * ratio)
        color = f"#{r_color:02x}{g_color:02x}{b_color:02x}"
        draw.ellipse(
            [x - r, y - r, x + r, y + r],
            fill=color,
        )


def draw_euro_symbol(draw: ImageDraw.Draw, center: tuple, radius: int):
    """Dessine un symbole € stylisé au centre."""
    x, y = center
    # Cercle extérieur (comme un C)
    outer = radius * 0.55
    inner = radius * 0.35
    draw.arc(
        [x - outer, y - outer, x + outer, y + outer],
        start=45,
        end=315,
        fill=BACKGROUND,
        width=int(radius * 0.12),
    )
    # Barres horizontales
    bar_width = radius * 0.25
    bar_height = radius * 0.08
    bar_offset = radius * 0.12
    for dy in [-bar_offset, bar_offset]:
        draw.rounded_rectangle(
            [x - bar_width / 2, y + dy - bar_height / 2, x + bar_width / 2, y + dy + bar_height / 2],
            radius=int(bar_height / 2),
            fill=BACKGROUND,
        )


def create_icon(size: int, with_background: bool = True):
    img = Image.new("RGBA", (size, size), BACKGROUND if with_background else (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = (size // 2, size // 2)
    radius = int(size * 0.38)
    draw_gradient_circle(draw, center, radius)
    draw_euro_symbol(draw, center, radius)
    return img


def create_splash(width: int, height: int):
    img = Image.new("RGB", (width, height), BACKGROUND)
    draw = ImageDraw.Draw(img)

    # Cercle doré au centre, plus grand
    center_x = width // 2
    center_y = height // 3
    radius = min(width, height) // 5
    draw_gradient_circle(draw, (center_x, center_y), radius)
    draw_euro_symbol(draw, (center_x, center_y), radius)

    # Titre
    title_font = load_font(int(width * 0.09), bold=True)
    title = "Il reste combien ?"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = bbox[2] - bbox[0]
    title_x = (width - title_w) // 2
    title_y = center_y + radius + int(height * 0.06)
    draw.text((title_x, title_y), title, font=title_font, fill=GOLD)

    # Sous-titre
    subtitle_font = load_font(int(width * 0.04))
    subtitle = "Calculateur micro-entreprise 2026"
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_w = bbox[2] - bbox[0]
    subtitle_x = (width - subtitle_w) // 2
    subtitle_y = title_y + int(height * 0.06)
    draw.text((subtitle_x, subtitle_y), subtitle, font=subtitle_font, fill=INK)

    return img


def create_favicon(size: int):
    return create_icon(size, with_background=True).convert("RGBA")


def main():
    os.makedirs(ASSETS_DIR, exist_ok=True)

    assets = {
        "icon.png": create_icon(1024),
        "adaptive-icon.png": create_icon(1024, with_background=False),
        "splash.png": create_splash(1242, 2436),
        "favicon.png": create_favicon(48),
    }

    for filename, img in assets.items():
        path = os.path.join(ASSETS_DIR, filename)
        img.save(path)
        print(f"Generated {path} ({img.size[0]}x{img.size[1]})")


if __name__ == "__main__":
    main()
