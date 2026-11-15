#!/usr/bin/env python3
"""Journey strip v2: six clear chapters (logo tile, calm landmark, road milestone, year + role)."""
import re, sys

FILL, LINE, GLOW = '#5a1528', '#ffcfb8', '#f2c66d'
S = f'fill="{FILL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"'
G = 200  # ground in the landmark svg (viewBox 1200 x 200)

def win(x, y, n, gap=14, w=8, h=10, lit=()):
    return ''.join(f'<rect x="{x+i*gap}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="{GLOW if i in lit else "none"}" stroke="{LINE}" stroke-opacity=".55" stroke-width="1"/>' for i in range(n))

land = []
L = land.append
# 1. Himachal: two peaks, snow caps, a small home, pines
L(f'<path d="M20 {G}L78 104l26 30 34 -58 62 {124}z" {S}/>'
  f'<path d="M78 104l-13 18 8 -3 6 6 7 -7 6 3zM138 76l-16 24 9 -4 7 8 8 -8 8 4z" fill="{LINE}"/>'
  f'<path d="M64 {G}v-34h40v34z" {S}/><path d="M58 {G-34}l26 -20 26 20z" {S}/>'
  f'<rect x="78" y="{G-18}" width="12" height="18" fill="none" stroke="{LINE}" stroke-width="1.2"/><rect x="69" y="{G-28}" width="7" height="7" fill="{GLOW}"/>'
  f'<path d="M150 {G}l12 -34 12 34zM172 {G}l9 -26 9 26z" {S}/>')
# 2. IIIT Allahabad: pediment + columns
L(f'<path d="M232 {G}v-62h136v62z" {S}/><path d="M224 {G-62}l76 -28 76 28z" {S}/>'
  + ''.join(f'<path d="M{246+i*22} {G-54}v54" stroke="{LINE}" stroke-opacity=".7" stroke-width="5"/>' for i in range(6))
  + f'<rect x="292" y="{G-24}" width="16" height="24" fill="{FILL}" stroke="{LINE}" stroke-width="1.2"/>')
# 3. Dineout: restaurant with scalloped awning and a cloche sign
L(f'<path d="M438 {G}v-58h124v58z" {S}/>'
  + ''.join(f'<path d="M{438+i*20.67:.1f} {G-58}h20.67v8a10.33 10.33 0 0 1 -20.67 0z" fill="{LINE if i%2 else FILL}" stroke="{LINE}" stroke-width="1.2"/>' for i in range(6))
  + f'<rect x="452" y="{G-34}" width="38" height="24" rx="2" fill="none" stroke="{LINE}" stroke-opacity=".6"/><rect x="506" y="{G-36}" width="28" height="36" fill="none" stroke="{LINE}" stroke-opacity=".6"/>'
  f'<path d="M461 {G-17}h20M463 {G-17}a8 8 0 0 1 16 0M471 {G-27}v2" fill="none" stroke="{GLOW}" stroke-width="1.6" stroke-linecap="round"/>')
# 4. Travacations: palms + a small plane above
for x, h in ((660, 70), (690, 56), (744, 64)):
    L(f'<path d="M{x} {G}q3 -{h/2} -2 -{h}" fill="none" stroke="{LINE}" stroke-width="2.4"/>'
      + ''.join(f'<path d="M{x-2} {G-h}q{dx*.6} -10 {dx} {dy}" fill="none" stroke="{LINE}" stroke-width="2.2" stroke-linecap="round"/>' for dx, dy in ((-20, 4), (-12, -10), (12, -10), (20, 4))))
L('<g class="jr-plane"><g transform="translate(672 66)">'
  '<path d="M-36 6h26" stroke="#ffe6d6" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="4 6" opacity=".8"/>'
  f'<path d="M34 4l12 -14h7l-5 14z" fill="#ffe6d6"/><path d="M0 1l-6 -15h8l11 14z" fill="#ffe6d6"/>'
  '<path d="M3 0h55c11 0 20 3 25 6c-5 3 -14 6 -25 6h-55a6 6 0 0 1 0 -12z" fill="#fff"/>'
  + ''.join(f'<circle cx="{18+i*7}" cy="5.5" r="1.4" fill="{FILL}"/>' for i in range(7)) +
  f'<path d="M32 8l15 19h8l-5 -19z" fill="{GLOW}"/></g></g>')
# 5. Jio: tower with antenna + pulsing signal
L(f'<path d="M866 {G}v-128h68v128z" {S}/><path d="M900 {G-128}v-26" stroke="{LINE}" stroke-width="2"/>'
  + ''.join(win(878, G - 112 + r * 22, 4, lit=((r + 1) % 4,)) for r in range(5))
  + ''.join(f'<path class="jr-sig" style="animation-delay:{i*.35}s" d="M{900-r} {G-158}a{r} {r} 0 0 1 {2*r} 0" fill="none" stroke="{LINE}" stroke-width="1.6" stroke-linecap="round"/>' for i, r in enumerate((8, 15, 22)))
  + f'<path d="M944 {G}v-70h40v70z" {S}/>' + ''.join(win(952, G - 58 + r * 20, 2, gap=14, lit=() if r else (1,)) for r in range(3))
  + f'<path d="M820 {G}v-54h36v54z" {S}/>' + ''.join(win(827, G - 44 + r * 20, 2, gap=12) for r in range(2)))
# 6. Delhivery, Gurgaon: glass towers
L(f'<path d="M1030 {G}v-112h44v112z" {S}/><path d="M1052 {G-112}v-18" stroke="{LINE}" stroke-width="1.6"/>'
  + ''.join(win(1038, G - 98 + r * 22, 2, gap=16, lit=(r % 2,) if r < 3 else ()) for r in range(4))
  + f'<path d="M1082 {G}v-146h52v146z" {S}/>' + ''.join(f'<path d="M1092 {G-132+r*16}h32" stroke="{LINE}" stroke-opacity=".5"/>' for r in range(8))
  + f'<rect x="1100" y="{G-104}" width="16" height="10" fill="{GLOW}"/>'
  + f'<path d="M1142 {G}v-92h40v92z" {S}/>' + ''.join(win(1150, G - 78 + r * 22, 2, gap=14, lit=(0,) if r == 1 else ()) for r in range(3)))
# sparkles
for x, y in ((180, 40), (420, 70), (560, 30), (800, 80), (1000, 40), (1190, 74)):
    L(f'<path class="jr-spk" style="animation-delay:{(x%5)*.5}s" d="M{x} {y-6}q1 5 6 6q-5 1 -6 6q-1 -5 -6 -6q5 -1 6 -6z" fill="{GLOW}"/>')

landsvg = f'<svg class="jr-land" viewBox="0 14 1200 186" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">{"".join(land)}</svg>'

bike = ('<svg class="jr-bike" viewBox="-14 -58 66 72" aria-hidden="true" focusable="false"><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
        + ''.join(f'<g transform="translate({cx} 0)"><circle r="11"/><path class="jr-spoke" d="M-11 0h22M0 -11v22" stroke-width="1.2"/></g>' for cx in (0, 38)) +
        f'<path d="M0 0l12 -20h20l6 20M12 -20l8 20h-20M20 0l12 -20M10 -26h7M30 -24l4 -6h5"/>'
        f'<path d="M22 -24l-6 -14 10 -8M18 -36l12 4 4 6" stroke="{GLOW}"/></g><circle cx="26" cy="-50" r="5" fill="{GLOW}"/></svg>')

def tile(src, alt='', cls=''):
    return f'<span class="jr-tile{cls}"><img src="./images/{src}" alt="{alt}" loading="lazy" /></span>'

home_icon = (f'<span class="jr-tile jr-tile--icon" role="img" aria-label="Himachal Pradesh"><svg viewBox="0 0 40 40" aria-hidden="true">'
             f'<path d="M4 32 15 14l6 8 5-8 10 18z" fill="{FILL}"/><path d="M15 14l-3.6 5.4 2.6-1 1.5 1.6 1.7-1.7z" fill="#fff"/></svg></span>')

stops = [
    ('2012 and before', 'Himachal', 'Where it began', home_icon, ''),
    ('2012 – 2016', 'IIIT Allahabad', 'B.Tech, Information Technology', tile('iiit-logo.png', 'IIIT Allahabad'), ''),
    ('2016 – 2019', 'Swiggy Dineout', 'Senior UX Designer, Manager II', tile('brandLogo/swiggy-dineout.svg', 'Swiggy Dineout'),
     tile('brandLogo/times-internet.svg', 'Times Internet', ' jr-tile--sm')),
    ('2019 – 2022', 'Travacations', 'Design Strategy', tile('brandLogo/trava-cation.svg', cls=' jr-tile--wide', alt='Travacations'), ''),
    ('2022 – 2023', 'Jio Platforms', 'Senior UX Manager', tile('brandLogo/jio.svg', 'Jio'),
     tile('brandLogo/jiomart.svg', 'JioMart', ' jr-tile--sm') + tile('brandLogo/netmeds.svg', 'Netmeds', ' jr-tile--sm') + tile('brandLogo/urban-ladder.svg', 'Urban Ladder', ' jr-tile--sm')),
    ('2023 – now', 'Delhivery', 'Lead, Gurgaon Design Team', tile('brandLogo/delhivery.svg', cls=' jr-tile--wide', alt='Delhivery'), ''),
]
lis = ''.join(
    f'<li class="jr-stop{" is-now" if i == len(stops)-1 else ""}"><div class="jr-badges">{main}{"<span class=jr-minis>"+minis+"</span>" if minis else ""}</div>'
    f'<div class="jr-info"><span class="jr-dot" aria-hidden="true"></span><p class="jr-year">{yr}</p><p class="jr-co">{co}</p><p class="jr-role">{role}</p></div></li>'
    for i, (yr, co, role, main, minis) in enumerate(stops))

section = f'''<!-- JOURNEY STRIP:START (generated by tools/journey-strip.py) -->
    <section class="journey" aria-labelledby="h-journey">
      <div class="jr-head">
        <p class="jr-kicker">10 years · 7 brands · 100M+ users</p>
        <h2 id="h-journey">The road so far</h2>
        <p class="jr-sub">From a home in the Himachal hills to designing for some of India's biggest consumer brands.</p>
      </div>
      <div class="jr-scroll" tabindex="0" aria-label="Career timeline, scroll sideways on small screens">
        <div class="jr-track">
          <div class="jr-scene">{landsvg}<div class="jr-road" aria-hidden="true">{bike}</div></div>
          <ol class="jr-stops">{lis}</ol>
        </div>
      </div>
      <p class="jr-hint" aria-hidden="true">Swipe to follow the road →</p>
    </section>
    <!-- JOURNEY STRIP:END -->'''

p = sys.argv[1]
s = open(p).read()
s = re.sub(r'\s*<!-- JOURNEY STRIP:START.*?JOURNEY STRIP:END -->', '', s, flags=re.S)
s = s.replace('\n    <footer class="footer">', '\n    ' + section + '\n\n    <footer class="footer">', 1)
open(p, 'w').write(s)
print('ok', len(section))
