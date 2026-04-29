# 🚀 Quick Start - Run Agents from Root Directory

> **Fix for:** "Cannot find module" errors when running commands from wrong directory

---

## Problem Solved ✅

The framework files are located in a nested directory:
```
C:\playwright-agentic-qe-framework\
└── playwright-agentic-qe-framework\    ← Actual framework location
    ├── package.json
    ├── invest_quality_example.js
    ├── generate_bdd_quality_report.js
    └── ...
```

Running commands from `C:\playwright-agentic-qe-framework\` would fail. We've created helper scripts at the root level.

---

## ✨ Solution: Root-Level Helper Scripts

### 1. From Root Directory - Use NPM Commands

**Change to root directory:**
```bash
cd C:\playwright-agentic-qe-framework
```

**Then run:**
```bash
# Run all agents and generate reports
npm run agents

# Or run individual commands:
npm run quality-report      # Generate INVEST quality report
npm run invest              # Run INVEST quality analysis
npm test                    # Run Cucumber tests
npm run dashboard           # Open dashboard in browser
```

### 2. Or Use Direct Node Execution

```bash
# From root directory
node run_agents.js
```

---

## 📊 What Gets Generated

When you run the agents, the following are created:

### 🎯 BDD Cucumber Dashboard
- **Location:** `playwright-agentic-qe-framework/bdd_dashboard.html`
- **Type:** Interactive HTML dashboard
- **Contains:** 
  - Overall quality score
  - INVEST criteria charts
  - Domain analysis
  - Requirement scorecard
  - Test coverage metrics

**Open it:**
```bash
npm run dashboard    # Windows - opens in default browser

# Or manually open:
.\playwright-agentic-qe-framework\bdd_dashboard.html
```

### 📋 Quality Reports
- **Location:** `playwright-agentic-qe-framework/reports/`
- **Files:**
  - `bdd_quality_report_2026-04-29.json` - Quality metrics
  - `cucumber-report.json` - Test execution results

### 📂 Feature Files & Steps
- **Location:** `playwright-agentic-qe-framework/playwright/`
- **Contents:**
  - `features/` - BDD feature files by domain
  - `step_definitions/` - Cucumber step implementations

---

## 🎯 Complete Workflow

### Step 1: Set Environment Variables
```bash
# Set your API credentials (optional)
$env:JIRA_EMAIL = "your-email@example.com"
$env:JIRA_API_TOKEN = "your-api-token"
$env:OPENAI_API_KEY = "your-openai-key"
```

### Step 2: Run All Agents
```bash
cd C:\playwright-agentic-qe-framework
npm run agents
```

**This executes:**
1. ✅ INVEST Quality Analysis
2. ✅ BDD Feature Generation
3. ✅ Cucumber Test Execution
4. ✅ Quality Report Generation

### Step 3: View Dashboard
```bash
# Dashboard opens automatically, or:
npm run dashboard
```

### Step 4: Review Reports
- Open generated HTML dashboard
- Check metrics and quality scores
- Review requirement details

### Step 5: Run Specific Tests
```bash
# From root:
npm run test:healthcare      # Healthcare domain tests
npm run test:insurance       # Insurance domain tests
npm run test:banking         # Banking domain tests
npm run test:smoke           # Smoke tests
npm run test:regression      # Regression tests
```

---

## 📝 NPM Scripts Reference

All scripts run from root directory `C:\playwright-agentic-qe-framework`:

```bash
npm run agents              # 🎯 Run all agents
npm run quality-report      # 📊 Generate quality report
npm run invest              # 💡 INVEST scoring analysis
npm test                    # 🧪 Run all tests
npm run test:ui             # 🖥️ UI tests only
npm run test:api            # 🔌 API tests only
npm run test:db             # 🗄️ Database tests only
npm run test:smoke          # 💨 Smoke tests
npm run test:regression     # ♻️ Regression tests
npm run test:insurance      # 🏢 Insurance tests
npm run test:healthcare     # 🏥 Healthcare tests
npm run test:banking        # 🏦 Banking tests
npm run dashboard           # 📊 View dashboard
```

---

## 🔧 Available Commands Inside Framework

If you need to work inside the framework directly:

```bash
cd C:\playwright-agentic-qe-framework\playwright-agentic-qe-framework

# Direct Node execution:
node invest_quality_example.js          # Run INVEST analysis
node generate_bdd_quality_report.js     # Generate quality report
node generate_invest_report.js          # Generate INVEST report
node project_kickoff_example.js         # Run project kickoff

# Cucumber tests:
npx @cucumber/cucumber                  # Run all tests
npx @cucumber/cucumber --tags @smoke    # Run specific tags
```

---

## 📊 Dashboard Preview

The interactive dashboard shows:

```
┌─────────────────────────────────────────────┐
│  🎯 BDD Quality Report Dashboard           │
├─────────────────────────────────────────────┤
│ Overall Score: 70.9/100 ⭐⭐⭐              │
│ Requirements: 9                            │
│ BDD Scenarios: 36                          │
│ Automation Ready: ✅                       │
├─────────────────────────────────────────────┤
│ Quality Distribution Chart                 │
│ INVEST Criteria Radar Chart                │
│ Domain Comparison Analysis                 │
│ Requirement Details Table                  │
└─────────────────────────────────────────────┘
```

---

## ✅ Troubleshooting

### "Cannot find module" Error
**Solution:** Make sure you're running from root directory
```bash
cd C:\playwright-agentic-qe-framework
npm run agents
```

### "package.json not found" Error
**Solution:** Created root-level `package.json`. Make sure it exists:
```bash
Get-Item package.json    # Windows PowerShell
ls -la package.json      # Linux/Mac
```

### Tests are failing with connection errors
**Solution:** This is expected - backend services need to be running
- Start your API server on localhost:3000
- Start your database service
- Then run tests again

### Dashboard won't open
**Solution:** Open manually in browser:
```bash
# Copy the full path:
C:\playwright-agentic-qe-framework\playwright-agentic-qe-framework\bdd_dashboard.html

# Then open in your browser (Ctrl+O or paste URL)
```

---

## 📈 Next Steps

1. ✅ Run agents: `npm run agents`
2. ✅ View dashboard: `npm run dashboard`
3. ✅ Review quality scores in the interactive dashboard
4. ✅ Check feature files in `playwright-agentic-qe-framework/playwright/features/`
5. ✅ Start your backend services
6. ✅ Run tests: `npm test`

---

## 💡 Tips

- **Always run npm commands from root directory** (`C:\playwright-agentic-qe-framework`)
- **Use npm scripts** instead of trying to call Node files directly
- **Check the dashboard** for comprehensive quality metrics
- **Review generated feature files** in `playwright/features/`
- **Use tags** to run specific test suites: `npm run test:healthcare`

---

**Status:** ✅ Ready to Execute  
**Framework Location:** Properly configured with root-level helper scripts  
**Next Command:** `npm run agents`

