
import re
from playwright.sync_api import sync_playwright, Page, expect
import os

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f"file://{os.getcwd()}/index.html")
        page.set_viewport_size({"width": 1920, "height": 1080})
        page.mouse.wheel(0, 10000)
        page.wait_for_timeout(500)
        last_link = page.locator(".sections-nav a").last
        expect(last_link).to_have_class(re.compile(r"\\bactive\\b"))
        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

if __name__ == "__main__":
    main()
