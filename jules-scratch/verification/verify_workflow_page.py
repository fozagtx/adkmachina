from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:3000/workflow")
    page.screenshot(path="jules-scratch/verification/workflow_page.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)