# Omega Omni

> A multi-stage, multi-model **collective reasoning engine**. It fans a task out
> across 12+ independent AI providers, lets a second collective see the
> evidence and debate it, runs an independent red-team evaluation, synthesises
> a refined candidate, and feeds unresolved questions back — recursively —
> until a quality gate is satisfied or the round budget is exhausted.

## How it works

```
USER TASK
   |
ORCHESTRATOR / TRIAGE   (estimate difficulty -> allocate compute)
   |
STAGE 1 — DIVERSITY     12+ agents, same task, ZERO cross-visibility.
   |                     Each uses full capacity: reason, criticise, generate.
   |                     Output -> structured claims + evidence on a blackboard.
   |
STAGE 2 — DELIBERATION   Collective sees the evidence + prior answers.
   |                     Debate, challenge, merge, reject.
   |                     Disagreement amplification: extra compute where answers conflict.
   |
STAGE 3 — EVAL / RED TEAM  Independent judges score candidates
   |                       (correctness, evidence, logic, completeness,
   |                        contradictions, uncertainty). Optional adversarial
   |                        round: agents try to DESTROY the candidate.
   |
STAGE 4 — SYNTHESIS      Strongest model(s) produce refined candidate
   |                     + confidence + unresolved questions + provenance.
   |
QUALITY GATE
   score >= threshold OR max rounds reached OR human approval -> FINAL
   else -> feed refined state + open questions back to STAGE 1 (recursive loop)
```

The agents have **no separate role** — each one thinks, decides, criticises,
and answers, using its full capacity. Stage 1 agents work in isolation
(diversity); Stage 2 agents work collectively (deliberation); both groups hand
results to Stage 3 (independent judges) and Stage 4 (synthesis), then the loop
repeats 2–3 times by default.

## Built-in providers (16)

| Name | Provider | Env var |
|------|----------|---------|
| `openai` | ChatGPT (OpenAI) | `OPENAI_API_KEY` |
| `claude` | Claude (Anthropic) | `ANTHROPIC_API_KEY` |
| `grok` | Grok (xAI) | `XAI_API_KEY` |
| `gemini` | Gemini (Google) | `GOOGLE_API_KEY` |
| `perplexity` | Perplexity (Sonar) | `PERPLEXITY_API_KEY` |
| `deepseek` | DeepSeek | `DEEPSEEK_API_KEY` |
| `kimi` | Kimi (Moonshot) | `MOONSHOT_API_KEY` |
| `qwen` | Qwen (DashScope) | `DASHSCOPE_API_KEY` |
| `mistral` | Mistral | `MISTRAL_API_KEY` |
| `meta` | Meta Llama (Together) | `TOGETHER_API_KEY` |
| `zai` | Z.ai (GLM) | `ZAI_API_KEY` |
| `copilot` | Copilot (via OpenRouter) | `OPENROUTER_API_KEY` |
| `venice` | Venice | `VENICE_API_KEY` |
| `minimax` | Minimax | `MINIMAX_API_KEY` |
| `groq` | Groq | `GROQ_API_KEY` |
| `ollama` | Ollama (local) | `OLLAMA_HOST` |

Providers with no key are **silently skipped**, so the engine runs with 1 key
or 16. Add more by appending a `ProviderSpec` in
`omega_omni/providers/registry.py`.

## Quick start

### Offline (no API keys — uses structured mock providers)

```bash
pip install -e .
omega-omni "Compare REST vs GraphQL for a high-read mobile backend."
# or
python examples/demo.py
```

### With real providers

```bash
export OPENAI_API_KEY=... ANTHROPIC_API_KEY=... DEEPSEEK_API_KEY=...
omega-omni --no-mock --only openai,claude,deepseek "Design a rate limiter."
```

### Tune the recursion

```bash
omega-omni --min-rounds 2 --max-rounds 4 --threshold 0.8 --no-adversarial "..."
```

### Full JSON output

```bash
omega-omni --json "Explain CAP theorem." > result.json
```

### Config file

```bash
cp config.example.yaml omega_omni.yaml
omega-omni --config omega_omni.yaml "..."
```

## As a library

```python
from omega_omni import OmegaConfig, Orchestrator

cfg = OmegaConfig(include_mock=True, mock_count=6, max_rounds=3, quality_threshold=0.75)
orch = Orchestrator(cfg)
result = orch.run("Design an event-driven analytics pipeline for 100k events/sec.")
print(result.summary())
print(result.final_answer)
print(result.confidence)
print(result.unresolved_questions)   # drives the next recursive round
print(result.provenance_summary)     # which providers/stages contributed
```

`result.rounds` holds the full per-round breakdown: claims, rebuttals, judge
scores, disagreement clusters, and the synthesised candidate for each round —
all with provenance.

## Key design choices

- **Structured JSON contracts**: every stage prompt asks for strict JSON, so
  claims/evidence/scores are parsed deterministically into typed pydantic v2
  models on a shared blackboard (`omega_omni/core/blackboard.py`).
- **Provenance everywhere**: every claim, rebuttal, score, and candidate
  records `provider/stage/round/model`, so you can trace any conclusion back
  to its source.
- **Disagreement amplification**: Stage 2 clusters claims that share a topic
  but conflict, and the prompt explicitly tells agents to spend extra compute
  on those clusters rather than averaging them away.
- **Red-team destroy round**: Stage 3 judges don't just score — they try to
  break the candidate. A successful "destroy" penalises the quality score and
  forces another recursive round.
- **Recursive quality gate**: the loop runs `min_rounds`–`max_rounds` times;
  each non-passing round injects the synthesiser's unresolved questions back
  into the task so Stage 1 of the next round addresses them.
- **No hard dependencies on provider SDKs**: all providers use plain `httpx`
  over their REST APIs (many are OpenAI-compatible and share one adapter),
  so the only required deps are `pydantic`, `httpx`, `click`, `rich`.

## Project layout

```
omega_omni/
  core/
    blackboard.py    # shared memory + schemas (Claim, Evidence, Rebuttal, ...)
    config.py        # OmegaConfig + StageConfig
    orchestrator.py  # triage + recursive loop + quality gate
    prompts.py       # stage prompts + JSON parsers
    result.py        # OmegaResult
  providers/
    base.py          # Provider contract
    openai_compat.py # one adapter for the OpenAI-compatible family
    anthropic.py google.py perplexity.py  # native adapters
    mock.py          # deterministic offline provider (structured mode)
    registry.py      # 16-provider catalogue + factory
  stages/
    stage1_diversity.py stage2_deliberation.py
    stage3_evaluation.py stage4_synthesis.py
  cli.py  __main__.py
tests/   examples/   config.example.yaml
```

## Run the tests

```bash
pip install -e ".[dev]"
pytest -q
```

## License

MIT.
