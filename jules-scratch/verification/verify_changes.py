from playwright.sync_api import Page, expect

def test_landing_page(page: Page):
    page.goto("http://localhost:3000")
    expect(page.get_by_text("Automate Your Workflows")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/landing_page.png")

def test_workflow_page(page: Page):
    page.goto("http://localhost:3000/workflow")
    expect(page.get_by_text("Script Input")).to_be_visible()
    expect(page.get_by_text("Audio Output")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/workflow_page.png")