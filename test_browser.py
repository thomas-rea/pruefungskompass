from playwright.sync_api import sync_playwright
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading, functools
base=Path(__file__).parent
html=(base/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+ (base/'style.css').read_text() +'</style>')
html=html.replace('<script src="app.js" defer></script>','<script>'+ (base/'app.js').read_text() +'</script>')
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    desktop=b.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
    desktop.set_default_timeout(8000)
    errors=[]
    desktop.on('pageerror',lambda e: errors.append(str(e)+'\n'+e.stack))
    desktop.set_content(html,wait_until="load")
    desktop.get_by_role('button',name='Beispiel: bestanden').click()
    assert 'BESTANDEN' in desktop.locator('#resultLabel').inner_text(),desktop.locator('#resultLabel').inner_text()
    desktop.screenshot(path=str(base/'desktop-preview.png'),full_page=True)
    for job in ['im','eat','ebt','maf','chem','am','mech']:
        desktop.locator(f'[data-job="{job}"]').click()
        desktop.locator('#sampleTypical').click()
        print(job,desktop.locator('#resultLabel').inner_text(),desktop.locator('#resultScore').inner_text())
        assert desktop.locator('#resultLabel').inner_text()=='BESTANDEN'
        assert desktop.locator('#legislation a').count()>=3
    # Grenzfall mit mindestens einer sinnvollen muendlichen Ergänzungsprüfung.
    for job in ['mech','im','eat','ebt','maf','chem','am']:
        desktop.locator(f'[data-job="{job}"]').click()
        desktop.locator('#sampleFail').click()
        assert desktop.locator('#resultLabel').inner_text()=='NICHT BESTANDEN',job
        eligible=desktop.locator('#oralPanel [data-oral]').evaluate_all('(xs)=>xs.map(x=>x.dataset.oral)')
        assert len(eligible)>0,job
        choose=eligible[:1] if job in ('mech','chem') else eligible
        for id in choose:
            desktop.locator(f'#oralPanel [data-oral="{id}"]').check()
            desktop.locator(f'#oral-range-{id}').fill('100')
        assert desktop.locator('#resultLabel').inner_text()=='BESTANDEN',job
    # Praxis in MAF unter 50 muss durchfallen, trotz sehr guter Theorie
    desktop.locator('[data-job="maf"]').click()
    desktop.locator('#sampleTypical').click()
    desktop.locator('#n-praxis').fill('49')
    desktop.locator('#n-praxis').dispatch_event('change')
    assert desktop.locator('#resultLabel').inner_text()=='NICHT BESTANDEN'
    # Simuliertes A/B für Chemie; prozentuale Anteile prüfen
    desktop.locator('[data-job="chem"]').click()
    desktop.locator('#sampleTypical').click()
    desktop.locator('#advancedToggle').check()
    assert desktop.locator('#split-p2praxis').is_visible()
    desktop.locator('#s-p2praxis-0').fill('60')
    desktop.locator('#s-p2praxis-0').dispatch_event('change')
    desktop.locator('#s-p2praxis-1').fill('50')
    desktop.locator('#s-p2praxis-1').dispatch_event('change')
    desktop.locator('#s-p2praxis-2').fill('40')
    desktop.locator('#s-p2praxis-2').dispatch_event('change')
    assert '54' in desktop.locator('#split-total-p2praxis').inner_text()
    # Mündliche Ergänzung in Mechatronik
    desktop.locator('[data-job="mech"]').click()
    desktop.locator('#sampleFail').click()
    assert desktop.locator('#resultLabel').inner_text()=='NICHT BESTANDEN'
    assert desktop.locator('#oralPanel [data-oral]').count()>0
    desktop.locator('#oralPanel [data-oral]').first.check()
    assert desktop.locator('#oralPanel input[type=range]').count()>0
    desktop.locator('#oralPanel input[type=range]').first.fill('100')
    assert desktop.locator('#resultLabel').inner_text()=='BESTANDEN'
    phone=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
    phone.on('pageerror',lambda e:errors.append('mobile '+str(e)))
    phone.set_content(html,wait_until="load")
    phone.locator('#mobileSelect').select_option('eat')
    phone.locator('#sampleTypical').click()
    phone.screenshot(path=str(base/'mobile-preview.png'),full_page=True)
    assert phone.locator('#stickyBar').is_visible()
    assert phone.locator('#stickyState').inner_text()=='BESTANDEN'
    dimensions=phone.evaluate('({scroll: document.documentElement.scrollWidth,inner:window.innerWidth})')
    print('mobile dimensions', dimensions)
    assert dimensions['scroll']<=dimensions['inner']+1,'Horizontaler Überlauf'
    assert errors==[],errors
    print('Browser- und Mobiltests erfolgreich.')
    b.close()

