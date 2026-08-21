#!/usr/bin/env python3
"""
Génère les assets graphiques de l'application avec l'identité visuelle
premium sombre + dorée (V1).

Nécessite Pillow.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")

BACKGROUND = "#050505"
GOLD = "#FFD700"
GOLD_LIGHT = "#FFEC8B"
INK = "#FFFFFF"


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


def interpolate_color(c1: tuple, c2: tuple, ratio: float) -> str:
    """Interpole entre deux couleurs RGB."""
    r = int(c1[0] + (c2[0] - c1[0]) * ratio)
    g = int(c1[1] + (c2[1] - c1[1]) * ratio)
    b = int(c1[2] + (c2[2] - c1[2]) * ratio)
    return f"#{r:02x}{g:02x}{b:02x}"


def draw_gradient_circle(draw: ImageDraw.Draw, center: tuple, radius: int):
    """Dessine un cercle avec un dégradé doré radial."""
    x, y = center
    c1 = tuple(int(GOLD_LIGHT[i:i+2], 16) for i in (1, 3, 5))
    c2 = tuple(int(GOLD[i:i+2], 16) for i in (1, 3, 5))
    for r in range(radius, 0, -1):
        ratio = r / radius
        color = interpolate_color(c1, c2, 1 - ratio)
        draw.ellipse(
            [x - r, y - r, x + r, y + r],
            fill=color,
        )


def draw_euro_symbol(draw: ImageDraw.Draw, center: tuple, radius: int):
    """Dessine un symbole € stylisé et fin au centre."""
    x, y = center
    outer = radius * 0.5
    inner = radius * 0.3
    width = max(2, int(radius * 0.09))

    # Cercle ouvert (forme de C)
    draw.arc(
        [x - outer, y - outer, x + outer, y + outer],
        start=50,
        end=310,
        fill=BACKGROUND,
        width=width,
    )

    # Barres horizontales
    bar_width = radius * 0.32
    bar_height = max(2, int(radius * 0.06))
    bar_offset = radius * 0.14
    for dy in [-bar_offset, bar_offset]:
        draw.rounded_rectangle(
            [x - bar_width / 2, y + dy - bar_height / 2, x + bar_width / 2, y + dy + bar_height / 2],
            radius=bar_height // 2,
            fill=BACKGROUND,
        )


def create_icon(size: int, with_background: bool = True):
    img = Image.new("RGBA", (size, size), BACKGROUND if with_background else (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = (size // 2, size // 2)
    radius = int(size * 0.35)
    draw_gradient_circle(draw, center, radius)
    draw_euro_symbol(draw, center, radius)
    return img


def create_splash(width: int, height: int):
    img = Image.new("RGB", (width, height), BACKGROUND)
    draw = ImageDraw.Draw(img)

    # Cercle doré au centre
    center_x = width // 2
    center_y = height // 3
    radius = min(width, height) // 6
    draw_gradient_circle(draw, (center_x, center_y), radius)
    draw_euro_symbol(draw, (center_x, center_y), radius)

    # Titre
    title_font = load_font(int(width * 0.085), bold=True)
    title = "Il reste combien ?"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = bbox[2] - bbox[0]
    title_x = (width - title_w) // 2
    title_y = center_y + radius + int(height * 0.07)
    draw.text((title_x, title_y), title, font=title_font, fill=GOLD)

    # Sous-titre
    subtitle_font = load_font(int(width * 0.038))
    subtitle = "Calculateur micro-entreprise 2026"
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_w = bbox[2] - bbox[0]
    subtitle_x = (width - subtitle_w) // 2
    subtitle_y = title_y + int(height * 0.055)
    draw.text((subtitle_x, subtitle_y), subtitle, font=subtitle_font, fill=INK)

    return img


def create_favicon(size: int):
    return create_icon(size, with_background=True).convert("RGBA")


def main():
    os.makedirs(ASSETS_DIR, exist_ok=True)

    assets = {
        "icon.png": create_icon(1024),
        "adaptive-icon.png": create_icon(1024, with_background=False),
        "splash.png": create_splash(1290, 2796),
        "favicon.png": create_favicon(64),
    }

    for filename, img in assets.items():
        path = os.path.join(ASSETS_DIR, filename)
        img.save(path)
        print(f"Generated {path} ({img.size[0]}x{img.size[1]})")


if __name__ == "__main__":
    main()
