/**
 * Domain Applications Definitions
 * Predefined domain structures for Banking, Healthcare, Insurance
 * Used for quick project kickoff and template-based generation
 */

const DOMAIN_APPS = {
  BANKING: {
    id: 'banking',
    name: 'Banking Application',
    description: 'Comprehensive banking platform with account management, payments, and transactions',
    domain: 'Financial Services',
    type: 'Web/Mobile Application',
    rawRequirements: [
      'Users must be able to create accounts with email and password',
      'Users should be able to view account balance and transaction history',
      'System must support fund transfers between accounts',
      'All financial transactions must be encrypted and audit-logged',
      'System should support multiple currencies',
      'Authentication must use multi-factor authentication for sensitive operations',
      'Users should receive real-time notifications for transactions',
      'System must comply with PCI DSS standards',
      'Admin users should be able to manage user accounts and permissions',
      'System should generate reports for transaction history'
    ],
    components: [
      'Authentication Service',
      'Account Management Service',
      'Payment Processing Service',
      'Notification Service',
      'Audit Logging Service',
      'Report Generation Service'
    ],
    actors: [
      'Customer',
      'Admin',
      'Bank Officer',
      'Compliance Officer',
      'External Payment Gateway'
    ],
    criticalPaths: [
      'User Registration → Login → View Account',
      'Initiate Transfer → Approve → Execute → Notify',
      'Account Setup → Activate → First Transaction'
    ],
    riskAreas: [
      'Payment Processing',
      'Security/Authentication',
      'Data Integrity',
      'Compliance (PCI DSS, AML)'
    ]
  },

  HEALTHCARE: {
    id: 'healthcare',
    name: 'Healthcare Management System',
    description: 'Comprehensive healthcare platform for patient management, appointments, and medical records',
    domain: 'Healthcare',
    type: 'Web/Mobile Application',
    rawRequirements: [
      'Patients must be able to schedule appointments with doctors',
      'System must maintain secure medical records',
      'Doctors should be able to view patient history and lab results',
      'System must support prescription management',
      'Patients should receive appointment reminders',
      'System must support telemedicine/video consultations',
      'All patient data must be HIPAA compliant',
      'System should support integration with insurance providers',
      'Billing and claims should be automated',
      'System must maintain audit trail for all data access'
    ],
    components: [
      'Patient Portal',
      'Doctor Portal',
      'Appointment Service',
      'Medical Records Service',
      'Prescription Service',
      'Telemedicine Service',
      'Billing Service'
    ],
    actors: [
      'Patient',
      'Doctor',
      'Nurse',
      'Administrator',
      'Insurance Provider',
      'Lab Technician'
    ],
    criticalPaths: [
      'Patient Registration → Profile Setup → Appointment Booking',
      'Doctor Login → View Patients → Review Records → Prescribe',
      'Appointment → Consultation → Prescription → Billing',
      'Lab Result Upload → Notification → Patient Access'
    ],
    riskAreas: [
      'Patient Privacy (HIPAA)',
      'Data Security',
      'Regulatory Compliance',
      'Telemedicine Integration'
    ]
  },

  INSURANCE: {
    id: 'insurance',
    name: 'Insurance Management Platform',
    description: 'Comprehensive insurance platform for policy management, claims processing, and customer service',
    domain: 'Insurance',
    type: 'Web/Mobile Application',
    rawRequirements: [
      'Customers should be able to browse and purchase insurance policies',
      'System must support policy renewal and modification',
      'Policyholders should be able to file and track claims',
      'Admin should be able to approve/reject claims',
      'System must calculate premiums based on risk factors',
      'System should support document upload for claims',
      'Customers should receive notifications on claim status',
      'System must generate insurance certificates',
      'System should support integration with payment gateways',
      'System must maintain compliance with insurance regulations'
    ],
    components: [
      'Policy Management Service',
      'Claims Processing Service',
      'Premium Calculation Service',
      'Document Management Service',
      'Notification Service',
      'Payment Service',
      'Reporting Service'
    ],
    actors: [
      'Customer',
      'Insurance Agent',
      'Claims Officer',
      'Underwriter',
      'Admin',
      'Finance Officer'
    ],
    criticalPaths: [
      'Browse Policies → Select → Purchase → Generate Certificate',
      'File Claim → Upload Documents → Review → Approve → Payout',
      'Renewal Reminder → Review Terms → Renew → Payment',
      'Policy Modification → Update Details → Recalculate Premium'
    ],
    riskAreas: [
      'Fraud Detection',
      'Premium Accuracy',
      'Claims Fraud',
      'Regulatory Compliance'
    ]
  },

  ECOMMERCE: {
    id: 'ecommerce',
    name: 'E-Commerce Platform',
    description: 'Full-featured e-commerce platform with product catalog, shopping cart, and order management',
    domain: 'Retail',
    type: 'Web/Mobile Application',
    rawRequirements: [
      'Customers should be able to browse product catalog',
      'System must support product search and filtering',
      'Customers should be able to add items to shopping cart',
      'System must support secure checkout process',
      'Multiple payment methods should be supported',
      'Inventory should be updated in real-time',
      'Customers should be able to track orders',
      'Admin should manage product inventory',
      'System should support user reviews and ratings',
      'System must send order notifications'
    ],
    components: [
      'Product Catalog Service',
      'Shopping Cart Service',
      'Order Management Service',
      'Inventory Service',
      'Payment Service',
      'Notification Service',
      'Review Service'
    ],
    actors: [
      'Customer',
      'Seller',
      'Admin',
      'Warehouse Manager',
      'Payment Provider',
      'Shipping Provider'
    ],
    criticalPaths: [
      'Browse → Add to Cart → Checkout → Payment → Order Confirmation',
      'Product Listing → Search → Filter → View Details → Review',
      'Order Placement → Inventory Update → Fulfillment → Shipping',
      'Inventory Low → Reorder → Stock Update'
    ],
    riskAreas: [
      'Payment Security',
      'Inventory Accuracy',
      'Order Fulfillment',
      'Customer Experience'
    ]
  },

  PROJECT_MANAGEMENT: {
    id: 'project_management',
    name: 'Project Management Tool',
    description: 'Comprehensive project management platform for team collaboration and task tracking',
    domain: 'Productivity',
    type: 'Web/Mobile Application',
    rawRequirements: [
      'Users should be able to create projects and tasks',
      'Team members should be able to collaborate in real-time',
      'System must support task assignment and tracking',
      'Progress tracking and reporting should be available',
      'System should support different user roles and permissions',
      'Notifications should alert users of task updates',
      'System must support file uploads and sharing',
      'Timeline/Gantt chart view should be available',
      'System should track time spent on tasks',
      'System should generate project reports'
    ],
    components: [
      'Project Service',
      'Task Service',
      'Team Collaboration Service',
      'Reporting Service',
      'File Management Service',
      'Notification Service',
      'Time Tracking Service'
    ],
    actors: [
      'Project Manager',
      'Team Member',
      'Admin',
      'Stakeholder',
      'Client'
    ],
    criticalPaths: [
      'Create Project → Add Team → Create Tasks → Assign',
      'Task Assignment → Work on Task → Update Status → Complete',
      'Project Start → Monitor Progress → Update → Generate Report',
      'Collaboration → Comment → Notification → Action'
    ],
    riskAreas: [
      'Data Security',
      'Concurrency/Conflict Resolution',
      'Real-time Synchronization',
      'Performance at Scale'
    ]
  }
};

/**
 * Get domain definition by ID
 * @param {String} domainId - ID of domain (banking, healthcare, insurance, etc.)
 * @returns {Object} Domain definition
 */
function getDomainApp(domainId) {
  const domain = domainId.toLowerCase();
  return DOMAIN_APPS[domain.toUpperCase()] || null;
}

/**
 * Get all available domains
 * @returns {Array} List of available domain IDs
 */
function getAvailableDomains() {
  return Object.keys(DOMAIN_APPS).map(key => ({
    id: DOMAIN_APPS[key].id,
    name: DOMAIN_APPS[key].name,
    domain: DOMAIN_APPS[key].domain
  }));
}

/**
 * Generate markdown documentation for a domain
 * @param {String} domainId - Domain ID
 * @returns {String} Markdown content
 */
function generateDomainMarkdown(domainId) {
  const domainApp = getDomainApp(domainId);
  if (!domainApp) return null;

  return `# ${domainApp.name}

## Overview

**Domain**: ${domainApp.domain}  
**Type**: ${domainApp.type}  
**Description**: ${domainApp.description}

## Raw Requirements

${domainApp.rawRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

## Core Components

${domainApp.components.map(comp => `- ${comp}`).join('\n')}

## Key Actors

${domainApp.actors.map(actor => `- ${actor}`).join('\n')}

## Critical User Paths

${domainApp.criticalPaths.map((path, i) => `${i + 1}. ${path}`).join('\n')}

## Risk Areas

${domainApp.riskAreas.map((risk, i) => `${i + 1}. ${risk}`).join('\n')}

---

*Generated from Domain Apps Configuration*
`;
}

module.exports = {
  DOMAIN_APPS,
  getDomainApp,
  getAvailableDomains,
  generateDomainMarkdown
};
