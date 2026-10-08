"""Build a portable HTML print view from the canonical exhibition Markdown."""
from pathlib import Path
import base64
import importlib.util
import re

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / '.agents/skills/print-pdf/scripts/md_to_html.py').exists())
converter = ROOT / '.agents/skills/print-pdf/scripts/md_to_html.py'
spec = importlib.util.spec_from_file_location('house_markdown', converter)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
body = module.convert((HERE / 'essay.md').read_text())

def embed(match):
    asset = HERE / match.group(1)
    mime = 'image/svg+xml' if asset.suffix == '.svg' else 'image/png'
    return 'src="data:' + mime + ';base64,' + base64.b64encode(asset.read_bytes()).decode() + '"'

body = re.sub(r'src="(assets/[^"]+)"', embed, body)
body = re.sub(r'<p>(<img[^>]+>)</p>\s*<p><em>(Figure.*?)</em></p>', r'<figure>\1<figcaption>\2</figcaption></figure>', body, flags=re.S)
body = body.replace('<h2 id="wall-label">', '<h2 class="new-page" id="wall-label">')
body = body.replace('<h2 id="annotated-anatomy">', '<h2 class="new-page" id="annotated-anatomy">')
body = body.replace('<h2 id="six-visual-candidates">', '<h2 class="new-page" id="six-visual-candidates">')
font = base64.b64encode((ROOT / '.agents/skills/print-pdf/fonts/InterVariable.ttf').read_bytes()).decode()
css = '''
@font-face {font-family:Inter;src:url(data:font/ttf;base64,FONT) format('truetype');font-weight:100 900}
*{box-sizing:border-box}body{margin:0;background:#edf0ed;color:#162126;font-family:Inter,Arial,sans-serif}
main{max-width:950px;margin:40px auto;background:white;padding:60px 70px}h1{font-size:44px;line-height:1.12;margin:0 0 24px;letter-spacing:-1px}
h2{font-size:25px;line-height:1.2;margin:40px 0 16px}p,li{font-size:17px;line-height:1.65}a{color:#234c58;text-decoration:underline;text-underline-offset:3px}
figure{margin:35px 0;break-inside:avoid;page-break-inside:avoid}figure img{display:block;max-width:100%;max-height:620px;margin:auto;object-fit:contain}
figcaption{font-size:13px;line-height:1.5;margin:12px auto 0;max-width:700px}p>img{max-width:100%;height:auto}table{width:100%;border-collapse:collapse;font-size:13px;line-height:1.5}
th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #bdc9cb}th{font-weight:700}ol{padding-left:23px}li{margin:0 0 24px}hr{border:0;border-top:1px solid #bdc9cb;margin-top:45px}
@page{size:11in 17in;margin:.8in} @media print{body{background:white}main{max-width:none;margin:0;padding:0}h1{font-size:40pt}h2{font-size:23pt;break-after:avoid}p,li{font-size:15pt;line-height:1.55;orphans:3;widows:3}figure img{max-height:7.5in}figcaption{font-size:11pt}a{color:inherit}table{font-size:11pt}tr{break-inside:avoid}.new-page{break-before:page}hr{display:none}}
'''.replace('FONT', font)
page = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>The loose leaf binder and the Trapper Keeper</title><style>' + css + '</style></head><body><main>' + body + '</main></body></html>'
(HERE / 'print.html').write_text(page)
print('Built portable print.html with five embedded illustrations and embedded Inter font')
