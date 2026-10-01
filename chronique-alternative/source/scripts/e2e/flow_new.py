import os
import asyncio, json
from playwright.async_api import async_playwright
from common import *
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); ctx=await b.new_context(viewport={"width":1280,"height":720})
        p=await ctx.new_page(); errs=[]; hook(p,errs)
        await p.goto(BASE); await p.wait_for_timeout(1200)
        await p.keyboard.press("Enter"); await p.wait_for_timeout(1200)
        await p.click(".t-item.principal"); await p.wait_for_timeout(1200)
        await p.fill(".v2 input[type=text], .v2 input:not([type=number])", "Testeur")
        for i in range(3):
            await p.click(".c-boutons .btn.principal"); await p.wait_for_timeout(400)
            await p.screenshot(path=f"{SHOTS}/flow/0a-creation-{i+2}.png")
        await p.click(".c-boutons .btn.principal"); await p.wait_for_timeout(2500)
        await p.screenshot(path=f"{SHOTS}/flow/0b-prologue.png")
        print(await buttons(p))
        await p.click("text=Passer le prologue"); await p.wait_for_timeout(2000)
        await p.screenshot(path=f"{SHOTS}/flow/0c-premier-hud.png")
        print(await buttons(p))
        print(errs)
        await b.close()
asyncio.run(main())
