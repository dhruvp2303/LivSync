import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_master_icon(size=1024):
    """Render high-res antialiased LivSync emblem at `size` x `size`"""
    # 2x supersampling for ultra smooth vector-like antialiasing
    scale = 2
    W = size * scale
    H = size * scale

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    # 1. Create Linear Gradient Background (#4338CA -> #7C3AED)
    grad = Image.new("RGBA", (W, H))
    c1 = (67, 56, 202)    # #4338CA
    c2 = (124, 58, 237)   # #7C3AED
    for y in range(H):
        t = y / (H - 1)
        r = int(c1[0] * (1 - t) + c2[0] * t)
        g = int(c1[1] * (1 - t) + c2[1] * t)
        b = int(c1[2] * (1 - t) + c2[2] * t)
        for x in range(W):
            # slight diagonal shift
            dx = (x / (W - 1) - 0.5) * 0.2
            t_diag = max(0.0, min(1.0, t + dx))
            r_d = int(c1[0] * (1 - t_diag) + c2[0] * t_diag)
            g_d = int(c1[1] * (1 - t_diag) + c2[1] * t_diag)
            b_d = int(c1[2] * (1 - t_diag) + c2[2] * t_diag)
            grad.putpixel((x, y), (r_d, g_d, b_d, 255))

    # Mask for squircle (rounded rectangle)
    mask = Image.new("L", (W, H), 0)
    draw_mask = ImageDraw.Draw(mask)
    corner_radius = int(W * 0.25)
    draw_mask.rounded_rectangle([0, 0, W - 1, H - 1], radius=corner_radius, fill=255)
    img.paste(grad, (0, 0), mask)

    draw = ImageDraw.Draw(img)

    # 2. Glass highlight on upper half
    glass_mask = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glass_draw = ImageDraw.Draw(glass_mask)
    for y in range(int(H * 0.45)):
        alpha = int(45 * (1 - y / (H * 0.45)))
        glass_draw.line([(0, y), (W, y)], fill=(255, 255, 255, alpha))
    img.alpha_composite(glass_mask)

    # Outer border rim
    draw.rounded_rectangle([2 * scale, 2 * scale, W - 3 * scale, H - 3 * scale], radius=corner_radius, outline=(255, 255, 255, 50), width=4 * scale)

    # 3. Draw Ambient Resonance Ring
    cx, cy = W // 2, H // 2
    r_outer = int(W * 0.29)
    # Dashed circle
    num_dashes = 28
    for i in range(num_dashes):
        if i % 2 == 0:
            a_start = (i / num_dashes) * 360
            a_end = ((i + 0.6) / num_dashes) * 360
            draw.arc([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], start=a_start, end=a_end, fill=(255, 255, 255, 55), width=6 * scale)

    r_mid = int(W * 0.21)
    draw.ellipse([cx - r_mid, cy - r_mid, cx + r_mid, cy + r_mid], outline=(56, 189, 248, 80), width=4 * scale)

    # 4. Arch 1: Person 1 / Living (White Arch)
    # Starts at left (31% W, 66% H) up to apex (50% W, 30% H) then curve to right
    p1_stroke = int(36 * (scale / 2)) * 2
    # Smooth line + arc
    x1 = int(W * 0.3125)
    y1_bottom = int(H * 0.656)
    y1_arc_center = int(H * 0.484)
    r_arch = int(W * 0.1875)

    # Vertical left pillar
    draw.line([(x1, y1_bottom), (x1, y1_arc_center)], fill=(255, 255, 255, 255), width=p1_stroke)
    # Top arch
    draw.arc([cx - r_arch, cy - r_arch - int(H * 0.016), cx + r_arch, cy + r_arch - int(H * 0.016)], start=180, end=330, fill=(255, 255, 255, 255), width=p1_stroke)

    # Arch 2: Person 2 / Sync (Sky Cyan #38BDF8)
    x2 = int(W * 0.6875)
    y2_top = int(H * 0.344)
    y2_arc_center = int(H * 0.516)
    draw.line([(x2, y2_top), (x2, y2_arc_center)], fill=(56, 189, 248, 255), width=p1_stroke)
    draw.arc([cx - r_arch, cy - r_arch + int(H * 0.016), cx + r_arch, cy + r_arch + int(H * 0.016)], start=0, end=150, fill=(56, 189, 248, 255), width=p1_stroke)

    # Rounded endpoints
    draw.ellipse([x1 - p1_stroke // 2, y1_bottom - p1_stroke // 2, x1 + p1_stroke // 2, y1_bottom + p1_stroke // 2], fill=(255, 255, 255, 255))
    draw.ellipse([x2 - p1_stroke // 2, y2_top - p1_stroke // 2, x2 + p1_stroke // 2, y2_top + p1_stroke // 2], fill=(56, 189, 248, 255))

    # 5. Compatibility Core at Center
    r_core_bg = int(W * 0.0625)
    draw.ellipse([cx - r_core_bg, cy - r_core_bg, cx + r_core_bg, cy + r_core_bg], fill=(15, 23, 42, 255), outline=(255, 255, 255, 255), width=8 * scale)
    
    r_core_cyan = int(W * 0.03125)
    draw.ellipse([cx - r_core_cyan, cy - r_core_cyan, cx + r_core_cyan, cy + r_core_cyan], fill=(56, 189, 248, 255))

    r_core_white = int(W * 0.0136)
    draw.ellipse([cx - r_core_white, cy - r_core_white, cx + r_core_white, cy + r_core_white], fill=(255, 255, 255, 255))

    # Downsample with Lanczos for anti-aliasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

def create_round_icon(master_icon):
    """Circle masked version of master icon"""
    size = master_icon.size[0]
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse([0, 0, size - 1, size - 1], fill=255)
    
    round_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    round_img.paste(master_icon, (0, 0), mask)
    return round_img

def create_foreground_icon(size=432):
    """Emblem without squircle background for adaptive icon foreground"""
    scale = 2
    W = size * scale
    H = size * scale
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = W // 2, H // 2
    r_arch = int(W * 0.17)
    p1_stroke = int(W * 0.065)

    x1 = cx - r_arch
    x2 = cx + r_arch
    y_span = int(W * 0.16)

    # Person 1 Pillar & Arch
    draw.line([(x1, cy + y_span), (x1, cy)], fill=(255, 255, 255, 255), width=p1_stroke)
    draw.arc([cx - r_arch, cy - r_arch - int(W * 0.01), cx + r_arch, cy + r_arch - int(W * 0.01)], start=180, end=330, fill=(255, 255, 255, 255), width=p1_stroke)

    # Person 2 Pillar & Arch
    draw.line([(x2, cy - y_span), (x2, cy)], fill=(56, 189, 248, 255), width=p1_stroke)
    draw.arc([cx - r_arch, cy - r_arch + int(W * 0.01), cx + r_arch, cy + r_arch + int(W * 0.01)], start=0, end=150, fill=(56, 189, 248, 255), width=p1_stroke)

    # End caps
    draw.ellipse([x1 - p1_stroke // 2, cy + y_span - p1_stroke // 2, x1 + p1_stroke // 2, cy + y_span + p1_stroke // 2], fill=(255, 255, 255, 255))
    draw.ellipse([x2 - p1_stroke // 2, cy - y_span - p1_stroke // 2, x2 + p1_stroke // 2, cy - y_span + p1_stroke // 2], fill=(56, 189, 248, 255))

    # Central Core
    r_core_bg = int(W * 0.055)
    draw.ellipse([cx - r_core_bg, cy - r_core_bg, cx + r_core_bg, cy + r_core_bg], fill=(15, 23, 42, 255), outline=(255, 255, 255, 255), width=int(W * 0.015))
    r_core_cyan = int(W * 0.028)
    draw.ellipse([cx - r_core_cyan, cy - r_core_cyan, cx + r_core_cyan, cy + r_core_cyan], fill=(56, 189, 248, 255))
    r_core_white = int(W * 0.012)
    draw.ellipse([cx - r_core_white, cy - r_core_white, cx + r_core_white, cy + r_core_white], fill=(255, 255, 255, 255))

    return img.resize((size, size), Image.Resampling.LANCZOS)

def create_splash(width, height, master_icon):
    """Generate professional splash screen with centered icon and branding"""
    splash = Image.new("RGBA", (width, height), (15, 23, 42, 255)) # Dark navy slate #0F172A
    
    # Target icon size: 28% of shortest dimension
    icon_dim = max(100, int(min(width, height) * 0.28))
    icon_resized = master_icon.resize((icon_dim, icon_dim), Image.Resampling.LANCZOS)
    
    cx = width // 2
    cy = (height // 2) - int(icon_dim * 0.1)
    
    # Paste centered icon
    splash.paste(icon_resized, (cx - icon_dim // 2, cy - icon_dim // 2), icon_resized)
    return splash

def main():
    base_dir = r"c:\Users\Dhruv\OneDrive\Desktop\LivSync"
    res_dir = os.path.join(base_dir, "frontend", "android", "app", "src", "main", "res")
    public_dir = os.path.join(base_dir, "frontend", "public")

    print("Generating master 1024x1024 icon...")
    master = create_master_icon(1024)
    master_round = create_round_icon(master)

    # 1. Save public web icons
    master.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "icon-512.png"))
    master.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "icon-192.png"))
    master.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "apple-touch-icon.png"))
    master.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon-32x32.png"))
    print("Saved public web icons.")

    # 2. Android Mipmap densities
    # mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192
    densities = {
        "mipmap-mdpi": (48, 108),
        "mipmap-hdpi": (72, 162),
        "mipmap-xhdpi": (96, 216),
        "mipmap-xxhdpi": (144, 324),
        "mipmap-xxxhdpi": (192, 432),
    }

    for folder, (ic_size, fg_size) in densities.items():
        target_dir = os.path.join(res_dir, folder)
        os.makedirs(target_dir, exist_ok=True)
        
        # ic_launcher.png
        master.resize((ic_size, ic_size), Image.Resampling.LANCZOS).save(os.path.join(target_dir, "ic_launcher.png"))
        
        # ic_launcher_round.png
        master_round.resize((ic_size, ic_size), Image.Resampling.LANCZOS).save(os.path.join(target_dir, "ic_launcher_round.png"))
        
        # ic_launcher_foreground.png
        fg = create_foreground_icon(fg_size)
        fg.save(os.path.join(target_dir, "ic_launcher_foreground.png"))
        print(f"Updated {folder} ({ic_size}x{ic_size})")

    # 3. Android Splash Screens
    splash_dirs = {
        "drawable": (480, 800),
        "drawable-port-mdpi": (320, 480),
        "drawable-port-hdpi": (480, 800),
        "drawable-port-xhdpi": (720, 1280),
        "drawable-port-xxhdpi": (960, 1600),
        "drawable-port-xxxhdpi": (1280, 1920),
        "drawable-land-mdpi": (480, 320),
        "drawable-land-hdpi": (800, 480),
        "drawable-land-xhdpi": (1280, 720),
        "drawable-land-xxhdpi": (1600, 960),
        "drawable-land-xxxhdpi": (1920, 1280),
    }

    for folder, (w, h) in splash_dirs.items():
        target_dir = os.path.join(res_dir, folder)
        os.makedirs(target_dir, exist_ok=True)
        splash_img = create_splash(w, h, master)
        splash_img.save(os.path.join(target_dir, "splash.png"))
        print(f"Updated {folder}/splash.png ({w}x{h})")

    print("All icons and splash assets successfully generated!")

if __name__ == "__main__":
    main()
