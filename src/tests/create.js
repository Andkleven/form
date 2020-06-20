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
  attach,
  to,
  fileField,
  checkBox,
  below
} = require("taiko");

async function login() {
  await openBrowser({ headless: false });
  await goto("http://localhost:3000/");
  await press("Tab");
  await write("lead");
  await press("Tab");
  await write("lead");
  await press("Enter");
  await waitFor(3000);
  await goto("http://localhost:3000/");
}

async function select(option, label, selector) {
  await click(label, selector);
  await press("Tab");
  await write(option);
  await press("Enter");
}

(async (projectName = "Test Project", items = 10) => {
  try {
    // Login
    await login();

    // Create Project
    await waitFor("Create new project");
    await click("Create new project");
    await write(projectName, textBox("Project Name"));
    await write("2", textBox("Number of Descriptions"));
    await write(items, textBox("Total Number of Items"));
    await click("Submit");

    // Description 1
    await write("Description 1", textBox("Description"));
    await press("Tab");
    await write("Coated Item");
    await press("Enter");
    await write("IFS123", textBox("IFS Activity Codes"));
    await write("CPS123", textBox("CPS"));

    await attach(
      "./dummies/dummy.png",
      to(
        fileField(
          { id: "File Upload" },
          {
            selectHiddenElements: true
          }
        )
      )
    );

    await click("Submit");

    // Add items

    const itemNumbers = Array.from(Array(items).keys());
    let itemIds1 = [];
    for (const number of itemNumbers) {
      if (number < Math.floor(items / 2)) {
        itemIds1.push(`ItemID${number + 1}`);
      }
    }

    await focus(textBox({ id: "custom-undefined-Item ID-undefined" }));

    for (const itemId of itemIds1) {
      await clear();
      await write(itemId);
      await press("Enter");
    }

    await click("Open all items");

    // Steel Preparation
    await select("Carbon", "Steel");
    await press("Tab");
    await write("Grit");
    await press("Enter");
    await click("Primer 1");
    await press("Tab");
    await write("Carbon");
    await press("Enter");
    await click("Submit");

    // Coating and Visualization
    await write("10", textBox("Ordered Total Rubber Thickness"));
    await press("Tab");
    await write("0");
    await press("Tab");
    await write("5");
    await write("1", textBox("Measurement Points"));
    await select("OD", "TDV (Target Description Value)");
    await write("10", textBox("Measurement Point Actual Steel"));
    await write("A", textBox("Reference Point"));
    await click("Add rubber cement");
    await write("69", textBox("Rubber Cement"));
    // Step 1
    await select("Hot Air", "Vulcanization Option");
    await write("1337", textBox("Program Number"));
    await write("2", textBox("Number of Layers"));
    // Layer 1 - Layers need work after adding indexes!
    await select("73165 3mm", "Compound Number");
    await write("5", textBox("Applied Thickness"));
    await write("0", textBox("Shrink"));
    // Layer 2
    await select("73165 3mm", "Compound Number", below("Cumulative Thickness"));
    await write(
      "6",
      textBox("Applied Thickness", below("Cumulative Thickness"))
    );
    await write("5", textBox("Shrink", below("Cumulative Thickness")));
    await click("Submit");

    // Final Inspection
    await write("123", textBox("Hardness of Outer Layer"));
    await write("1", textBox("Number of Hardness of Outer Layer"));
    await write("123", textBox("Identification Marking"));
    await write("123", textBox("Peel Test"));
    await write("1", textBox("Number of Peel Test"));

    try {
      await checkBox("Total Coating Thickness").check();
    } catch (error) {
      console.log(error);
      await click("Total Coating Thickness");
    }
    try {
      await checkBox("Spark Test").check();
    } catch (error) {
      console.log(error);
      await click("Spark Test");
    }

    await click("Advanced Final Dimensions Check");
    await write("Ref B", textBox("Final Dimensions Reference"));
    await press("Tab");
    await write("10");
    await press("Tab");
    await write("11");
    await click("Submit");
    await click("Back");

    await click("Next");

    // Description 2
    await write("Description 2", into(textBox({ name: "description" })));
    await press("Tab");
    await write("Mould");
    await press("Enter");
    await write("IFS123", into(textBox({ name: "ifsActivityCodes" })));
    await write("CPS123", into(textBox({ name: "CPS" })));

    await attach(
      "./dummies/dummy.png",
      to(
        fileField(
          { id: "File Upload" },
          {
            selectHiddenElements: true
          }
        )
      )
    );

    await click("Submit");

    // Add items

    let itemIds2 = [];
    for (const number of itemNumbers) {
      if (number >= Math.floor(items / 2)) {
        itemIds2.push(`ItemID${number + 1}`);
      }
    }

    await focus(textBox({ id: "custom-undefined-Item ID-undefined" }));

    for (const itemId of itemIds2) {
      await clear();
      await write(itemId);
      await press("Enter");
    }

    await click("Send to Production");
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
