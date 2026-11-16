"""Generates every icon / share image the site needs. Run: python3 scripts/make-icons.py"""
import math, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
OUT = 'public'; F = 'node_modules/geist/dist/fonts/geist-sans/'
BLUE, GREEN, BG = (9, 108, 255), (3, 176, 128), (5, 7, 13)

def s_points(scale=1.0, ox=0, oy=0):
    """Bold geometric 'S' on a 64 grid: 3 bars (y=16,32,48) joined by two r=8 arcs. Designed to stay legible at 16px."""
    pts = [(46, 16), (26, 16)]
    for a in range(90, 271, 5):
        pts.append((26 + 8 * math.cos(math.radians(a)), 24 - 8 * math.sin(math.radians(a))))
    pts += [(26, 32), (38, 32)]
    for a in range(90, -91, -5):
        pts.append((38 + 8 * math.cos(math.radians(a)), 40 - 8 * math.sin(math.radians(a))))
    pts += [(38, 48), (18, 48)]
    return [(ox + x * scale, oy + y * scale) for x, y in pts]

def gradient(size):
    g = Image.new('RGB', (size, size)); px = g.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size - 2)
            px[x, y] = tuple(int(BLUE[i] + (GREEN[i] - BLUE[i]) * t) for i in range(3))
    return g

def mark(size, rounded=True, pad=0.0):
    """Gradient tile with the white S. pad shrinks the S for maskable icons."""
    K = 4; S = size * K
    tile = gradient(S).convert('RGBA')
    d = ImageDraw.Draw(tile)
    sc = S / 64 * (1 - pad * 2); off = S * pad
    w = int(9.4 * sc)
    pts = s_points(sc, off, off)
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        d.line([(x0, y0), (x1, y1)], fill='white', width=w)
    for x, y in pts[::2] + [pts[0], pts[-1]]:
        d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill='white')
    if rounded:
        m = Image.new('L', (S, S), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=255)
        tile.putalpha(m)
    return tile.resize((size, size), Image.LANCZOS)

mark(512).save(f'{OUT}/icon-512.png'); mark(192).save(f'{OUT}/icon-192.png')
mark(180, rounded=False).convert('RGB').save(f'{OUT}/apple-touch-icon.png')
mark(512, rounded=False, pad=0.14).convert('RGB').save(f'{OUT}/icon-512-maskable.png')
import struct, io
def write_ico(path, sizes):
    """Each frame is rendered natively at its own size (a downscaled single image looks muddy at 16px)."""
    frames = []
    for n in sizes:
        b = io.BytesIO(); mark(n).save(b, format='PNG'); frames.append((n, b.getvalue()))
    out = struct.pack('<HHH', 0, 1, len(frames)); off = 6 + 16 * len(frames); data = b''
    for n, png in frames:
        out += struct.pack('<BBBBHHII', n, n, 0, 0, 1, 32, len(png), off); off += len(png); data += png
    open(path, 'wb').write(out + data)
write_ico(f'{OUT}/favicon.ico', [16, 32, 48, 64])
mark(32).save(f'{OUT}/favicon-32.png'); mark(16).save(f'{OUT}/favicon-16.png')

svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#096CFF"/><stop offset="1" stop-color="#03B080"/></linearGradient></defs>
<rect width="64" height="64" rx="14" fill="url(#g)"/>
<path d="M46 16H26a8 8 0 0 0 0 16h12a8 8 0 0 1 0 16H18" fill="none" stroke="#fff" stroke-width="9.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>'''
open(f'{OUT}/favicon.svg', 'w').write(svg)

# ---- Open Graph / Twitter share image 1200x630 ----
W, H = 1200, 630
im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
glow = Image.new('RGB', (W, H), BG); gd = ImageDraw.Draw(glow)
gd.ellipse([700, -200, 1400, 480], fill=(9, 108, 255)); gd.ellipse([-250, 380, 450, 900], fill=(3, 176, 128))
glow = glow.filter(ImageFilter.GaussianBlur(150)); im = Image.blend(im, glow, 0.5); d = ImageDraw.Draw(im)
for x in range(0, W, 60): d.line([(x, 0), (x, H)], fill=(255, 255, 255, 18) if False else (22, 28, 40), width=1)
for y in range(0, H, 60): d.line([(0, y), (W, y)], fill=(22, 28, 40), width=1)
im.paste(mark(96), (72, 72), mark(96))
f_logo = ImageFont.truetype(F + 'Geist-SemiBold.ttf', 44); f_h = ImageFont.truetype(F + 'Geist-SemiBold.ttf', 76)
f_s = ImageFont.truetype(F + 'Geist-Regular.ttf', 32); f_t = ImageFont.truetype(F + 'Geist-Medium.ttf', 28)
d.text((188, 92), 'Scape AI', font=f_logo, fill='white')
d.text((72, 232), 'AI chatbots, custom models', font=f_h, fill='white')
d.text((72, 322), 'and evaluation that ships.', font=f_h, fill=(120, 190, 255))
d.text((72, 450), 'Build, train, benchmark and run AI for enterprises,', font=f_s, fill=(170, 178, 196))
d.text((72, 494), 'small businesses and independent experts.', font=f_s, fill=(170, 178, 196))
d.text((72, 556), 'ai.scapedatasolutions.com', font=f_t, fill=(51, 255, 182))
im.save(f'{OUT}/og-default.png', optimize=True)
print('icons ok:', sorted(os.listdir(OUT)))
