# Metrics

## North Star Metric
**Audits completed that surface $200+/month in savings**

Why: This is the moment the tool delivers real value. A user who sees
$200+ savings is 5x more likely to book a Credex consultation than one
who sees $0. Optimizing for this metric aligns user value with business value.

## 3 Input Metrics

1. **Form completion rate** (started audit / completed audit)
   Target: >40%. Below 30% means the form is too long or confusing.

2. **Average savings surfaced per audit**
   Target: >$150/mo. Below $80 means our audit rules are too conservative.

3. **Email capture rate** (email submitted / audit completed)
   Target: >20%. Below 10% means the modal timing or copy needs work.

## What to instrument first
- Audit form start event
- Audit submit event
- Results page load
- Lead modal shown
- Lead modal submitted
- Share button clicked

## Pivot trigger
If after 500 audits, email capture rate is below 8% AND average savings
surfaced is below $100/mo, the tool is not delivering enough value to
justify continued investment. Pivot signal: rebuild audit engine with
more aggressive (but still defensible) recommendations.

Note: DAU is wrong for this tool. Users audit once a quarter at most.
The right frequency metric is "monthly unique audits completed."