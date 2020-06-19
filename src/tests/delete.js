const {
  openBrowser,
  goto,
  textBox,
  press,
  write,
  click,
  closeBrowser,
  into,
  waitFor,
  clear,
  focus,
  below,
  accept,
  confirm
} = require("taiko");

(async () => {
  try {
    // Login
    await openBrowser({ headless: true, observe: false });
    await goto("http://localhost:3000/");
    await press("Tab");
    await write("admin");
    await press("Tab");
    await write("admin");
    await press("Enter");
    await waitFor(5000);
    await goto("http://localhost:3000/");

    // Delete Projects
    while (await $(`//*[text()='Test Project']`).exists()) {
      prompt(
        "To delete a project is irreversible. Enter the project name to confirm deletion:",
        async () => await accept("Test Project")
      );
      confirm(
        'Are you sure? The project "Test Project" will be gone forever. Tip: You may need to refresh the browser to see the changes.',
        async () => await accept()
      );
      await click("Delete Project", below("Test Project"));
      await goto("http://localhost:3000/");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
