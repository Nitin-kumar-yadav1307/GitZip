#!/usr/bin/env node

const fs = require("fs");
const { Command } = require("commander");
const inquirer = require("inquirer").default;
const chalk = require("chalk");
const { execSync } = require("child_process");

const program = new Command();
const DB_FILE = "./shortcuts.json";

/* ---------------- HELPERS ---------------- */

function loadShortcuts() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveShortcuts(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}



function safeRun(command) {
  // Safety warning for dangerous commands
  if (command.includes("rm") || command.includes("delete")) {
    console.log(
      chalk.red("\n⚠️ WARNING: This command may delete files!")
    );
  }

  execSync(command, { stdio: "inherit" });
}

function isGitRepo() {
  return fs.existsSync(".git");
}
function hasCommits() {
  try {
    execSync("git rev-parse HEAD", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}


/* ---------------- CREATE SPELL ---------------- */

program
  .command("create")
  .description("Create a new Git shortcut spell (Copilot-assisted)")
  .action(async () => {
    console.log(
      chalk.magenta("\n🧙 GitZip Spell Creator\n")
    );

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "task",
        message:
          "Describe your Git task (ask Copilot in VS Code/Chat first):",
      },
      {
        type: "input",
        name: "command",
        message: "Paste the Git command you got from Copilot:",
      },
      {
        type: "input",
        name: "shortcut",
        message: "Choose a spell name (example: gundo):",
      },
    ]);

    let shortcuts = loadShortcuts();

    shortcuts[answers.shortcut] = {
      command: answers.command,
      task: answers.task,
    };

    saveShortcuts(shortcuts);

    console.log(
      chalk.green(
        `\n✅ Spell Saved: ${answers.shortcut} → ${answers.command}`
      )
    );
  });

/* ---------------- RUN SPELL ---------------- */

program
  .command("run <spell>")
  .description("Run a saved Git spell")
  .action((spell) => {
    let shortcuts = loadShortcuts();

    // Spell exists?
    if (!shortcuts[spell]) {
      console.log(chalk.red("\n❌ Spell not found!"));
console.log(chalk.yellow("Tip: Run `gitzip list` or `gitzip helpme`\n"));

      return;
    }

    console.log(
      chalk.yellow(
        `\n⚡ Casting Spell: ${spell}\n➡️ ${shortcuts[spell].command}\n`
      )
    );

    // Git repo check
    if (!isGitRepo()) {
      console.log(chalk.red("\n❌ Not a Git repository!"));
      console.log(
        chalk.yellow("Tip: Run `git init` inside your project folder first.\n")
      );
      return;
    }

    if (!hasCommits()) {
  console.log(chalk.red("\n❌ No commits found in this repo."));
  console.log(chalk.yellow("Tip: Make at least one commit first.\n"));
  return;
}


    // Run command safely
    safeRun(shortcuts[spell].command);
    console.log(chalk.green("\n✅ Spell executed successfully!\n"));

  });


/* ---------------- LIST SPELLS ---------------- */

program
  .command("list")
  .description("List all saved Git spells")
  .action(() => {
    let shortcuts = loadShortcuts();

    console.log(chalk.blue("\n📌 Your GitZip Spellbook:\n"));

    Object.keys(shortcuts).forEach((key) => {
      console.log(
        chalk.green(key) +
          " → " +
          shortcuts[key].command
      );
    });
  });

  /* ---------------- DELETE SPELL ---------------- */

program
  .command("delete <spell>")
  .description("Delete a saved Git spell")
  .action((spell) => {
    let shortcuts = loadShortcuts();

    if (!shortcuts[spell]) {
      console.log(chalk.red("\n❌ Spell not found!\n"));
      return;
    }

    delete shortcuts[spell];
    saveShortcuts(shortcuts);

    console.log(chalk.green(`\n✅ Spell '${spell}' deleted successfully!\n`));
  });
/* ---------------- SEARCH SPELLS ---------------- */

program
  .command("search <keyword>")
  .description("Search spells by name or command")
  .action((keyword) => {
    let shortcuts = loadShortcuts();

    const results = Object.keys(shortcuts).filter((key) => {
      return (
        key.toLowerCase().includes(keyword.toLowerCase()) ||
        shortcuts[key].command.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    if (results.length === 0) {
      console.log(chalk.red("\n❌ No spells found.\n"));
      return;
    }

    console.log(chalk.blue("\n🔍 Matching Spells:\n"));

    results.forEach((key) => {
      console.log(chalk.green(key) + " → " + shortcuts[key].command);
    });

    console.log();
  });

/* ---------------- EXPLAIN SPELL ---------------- */

program
  .command("explain <spell>")
  .description("Explain what a spell does (learning mode)")
  .action((spell) => {
    let shortcuts = loadShortcuts();

    if (!shortcuts[spell]) {
      console.log(chalk.red("❌ Spell not found!"));
      return;
    }

    console.log(chalk.magenta("\n📘 Spell Explanation:\n"));
    console.log(
      chalk.cyan("Task: ") + shortcuts[spell].task
    );
    console.log(
      chalk.cyan("Command: ") + shortcuts[spell].command
    );

    console.log(
      chalk.yellow(
        "\n💡 Tip: Use Copilot Chat to get a deeper explanation."
      )
    );
  });

/* ---------------- EXPORT ALIASES ---------------- */

program
  .command("export")
  .description("Export spells as bash/zsh aliases")
  .action(() => {
    let shortcuts = loadShortcuts();

    let output = "# GitZip Exported Aliases\n\n";

    Object.keys(shortcuts).forEach((key) => {
      output += `alias ${key}="${shortcuts[key].command}"\n`;
    });

    fs.writeFileSync("gitzip_aliases.sh", output);

    console.log(
      chalk.green("\n✅ Exported aliases to gitzip_aliases.sh")
    );
    console.log(
      chalk.yellow(
        "Run: source gitzip_aliases.sh to activate spells!"
      )
    );
  });

 /* ---------------- INSTALL SPELLS ---------------- */

program
  .command("install")
  .description("Install GitZip spells permanently into your PowerShell profile")
  .action(() => {
    let shortcuts = loadShortcuts();

    if (Object.keys(shortcuts).length === 0) {
      console.log(chalk.red("\n❌ No spells to install.\n"));
      return;
    }

    // Detect correct PowerShell profile
    let profilePath = execSync(
      "powershell -NoProfile -Command \"$PROFILE\""
    )
      .toString()
      .trim();

    // Ensure folder exists
    fs.mkdirSync(require("path").dirname(profilePath), { recursive: true });

    // Read existing profile content
    let profileContent = "";
    if (fs.existsSync(profilePath)) {
      profileContent = fs.readFileSync(profilePath, "utf-8");
    }

    // Remove old GitZip block if present
    profileContent = profileContent.replace(
      /# BEGIN GITZIP[\s\S]*# END GITZIP/g,
      ""
    );

    // Create fresh GitZip block
    let newBlock = "\n# BEGIN GITZIP\n# GitZip Installed Spells\n";

    Object.keys(shortcuts).forEach((key) => {
      newBlock += `function ${key} { ${shortcuts[key].command} }\n`;
    });

    newBlock += "# END GITZIP\n";

    // Write back cleanly
    fs.writeFileSync(profilePath, profileContent + newBlock);

    console.log(chalk.green("\n✅ GitZip spells installed cleanly!"));
    console.log(chalk.yellow("\nRun this now:\n. $PROFILE\n"));
  });

  /* ---------------- DEMO COMMAND ---------------- */

program
  .command("demo")
  .description("Run a full GitZip demo showcase automatically")
  .action(() => {
    console.log(chalk.magenta("\n🎬 Running GitZip Demo...\n"));

    const demoFolder = "gitzip-demo-repo";

    // Step 1: Create demo folder
    if (!fs.existsSync(demoFolder)) {
      fs.mkdirSync(demoFolder);
    }

    process.chdir(demoFolder);

    console.log(chalk.cyan("📌 Initializing demo git repository...\n"));
    try {
      execSync("git init", { stdio: "ignore" });
    } catch {}

    // Step 2: First commit
    console.log(chalk.cyan("✅ Creating first commit...\n"));
    execSync("echo first > file.txt");
    execSync("git add .");
    execSync("git commit -m \"first commit\"", { stdio: "ignore" });

    // Step 3: Add demo spell automatically
    console.log(chalk.cyan("🧙 Adding demo spell: gundo...\n"));

    let shortcuts = loadShortcuts();
    shortcuts["gundo"] = {
      task: "Undo last commit but keep changes",
      command: "git reset --soft HEAD~1",
    };
    saveShortcuts(shortcuts);

    console.log(chalk.green("✅ Spell saved: gundo\n"));

    // Step 4: Second commit
    console.log(chalk.cyan("✅ Creating second commit...\n"));
    execSync("echo second >> file.txt");
    execSync("git add .");
    execSync("git commit -m \"second commit\"", { stdio: "ignore" });

    console.log(chalk.yellow("📜 Git log BEFORE undo:\n"));
    execSync("git log --oneline", { stdio: "inherit" });

    // Step 5: Run spell
    console.log(chalk.magenta("\n⚡ Casting spell: gundo...\n"));
    execSync("git reset --soft HEAD~1", { stdio: "inherit" });

    console.log(chalk.yellow("\n📜 Git log AFTER undo:\n"));
    execSync("git log --oneline", { stdio: "inherit" });

    console.log(chalk.green("\n🏆 Demo Complete! GitZip works perfectly.\n"));

    console.log(
      chalk.blue(
        "Next try:\n  gitzip install\n  . $PROFILE\n  gundo\n"
      )
    );
  });


/* ---------------- MENU MODE ---------------- */

program
  .command("menu")
  .description("Interactive GitZip Menu")
  .action(async () => {
    console.log(
      chalk.magenta("\n⚡ Welcome to GitZip Spell Menu ⚡\n")
    );

    const choice = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Choose an action:",
        choices: [
          "Create Spell (Copilot-assisted)",
          "Run Spell",
          "Explain Spell",
          "List Spellbook",
          "Export Aliases",
          "Exit",
        ],
      },
    ]);

    if (choice.action === "Create Spell (Copilot-assisted)") {
      execSync("gitzip create", { stdio: "inherit" });
    }

    if (choice.action === "Run Spell") {
      const q = await inquirer.prompt([
        { type: "input", name: "spell", message: "Spell name:" },
      ]);
      execSync(`gitzip run ${q.spell}`, { stdio: "inherit" });
    }

    if (choice.action === "Explain Spell") {
      const q = await inquirer.prompt([
        { type: "input", name: "spell", message: "Spell name:" },
      ]);
      execSync(`gitzip explain ${q.spell}`, { stdio: "inherit" });
    }

    if (choice.action === "List Spellbook") {
      execSync("gitzip list", { stdio: "inherit" });
    }

    if (choice.action === "Export Aliases") {
      execSync("gitzip export", { stdio: "inherit" });
    }

    if (choice.action === "Exit") {
      console.log(chalk.green("\n👋 Goodbye, Git Warrior!\n"));
      process.exit(0);
    }
  });
  /* ---------------- HELP GUIDE ---------------- */

program
  .command("helpme")
  .description("Show GitZip usage guide and examples")
  .action(() => {
    console.log(chalk.magenta("\n🧙 GitZip Help Guide\n"));

    console.log(chalk.yellow("GitZip turns Git commands into one-word spells.\n"));

    console.log(chalk.cyan("📌 Main Commands:\n"));

    console.log("  gitzip create       → Create a new spell");
    console.log("  gitzip run <spell>  → Run a saved spell");
    console.log("  gitzip list         → Show all spells");
    console.log("  gitzip search <key> → Search spells");
    console.log("  gitzip delete <sp>  → Delete a spell");
    console.log("  gitzip install      → Install spells permanently");
    console.log("  gitzip menu         → Open interactive menu");

    console.log(chalk.cyan("\n✨ Example Workflow:\n"));

    console.log("  gitzip create");
    console.log("  gitzip run gundo");
    console.log("  gitzip install");
    console.log("  . $PROFILE");
    console.log("  gundo");

    console.log(chalk.green("\n⚡ Tip: Ask Copilot Chat for Git commands, then save them as spells.\n"));

    console.log(chalk.blue("Happy spell casting! 🧙⚡\n"));
  });




program.exitOverride();

try {
  program.parse(process.argv);
} catch (err) {
  console.log(chalk.red("\n❌ Invalid command!\n"));
  console.log(chalk.yellow("Run: gitzip helpme\n"));
  process.exit(1);
}
