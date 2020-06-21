const {
  openBrowser,
  goto,
  write,
  press,
  textBox,
  into,
  dropDown,
  click,
  closeBrowser
} = require("taiko");
(async () => {
  try {
    // Login
    await openBrowser({ headless: false });
    await goto("https://versjon2.herokuapp.com/admin/login/?next=/admin/");
    await write("admin", into(textBox("Username:")));
    await write("admin", into(textBox("Password:")));
    await press("Enter");

    // Users
    const users = [
      {
        username: "lead",
        password: "lead",
        role: "Lead Engineer",
        name: "Inge Ingeniør"
      },
      {
        username: "operator",
        password: "operator",
        role: "Operator",
        name: "Ola Operator"
      },
      {
        username: "quality",
        password: "quality",
        role: "Quality Control",
        name: "Kari Kvalitet"
      },
      {
        username: "supervisor",
        password: "supervisor",
        role: "Supervisor",
        name: "Vilde Veileder"
      },
      {
        username: "spectator",
        password: "spectator",
        role: "Spectator",
        name: "Tiril Tilskuer"
      }
    ];

    // Add users
    for (const user of users) {
      // Add user
      await goto("https://versjon2.herokuapp.com/admin/auth/user/add/");
      await write(user.username, into(textBox("Username:")));
      await write(user.password, into(textBox("Password:")));
      await write(user.password, into(textBox("Password confirmation:")));
      await press("Enter");
      await dropDown("Role").select(user.role);
      await write(user.name, into(textBox("Name:")));
      await click("SAVE");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
