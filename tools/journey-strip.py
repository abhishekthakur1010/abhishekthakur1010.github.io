#!/usr/bin/env python3
"""Journey strip v3: light, fine-line (monoline) illustration that sits quietly above the footer."""
import re, sys

G = 150                       # ground line in a 1200 x 150 viewBox
L = []
A = L.append
BG = 'var(--jr-bg)'           # fills hide lines behind shapes, matching the band

# 1. Himachal: layered ridges, snow caps, a small home and pines
A(f'<path d="M14 {G}L58 92l18 20 36 -56 30 40 14 -12 40 66" fill="{BG}"/>'
  f'<path d="M14 {G}L58 92l18 20 36 -56 30 40 14 -12 40 66"/>'
  '<path d="M49 104l9 -12 7 8M101 72l11 -16 11 15" />'
  f'<path d="M62 {G}v-30h34v30" fill="{BG}"/><path d="M56 {G-30}l23 -18 23 18"/>'
  f'<path d="M88 {G-40}v-10h5v14"/><path d="M75 {G}v-14h8v14M67 {G-22}h6v6h-6z"/>'
  f'<path d="M150 {G}l9 -26 9 26M154 {G-12}h10M164 {G}l7 -20 7 20"/>')
# 2. IIIT Allahabad: pediment, columns and steps
A(f'<path d="M244 {G-58}h112v58h-112z" fill="{BG}" stroke="none"/>'
  f'<path d="M236 {G-58}l64 -24 64 24zM240 {G-58}h120"/><path d="M244 {G-52}h112"/>'
  + ''.join(f'<path d="M{252+i*19.2:.1f} {G-52}v44"/>' for i in range(6)) +
  f'<path d="M240 {G-8}h120M234 {G-4}h132"/><circle cx="300" cy="{G-68}" r="4"/>')
# 3. Swiggy Dineout: café with scalloped awning, window with a cloche, hanging sign
A(f'<path d="M444 {G}v-62h112v62" fill="{BG}"/>'
  f'<path d="M440 {G-62}h120"/>'
  + ''.join(f'<path d="M{440+i*20} {G-62}v6a10 10 0 0 0 20 0v-6"/>' for i in range(6)) +
  f'<path d="M454 {G-38}h44v28h-44zM512 {G}v-38h30v38M535 {G-18}v2"/>'
  f'<path d="M462 {G-18}h28M465 {G-18}a11 9 0 0 1 22 0M476 {G-27}v-2"/>'
  f'<path d="M566 {G-46}h14v14h-14zM573 {G-46}v-8"/>')
# 4. Travacations: palms, a sun and a small plane on a dotted route
for x, h, lean in ((664, 64, 6), (694, 50, -4), (744, 58, 5)):
    tx = x + lean
    A(f'<path d="M{x} {G}q{lean*.2:.1f} -{h*.55:.1f} {lean} -{h}"/>'
      + ''.join(f'<path d="M{tx} {G-h}q{dx*.5} {-9 if dy<0 else -6} {dx} {dy}"/>' for dx, dy in ((-18, 6), (-12, -6), (12, -6), (18, 6))))
A('<circle cx="770" cy="54" r="12"/>')
A('<path class="jr-route" d="M612 70q50 -40 110 -26" stroke-dasharray="2 5"/>'
  '<g class="jr-plane"><path d="M724 44l8 -1 14 -8h5l-6 9 10 -1 4 -4h3l-2 6 2 6h-3l-4 -4 -10 -1 6 9h-5l-14 -8 -8 -1a1.5 1.5 0 0 1 0 -2z" fill="var(--jr-bg)" transform="rotate(-10 740 44) translate(740 44) scale(1.35) translate(-740 -44)"/></g>')
# 5. Jio Platforms: tower with antenna and signal arcs, a lower block beside it
A(f'<path d="M872 {G}v-118h56v118" fill="{BG}"/><path d="M866 {G-118}h68"/>'
  + ''.join(f'<path d="M{884+i*12} {G-108}v96" stroke-opacity=".55"/>' for i in range(4)) +
  f'<path d="M900 {G-118}v-14"/>'
  + ''.join(f'<path class="jr-sig" style="animation-delay:{i*.3}s" d="M{900-r} {G-138}a{r} {r} 0 0 1 {2*r} 0"/>' for i, r in enumerate((6, 12, 18))) +
  f'<path d="M934 {G}v-56h36v56" fill="{BG}"/>' + ''.join(f'<path d="M940 {G-46+r*12}h24" stroke-opacity=".55"/>' for r in range(4)) +
  f'<path d="M828 {G}v-38h32v38" fill="{BG}"/><path d="M836 {G-28}h6v6h-6zM848 {G-28}h6v6h-6z"/>')
# 6. Delhivery, Gurgaon: three towers (one with a slanted crown) and a parked van
A(f'<path d="M1024 {G}v-96l40 -14v110" fill="{BG}"/>' + ''.join(f'<path d="M1030 {G-84+r*12}h28" stroke-opacity=".55"/>' for r in range(7)) +
  f'<path d="M1072 {G}v-128h44v128" fill="{BG}"/><path d="M1094 {G-128}v-10"/>' + ''.join(f'<path d="M{1080+c*10} {G-118}v108" stroke-opacity=".55"/>' for c in range(3)) +
  f'<path d="M1124 {G}v-74h34v74" fill="{BG}"/>' + ''.join(f'<path d="M1130 {G-64+r*12}h22" stroke-opacity=".55"/>' for r in range(5)) +
  f'<path d="M1166 {G-4}v-22h22l8 9v13" fill="{BG}"/><circle cx="1172" cy="{G-3}" r="3" fill="{BG}"/><circle cx="1190" cy="{G-3}" r="3" fill="{BG}"/>')
# horizon
A(f'<path d="M-400 {G}H1600" class="jr-ground"/>')

landsvg = ('<svg class="jr-land" viewBox="0 0 1200 152" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">'
           f'<g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">{"".join(L)}</g></svg>')

bike = ('<svg class="jr-bike" viewBox="-13 -44 64 58" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
        + ''.join(f'<g transform="translate({cx} 0)"><circle r="10"/><path class="jr-spoke" d="M-10 0h20M0 -10v20" stroke-opacity=".5"/></g>' for cx in (0, 36)) +
        '<path d="M0 0l11 -18h19l6 18M11 -18l7 18h-18M18 0l12 -18M9 -23h6M28 -21l4 -5h4"/>'
        '<path d="M20 -21l-5 -11 8 -6M17 -30l10 3 4 5"/><circle cx="24" cy="-41" r="3.5"/></g></svg>')

def tile(src, alt, cls=''):
    return f'<span class="jr-tile{cls}"><img src="./images/{src}" alt="{alt}" loading="lazy" /></span>'

stops = [
    ('Before 2012', 'Himachal', 'Where it began', '<span class="jr-tile jr-tile--home" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19 9 9l3 4 3-5 6 11z"/><path d="M7.5 11.5 9 9l1.5 2"/></svg></span>', ''),
    ('2012 – 2016', 'IIIT Allahabad', 'B.Tech, Information Technology', tile('iiit-logo.png', 'IIIT Allahabad'), ''),
    ('2016 – 2019', 'Swiggy Dineout', 'Senior UX Designer, Manager II', tile('brandLogo/swiggy-dineout.svg', 'Swiggy Dineout'), ''),
    ('2019 – 2022', 'Travacations', 'Design Strategy', tile('brandLogo/trava-cation.svg', 'Travacations', ' jr-tile--wide'), ''),
    ('2022 – 2023', 'Jio Platforms', 'Senior UX Manager', tile('brandLogo/jio.svg', 'Jio'), ''),
    ('2023 – now', 'Delhivery', 'Lead, Gurgaon Design Team', tile('brandLogo/delhivery.svg', 'Delhivery', ' jr-tile--wide'), ''),
]
lis = ''.join(
    f'<li class="jr-stop{" is-now" if i == len(stops)-1 else ""}">'
    f'<span class="jr-dot" aria-hidden="true"></span><div class="jr-info">{main}<p class="jr-year">{yr}</p><p class="jr-co">{co}</p><p class="jr-role">{role}</p></div></li>'
    for i, (yr, co, role, main, _) in enumerate(stops))

section = f'''<!-- JOURNEY STRIP:START (generated by tools/journey-strip.py) -->
    <section class="journey" aria-labelledby="h-journey">
      <div class="jr-head">
        <h2 id="h-journey">The road so far</h2>
        <p class="jr-sub">From the Himachal hills to India's biggest consumer brands.</p>
      </div>
      <div class="jr-scroll" tabindex="0" aria-label="Career timeline">
        <div class="jr-track">
          <div class="jr-scene">{landsvg}{bike}</div>
          <ol class="jr-stops">{lis}</ol>
        </div>
      </div>
    </section>
    <!-- JOURNEY STRIP:END -->'''

p = sys.argv[1]
s = open(p).read()
s = re.sub(r'\s*<!-- JOURNEY STRIP:START.*?JOURNEY STRIP:END -->', '', s, flags=re.S)
s = s.replace('\n    <footer class="footer">', '\n    ' + section + '\n\n    <footer class="footer">', 1)
open(p, 'w').write(s)
print('ok', len(section))
