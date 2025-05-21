#!/usr/bin/env node

"use strict";

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const ora = require("ora");
const cliSpinners = require("cli-spinners");
clear();

const prompt = inquirer.createPromptModule();

const questions = [
  {
    type: "list",
    name: "action",
    message: "What you want to do?",
    choices: [
      {
        name: `Send me an ${chalk.green.bold("email")}?`,
        value: () => {
          open("mailto:keshavashiya@outlook.com");
          console.log("\nDone, see you soon at inbox.\n");
        },
      },
      {
        name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
        value: async () => {
          const loader = ora({
            text: " Downloading Resume",
            spinner: cliSpinners.material,
          }).start();

          try {
            // Convert Google Docs URL to export URL
            const docId = "1lz463OeTrOVxVdOt9H_9zAGADIXuKU6B9qPaNeL20AE";
            const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=pdf`;

            const response = await axios({
              method: "get",
              url: exportUrl,
              responseType: "arraybuffer", // Important for binary files like PDFs
            });

            const downloadPath = path.join(process.cwd(), "keshavashiya.pdf");
            fs.writeFileSync(downloadPath, response.data);
            console.log(`\nResume Downloaded at ${downloadPath} \n`);
            open(downloadPath);
            loader.stop();
          } catch (error) {
            loader.stop();
            console.error("\nError downloading resume:", error.message, "\n");
          }
        },
      },
      {
        name: `Schedule a ${chalk.redBright.bold("Meeting")}?`,
        value: () => {
          open("https://calendly.com/keshavashiya/30min");
          console.log("\n See you at the meeting \n");
        },
      },
      {
        name: "Just quit.",
        value: () => {
          console.log("Hasta la vista.\n");
        },
      },
    ],
  },
];

const data = {
  name: chalk.bold.green(`${" ".repeat(28)}Keshav Ashiya`),
  handle: chalk.white(`${" ".repeat(28)}@keshavashiya`),
  work: `${chalk.white("Senior Software Engineer at")} ${chalk
    .hex("#2b82b2")
    .bold("Popular Digital AI")}`,
  twitter: chalk.gray("https://twitter.com/") + chalk.cyan("keshavashiya"),
  github: chalk.gray("https://github.com/") + chalk.green("keshavashiya"),
  linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue("keshavashiya"),
  web: chalk.cyan("https://keshavashiya.github.io"),
  npx: chalk.red("npx") + " " + chalk.white("keshavashiya"),

  labelWork: chalk.white.bold("       Work:"),
  labelTwitter: chalk.white.bold("    Twitter:"),
  labelGitHub: chalk.white.bold("     GitHub:"),
  labelLinkedIn: chalk.white.bold("   LinkedIn:"),
  labelWeb: chalk.white.bold("        Web:"),
  labelCard: chalk.white.bold("       Card:"),
};

function getFormattedItalicText(text) {
  const terminalWidth = 80;
  const boxPadding = 4;
  const maxWidth = terminalWidth - boxPadding * 2;

  // Split text into words
  const words = text.split(" ");
  const lines = [];
  let currentLine = [];

  // Create lines that fit within the box
  words.forEach((word) => {
    if ((currentLine.join(" ") + " " + word).length <= maxWidth - 2) {
      currentLine.push(word);
    } else {
      lines.push(currentLine.join(" "));
      currentLine = [word];
    }
  });
  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }

  // Center and format each line without extra padding
  return lines.map((line) => {
    const lineLength = line.length;
    const availableSpace = maxWidth - lineLength;
    const padding = Math.max(0, Math.floor(availableSpace / 2) - 2); // Reduced padding
    return chalk.italic(line); // Removed padding to let boxen handle centering
  });
}

// And update the boxen configuration
const me = boxen(
  [
    `${data.name}`,
    `${data.handle}`,
    ``,
    `${data.labelWork}  ${data.work}`,
    ``,
    `${data.labelTwitter}  ${data.twitter}`,
    `${data.labelGitHub}  ${data.github}`,
    `${data.labelLinkedIn}  ${data.linkedin}`,
    `${data.labelWeb}  ${data.web}`,
    ``,
    `${data.labelCard}  ${data.npx}`,
    ``,
    ...getFormattedItalicText(
      "I am currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I will try my best to get back to you!"
    ),
  ].join("\n"),
  {
    margin: 1,
    float: "center",
    padding: 1,
    borderStyle: "single",
    borderColor: "green",
  }
);

console.log(me);
const tip = [
  `Tip: Try ${chalk.cyanBright.bold("cmd/ctrl + click")} on the links above`,
  "",
].join("\n");
console.log(tip);

prompt(questions).then((answer) => answer.action());
