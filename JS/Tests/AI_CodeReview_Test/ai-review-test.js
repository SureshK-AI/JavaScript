async function loginUser(page, username, password) {
    await page.locator("#username").fill(username);
    await page.locator("#password").fill(password);
    await page.locator("#login").click();
}

module.exports = { loginUser };
