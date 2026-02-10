# 🧙⚡ GitZip

## 🏆 Built For

GitHub Copilot CLI Challenge 2026  
Designed to demonstrate Copilot-assisted workflows for real developer productivity.

**Turn long Git commands into one-word spells with Copilot-assisted workflow**

GitZip is a powerful CLI tool that transforms complex Git commands into simple, memorable shortcuts. Create, save, and execute Git "spells" in seconds. Perfect for developers who want to speed up their workflow and reduce cognitive load when working with Git.

---
🎥 **Demo Video:**  
[for demo video click here](https://drive.google.com/file/d/1gLayfnghgSHl3z6Chc-XuTbF9KIL1_mk/view?usp=sharing)


## ✨ Features

- **🧙 Create Spells**: Convert long Git commands into one-word shortcuts
- **⚡ Run Spells**: Execute saved commands instantly
- **📘 Explain Mode**: Learn what each spell does (great for beginners)
- **🔍 Search Spells**: Find spells by name or command
- **📌 List Spellbook**: View all saved shortcuts
- **🗑️ Delete Spells**: Remove shortcuts you no longer need
- **🔌 Export Aliases**: Export spells as bash/zsh aliases
- **📥 Install Permanently**: Add spells to PowerShell profile for permanent access
- **🎬 Demo Mode**: See GitZip in action with an interactive demo
- **🎨 Interactive Menu**: User-friendly menu for all operations
- **💡 Copilot-Assisted**: Built to work seamlessly with GitHub Copilot Chat

---

## 🚀 Installation

### Prerequisites
- Node.js (v12 or higher)
- Git installed on your system

### Global Usage (Local Linking)

```bash
git clone <your-repo-url>
cd GitZip
npm install
npm link
```

### Local Development

```bash
git clone <your-repo-url>
cd GitZip
npm install
node index.js
```

---

## 📖 Usage Guide

### Basic Commands

#### Create a New Spell
Create a custom shortcut for any Git command:

```bash
gitzip create
```

You'll be prompted to:
1. Describe your Git task
2. Paste the Git command from Copilot
3. Choose a spell name (e.g., `gundo`, `gpush`, `gstash`)

**Example:**
```
Task: Undo last commit but keep changes
Command: git reset --soft HEAD~1
Spell name: gundo
```

#### Run a Spell
Execute a saved spell:

```bash
gitzip run <spell-name>
```

**Example:**
```bash
gitzip run gundo
```

#### List All Spells
View your entire spellbook:

```bash
gitzip list
```

**Output:**
```
📌 Your GitZip Spellbook:

gundo → git reset --soft HEAD~1
gpush → git push origin $(git rev-parse --abbrev-ref HEAD)
gstash → git stash push -m "work in progress"
```

#### Search Spells
Find spells by name or command:

```bash
gitzip search <keyword>
```

**Example:**
```bash
gitzip search push
```

#### Explain a Spell
Learn what a spell does (perfect for learning):

```bash
gitzip explain <spell-name>
```

**Output:**
```
📘 Spell Explanation:

Task: Undo last commit but keep changes
Command: git reset --soft HEAD~1

💡 Tip: Use Copilot Chat to get a deeper explanation.
```

#### Delete a Spell
Remove a spell from your spellbook:

```bash
gitzip delete <spell-name>
```

#### Export as Bash/Zsh Aliases
Create a shell file with all your spells as aliases:

```bash
gitzip export
```

This generates `gitzip_aliases.sh`. Activate with:
```bash
source gitzip_aliases.sh
```

#### Install Permanently (PowerShell)
Add spells directly to your PowerShell profile:

```bash
gitzip install
. $PROFILE
```

After installation, use spells directly:
```bash
gundo
```

#### Interactive Menu
Open the user-friendly menu system:

```bash
gitzip menu
```

Choose from:
- Create Spell (Copilot-assisted)
- Run Spell
- Explain Spell
- List Spellbook
- Export Aliases
- Exit

#### Demo Mode
See GitZip in action with a full interactive demonstration:

```bash
gitzip demo
```

This creates a demo repository and shows how spells work end-to-end.

#### Help Guide
Get comprehensive help and examples:

```bash
gitzip helpme
```

---

## 🔧 How Features Work

### 1. **Spell Creation (Copilot-Assisted Workflow)**
- Ask GitHub Copilot in VS Code for a complex Git command
- Copy the command from Copilot
- Run `gitzip create` and paste the command
- Give it a memorable name
- GitZip saves it to `shortcuts.json` for future use

### 2. **Safe Command Execution**
- GitZip validates Git repositories before running spells
- Shows safety warnings for dangerous commands (rm, delete)
- Checks for commits in the repository before execution

### 3. **Spell Storage**
- Spells are stored in `shortcuts.json` in your project directory
- Each spell contains:
  - **Spell name**: One-word shortcut
  - **Task description**: What the spell does
  - **Git command**: The actual command to execute

### 4. **PowerShell Integration**
- `gitzip install` automatically adds spells to your PowerShell profile
- Creates functions for each spell
- Clean installation with automatic cleanup of old spells

### 5. **Search & Discovery**
- Search spells by name or partial command matches
- Case-insensitive searching
- Helps you find spells you've already created

### 6. **Learning Mode**
- The `explain` command helps you understand what each spell does
- Perfect for teams sharing spell collections
- Integrates with Copilot Chat for deeper explanations

---

## 💡 Quick Start Example

```bash
# 1. Create a spell to undo the last commit
gitzip create
# Task: Undo last commit
# Command: git reset --soft HEAD~1
# Spell name: gundo

# 2. List your spells
gitzip list

# 3. Use the spell
gitzip run gundo

# 4. Install permanently
gitzip install
. $PROFILE

# 5. Now use it directly
gundo
```

---

## 🎯 Common Spell Examples

### Undo Last Commit (Keep Changes)
```bash
gitzip create
Task: Undo last commit but keep changes
Command: git reset --soft HEAD~1
Spell: gundo
```

### Push to Current Branch
```bash
gitzip create
Task: Push to current branch
Command: git push origin $(git rev-parse --abbrev-ref HEAD)
Spell: gpush
```

### Stash Work in Progress
```bash
gitzip create
Task: Save work in progress without committing
Command: git stash push -m "work in progress"
Spell: gstash
```

### View Commit History
```bash
gitzip create
Task: Show beautiful commit history
Command: git log --oneline --graph --all
Spell: glog
```

### Create Feature Branch
```bash
gitzip create
Task: Create and checkout new feature branch
Command: git checkout -b feature/$(date +%Y%m%d)
Spell: gnew
```

---

## 📋 System Requirements

- **OS**: Windows, macOS, or Linux
- **Node.js**: v12.0.0 or higher
- **npm**: v6.0.0 or higher
- **Git**: Latest version recommended
- **PowerShell** (v5.0+): Required for `gitzip install` on Windows

---

## 🛠️ Dependencies

- **chalk** (v4.1.2): Colorful terminal output
- **commander** (v11.0.0): CLI framework
- **inquirer** (v9.2.10): Interactive prompts

---

## 🔐 Safety Features

✅ **Git Repository Validation**: Ensures you're in a Git repo before running spells  
✅ **Commit Check**: Requires at least one commit before certain operations  
✅ **Dangerous Command Warnings**: Alerts for commands containing `rm` or `delete`  
✅ **Spell Verification**: Checks that spells exist before execution  

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share useful spell ideas

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎓 Tips & Tricks

1. **Use with Copilot Chat**: Ask Copilot for complex Git commands, then save them as spells
2. **Share Spells**: Copy your `shortcuts.json` to share with teammates
3. **Documentation**: Use the `explain` command to document what each spell does
4. **Version Control**: Do NOT commit `shortcuts.json` for personal use.
   Commit it only if your team intentionally shares spell definitions.
5. **Regular Cleanup**: Periodically review and delete unused spells

---

## ❓ FAQ

**Q: Can I use GitZip without Copilot?**  
A: Yes! You can manually enter any Git command you want to shortcut.

**Q: Are my spells saved?**  
A: Yes, they're stored in `shortcuts.json` in your project directory.

**Q: Can I share spells with my team?**  
A: Absolutely! Share your `shortcuts.json` file with teammates.

**Q: What if I make a mistake running a spell?**  
A: All Git operations can be undone. That's the beauty of Git!

**Q: Can I use spells in CI/CD pipelines?**  
A: Yes! GitZip works in any environment with Node.js and Git.

---

## 🚀 Get Started Now


### With this:

```md
### Global Usage (Local Linking)

```bash
git clone <your-repo-url>
cd GitZip
npm install
npm link

```

**Happy spell casting! 🧙⚡**

---

Made with ⚡ by Nitin  
GitHub: https://github.com/Nitin-kumar-yadav1307


