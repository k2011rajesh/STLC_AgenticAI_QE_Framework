# ⚡ QUICK START GUIDE - Project Kickoff (5 Minutes)

## Step 1: Set Environment Variables (1 min)

Open your terminal and set:

```bash
# Jira Configuration
export JIRA_EMAIL="your-email@example.com"
export JIRA_API_TOKEN="your-jira-api-token-here"
export JIRA_PROJECT_KEY="QED"

# OpenAI Configuration
export OPENAI_API_KEY="your-openai-api-key"
```

**Get API Tokens**:
- Jira: https://id.atlassian.com/manage-profile/security/api-tokens
- OpenAI: https://platform.openai.com/api-keys

---

## Step 2: Run Project Kickoff (2 min)

```bash
# Navigate to framework directory
cd playwright-agentic-qe-framework

# Run the project kickoff example
node project_kickoff_example.js
```

This will:
1. ✅ Ingest raw requirements
2. ✅ Structure requirements
3. ✅ Extract use cases
4. ✅ Generate scenarios
5. ✅ Create acceptance criteria
6. ✅ Generate Jira project
7. ✅ Save documentation

---

## Step 3: Access Jira Board (1 min)

Open browser:
```
https://k2011rajesh.atlassian.net/jira/core/projects/QED/board
```

You'll see:
- ✅ Main epic created
- ✅ All use case stories
- ✅ Acceptance criteria sub-tasks
- ✅ Infrastructure tasks
- ✅ QA stories

---

## Step 4: Review Documentation (1 min)

Check generated files:

```bash
# Use case documentation
ls use_cases/banking/

# Domain documentation  
ls domains_docs/

# View specific file
cat use_cases/banking/INDEX.md
```

---

## 🎯 Domains Available

Run project kickoff for any domain:

```javascript
// In project_kickoff_example.js

// Banking (default)
await bankingProjectKickoff();

// Healthcare
await healthcareProjectKickoff();

// Insurance
await insuranceProjectKickoff();
```

---

## 📝 Customize for Your Application

### Option 1: Modify Example

Edit `project_kickoff_example.js`:

```javascript
const customRequirements = [
  'Your requirement 1',
  'Your requirement 2',
  'Your requirement 3'
];

const result = await orchestrator.executeProjectKickoff(
  'My Application Name',
  'banking',  // Choose domain
  customRequirements
);
```

### Option 2: Use Programmatically

```javascript
const ProjectKickoffOrchestrator = require('./agents/ProjectKickoffOrchestrator');

const orchestrator = new ProjectKickoffOrchestrator();
const result = await orchestrator.executeProjectKickoff(
  'My App',
  'healthcare',  // or 'insurance', 'ecommerce', etc.
  ['requirement1', 'requirement2']
);

console.log('Jira Board:', result.jiraUrl);
console.log('Use Cases:', result.results.useCases.length);
console.log('Requirements:', result.results.requirements.length);
```

---

## ✨ What Gets Created

### In Jira
```
✅ Main Epic: {Your App} - Project Kickoff
├── ✅ Core Features Epic
├── ✅ Security & Compliance Epic
├── ✅ Performance Epic
├── ✅ Integration Epic
├── ✅ UX Epic
├── ✅ Infrastructure Tasks (5 groups)
└── ✅ QA Stories (5 types)

Plus: 50-100+ stories with acceptance criteria
```

### In Files
```
✅ use_cases/{domain}/
   ├── INDEX.md                     (navigation)
   ├── UC-001-{name}.md            (full use case)
   ├── UC-002-{name}.md
   └── ... (10-20+ use cases)

✅ domains_docs/{domain}/
   └── {domain}_domain.md          (overview)
```

---

## 🐛 Troubleshooting

### Error: "Invalid API token"
**Solution**: 
- Check JIRA_EMAIL and JIRA_API_TOKEN are set
- Verify token hasn't expired
- Regenerate at https://id.atlassian.com/manage-profile/security/api-tokens

### Error: "Project QED not found"
**Solution**:
- Change JIRA_PROJECT_KEY to your project
- Or create QED project in Jira
- Ensure user has project access

### Error: "Invalid OpenAI API key"
**Solution**:
- Check OPENAI_API_KEY is set correctly
- Regenerate at https://platform.openai.com/api-keys
- Ensure account has credits

### Error: "Domain not found"
**Solution**:
- Use `domain_apps.getAvailableDomains()`
- Valid domains: banking, healthcare, insurance, ecommerce, project_management

### No use cases generated
**Solution**:
- Add more detailed raw requirements
- Include specific business workflows
- Add acceptance criteria hints

---

## 📊 Quality Metrics

After execution, you'll see:

```
✅ Requirements Metrics
   - Ingested: 10+
   - Structured: 10+
   - Validated: 100%
   - Conflicts: 0

✅ Use Case Metrics
   - Identified: 8-12
   - Scenarios: 25-40
   - Actors: 4-6
   - Criteria: 40-60

✅ Jira Metrics
   - Epics: 6
   - Stories: 20-40
   - Tasks: 50-100
   - Links: 100+
```

---

## 🚀 Next Steps

After seeing the dashboard output:

1. **Access Jira**: Review the created epics and stories
2. **Read Documentation**: Check use_cases/{domain}/ directory
3. **Assign Stories**: Assign epics to team members
4. **Set Sprints**: Plan sprints with team
5. **Start Development**: Begin implementation with test automation

---

## 📚 Learn More

- **Complete Guide**: [PROJECT_KICKOFF_GUIDE.md](./PROJECT_KICKOFF_GUIDE.md)
- **UseCase Agent**: [agents/UseCaseAnalysisAgent/README.md](./agents/UseCaseAnalysisAgent/README.md)
- **Requirement Agent**: [agents/RawRequirementAgent/README.md](./agents/RawRequirementAgent/README.md)
- **Implementation Summary**: [IMPLEMENTATION_SUMMARY_PROJECT_KICKOFF.md](./IMPLEMENTATION_SUMMARY_PROJECT_KICKOFF.md)
- **File Inventory**: [FILE_INVENTORY_PROJECT_KICKOFF.md](./FILE_INVENTORY_PROJECT_KICKOFF.md)

---

## 💡 Pro Tips

### Tip 1: Test Different Domains
```bash
# Quickly test each domain
for domain in banking healthcare insurance ecommerce project_management; do
  echo "Testing $domain..."
  # Run kickoff for each
done
```

### Tip 2: Customize Requirements
```javascript
// Add domain-specific requirements for your use case
const bankingPlus = [
  ...domain_apps.getDomainApp('banking').rawRequirements,
  'Your custom requirement 1',
  'Your custom requirement 2'
];
```

### Tip 3: Check Quality Metrics
```javascript
const result = await orchestrator.executeProjectKickoff(...);

console.log('Requirement Quality:', result.results.requirementMetrics);
console.log('Use Case Quality:', result.results.useCaseMetrics);
console.log('Jira Quality:', result.results.jiraMetrics);
```

### Tip 4: Review Generated Docs
```bash
# View the generated use cases
cat use_cases/banking/INDEX.md

# View a specific use case
cat use_cases/banking/UC-001-user_authentication.md

# View domain overview
cat domains_docs/banking/banking_domain.md
```

---

## ✅ Success Indicators

After running, you should see:

- ✅ Console output with detailed progress
- ✅ No errors (warnings are OK)
- ✅ Jira board updated with new epics/stories
- ✅ Generated markdown files in use_cases/ and domains_docs/
- ✅ Quality metrics report
- ✅ Final summary with links

**If all ✅, you're ready to proceed!**

---

## 🎯 From Here

1. **Jira Board**: https://k2011rajesh.atlassian.net/jira/core/projects/QED/board
2. **Use Cases**: `./use_cases/{domain}/`
3. **Domain Docs**: `./domains_docs/{domain}/`
4. **Framework**: Ready for Phase 1 and beyond

---

## 📞 Need Help?

Check these docs in order:
1. This guide (QUICK_START.md)
2. Full guide (PROJECT_KICKOFF_GUIDE.md)
3. Agent READMEs (in agents/ folder)
4. Implementation summary (IMPLEMENTATION_SUMMARY_PROJECT_KICKOFF.md)

---

**Ready to kickoff your project?**

```bash
node project_kickoff_example.js
```

**That's it! 🚀**

*Time to completion: ~5 minutes*  
*Setup to Jira board: ~3 minutes after running*  
*Total: ~8 minutes from start to team-ready project*
