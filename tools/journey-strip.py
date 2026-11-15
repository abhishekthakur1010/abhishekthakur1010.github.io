#!/usr/bin/env python3
"""Generate the 'journey strip' flat illustration for profile.html (inline SVG)."""
import re, sys, math

W, H, G = 2600, 372, 292        # tile width, height, ground line
C = dict(bg='#3e0f22', far='#4d1229', mid='#5e1830', near='#74203a',
         ln='#ffc9b0', lt='#ffe6d6', wh='#ffffff', road='#2c0915', gold='#f2c66d')
o = []
A = o.append

def bld(x, w, h, rows=None, cols=None, fill=None, roof=None):
    y = G - h
    A(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill or C["mid"]}" stroke="{C["ln"]}" stroke-width="1.8"/>')
    rows = rows or max(2, h // 26); cols = cols or max(2, w // 22)
    gw, gh = (w - 16) / cols, (h - 24) / rows
    for r in range(rows):
        for c in range(cols):
            lit = (r * 7 + c * 3 + x) % 5 == 0
            A(f'<rect x="{x+8+c*gw+3:.1f}" y="{y+12+r*gh+3:.1f}" width="{gw-6:.1f}" height="{gh-8:.1f}" rx="1" fill="{C["gold"] if lit else C["far"]}" fill-opacity="{.85 if lit else 1}" stroke="{C["ln"]}" stroke-width=".8" stroke-opacity=".7"/>')
    if roof == 'spire':
        A(f'<path d="M{x+w/2-6} {y}h12l-6 -34z" fill="{C["mid"]}" stroke="{C["ln"]}" stroke-width="1.8"/>')
    elif roof == 'step':
        A(f'<rect x="{x+10}" y="{y-14}" width="{w-20}" height="14" fill="{C["mid"]}" stroke="{C["ln"]}" stroke-width="1.8"/>')

def tree(x, s=1, kind='round'):
    if kind == 'pine':
        A(f'<path d="M{x} {G-60*s}l{16*s} {28*s}h-{8*s}l{14*s} {24*s}h-{44*s}l{14*s} -{24*s}h-{8*s}z" fill="{C["near"]}" stroke="{C["ln"]}" stroke-width="1.2"/>'
          f'<rect x="{x-2}" y="{G-8*s}" width="4" height="{8*s}" fill="{C["ln"]}"/>')
    elif kind == 'palm':
        A(f'<path d="M{x} {G}q4 -40 -2 -70" fill="none" stroke="{C["ln"]}" stroke-width="3"/>')
        for a in (-150, -110, -70, -30, 10):
            r = math.radians(a)
            A(f'<path d="M{x-2} {G-70}q{22*math.cos(r):.1f} {22*math.sin(r)-10:.1f} {36*math.cos(r):.1f} {36*math.sin(r)+8:.1f}" fill="none" stroke="{C["lt"]}" stroke-width="3" stroke-linecap="round"/>')
    else:
        A(f'<rect x="{x-1.5}" y="{G-22*s}" width="3" height="{22*s}" fill="{C["ln"]}"/>'
          f'<circle cx="{x}" cy="{G-34*s}" r="{16*s}" fill="{C["near"]}" stroke="{C["ln"]}" stroke-width="1.2"/>')

def sign(x, logo, label, h=96, r=34):
    cy = G - h
    A(f'<g class="js-sign"><rect x="{x-2}" y="{cy}" width="4" height="{h}" fill="{C["lt"]}"/>'
      f'<circle cx="{x}" cy="{cy}" r="{r+5}" fill="{C["bg"]}" stroke="{C["lt"]}" stroke-width="2"/>'
      f'<circle cx="{x}" cy="{cy}" r="{r}" fill="#fff"/>'
      f'<image href="./images/{logo}" x="{x-r*0.78:.1f}" y="{cy-r*0.78:.1f}" width="{r*1.56:.1f}" height="{r*1.56:.1f}" preserveAspectRatio="xMidYMid meet"/>'
      f'<rect x="{x-len(label)*3.6-8:.1f}" y="{cy+r+12}" width="{len(label)*7.2+16:.1f}" height="18" rx="9" fill="{C["bg"]}" stroke="{C["ln"]}" stroke-width="1"/>'
      f'<text x="{x}" y="{cy+r+25}" text-anchor="middle" class="js-lbl">{label}</text></g>')

def board(x, big, small, w=150, h=74, post=70):
    y = G - post - h
    A(f'<rect x="{x+w*0.25-2}" y="{y+h}" width="4" height="{post}" fill="{C["ln"]}"/><rect x="{x+w*0.75-2}" y="{y+h}" width="4" height="{post}" fill="{C["ln"]}"/>'
      f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{C["bg"]}" stroke="{C["lt"]}" stroke-width="2"/>'
      f'<text x="{x+w/2}" y="{y+38}" text-anchor="middle" class="js-big">{big}</text>'
      f'<text x="{x+w/2}" y="{y+58}" text-anchor="middle" class="js-sm">{small}</text>')

def cloud(x, y, s=1):
    A(f'<path d="M{x} {y}h{70*s}a{14*s} {14*s} 0 0 0 -{14*s} -{14*s}a{20*s} {20*s} 0 0 0 -{36*s} -{6*s}a{14*s} {14*s} 0 0 0 -{20*s} {20*s}z" fill="{C["near"]}" fill-opacity=".55" stroke="{C["ln"]}" stroke-opacity=".7" stroke-width="1.2"/>')

def spark(x, y, s=1):
    A(f'<path class="js-spk" d="M{x} {y-8*s}q1.5 6.5 8 8q-6.5 1.5 -8 8q-1.5 -6.5 -8 -8q6.5 -1.5 8 -8z" fill="{C["gold"]}"><animate attributeName="opacity" values="1;.25;1" dur="{2.4+(x%7)*.3:.1f}s" repeatCount="indefinite"/></path>')

def lights(y0=10, sag=30, step=44):
    half = W / 2
    A(f'<path d="M0 {y0}Q{W/4} {y0+sag} {half} {y0}T{W} {y0}" fill="none" stroke="{C["ln"]}" stroke-opacity=".45" stroke-width="1"/>')
    for i in range(int(W / step)):
        x = i * step + step / 2
        t = (x % half) / half
        y = y0 + sag * 2 * t * (1 - t)
        A(f'<circle cx="{x}" cy="{y+3:.1f}" r="2.6" fill="#ffe7a8"><animate attributeName="opacity" values="1;.4;1" dur="{2+(i%4)*.5}s" begin="{(i%5)*.4}s" repeatCount="indefinite"/></circle>')

# ---------- road ----------
A(f'<rect x="-1" y="{G}" width="{W+2}" height="{H-G}" fill="{C["road"]}"/>'
  f'<path d="M0 {G}H{W}" stroke="{C["ln"]}" stroke-width="2"/>'
  f'<path d="M0 {G+34}H{W}" stroke="{C["ln"]}" stroke-width="2" stroke-dasharray="22 18" opacity=".55"/>')

# ---------- sky ----------
lights()
for x, y, s in [(60, 70, 1), (420, 50, .8), (760, 90, 1.1), (1180, 60, .9), (1520, 80, 1), (1900, 48, .8), (2280, 86, 1.1)]:
    cloud(x, y, s)
for x, y in [(240, 40), (600, 120), (980, 36), (1350, 130), (1700, 30), (2080, 120), (2480, 40)]:
    spark(x, y, .9)

# ---------- 1. Himachal: mountains, pines, home ----------
A(f'<path d="M0 {G}L90 150l50 60 70 -110 120 {G-100}z" fill="{C["far"]}" stroke="{C["ln"]}" stroke-width="1.8"/>'
  f'<path d="M90 150l-22 30 12 -4 10 10 12 -12 10 6zM210 100l-26 36 14 -6 12 12 14 -14 14 8z" fill="{C["lt"]}"/>')
for x in (30, 70, 250, 300):
    tree(x, 1, 'pine')
A(f'<g><rect x="130" y="{G-46}" width="70" height="46" fill="{C["mid"]}" stroke="{C["ln"]}" stroke-width="1.8"/>'
  f'<path d="M122 {G-46}l43 -30 43 30z" fill="{C["near"]}" stroke="{C["lt"]}" stroke-width="1.5"/>'
  f'<rect x="158" y="{G-26}" width="14" height="26" fill="{C["far"]}" stroke="{C["ln"]}"/>'
  f'<rect x="140" y="{G-36}" width="12" height="10" fill="{C["gold"]}" opacity=".85"/><rect x="180" y="{G-36}" width="12" height="10" fill="{C["gold"]}" opacity=".85"/></g>')
A(f'<text x="165" y="{G+22}" text-anchor="middle" class="js-place">Himachal · where it began</text>')

# ---------- 2. IIIT Allahabad campus ----------
A(f'<g><rect x="380" y="{G-92}" width="180" height="92" fill="{C["mid"]}" stroke="{C["ln"]}" stroke-width="1.8"/>'
  f'<path d="M370 {G-92}h200l-100 -36z" fill="{C["near"]}" stroke="{C["lt"]}" stroke-width="1.5"/>')
for i in range(6):
    A(f'<rect x="{392+i*28}" y="{G-80}" width="10" height="80" fill="{C["far"]}" stroke="{C["ln"]}"/>')
A(f'<path d="M455 {G-30}h30v30h-30z" fill="{C["bg"]}" stroke="{C["lt"]}"/></g>')
sign(610, 'iiit-logo.png', 'IIIT Allahabad', 110)
A(f'<text x="470" y="{G+22}" text-anchor="middle" class="js-place">B.Tech, IIIT Allahabad</text>')

# ---------- 3. Times Internet / Dineout restaurant street ----------
bld(690, 90, 150, roof='step')
A(f'<g><rect x="800" y="{G-80}" width="150" height="80" fill="{C["mid"]}" stroke="{C["ln"]}" stroke-width="1.8"/>')
for i in range(6):
    A(f'<path d="M{800+i*25} {G-80}h25v14a12.5 12.5 0 0 1 -25 0z" fill="{C["lt"] if i%2 else C["near"]}" stroke="{C["ln"]}"/>')
A(f'<rect x="815" y="{G-50}" width="44" height="34" fill="{C["far"]}" stroke="{C["ln"]}"/><rect x="890" y="{G-50}" width="44" height="50" fill="{C["far"]}" stroke="{C["ln"]}"/>'
  f'<circle cx="837" cy="{G-33}" r="9" fill="none" stroke="{C["gold"]}" stroke-width="2"/><path d="M822 {G-33}v-8M852 {G-33}v-8" stroke="{C["gold"]}" stroke-width="2"/></g>')
sign(990, 'brandLogo/swiggy-dineout.svg', 'Swiggy Dineout', 104)
sign(1070, 'brandLogo/times-internet.svg', 'Times Internet', 70, 26)
A(f'<text x="870" y="{G+22}" text-anchor="middle" class="js-place">Dineout · Times Internet</text>')

# ---------- 4. Travacations: plane + palm ----------
tree(1130, 1, 'palm'); tree(1165, .8, 'palm')
A(f'<g transform="translate(1150 92)"><g>'
  f'<path d="M-70 8h62" stroke="{C["lt"]}" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 8"><animate attributeName="stroke-dashoffset" values="0;28" dur="1s" repeatCount="indefinite"/></path>'
  f'<path d="M44 6l16 -18h9l-6 18z" fill="{C["lt"]}"/>'
  f'<path d="M2 2l-8 -22h11l15 20z" fill="{C["lt"]}"/>'
  f'<path d="M4 0h76c16 0 28 4 34 8c-6 4 -18 8 -34 8h-76a8 8 0 0 1 0 -16z" fill="#fff"/>'
  f'<path d="M100 3.5c5 1 9 2.5 12 4.5h-12z" fill="{C["bg"]}"/>'
  + ''.join(f'<circle cx="{24+i*9}" cy="7" r="1.8" fill="{C["bg"]}"/>' for i in range(8)) +
  f'<path d="M42 11l20 26h10l-6 -26z" fill="{C["gold"]}"/>'
  f'<animateTransform attributeName="transform" type="translate" values="0 0;0 -7;0 0" dur="4s" repeatCount="indefinite"/></g></g>')
sign(1230, 'brandLogo/trava-cation.svg', 'Travacations', 96)

# ---------- 5. Jio / Reliance tower ----------
bld(1310, 110, 210, roof='spire')
A(f'<rect x="1335" y="{G-196}" width="60" height="22" rx="4" fill="{C["bg"]}" stroke="{C["lt"]}"/><text x="1365" y="{G-180}" text-anchor="middle" class="js-tw">JIO</text>')
for r in (14, 24, 34):
    A(f'<path d="M{1365-r} {G-244-r*0.4:.0f}a{r} {r} 0 0 1 {2*r} 0" fill="none" stroke="{C["lt"]}" stroke-width="1.6" class="js-wave"/>')
bld(1430, 70, 140)
board(1510, '100M+', 'users impacted')
sign(1690, 'brandLogo/jio.svg', 'Jio', 120)
sign(1760, 'brandLogo/jiomart.svg', 'JioMart', 84, 26)
sign(1830, 'brandLogo/netmeds.svg', 'Netmeds', 112)
A(f'<text x="1400" y="{G+22}" text-anchor="middle" class="js-place">Jio Platforms · Reliance</text>')

# ---------- 6. Urban Ladder ----------
A(f'<g><rect x="1880" y="{G-70}" width="110" height="70" fill="{C["mid"]}" stroke="{C["ln"]}" stroke-width="1.8"/>'
  f'<path d="M1896 {G-12}v-20a6 6 0 0 1 6 -6h66a6 6 0 0 1 6 6v20zM1902 {G-38}v-10h66v10" fill="{C["near"]}" stroke="{C["lt"]}" stroke-width="1.4"/></g>')
sign(2030, 'brandLogo/urban-ladder.svg', 'Urban Ladder', 92, 26)

# ---------- 7. Delhivery, Gurgaon skyline ----------
bld(2090, 80, 230, roof='spire'); bld(2180, 100, 180, roof='step'); bld(2290, 70, 250)
board(2380, '10 yrs', 'designing products', 150)
sign(2560, 'brandLogo/delhivery.svg', 'Delhivery', 110)
A(f'<text x="2230" y="{G+22}" text-anchor="middle" class="js-place">Delhivery · Gurgaon</text>')


# ---------- movers (overlay, not tiled) ----------
truck = (f'<g class="js-truck"><rect x="0" y="-34" width="58" height="34" rx="3" fill="{C["wh"]}"/>'
         f'<path d="M58 -24h16l10 12v12h-26z" fill="{C["lt"]}"/><rect x="64" y="-20" width="10" height="8" fill="{C["bg"]}"/>'
         f'<text x="29" y="-12" text-anchor="middle" class="js-trk">DELHIVERY</text>'
         f'<circle cx="16" cy="2" r="7" fill="{C["bg"]}" stroke="{C["wh"]}" stroke-width="2.5"/><circle cx="68" cy="2" r="7" fill="{C["bg"]}" stroke="{C["wh"]}" stroke-width="2.5"/></g>')
bike = (f'<g class="js-bike" fill="none" stroke="{C["wh"]}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
        + ''.join(f'<g transform="translate({cx} 0)"><circle r="11"/><path d="M-11 0h22M0 -11v22" stroke-width="1.2"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur=".6s" repeatCount="indefinite"/></path></g>' for cx in (0, 38)) +
        f'<path d="M0 0l12 -20h20l6 20M12 -20l8 20h-20M20 0l12 -20M10 -26h7M30 -24l4 -6h5"/>'
        f'<path d="M22 -24l-6 -14 10 -8M18 -36l12 4 4 6" stroke="{C["gold"]}"/><circle cx="26" cy="-50" r="5" fill="{C["gold"]}" stroke="none"/></g>')
dog = lambda x, s: (f'<g transform="translate({x} 0) scale({s})"><path d="M0 -14h26a6 6 0 0 1 6 -6l4 -4v8l4 2v6h-8v14h-4v-8h-20v8h-4v-14l-6 -8z" fill="{C["lt"]}"/></g>')
dogs = f'<g class="js-dogs">{dog(0, 1)}{dog(54, .85)}</g>'

A(f'<g transform="translate(0 {G+44})"><g>{truck}<animateTransform attributeName="transform" type="translate" values="{W} 0;0 0" dur="60s" repeatCount="indefinite"/></g></g>')
A(f'<g transform="translate(0 {G+66})"><g>{bike}<animateTransform attributeName="transform" type="translate" values="0 0;{W} 0" dur="38s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -1.5;0 0" dur=".6s" repeatCount="indefinite"/></g></g><g transform="translate(240 {G+70})">{dogs}</g>')
tile = ''.join(o)
F='font-family="Inter, system-ui, sans-serif"'; SF='font-family="Fraunces, Georgia, serif"'
for k,v in {'js-lbl':f'{F} font-size="11" font-weight="600" fill="#fff"',
            'js-place':f'{F} font-size="12" font-weight="600" fill="#ffd2b8" letter-spacing=".5"',
            'js-big':f'{SF} font-size="26" font-weight="700" fill="#f2c66d"',
            'js-sm':f'{F} font-size="11" font-weight="500" fill="#ffe3cf"',
            'js-tw':f'{F} font-size="12" font-weight="800" fill="#fff" letter-spacing="1.2"',
            'js-trk':f'{F} font-size="7.5" font-weight="800" fill="#3e0f22" letter-spacing=".4"'}.items():
    tile=tile.replace(f'class="{k}"', v)
svg = (f'<svg class="js-svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMinYMax slice" aria-hidden="true" focusable="false">'
       f'<defs><g id="js-tile">{tile}</g></defs>'
       f'<g class="js-track"><use href="#js-tile"/><use href="#js-tile" x="{W}"/></g></svg>')

section = f'''<!-- JOURNEY STRIP:START (generated) -->
    <section class="journey" aria-labelledby="h-journey">
      <div class="jr-head">
        <p class="jr-kicker">10 years · 7 brands · 100M+ users</p>
        <h2 id="h-journey">The road so far</h2>
        <p class="jr-sub">From a home in the Himachal hills to designing at India's biggest consumer brands.</p>
      </div>
      <div class="jr-scene">
        {svg}
        <ul class="jr-sr">
          <li>Grew up in Himachal Pradesh</li><li>Studied design at IIIT Allahabad</li><li>Swiggy Dineout and Times Internet</li>
          <li>Travacations</li><li>Jio Platforms: MyJio, JioMart, Netmeds</li><li>Urban Ladder</li><li>Delhivery, Gurgaon</li>
        </ul>
      </div>
    </section>
    <!-- JOURNEY STRIP:END -->'''

p = sys.argv[1]
s = open(p).read()
s = re.sub(r'\s*<!-- JOURNEY STRIP:START.*?JOURNEY STRIP:END -->', '', s, flags=re.S)
s = s.replace('\n    <footer class="footer">', '\n    ' + section + '\n\n    <footer class="footer">', 1)
open(p, 'w').write(s)
print('ok', len(section))
