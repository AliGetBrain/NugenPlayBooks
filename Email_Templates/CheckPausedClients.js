const Handlebars = require("handlebars");
require("../HandleBarHelpers");
const fs = require("node:fs");
const path = require("node:path");
const chokidar = require("chokidar");

const subject = `Invoices on Paused Outreach Reminder`;

const emailMessage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check Paused Outreach</title>
</head>

<body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px 20px; background-color: #F8FBFF;">
    <div style="margin-bottom: 12px; background: white; border-color:{{primaryColor}}; border-bottom: 3px solid {{primaryColor}}; border-radius: 8px; text-align: center; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <div style="margin: 15px 20px 0 0;">
                <img src="https://raw.githubusercontent.com/AliGetBrain/Logo-Storage/main/neurostructures_logoR_hd (1).png" width="250" height="80" alt="Logo">
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <h2 style="margin: 0 0 15px 0; font-weight: 600; letter-spacing: 0.025em;">SCHEDULED REMINDER</h2>
            </td>
          </tr>
      </table>
    </div>    
    <div style="background: white; border-radius: 12px; padding: 40px; position: relative; overflow: hidden;">

         <div style="margin-bottom: 12px; padding: 24px; background-color: white; border-radius: 8px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">
          <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
            The following clients are currently paused for outreach: 
        </p>
        
         <ul style="font-family: Arial, Helvetica, sans-serif; padding-left: 20px; margin: 20px 0;">
            {{#each clientData}}
            <li style="margin: 0 0 8px 0; font-size: 1rem; line-height: 1.6; color: #333333;">
                <strong>{{CompanyName}}</strong>
            </li>
            {{/each}}
        </ul>

        <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
            Please verify these clients are being addressed through appropriate escalation channels or update their status if resolved. 
        </p>
    
        <p style="margin: 0 0 16px 0; font-size: 1rem; line-height: 1.6;">
            To resume outreach, go to the customer notes section in QuickBooks and remove the word "PAUSE".
        </p>

        <p style="margin: 0; font-size: 1rem;">
            Thank you,<br>
            <span style="font-weight: 500;">Automated AR System</span>
        </p> 
        </div>
</body>
</html>
`;

const data = {
  clientData: [{ CompanyName: "Southern Ionics" }, { CompanyName: "Bio Tech" }],
  primaryColor: "#0068FF",
};

const template = Handlebars.compile(emailMessage);
const subjectTemplate = Handlebars.compile(subject);
function generateAndSaveHTML() {
  try {
    console.log("Generating HTML...");
    const html = template(data);
    console.log("Subject: ", subjectTemplate(data));
    const outputFile = path.join(
      __dirname,
      "./html_output/check_paused_clients.html"
    );
    fs.writeFileSync(outputFile, html);
    console.log(`HTML generated successfully at: ${outputFile}`);
  } catch (error) {
    console.error("Error generating HTML:", error);
  }
}

console.log("Setting up file watcher with chokidar...");

// Watch JS files
const watcher = chokidar.watch(["./*.js"], {
  ignored: /(node_modules|\.git)/,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100,
  },
});

// Add event listeners
watcher
  .on("change", (path) => {
    console.log(`File ${path} has changed, regenerating HTML...`);
    generateAndSaveHTML();
  })
  .on("error", (error) => console.error(`Watcher error: ${error}`))
  .on("ready", () =>
    console.log("Initial scan complete. Ready for changes...")
  );

// Initial generation
console.log("Performing initial HTML generation...");
generateAndSaveHTML();
