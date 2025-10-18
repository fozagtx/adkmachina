from playwright.sync_api import sync_playwright, Page, expect
import os

def verify_landing_page(page: Page):
    """
    This test verifies that the new landing page is displayed correctly.
    """
    # 1. Arrange: Go to the application's home page.
    file_path = os.path.abspath(".next/server/app/index.html")
    page.goto(f"file://{file_path}")

    # 2. Assert: Check for the main headline.
    expect(page.get_by_role("heading", name="Automate UGC Content.")).to_be_visible()

    # 3. Assert: Check for the tagline.
    expect(page.get_by_text("You Weren't Born Viral.")).to_be_visible()

    # 4. Assert: Check for the CTA button.
    expect(page.get_by_role("link", name="Start Automating")).to_be_visible()

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    verify_landing_page(page)
    browser.close()