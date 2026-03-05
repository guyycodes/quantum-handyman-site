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
n_0 = (z / E)^2 * p * (1-p)
    = (1.96 / 0.05)^2 * 0.5 * 0.5
    = 384.16

n   = n_0 / (1 + (n_0 - 1) / N)       # Finite Population Correction
```

### FPC Input Clarification

The `N` in the FPC denominator should reflect your **near-term reachable audience**, not the total metro population. Choose the value that matches your distribution channel:

| Channel | Realistic N | FPC-adjusted n |
|---|---|---|
| Email list / CRM contacts | ~4,000 | ~350 |
| Paid ad campaign (monthly reach) | ~15,000 | ~380 |
| Full Denver metro (theoretical) | ~2,900,000 | ~384 (FPC negligible) |

If your initial campaign targets ~4,000 reachable contacts, using N=4,000 is appropriate and yields n~350. For broader campaigns, FPC barely matters and n stays near 384.

### Proportion Assumption

The formula uses p=0.5 (maximum variance / most conservative). If early data shows your actual qualification rate is materially different (e.g., p=0.35), you can recalculate:

```
p = 0.35 -> n_0 = (1.96/0.05)^2 * 0.35 * 0.65 = 349.6
p = 0.50 -> n_0 = (1.96/0.05)^2 * 0.50 * 0.50 = 384.2  (most conservative)
```

Use p=0.5 until you have enough data to estimate the real rate.

### Continuous Improvement (Not One-and-Done)

Treat 385 as the **validation cohort threshold**, not a marketing target. Once you hit ~400-500 completed funnels with real agent outcomes, run your first calibration analysis. After that, keep collecting and re-validating continuously -- your funnel, scoring weights, and marketing environment all evolve.

**Milestone cadence:**
- **~100 leads:** Check funnel drop-off rates, fix UX bottlenecks
- **~250 leads:** Preliminary scoring accuracy check (does score predict agent contact?)
- **~400-500 leads:** Full statistical validation cohort -- measure qualification rate +/-5% at 95% CI
- **Ongoing:** Re-calibrate scoring weights quarterly based on closed-loop outcome data

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
- Maintain disclaimers that you are **not making an official lending decision**
- Revisit compliance posture whenever you add new data sources or begin sharing consumer financial details with third parties -- certain state laws may impose additional data-privacy constraints beyond CCPA

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
  let verifiedFactors = 0;
  let totalFactors = 5;
  const hasPlaid = plaidData !== null;

  // Timeline (25 pts)
  if (intentData.timeline === '<6mo') score += 25;
  else if (intentData.timeline === '<12mo') score += 15;
  else score += 5;

  // Credit Self-Report (20 pts) - with honesty buffer
  const creditMap = { 'excellent': 18, 'good': 14, 'fair': 8, 'poor': 3 };
  score += creditMap[selfReport.creditRange] || 0;

  // Income Verification (20 pts)
  if (hasPlaid) {
    const plaidIncome = estimateIncomeFromDeposits(plaidData.transactions);
    const statedIncome = selfReport.annualIncome;
    const variance = Math.abs(plaidIncome - statedIncome) / statedIncome;

    if (variance <= 0.15) { score += 20; verifiedFactors++; }
    else if (variance <= 0.30) { score += 12; verifiedFactors++; }
    else score += 5; // large discrepancy -- flag for review
  } else {
    score += 10;
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

    if (totalBalance >= minDown * 2) { score += 20; verifiedFactors++; }
    else if (totalBalance >= minDown) { score += 15; verifiedFactors++; }
    else score += 5;
  } else {
    score += 8;
  }

  const finalScore = Math.min(score, 100);
  const confidence = hasPlaid
    ? (verifiedFactors >= 2 ? 'high' : 'medium')
    : 'low';

  return { score: finalScore, confidence };
};
```

**Confidence Flag:**

Each lead receives both a numeric score and a verification confidence level. This lets agents distinguish between "score 72, high confidence (Plaid-verified income + balance)" vs "score 74, low confidence (self-report only)."

| Confidence | Meaning | Agent Action |
|---|---|---|
| `high` | 2+ factors verified via Plaid, data consistent | Priority follow-up |
| `medium` | Plaid linked but data partially inconsistent | Follow up, verify claims |
| `low` | Self-report only, no bank verification | Lower priority or request Plaid |

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
      confidence: leadData.confidence,
      tier: leadData.tier,
      selfReportedCredit: leadData.creditRange,
      estimatedDTI: leadData.estimatedDTI,
      timeline: leadData.timeline,
      preApproved: leadData.preApproved,
      plaidVerified: leadData.plaidLinked,
      verifiedBalance: leadData.plaidLinked ? leadData.totalBalance : null,
      incomeVariance: leadData.plaidLinked ? leadData.incomeVariance : null
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
- **Bank data:** Balances and transaction summaries processed in-memory; raw transactions not persisted. If you begin storing transaction-level history, anonymize or encrypt sensitive fields (partial transaction descriptions, masked account numbers).
- **PII:** Name, email, phone stored with standard encryption at rest.
- **Plaid compliance:** Plaid handles bank credential security via their OAuth flow; credentials never touch your infrastructure.
- **Privacy policy:** Provide an easily accessible policy clarifying how Plaid and your widget handle user data, including data retention periods and deletion rights.

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

## Data Quality & Verification Strategy

### Self-Report Honesty Tracking

For leads who link Plaid, compare stated income against Plaid's recurring deposit estimate. Track this over time to understand reporting patterns:

```javascript
const honestyCheck = {
  statedIncome: selfReport.annualIncome,
  plaidEstimatedIncome: estimateIncomeFromDeposits(plaidData.transactions),
  variance: null, // calculated as |stated - plaid| / plaid
  pattern: null   // 'accurate' | 'over_reporter' | 'under_reporter'
};

// Aggregate across leads to detect systemic patterns
// e.g., if a particular lead source consistently over-reports by 20%+,
// apply a dynamic penalty to future self-reports from that source
```

If you see consistent over/under-reporting patterns from specific lead sources (ad campaigns, landing pages), adjust scoring weights for those cohorts.

### Handling Missing / Partial Data

Not all leads will connect Plaid. Monitor how partial-data leads perform vs verified leads:

| Metric | Plaid-Verified | Self-Report Only |
|---|---|---|
| Agent contact rate | Track | Track |
| Agent conversion rate | Track | Track |
| Average time to close | Track | Track |
| Self-reported accuracy (retroactive) | Baseline | Compare |

If the gap between groups is large, consider making Plaid linking more strongly encouraged:
- "Connect your bank to skip documentation steps"
- "Plaid-verified leads get priority agent callback"
- Move Plaid Link earlier in the flow (before self-report fields)

### Potential Bias & Representativeness

Watch for demographic or behavioral biases in Plaid adoption:

- **Tech-savvy / younger users** may link Plaid more readily
- **Older or privacy-conscious buyers** may skip Plaid but still be financially strong
- **High-net-worth leads** may refuse bank linking on principle

Segment your outcome data by Plaid-linked vs not-linked and measure each group's actual close rate. If strong leads are systematically refusing Plaid, recalibrate so you don't over-penalize the no-Plaid path. The score ceiling (76 vs 98) should reflect real-world outcome differences, not assumptions.

---

## Scoring Validation & Calibration

### Phase 1: Point-Based System (Current)

The static point system is transparent and easy for stakeholders to understand. Use it to launch and collect your first ~400-500 leads with outcome data.

### Phase 2: Data-Driven Weight Adjustment

Once you have labeled outcomes (Lead -> Agent Contact -> Viewing -> Preapproval -> Close), analyze which scoring factors actually predict conversion:

```javascript
// Closed-loop outcome tracking schema
const leadOutcome = {
  leadId: 'string',
  initialScore: 0,
  confidence: 'high|medium|low',
  selfReportedData: { /* credit range, income, debt */ },
  plaidData: { /* balances, income estimate, variance */ },
  outcomes: {
    agentContacted: false,
    agentContactDate: null,
    meetingScheduled: false,
    preapprovalObtained: false,
    offerMade: false,
    closedTransaction: false,
    closedDate: null
  }
};
```

Run correlation analysis on each factor vs final outcome. If Plaid deposit verification turns out to be the single strongest predictor, up-weight it. If self-reported credit range has near-zero correlation with close rate, down-weight or replace it.

### Phase 3: Logistic Regression (Future)

With ~1,000+ labeled leads, consider replacing static point tiers with a logistic regression model:

```
P(conversion) = sigmoid(b0 + b1*timeline + b2*creditRange + b3*plaidIncome + b4*dti + b5*balance)
```

This automatically learns optimal weights from your data. The point-based system becomes the fallback for explainability and for new market segments without enough data.

---

## A/B Testing & Conversion Optimization

### Recommended Experiments

| Test | Variant A (Control) | Variant B | Measure |
|---|---|---|---|
| Plaid timing | Plaid on Step 2 (current) | Plaid on Step 1 (before self-report) | Plaid adoption rate, overall completion rate |
| Step count | 3-step flow (current) | 2-step flow (demographics + financials combined) | Drop-off rate, lead quality |
| Plaid framing | "Verify with your bank (optional)" | "Get priority callback - verify with your bank" | Plaid link rate |
| Score threshold | minScore = 60 (current) | minScore = 50 | Volume vs agent satisfaction |
| Incentive for Plaid | No incentive | "Skip documentation steps" messaging | Plaid adoption |

### Implementation Notes

- Run each test with a 50/50 traffic split
- Minimum ~200 leads per variant before drawing conclusions (100 per arm)
- Primary metric: **agent conversion rate** (not just funnel completion)
- Secondary metrics: funnel completion rate, Plaid adoption rate, time-to-complete
- Tag each lead with its experiment variant so you can trace outcomes back to the test

### Drop-Off Monitoring

Break down analytics at each micro-step:

```
Start -> Demographics completed -> Intent questions completed
-> Plaid Link attempted -> Plaid Link succeeded (or skipped)
-> Self-report completed -> Score calculated -> Agent contact
```

Tag each lead's exit point. Common patterns to watch for:
- High drop-off at Plaid Link -> friction too high, test alternative framing
- High drop-off at income/debt questions -> consider fewer fields or ranges instead of exact numbers
- High drop-off after score display -> messaging needs work (even nurture leads should feel valued)

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
  overReportRate: 0,                // % who overstate income by >15%
  underReportRate: 0,               // % who understate income by >15%

  // Agent Feedback (closed-loop)
  agentContactRate: 0,              // % agents who contacted lead
  agentConversionRate: 0,           // % leads who became clients
  plaidVsNonPlaidConversion: 0,     // conversion rate comparison
  avgTimeToAgentContact: 0,         // hours from lead submission to first contact
  avgTimeToClose: 0,                // days from lead submission to closed deal

  // Outcome Tracking (calibration data)
  leadOutcomes: {
    contacted: 0,                   // agent made contact
    meetingHeld: 0,                 // in-person or virtual meeting
    preapproved: 0,                 // mortgage preapproval obtained
    offerMade: 0,                   // offer submitted on property
    closed: 0                       // transaction closed
  },

  // Statistical Validation
  marginOfError: 0,
  confidenceInterval: [0, 0],       // 95% CI for qualification rate

  // A/B Test Tracking
  experimentResults: {}             // variant -> { completionRate, plaidRate, conversionRate }
};
```

### Agent Dashboard Display

The agent notification payload includes the confidence flag so agents can prioritize effectively:

```
Lead: Jane Doe | Score: 78 | Confidence: HIGH
  Timeline: <6mo | Credit: Good (self-reported)
  Income: $95K stated, $91K verified (Plaid) | DTI: 34%
  Down Payment: $42K verified balance vs $15K minimum (3% of $500K)
  
Lead: John Smith | Score: 72 | Confidence: LOW
  Timeline: <6mo | Credit: Excellent (self-reported)
  Income: $110K stated (unverified) | DTI: 38% (self-reported)
  Down Payment: unverified
```

Agents see at a glance that Jane's 78 is backed by bank data while John's 72 relies entirely on self-reporting.

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

## Next Steps Roadmap

Concrete actions to launch, validate, and iterate:

### Phase 1: Launch & Collect (Weeks 1-4)

- [ ] Build widget and deploy with Plaid sandbox credentials
- [ ] Switch to Plaid development/production environment
- [ ] Choose a stable marketing channel (single ad campaign or email list) for the initial cohort
- [ ] Collect first ~100 leads; fix UX bottlenecks based on drop-off data
- [ ] Enable outcome labels in CRM: `contacted -> meeting -> preapproval -> offer -> closed`

### Phase 2: Validate (Leads 100-500)

- [ ] At ~250 leads: run preliminary scoring accuracy check (does score predict agent contact rate?)
- [ ] At ~400-500 leads: full statistical validation -- measure qualification rate +/-5% at 95% CI
- [ ] Compare Plaid-verified vs self-report-only cohorts on actual conversion rates
- [ ] Check self-report honesty rate: % where stated income is within 15% of Plaid estimate
- [ ] If over-reporting pattern detected (>20% of Plaid-linked leads overstate by 15%+), adjust income scoring weight

### Phase 3: Optimize (Leads 500+)

- [ ] Launch first A/B test (recommended: Plaid timing -- Step 1 vs Step 2)
- [ ] Run closed-loop analysis: correlate each scoring factor with actual close rate
- [ ] Adjust scoring weights based on real outcome data (not assumptions)
- [ ] If strong leads are systematically refusing Plaid, reduce the no-Plaid score penalty
- [ ] Introduce confidence flag to agent dashboard if not already visible

### Phase 4: Scale (Leads 1,000+)

- [ ] Evaluate logistic regression model as a scoring replacement (requires labeled outcome data)
- [ ] Expand to additional marketing channels; re-validate scoring per channel
- [ ] Consider upgrading high-confidence leads to Widget A (FCRA) for premium agent handoff
- [ ] Quarterly re-calibration of scoring weights based on latest 90-day outcome window

---

## Support

- **Plaid API Docs:** https://plaid.com/docs/
- **Plaid Link (React):** https://plaid.com/docs/link/react/
- **Plaid Sandbox:** https://plaid.com/docs/sandbox/

---

## License

MIT - See parent repository LICENSE.md
