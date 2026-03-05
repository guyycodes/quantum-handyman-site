# FCRA Credit Pull Lead Qualification Widget

## Overview

This widget implements a **FCRA-compliant lead qualification funnel** that uses soft credit pulls to verify homebuyer creditworthiness. It offers maximum qualification accuracy with full regulatory compliance.

**Philosophy:** Maximum qualification accuracy, full regulatory compliance, premium lead quality.

---

## Statistical Foundation

**Use Case:** Denver Metro Area (~2.9M population)
**Target:** Intent-qualified homebuyers (credit score >= 620, DTI <= 43%)
**Confidence:** 95% (z = 1.96)
**Margin of Error:** +/-5%
**Required Sample:** n ~ 385 qualified leads

```
n_0 = (1.96/0.05)^2 x 0.25 = 384.16
n   = n_0 / (1 + (n_0-1)/4000) = 350 (with FPC)
```

---

## Architecture

```
User Journey:
Landing Page -> Demographics -> Intent/Timeline -> FCRA Consent (E-Sign)
-> Soft Credit Pull (Experian/SoftVue) -> Lead Score (0-100) -> Agent Handoff
                                      |
                                      v
                              Score < Threshold -> Adverse Action Notice + Nurture
```

### Compliance Stack

| Component | Implementation |
|---|---|
| FCRA Permissible Purpose | "Mortgage referral evaluation" disclosure |
| Consumer Consent | Digital signature + email confirmation |
| Privacy Policy | CCPA/GDPR compliant (template provided) |
| Credit Bureau Contract | SoftVue API key (covered in config) |
| Security | SOC 2 Type II via API (no local storage of SSN) |
| Adverse Action | Auto-generated if score < threshold |

---

## Implementation Steps

### Step 1: Legal Foundation

- [ ] Draft **FCRA Permissible Purpose Disclosure**
  - Statement: "This credit inquiry is for mortgage referral evaluation only"
  - Required under FCRA Section 604(a)(3)(F)

- [ ] Create **Consumer Consent Form**
  - Digital signature capture
  - Email confirmation requirement
  - Retention: 5 years minimum

- [ ] Implement **Privacy Policy** (CCPA/GDPR compliant)
  - Data retention: 2 years for leads, 7 years for consents
  - Right to deletion process

- [ ] Build **Adverse Action Notice Template**
  - Auto-generated for declined leads
  - Include: credit score, key factors, CRA contact info
  - Required under FCRA Section 615(a)

### Step 2: Credit Bureau Integration

- [ ] Apply for **SoftVue/Experian API Account**
  - URL: https://www.experian.com/business/soft-inquiries
  - Documentation: SoftPull API
  - Contract: End User Agreement required

- [ ] Configure API Credentials
```javascript
// config/creditService.js
export const creditConfig = {
  apiKey: process.env.EXPERIAN_API_KEY,
  apiSecret: process.env.EXPERIAN_API_SECRET,
  environment: 'production', // or 'sandbox'
  permissiblePurpose: 'MORTGAGE_REFERRAL'
};
```

- [ ] Implement Soft Pull Service
```javascript
// services/creditService.js
// - softPullCredit(ssn, dob, address) -> returns { score, factors, report }
// - validatePermissiblePurpose() -> boolean
// - logAdverseAction(lead, reason) -> async
```

### Step 3: React Widget Implementation

#### Component: `FCRALeadQualificationWidget.jsx`

**Props Interface:**
```javascript
FCRALeadQualificationWidget.propTypes = {
  apiKey: PropTypes.string.isRequired,
  agentId: PropTypes.string.isRequired,
  minCreditScore: PropTypes.number,      // default: 620
  maxDTI: PropTypes.number,              // default: 0.43
  onLeadQualified: PropTypes.func,       // callback(leadData)
  onLeadDisqualified: PropTypes.func,    // callback(leadData, reason)
  onError: PropTypes.func                // callback(error)
};
```

**Step Flow:**
```
Step 1: Demographics
  - First/Last Name
  - Email (verified via OTP)
  - Phone
  - ZIP (Denver Metro validation)

Step 2: Intent Assessment
  - "Buying within..." (6mo, 12mo, 24mo)
  - "Pre-approved?" (Yes/No/In Progress)
  - Target home price range
  - Currently working with agent? (disqualify if yes)

Step 3: FCRA Consent
  - Permissible purpose disclosure
  - Consumer rights summary
  - Digital signature canvas
  - Email confirmation sent

Step 4: Identity Verification
  - SSN input (encrypted at rest)
  - DOB
  - Current address (USPS validated)

Step 5: Credit Pull & Scoring
  - API call to SoftVue
  - Score calculation (see below)
  - Success screen OR adverse action
  - Agent notification (if qualified)
```

**Lead Scoring Algorithm:**
```javascript
const calculateLeadScore = (creditData, intentData) => {
  let score = 0;

  // Credit Score (20 pts) - Tiered
  if (creditData.score >= 740) score += 20;
  else if (creditData.score >= 670) score += 15;
  else if (creditData.score >= 620) score += 10;
  else score += 5;

  // Timeline (25 pts)
  if (intentData.timeline === '<6mo') score += 25;
  else if (intentData.timeline === '<12mo') score += 15;
  else score += 5;

  // DTI (15 pts)
  const estimatedDTI = calculateDTI(creditData, intentData.income);
  if (estimatedDTI <= 0.36) score += 15;
  else if (estimatedDTI <= 0.43) score += 10;
  else score += 0;

  // Pre-Approval Status (20 pts)
  if (intentData.preApproved) score += 20;
  else if (intentData.preApproved === 'in_progress') score += 10;
  else score += 0;

  // Down Payment Capacity (20 pts)
  const minDown = intentData.targetPrice * 0.03;
  if (hasSufficientSavings(creditData, minDown)) score += 20;
  else score += 5;

  return Math.min(score, 100);
};
```

### Step 4: Custom Hooks

#### `useCreditPull.js`
```javascript
// src/hooks/useCreditPull.js
const useCreditPull = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creditData, setCreditData] = useState(null);

  const pullCredit = async (identityData, consentToken) => {
    setLoading(true);
    try {
      const isValid = await validateConsent(consentToken);
      if (!isValid) throw new Error('Invalid or expired consent');

      const response = await creditService.softPull(identityData);
      setCreditData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { pullCredit, loading, error, creditData };
};
```

#### `useFCRACompliance.js`
```javascript
// src/hooks/useFCRACompliance.js
const useFCRACompliance = () => {
  const validateConsent = async (formData) => {
    // Check all required fields
    // Verify digital signature
    // Send confirmation email
    // Store consent record
  };

  const generateAdverseAction = (lead, reasons) => {
    // Create adverse action letter
    // Include: credit score (if applicable), key factors, CRA contact
    // Log for compliance audit
  };

  return { validateConsent, generateAdverseAction };
};
```

### Step 5: Agent Dashboard Integration

When lead passes threshold:
```javascript
const notifyAgent = async (leadData) => {
  const payload = {
    leadId: leadData.id,
    agentId: leadData.agentId,
    contact: {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone
    },
    qualification: {
      score: leadData.score,
      creditScore: leadData.creditScore,
      estimatedDTI: leadData.estimatedDTI,
      timeline: leadData.timeline,
      preApproved: leadData.preApproved
    },
    timestamp: new Date().toISOString()
  };

  await fetch(`/api/agents/${leadData.agentId}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Credit pull API timeout | Retry up to 3x with exponential backoff; show "processing" spinner |
| Invalid SSN format | Client-side validation before API call; inline error message |
| Consent token expired | Redirect user back to consent step with explanation |
| API rate limit hit | Queue request; notify user of delay |
| Network failure mid-pull | Save progress locally (encrypted); offer resume on reconnect |
| Score below threshold | Trigger adverse action flow; enroll in nurture campaign |

---

## Data Security

- **SSN Handling:** Never stored in local state, localStorage, or cookies. Transmitted via TLS 1.3, tokenized server-side immediately upon receipt.
- **Consent Records:** Stored with immutable timestamps; write-once audit log.
- **Credit Data:** Encrypted at rest (AES-256); auto-purged after 2 years for leads, 7 years for consents.
- **PII Minimization:** Only the lead score and qualification status are passed to the agent dashboard -- raw credit data stays server-side.

---

## Compliance Checklist

- [ ] FCRA End User Agreement signed with Experian
- [ ] Consumer consent form reviewed by legal counsel
- [ ] Adverse action notice template FCRA-compliant
- [ ] Data retention policy implemented (7 years)
- [ ] Security: No SSNs stored in plain text (use tokenization)
- [ ] Audit trail: All credit pulls logged with timestamp + consent proof
- [ ] Annual FCRA compliance review scheduled

---

## Cost Breakdown

| Item | Cost |
|---|---|
| Legal review (privacy policy, consent forms) | $1,500-2,500 |
| Experian API setup | $0 (pay per pull) |
| Soft credit pulls | $1.25-1.50 each |
| Adverse action letter service (optional) | $50/month |
| **Total (100 leads)** | **~$1,625-2,650** |

---

## Configuration

```bash
# .env
EXPERIAN_API_KEY=your_key
EXPERIAN_API_SECRET=your_secret
EXPERIAN_ENV=sandbox                    # Change to 'production' when ready
MIN_CREDIT_SCORE=620
MAX_DTI=0.43
AGENT_WEBHOOK_URL=https://your-crm.com/webhook
```

---

## Analytics & Validation

Track these metrics to validate your sample:

```javascript
const metrics = {
  // Conversion Funnel
  stepCompletionRates: {},       // % completing each step
  creditPullSuccessRate: 0,      // % successfully pulling credit

  // Lead Quality
  averageLeadScore: 0,
  qualifiedRate: 0,              // % scoring above threshold

  // Agent Feedback (close the loop)
  agentContactRate: 0,           // % agents who contacted lead
  agentConversionRate: 0,        // % leads who became clients

  // Statistical Validation
  marginOfError: 0,              // Is your qualified rate +/-5%?
  confidenceInterval: [0, 0]     // 95% CI for qualification rate
};
```

---

## Testing

```bash
# Sandbox mode: Use Experian sandbox credentials for development
EXPERIAN_ENV=sandbox

# Test SSNs provided by Experian sandbox:
# 666-xx-xxxx range reserved for testing
# See Experian developer docs for full list
```

| Test Case | Expected Result |
|---|---|
| Valid SSN, score >= 740 | Lead score 80-100, agent notified |
| Valid SSN, score 620-669 | Lead score 50-70, agent notified |
| Valid SSN, score < 620 | Adverse action notice triggered |
| Invalid SSN format | Client-side validation error |
| Expired consent token | Redirect to consent step |
| API timeout | Retry with backoff, user sees spinner |

---

## Deployment

```bash
# Install dependencies
npm install @experian/softpull-sdk react-signature-canvas

# Run in development
npm run dev

# Build for production (ensure env vars are set)
npm run build

# Deploy
npm run deploy
```

---

## Directory Structure

```
src/leadQualificationFunnel/
├── README-FCRA-CreditPull.md              # This file
├── README-Plaid-SelfReport.md             # Widget B documentation
├── components/
│   ├── FCRALeadQualificationWidget.jsx
│   └── shared/
│       ├── LeadScoreDisplay.jsx
│       ├── DemographicStep.jsx
│       ├── TimelineStep.jsx
│       └── AgentHandoffModal.jsx
├── hooks/
│   ├── useCreditPull.js
│   └── useLeadScoring.js
├── services/
│   └── creditService.js                   # SoftVue API wrapper
└── utils/
    ├── fcraCompliance.js                  # Consent validation, adverse action
    ├── leadScoring.js                     # Scoring algorithms
    └── validation.js                      # Form validation
```

---

## Support

- **Experian API Docs:** https://developer.experian.com/
- **FCRA Compliance:** https://www.consumerfinance.gov/fair-credit-reporting-act/
- **Legal Review:** Consult FCRA attorney before production use

---

## License

MIT - See parent repository LICENSE.md
