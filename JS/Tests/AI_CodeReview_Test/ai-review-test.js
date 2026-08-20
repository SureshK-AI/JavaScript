// function loginUser(page) {

//     const username = "admin";
//     const password = "Password123";

//     page.locator("#username").fill(username);
//     page.locator("#password").fill(password);

//     page.waitForTimeout(5000);

//     page.locator("#login").click();

//     console.log("Login completed");
// }

// module.exports = { loginUser };

async function loginUser(page, username, password) {
    await page.locator("#username").fill(username);
    await page.locator("#password").fill(password);
    await page.locator("#login").click();
}

module.exports = { loginUser };