from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000/studio")
        page.wait_for_selector('textarea[placeholder="Paste or type your script here..."]')
        page.fill('textarea[placeholder="Paste or type your script here..."]', "Hello, this is a test script.")
        page.click('button:has-text("Generate Voice-Over")')
        page.wait_for_selector('audio')
        page.screenshot(path="jules-scratch/verification/verification.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
