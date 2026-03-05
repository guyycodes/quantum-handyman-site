# Plaid + Self-Report Lead Qualification Widget

## Overview

This widget implements a **lightweight lead qualification funnel** that combines Plaid bank verification with self-reported financial data to pre-qualify homebuyers. No FCRA compliance burden -- designed for speed, low friction, and volume.

**Philosophy:** Minimum friction, maximum speed, regulatory lightweight, "trust but verify."

---

## Statistical Foundation

**Use Case:** Denver Metro Area (~2.9M population)
**Target:** Intent-qualified homebuyers with verifiable financial capacity
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
Landing Page -> Demographics + Intent (single page) -> Plaid Link (optional)
-> Self-Reported Financials -> Lead Score (0-100) -> Agent Handoff
                                                  |
                                                  v
                                          Score < Threshold -> Nurture Campaign
```

### Data Sources

| Component | Implementation |
|---|---|
| Bank Verification | Plaid Link (Transactions + Balance) |
| Credit Score | Self-reported with confidence interval |
| Income/Employment | Self-reported + Plaid recurring deposits |
| Savings/Down Payment | Plaid account balances verified |
| Timeline Intent | Direct question + behavioral tracking |

---

## Why No FCRA?

This widget **does not pull credit reports** from any consumer reporting agency. All credit-related data is self-reported by the user. Plaid connects directly to the user's bank with their explicit OAuth consent -- this is not a credit inquiry.

**Regulatory position:**
- No permissible purpose required (no CRA data accessed)
- No adverse action notices required
- Plaid falls under bank data aggregation, not credit reporting
- Still subject to standard privacy laws (CCPA/state-level)

---

## Implementation Steps

### Step 1: Plaid Integration Setup

- [ ] Create **Plaid Developer Account**
  - URL: https://dashboard.plaid.com/signup
  - Products needed: `transactions`, `auth`, `balance`
  - Environment: `sandbox` -> `development` -> `production`

- [ ] Configure API Credentials
```javascript
// config/plaidService.js
export const plaidConfig = {
  clientId: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  environment: 'sandbox', // 'development' or 'production'
  products: ['transactions', 'auth', 'balance'],
  countryCodes: ['US'],
  language: 'en'
};
```

- [ ] Implement Plaid Link Token Flow
```javascript
// services/plaidService.js
// - createLinkToken(userId) -> returns link_token for Plaid Link UI
// - exchangePublicToken(publicToken) -> returns access_token
// - getBalances(accessToken) -> returns account balances
// - getTransactions(accessToken, startDate, endDate) -> returns transactions
// - getRecurringDeposits(transactions) -> returns estimated monthly income
```

### Step 2: React Widget Implementation

#### Component: `LightLeadQualificationWidget.jsx`

**Props Interface:**
```javascript
LightLeadQualificationWidget.propTypes = {
  plaidPublicKey: PropTypes.string.isRequired,
  agentId: PropTypes.string.isRequired,
  minPlaidScore: PropTypes.number,        // default: 60
  targetHomePrice: PropTypes.number,      // for down payment calculation
  requirePlaidLink: PropTypes.bool,       // default: false
  onLeadQualified: PropTypes.func,        // callback(leadData)
  onLeadDisqualified: PropTypes.func,     // callback(leadData, reason)
  onError: PropTypes.func                 // callback(error)
};
```

**Step Flow:**
```
Step 1: Demographics + Intent (single page)
  - First/Last Name
  - Email
  - Phone
  - ZIP (Denver Metro validation)
  - "Buying within..." (6mo, 12mo, 24mo)
  - "Pre-approved?" (Yes/No/In Progress)
  - Target home price range
  - Currently working with agent? (disqualify if yes)

Step 2: Financial Self-Report + Plaid Link
  - Self-reported credit score range (Excellent/Good/Fair/Poor)
  - Estimated annual income
  - Estimated monthly debt payments
  - Plaid Link button: "Verify with your bank (optional)"
    - If linked: pull balances + recurring deposits
    - If skipped: rely on self-report only (lower score ceiling)

Step 3: Scoring & Results
  - Calculate lead score
  - Display pre-qualification result
  - If qualified: agent notification + calendar booking
  - If not qualified: nurture enrollment + resource links
```

**Lead Scoring Algorithm:**
```javascript
const calculateLeadScore = (selfReport, plaidData, intentData) => {
  let score = 0;
  const hasPlaid = plaidData !== null;

  // Timeline (25 pts)
  if (intentData.timeline === '<6mo') score += 25;
  else if (intentData.timeline === '<12mo') score += 15;
  else score += 5;

  // Credit Self-Report (20 pts) - with honesty buffer
  // Self-reported scores get a confidence penalty vs verified data
  const creditMap = { 'excellent': 18, 'good': 14, 'fair': 8, 'poor': 3 };
  score += creditMap[selfReport.creditRange] || 0;
  // Cap at 18 instead of 20 because self-reported (no hard verification)

  // Income Verification (20 pts)
  if (hasPlaid) {
    const plaidIncome = estimateIncomeFromDeposits(plaidData.transactions);
    const statedIncome = selfReport.annualIncome;
    const variance = Math.abs(plaidIncome - statedIncome) / statedIncome;

    if (variance <= 0.15) score += 20;      // stated income matches Plaid
    else if (variance <= 0.30) score += 12; // moderate discrepancy
    else score += 5;                         // large discrepancy
  } else {
    score += 10; // self-report only, half credit
  }

  // DTI Estimation (15 pts)
  const monthlyIncome = selfReport.annualIncome / 12;
  const estimatedDTI = selfReport.monthlyDebt / monthlyIncome;
  if (estimatedDTI <= 0.36) score += 15;
  else if (estimatedDTI <= 0.43) score += 10;
  else score += 0;

  // Down Payment Capacity (20 pts)
  if (hasPlaid) {
    const totalBalance = plaidData.balances.reduce(
      (sum, acct) => sum + acct.current, 0
    );
    const minDown = intentData.targetPrice * 0.03;

    if (totalBalance >= minDown * 2) score += 20;  // strong reserves
    else if (totalBalance >= minDown) score += 15;  // meets minimum
    else score += 5;                                 // below minimum
  } else {
    score += 8; // self-report only, partial credit
  }

  return Math.min(score, 100);
};
```

### Step 3: Custom Hooks

#### `usePlaidLink.js`
```javascript
// src/hooks/usePlaidLink.js
const usePlaidLink = (config) => {
  const [linkToken, setLinkToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [plaidData, setPlaidData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeLink = async (userId) => {
    const response = await fetch('/api/plaid/create-link-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const { link_token } = await response.json();
    setLinkToken(link_token);
  };

  const onSuccess = async (publicToken, metadata) => {
    setLoading(true);
    try {
      // Exchange public token for access token
      const tokenResponse = await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicToken })
      });
      const { access_token } = await tokenResponse.json();
      setAccessToken(access_token);

      // Fetch balances and transactions
      const dataResponse = await fetch('/api/plaid/get-financial-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: access_token })
      });
      const data = await dataResponse.json();
      setPlaidData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { linkToken, initializeLink, onSuccess, plaidData, loading, error };
};
```

#### `useLeadScoring.js` (shared with Widget A)
```javascript
// src/hooks/useLeadScoring.js
const useLeadScoring = (scoringFn) => {
  const [score, setScore] = useState(null);
  const [tier, setTier] = useState(null);

  const calculateScore = (data) => {
    const result = scoringFn(data);
    setScore(result);

    if (result >= 80) setTier('hot');
    else if (result >= 60) setTier('warm');
    else if (result >= 40) setTier('nurture');
    else setTier('cold');

    return { score: result, tier };
  };

  return { score, tier, calculateScore };
};
```

### Step 4: Server-Side Plaid Endpoints

```javascript
// netlify/functions/plaid-create-link-token.js
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const client = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
}));

export const handler = async (event) => {
  const { userId } = JSON.parse(event.body);

  const response = await client.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: 'Quantum Handyman Lead Qualification',
    products: ['transactions', 'auth'],
    country_codes: ['US'],
    language: 'en',
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ link_token: response.data.link_token }),
  };
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
      tier: leadData.tier,
      selfReportedCredit: leadData.creditRange,
      estimatedDTI: leadData.estimatedDTI,
      timeline: leadData.timeline,
      preApproved: leadData.preApproved,
      plaidVerified: leadData.plaidLinked,
      verifiedBalance: leadData.plaidLinked ? leadData.totalBalance : null
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
| Plaid Link closed by user | Score without Plaid data (lower ceiling); prompt to retry |
| Plaid API timeout | Offer to continue without bank verification |
| Invalid institution | Show "bank not supported" message; allow manual entry |
| Token exchange failure | Retry up to 3x; fallback to self-report only |
| Network failure | Save progress in sessionStorage; offer resume |
| Score below threshold | Enroll in nurture campaign; show resource links |

---

## Data Security

- **No SSN collected.** This is the primary advantage over Widget A.
- **Plaid tokens:** Access tokens stored server-side only, never exposed to the client.
- **Bank data:** Balances and transaction summaries processed in-memory; raw transactions not persisted.
- **PII:** Name, email, phone stored with standard encryption at rest.
- **Plaid compliance:** Plaid handles bank credential security via their OAuth flow; credentials never touch your infrastructure.

---

## Scoring Comparison: With vs Without Plaid

| Factor | With Plaid (max pts) | Without Plaid (max pts) |
|---|---|---|
| Timeline | 25 | 25 |
| Credit Self-Report | 18 | 18 |
| Income Verification | 20 | 10 |
| DTI Estimation | 15 | 15 |
| Down Payment Capacity | 20 | 8 |
| **Maximum Possible** | **98** | **76** |

Leads who skip Plaid Link are capped at a lower score, reflecting reduced verification confidence. This naturally prioritizes Plaid-verified leads for agent handoff.

---

## Cost Breakdown

| Item | Cost |
|---|---|
| Plaid API (sandbox/development) | Free |
| Plaid API (production, per link) | $0.30-1.50 per item-connection |
| Plaid monthly minimum | ~$500/month (volume dependent) |
| No legal review required (no FCRA) | $0 |
| **Total (100 leads, ~60% link Plaid)** | **~$520-590** |

---

## Configuration

```bash
# .env
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox                        # 'development' or 'production'
MIN_PLAID_SCORE=60                       # minimum score for agent handoff
DEFAULT_TARGET_HOME_PRICE=500000         # Denver metro default
AGENT_WEBHOOK_URL=https://your-crm.com/webhook
```

---

## Analytics & Validation

Track these metrics to validate your sample:

```javascript
const metrics = {
  // Conversion Funnel
  stepCompletionRates: {},          // % completing each step
  plaidLinkRate: 0,                 // % who connected Plaid
  plaidLinkDropoffRate: 0,          // % who started but abandoned Plaid

  // Lead Quality
  averageLeadScore: 0,
  averageScoreWithPlaid: 0,         // compare verified vs unverified
  averageScoreWithoutPlaid: 0,
  qualifiedRate: 0,                 // % scoring above threshold

  // Plaid Data Accuracy
  incomeVariance: 0,                // avg difference: stated vs Plaid income
  selfReportHonestyRate: 0,         // % where stated income within 15% of Plaid

  // Agent Feedback (close the loop)
  agentContactRate: 0,              // % agents who contacted lead
  agentConversionRate: 0,           // % leads who became clients
  plaidVsNonPlaidConversion: 0,     // conversion rate comparison

  // Statistical Validation
  marginOfError: 0,
  confidenceInterval: [0, 0]        // 95% CI for qualification rate
};
```

---

## Testing

```bash
# Sandbox mode: Use Plaid sandbox credentials
PLAID_ENV=sandbox

# Plaid sandbox test credentials:
# Institution: any sandbox bank
# Username: user_good
# Password: pass_good
# See: https://plaid.com/docs/sandbox/test-credentials/
```

| Test Case | Expected Result |
|---|---|
| Plaid linked, high balance, near timeline | Score 80+, agent notified |
| Plaid linked, low balance, far timeline | Score 40-60, nurture campaign |
| No Plaid, excellent self-report | Score 50-76 (capped), conditional qualify |
| No Plaid, poor self-report | Score < 40, nurture campaign |
| Plaid Link closed mid-flow | Graceful fallback to self-report scoring |
| Stated income 50%+ off Plaid income | Income score penalized to 5 pts |

---

## Deployment

```bash
# Install dependencies
npm install plaid react-plaid-link

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
├── README-FCRA-CreditPull.md              # Widget A documentation
├── README-Plaid-SelfReport.md             # This file
├── components/
│   ├── LightLeadQualificationWidget.jsx
│   └── shared/
│       ├── LeadScoreDisplay.jsx
│       ├── DemographicStep.jsx
│       ├── TimelineStep.jsx
│       └── AgentHandoffModal.jsx
├── hooks/
│   ├── usePlaidLink.js
│   └── useLeadScoring.js
├── services/
│   └── plaidService.js                    # Plaid API wrapper
└── utils/
    ├── leadScoring.js                     # Scoring algorithms
    └── validation.js                      # Form validation
```

---

## Key Differences from Widget A (FCRA)

| Aspect | Widget A (FCRA) | Widget B (This Widget) |
|---|---|---|
| User Friction | High (SSN, consent, 5-7 min) | Low (2-3 min, optional bank link) |
| Lead Accuracy | Very High (actual credit data) | Medium-High (verified deposits + self-report) |
| Compliance Burden | High (FCRA, audits, adverse actions) | Low (no credit report = no FCRA) |
| Agent Confidence | Very High | Medium (depends on Plaid depth) |
| Expected Conversion Rate | ~15-20% | ~35-45% |
| Cost Per Lead | ~$12-15 (incl credit pull) | ~$5-8 (Plaid only) |
| Best For | Premium service, high-touch agents | Volume play, first-time buyer focus |

---

## Support

- **Plaid API Docs:** https://plaid.com/docs/
- **Plaid Link (React):** https://plaid.com/docs/link/react/
- **Plaid Sandbox:** https://plaid.com/docs/sandbox/

---

## License

MIT - See parent repository LICENSE.md
