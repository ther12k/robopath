# Proposed 60-level curriculum

This is an authoring plan, not 60 implemented maps. Twelve entries have supplied example JSON/witnesses. All public-release levels still need production-core replay and human review. Brief-only entries deliberately omit numeric limits until a valid three-star route exists.

## W1

| Level | Working title | New/recombined decision | Authoring brief | Evidence in kit |
|---|---|---|---|---|
| w1-01 | First steps | Forward | Short straight path; place two commands and see sequential highlights. | Example witness |
| w1-02 | Round the corner | Right turn | An elbow corridor makes rotation visibly different from moving sideways. | Example witness |
| w1-03 | Turn the other way | Left turn | Offset elbows require both turn directions instead of mirroring the earlier answer. | Example witness |
| w1-04 | Battery delivery | Required pickup | Collect a required battery on a visible route before the flag. | Example witness |
| w1-05 | A star detour | Optional objectives | A short success route and a longer bonus route both work. | Example witness |
| w1-06 | Around the rock | Debugging | A direct route is blocked; take a side route through a required pickup. | Example witness |
| w1-07 | Which way am I facing? | Facing transfer | Start north rather than east and keep the same forward semantics. | Example witness |
| w1-08 | Two deliveries | Pickup order | Visit two required batteries and choose the useful turn order. | Example witness |
| w1-09 | Not that shortcut | Goal prerequisites | Reach the flag early without a battery, then plan a valid return. | Brief only |
| w1-10 | A little less code | Block budget | A turn-heavy detour fits actions but wastes static blocks. | Brief only |
| w1-11 | Back to the fork | Backtracking | A battery is in a short dead-end branch requiring a deliberate return. | Brief only |
| w1-12 | Repair one turn | Debugging sequence | Offer an optional editable starter draft with one wrong turn; any valid solution works. | Brief only |
| w1-13 | Both paths work | Multiple solutions | Two distinct corridors fit the cap and lead to the same goal. | Brief only |
| w1-14 | Follow the batteries | Ordering | Three pickups on an asymmetric route test sequence planning. | Brief only |
| w1-15 | Meadow adventure | Transfer | Combine facing, optional detour and a block target without new commands. | Brief only |

## W2

| Level | Working title | New/recombined decision | Authoring brief | Evidence in kit |
|---|---|---|---|---|
| w2-01 | Five little steps | Repeat count | A long stride introduces repeat as a compact program rather than a faster robot. | Example witness |
| w2-02 | Little staircase | Repeat body | Repeat forward/right/forward/left across three stair steps. | Example witness |
| w2-03 | Two then turn | Prefix/suffix | Use repeated moves followed by a non-repeated final turn. | Brief only |
| w2-04 | The pattern starts later | Prefix | One setup action precedes a repeated sequence. | Brief only |
| w2-05 | Three or four? | Repeat count | Choose the repeat count from spatial structure, not a text prompt. | Brief only |
| w2-06 | A corner pattern | Rotating bodies | A repeated forward/turn pattern visits corners; avoid premature stopping assumptions. | Brief only |
| w2-07 | Make room | Static limits | An expanded correct program exceeds slots; its repeated equivalent fits. | Brief only |
| w2-08 | Different long sides | Mixed patterns | Two runs of different lengths need separate repeat groups or literals. | Brief only |
| w2-09 | The last step | Suffix reasoning | A repeated motif ends one step short of the goal. | Brief only |
| w2-10 | Stars on the pattern | Bonus planning | Collect a bonus through a repeated route without treating repeat as free movement. | Brief only |
| w2-11 | Wrong-sized repeat | Debug repeat | An editable draft repeats once too many; preserve creative alternative fixes. | Brief only |
| w2-12 | A broken pattern | Exception | An obstacle breaks regularity and needs a prefix/suffix intervention. | Brief only |
| w2-13 | Small program, longer walk | Tradeoff | Compare low block count against runtime action budget. | Brief only |
| w2-14 | Two compact answers | Multiple programs | Different valid repeat groupings reach the same required objectives. | Brief only |
| w2-15 | Workshop finale | Transfer | Combine counts, asymmetric turns and optional efficiency in a new topology. | Brief only |

## W3

| Level | Working title | New/recombined decision | Authoring brief | Evidence in kit |
|---|---|---|---|---|
| w3-01 | Open the garden gate | Switch entry | Step on a visible switch, return and pass the latched gate. | Example witness |
| w3-02 | Two gate journey | State order | Open two gates in a spatially legible sequence. | Example witness |
| w3-03 | Still open | Latched state | Walk away from a switch and see the gate remain open. | Brief only |
| w3-04 | One switch, two paths | Shared switch | A switch opens two gates; choose the useful path. | Brief only |
| w3-05 | Behind the gate | Required pickup | The flag is reachable early but a required battery needs a gate. | Brief only |
| w3-06 | Back through the garden | Backtracking | Open a route then revisit an earlier junction. | Brief only |
| w3-07 | A repeating approach | Loop plus state | Use a repeated path to reach a switch without changing switch semantics. | Brief only |
| w3-08 | Two switches, two choices | Ordering | Independent switch order permits two valid approaches. | Brief only |
| w3-09 | Gate or detour | Alternative solution | An openable shortcut and a longer ungated route can both succeed. | Brief only |
| w3-10 | Clear the route | Combined prerequisite | Prepare several gates before a final route through required items. | Brief only |
| w3-11 | Pick the useful switch | Selective planning | Some openable branches are optional; do not imply every switch must be used. | Brief only |
| w3-12 | Remember the open path | State debugging | An optional starter program wrongly revisits an already-satisfied switch. | Brief only |
| w3-13 | Optional crystal star | Bonus detour | A bonus behind a gate rewards extra planning without blocking completion. | Brief only |
| w3-14 | Save a few blocks | Compression | Compress repeated sections around a non-repeating switch detour. | Brief only |
| w3-15 | Grove finale | Transfer | A fresh route combines latches, pickup order and bounded repetition. | Brief only |

## W4

| Level | Working title | New/recombined decision | Authoring brief | Evidence in kit |
|---|---|---|---|---|
| w4-01 | New island, same rules | Transfer | A new theme tests known commands without new mechanics. | Brief only |
| w4-02 | Start facing home | Facing plus repeat | A changed start heading requires setup before a familiar pattern. | Brief only |
| w4-03 | The winding bridge | Topology | Narrow asymmetric paths prevent straight-line pattern guessing. | Brief only |
| w4-04 | Supply circuit | Ordering | Several required pickups allow more than one meaningful collection order. | Brief only |
| w4-05 | Open, then explore | State planning | Open a branch first, then use a repeated traversal. | Brief only |
| w4-06 | Tiny program adventure | Compression | A small static budget favors a repeated motif in an unfamiliar layout. | Brief only |
| w4-07 | Watch the action meter | Two budgets | A compact program still must fit runtime action limits. | Brief only |
| w4-08 | Choose a bonus route | Optional challenge | Trade a short completion route against an all-bonus route. | Brief only |
| w4-09 | Fix the journey | Debugging transfer | Repair a provided optional draft with a logic error in the middle. | Brief only |
| w4-10 | Two ways to the flag | Alternative strategies | Direct literals and a repeat-based route both fit the limits. | Brief only |
| w4-11 | The long return | Backtracking synthesis | A gate and required pickup require revisiting an earlier region. | Brief only |
| w4-12 | The pattern changes | Prefix/body/suffix | Recognize where regular movement stops and one exception begins. | Brief only |
| w4-13 | Garden in the clouds | State synthesis | Pair visible switch relations with several spatial choices. | Brief only |
| w4-14 | Your clever route | Efficiency mastery | Support more than one target-meeting program and avoid answer matching. | Brief only |
| w4-15 | Robo expedition | Final transfer | Combine familiar mechanics in a unique celebratory map; no sudden new rule. | Brief only |
