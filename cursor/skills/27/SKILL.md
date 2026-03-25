---
name: ck:google-adk-python
description: "Build AI agents with Google ADK Python. Multi-agent systems, A2A protocol, MCP tools, workflow agents, state/memory, callbacks/plugins, Vertex AI deployment, evaluation."
license: Apache-2.0
version: 2.0.0
argument-hint: "[agent or feature]"
---

# Google ADK Python Skill

Expert guide for Google's Agent Development Kit (ADK) Python — open-source, code-first toolkit for building, evaluating, and deploying AI agents. Optimized for Gemini, model-agnostic by design.

## When to Activate

- Build single or multi-agent systems with tool integration
- Implement A2A protocol for remote agent communication
- Integrate MCP servers as agent tools
- Use workflow agents (sequential, parallel, loop) for pipelines
- Manage sessions, state, memory, and artifacts
- Add callbacks, plugins, or observability hooks
- Deploy to Cloud Run, Vertex AI Agent Engine, or GKE
- Evaluate agents with `adk eval` framework

## Agent Structure Convention (Required)

```
my_agent/
├── __init__.py   # MUST: from . import agent
└── agent.py      # MUST: root_agent = Agent(...) OR app = App(...)
```

## Quick Start

```bash
pip install google-adk          # stable (weekly releases)
uv sync --all-extras            # dev setup (uv required, Python 3.10+, 3.11+ recommended)
```

```python
from google.adk import Agent

root_agent = Agent(
    name="assistant",
    model="gemini-2.5-flash",
    instruction="You are a helpful assistant.",
    description="General assistant agent.",
    tools=[get_weather],
)
```

## App Pattern (Production)

```python
from google.adk import Agent
from google.adk.apps import App
from google.adk.apps.app import EventsCompactionConfig
from google.adk.plugins.save_files_as_artifacts_plugin import SaveFilesAsArtifactsPlugin

app = App(
    name="my_app",
    root_agent=Agent(name="my_agent", model="gemini-2.5-flash", ...),
    plugins=[SaveFilesAsArtifactsPlugin()],
    events_compaction_config=EventsCompactionConfig(compaction_interval=2),
)
```

Use `App` when needing plugins, event compaction, or custom lifecycle management.

## CLI Tools

| Command | Purpose |
|---------|---------|
| `adk web <agents_dir>` | Dev UI (recommended for development) |
| `adk run <agent_dir>` | Interactive CLI testing |
| `adk api_server <agents_dir>` | FastAPI production server |
| `adk eval <agent> <evalset.json>` | Run evaluation suite |

## Agent Types

| Type | Use Case |
|------|----------|
| `Agent` / `LlmAgent` | Dynamic routing, tool use, reasoning |
| `SequentialAgent` | Fixed-order pipeline |
| `ParallelAgent` | Concurrent execution |
| `LoopAgent` | Iterative processing |
| `RemoteA2aAgent` | Remote agent via A2A protocol |

## Key APIs

| Feature | API |
|---------|-----|
| State | `tool_context.state[key] = value` |
| Artifacts | `tool_context.save_artifact(name, part)` |
| Callbacks | `before_agent_callback`, `after_model_callback`, etc. |
| MCP Tools | `MCPToolset(connection_params=StdioConnectionParams(...))` |
| Sub-agents | `Agent(..., sub_agents=[agent1, agent2])` |
| Human-in-loop | `LongRunningFunctionTool(func=my_func)` |
| Plugins | `App(..., plugins=[MyPlugin()])` |

## Model Support

Latest: `gemini-2.5-flash` (default), `gemini-2.5-pro`, `gemini-2.0-flash` (sunsets Mar 2026)
Preview: `gemini-3-flash-preview`, `gemini-3-pro-preview`
Also: Anthropic Claude, Ollama, LiteLLM, vLLM, Model Garden

## Best Practices

1. **Code-first** — define agents in Python for version control and testing
2. **Agent convention** — always use `root_agent` or `app` variable in `agent.py`
3. **Modular agents** — specialize per domain, compose via `sub_agents`
4. **Workflow selection** — workflow agents for predictable, LlmAgent for dynamic
5. **State** — `ToolContext.state` for ephemeral, `MemoryService` for long-term
6. **Safety** — callbacks for guardrails, tool confirmation for sensitive ops
7. **Evaluate** — test with `adk eval` + evalset JSON before deployment

## References

Detailed guides (load as needed):

- `references/agent-types-and-architecture.md` — Agent types, workflows, custom agents
- `references/tools-and-mcp-integration.md` — Custom tools, MCP, tool filtering
- `references/multi-agent-and-a2a-protocol.md` — Sub-agents, A2A, coordinator patterns
- `references/sessions-state-memory-artifacts.md` — State, artifacts, sessions, memory
- `references/callbacks-plugins-observability.md` — Lifecycle hooks, plugins, tracing
- `references/evaluation-testing-cli.md` — adk eval, CLI, evalset format
- `references/deployment-cloud-run-vertex-gke.md` — Cloud Run, Vertex AI, GKE

## External Resources

- GitHub: https://github.com/google/adk-python
- Docs: https://google.github.io/adk-docs/
- Samples: https://github.com/google/adk-python/tree/main/contributing/samples
- llms.txt: https://raw.githubusercontent.com/google/adk-python/refs/heads/main/llms.txt


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### agent types and architecture

# Agent Types and Architecture

## LlmAgent

Dynamic routing agent.

**Properties:** `model`, `instruction`, `description`, `tools`, `sub_agents`, `generate_content_config`

```python
from google.adk.agents import Agent

agent = Agent(
    name="assistant", model="gemini-2.5-flash",
    instruction="You are a helpful assistant.",
    tools=[search_tool], sub_agents=[code_agent],
    generate_content_config={"temperature": 0.7}
)
```

## Workflow Agents

### SequentialAgent

```python
from google.adk.agents import SequentialAgent

pipeline = SequentialAgent(
    name="research_pipeline",
    sub_agents=[
        Agent(name="searcher", model="gemini-2.5-flash", tools=[search]),
        Agent(name="writer", model="gemini-2.5-flash", tools=[write]),
    ]
)
```

### ParallelAgent

```python
from google.adk.agents import ParallelAgent

parallel = ParallelAgent(
    name="multi_source",
    sub_agents=[
        Agent(name="web", model="gemini-2.5-flash", tools=[web_search]),
        Agent(name="db", model="gemini-2.5-flash", tools=[db_query]),
    ]
)
```

### LoopAgent

```python
from google.adk.agents import LoopAgent

loop = LoopAgent(
    name="refiner",
    sub_agents=[
        Agent(name="generator", model="gemini-2.5-flash", tools=[generate]),
        Agent(name="validator", model="gemini-2.5-flash", tools=[validate]),
    ],
    max_iterations=5,
)
```

## BaseAgent

Override `run_async()` and `get_agent_card()`.

```python
from google.adk.agents.base_agent import BaseAgent

class CustomAgent(BaseAgent):
    async def run_async(self, query: str, context: dict) -> dict:
        return {"response": "Custom"}
```

## Agent Structure

```
my_agent/
├── __init__.py      # Export root_agent or app
├── agent.py         # Agent definition
└── tools.py         # Custom tools
```

```python
# __init__.py
from my_agent.agent import root_agent
__all__ = ["root_agent"]

# agent.py
from google.adk.agents import Agent
root_agent = Agent(name="my_agent", model="gemini-2.5-flash", instruction="...")

# A2A server
from google.adk.servers.a2a_server import create_a2a_server
app = create_a2a_server(root_agent)
```

## Source Structure

```
src/google/adk/
├── agents/                # Agent implementations
├── tools/                 # Tool system
├── sessions/              # Session management
├── runners/               # Execution orchestration
└── servers/               # A2A server utilities
```

## Global Instructions

```python
root = Agent(
    name="root", model="gemini-2.5-flash",
    instruction="Root behavior.",
    global_instruction="Always be polite and concise.",
    sub_agents=[Agent(name="sub1", model="gemini-2.5-flash")]
)
```

## Best Practices

- Use descriptive `name`/`description` for routing
- Keep `instruction` focused on single responsibility
- Delegate specialized tasks to sub-agents
- Use workflow agents for orchestration
- Export `root_agent` or `app` from `__init__.py`


### callbacks plugins observability

# Callbacks, Plugins, Observability

## Callback Types

- `before_agent`, `after_agent`: Agent lifecycle
- `before_model`, `after_model`: LLM calls
- `before_tool`, `after_tool`: Tool execution

## Callback Signatures

```python
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.content import ModelContent
from google.adk.models.llm_request import LlmRequest
from google.adk.models.llm_response import LlmResponse
from google.adk.tools.tool_context import ToolContext

def before_agent_callback(callback_context: CallbackContext) -> None:
    print(f"Agent: {callback_context.agent_name}")

def after_agent_callback(callback_context: CallbackContext) -> ModelContent | None:
    return None

def before_model_callback(callback_context: CallbackContext, llm_request: LlmRequest) -> None:
    print(f"Model: {llm_request.model_id}")

def after_model_callback(callback_context: CallbackContext, llm_response: LlmResponse) -> None:
    print(f"Tokens: {llm_response.usage_metadata}")

def before_tool_callback(tool: str, args: dict, tool_context: ToolContext) -> None:
    print(f"Tool: {tool}")

def after_tool_callback(tool: str, args: dict, tool_context: ToolContext, response: Any) -> Any:
    return response
```

## Using Callbacks

```python
from google.adk.agents.web_agent import WebAgent

agent = WebAgent(
    name='my_agent', model='gemini-2.5-flash',
    before_agent_callback=before_agent_callback,
    before_model_callback=[callback1, callback2]
)

# Async supported
async def async_callback(callback_context: CallbackContext) -> None:
    await log_to_database(callback_context)
```

## Plugins

```python
from google.adk.plugins.base_plugin import BasePlugin
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_request import LlmRequest

class CountPlugin(BasePlugin):
    def __init__(self):
        super().__init__(name='count')
        self.count = 0

    async def before_agent_callback(self, *, agent, callback_context: CallbackContext):
        self.count += 1
        print(f"#{self.count}")

    async def before_model_callback(self, *, callback_context: CallbackContext, llm_request: LlmRequest):
        print(f"Model: {llm_request.model_id}")

agent = WebAgent(name='agent', model='gemini-2.5-flash', plugins=[CountPlugin()])
```

## Built-in Plugins

```python
from google.adk.plugins.save_files_as_artifacts_plugin import SaveFilesAsArtifactsPlugin
from google.adk.plugins.context_filter_plugin import ContextFilterPlugin

plugin1 = SaveFilesAsArtifactsPlugin()
plugin2 = ContextFilterPlugin(filter_fn=lambda ctx: ctx.priority > 5)
agent = WebAgent(name='agent', model='gemini-2.5-flash', plugins=[plugin1, plugin2])
```

## Observability

### Arize Phoenix

```python
from phoenix.otel import register

tracer_provider = register(
    project_name='my_project',
    endpoint='http://localhost:6006/v1/traces'
)

agent = WebAgent(name='agent', model='gemini-2.5-flash')
result = await agent.run('What is 2+2?')
```

### Custom Metrics

```python
class MetricsPlugin(BasePlugin):
    def __init__(self):
        super().__init__(name='metrics')
        self.latencies = []

    async def before_model_callback(self, *, callback_context, llm_request):
        callback_context.start_time = time.time()

    async def after_model_callback(self, *, callback_context, llm_response):
        latency = time.time() - callback_context.start_time
        self.latencies.append(latency)
        print(f"Avg: {sum(self.latencies) / len(self.latencies):.2f}s")
```


### deployment cloud run vertex gke

# Deployment: Cloud Run, Vertex AI, GKE

## Development Modes

```bash
adk web samples/agents/my_agent.py:agent --port 8080
adk run samples/agents/my_agent.py:agent "What is 2+2?" --streaming
adk api_server samples/agents/my_agent.py:agent --port 8000
```

Endpoints: `/chat`, `/stream`, `/health`

## Cloud Run

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
COPY pyproject.toml uv.lock ./
COPY src/ ./src/
RUN uv sync --frozen --no-cache
EXPOSE 8080
CMD ["uv", "run", "adk", "api_server", "src/my_agent.py:agent", "--host", "0.0.0.0", "--port", "8080"]
```

```bash
export PROJECT_ID=my-project REGION=us-central1
gcloud builds submit --tag gcr.io/$PROJECT_ID/my-agent
gcloud run deploy my-agent \
  --image gcr.io/$PROJECT_ID/my-agent \
  --region $REGION \
  --set-env-vars GOOGLE_API_KEY=$GOOGLE_API_KEY

# Secret Manager
echo -n "key" | gcloud secrets create google-api-key --data-file=-
gcloud run deploy my-agent --set-secrets GOOGLE_API_KEY=google-api-key:latest
```

## Vertex AI

```bash
adk deploy --target vertex --agent my_agent.py:agent --project my-project
```

```yaml
agent:
  name: my-agent
  model: gemini-2.5-flash
  region: us-central1
  scaling: {min_instances: 1, max_instances: 10}
  resources: {cpu: 2, memory: 4Gi}
```

```python
from google.cloud import aiplatform
aiplatform.init(project='my-project', location='us-central1')
endpoint = aiplatform.Endpoint('projects/123/locations/us-central1/endpoints/456')
response = endpoint.predict(instances=[{'prompt': 'What is 2+2?'}])
```

## GKE

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: {name: my-agent}
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: agent
        image: gcr.io/my-project/my-agent:latest
        ports: [{containerPort: 8080}]
        env:
        - name: GOOGLE_API_KEY
          valueFrom: {secretKeyRef: {name: google-api-key, key: key}}
        resources:
          requests: {memory: "2Gi", cpu: "1"}
          limits: {memory: "4Gi", cpu: "2"}
---
apiVersion: v1
kind: Service
metadata: {name: my-agent}
spec:
  type: LoadBalancer
  ports: [{port: 80, targetPort: 8080}]
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: {name: my-agent-hpa}
spec:
  scaleTargetRef: {kind: Deployment, name: my-agent}
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource: {name: cpu, target: {type: Utilization, averageUtilization: 70}}
```

```bash
gcloud container clusters create my-cluster --region us-central1 --num-nodes 3
gcloud container clusters get-credentials my-cluster --region us-central1
kubectl create secret generic google-api-key --from-literal=key=$GOOGLE_API_KEY
kubectl apply -f deployment.yaml
```

## Best Practices

```python
# config.py
import os
from dataclasses import dataclass

@dataclass
class Config:
  model_id: str = os.getenv('MODEL_ID', 'gemini-2.5-flash')
  api_key: str = os.getenv('GOOGLE_API_KEY')
  log_level: str = os.getenv('LOG_LEVEL', 'INFO')

# Health checks
@app.get('/health')
async def health(): return {'status': 'healthy'}

# Logging
from google.cloud import logging
client = logging.Client()
client.setup_logging()

# Rate limiting
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post('/chat')
@limiter.limit('10/minute')
async def chat(request: Request, prompt: str):
  return {'response': (await agent.run(prompt)).text}
```


### evaluation testing cli

# Evaluation, Testing, CLI

## CLI Commands

```bash
adk web samples/agents/my_agent.py:agent --port 8080
adk run samples/agents/my_agent.py:agent "What is 2+2?" --streaming
adk api_server samples/agents/my_agent.py:agent --port 8000
adk eval --agent my_agent.py:agent --evalset evals/evalset.json
adk deploy --target cloud-run --agent my_agent.py:agent
```

## Evaluation

### Evalset JSON

```json
{
  "name": "math_evalset",
  "test_cases": [
    {"id": "add", "input": "2+2?", "expected_output": "4", "evaluation_type": "exact_match"},
    {"id": "mult", "input": "5*6?", "expected_output": "30", "evaluation_type": "contains"},
    {"id": "judge", "input": "(10+5)*2", "expected_output": "30", "evaluation_type": "llm_judge"}
  ]
}
```

Types: `exact_match`, `contains`, `regex`, `llm_judge`

### Running Evals

```python
from google.adk.evaluation import Evaluator, EvalCase, EvalResult

evaluator = Evaluator(agent=my_agent, evalset='evals/math.json')
results = await evaluator.run()

# Custom
def custom_eval(case: EvalCase, response: str) -> EvalResult:
    passed = response.strip().lower() == case.expected_output.lower()
    return EvalResult(passed=passed, score=1.0 if passed else 0.0)

evaluator = Evaluator(agent=my_agent, evalset='evals/custom.json', eval_fn=custom_eval)
```

## Testing

```bash
uv sync --extra test --extra eval --extra a2a
pytest tests/unittests -n auto
pytest tests/unittests --cov=google.adk
```

```python
# conftest.py
import pytest
from google.adk.agents.web_agent import WebAgent

@pytest.fixture
def test_agent():
    return WebAgent(name='test', model='gemini-2.5-flash')

# test_agent.py
@pytest.mark.asyncio
async def test_basic():
    agent = WebAgent(name='test', model='gemini-2.5-flash')
    result = await agent.run('What is 2+2?')
    assert '4' in result.text

@pytest.mark.asyncio
async def test_tools():
    def calc(a: int, b: int) -> int: return a + b
    agent = WebAgent(name='test', model='gemini-2.5-flash', tools=[calc])
    result = await agent.run('Add 5 and 7')
    assert '12' in result.text

# Integration
@pytest.mark.asyncio
async def test_multi_turn():
    agent = WebAgent(name='test', model='gemini-2.5-flash')
    r1 = await agent.run('My name is Alice')
    r2 = await agent.run('What is my name?')
    assert 'Alice' in r2.text
```

## Formatting

```bash
./autoformat.sh
pyink --line-length 80 --pyink-indentation 2 src/
isort src/
```

## Style

- Google Python Style Guide
- 2-space indent, 80 chars
- Type hints, docstrings

```python
def my_func(arg1: str, arg2: int) -> bool:
  """Short description.

  Args:
    arg1: First
    arg2: Second

  Returns:
    Result
  """
  return True
```


### multi agent and a2a protocol

# Multi-Agent and A2A Protocol

## Sub-Agent Composition

```python
from google.adk.agents import Agent

code_agent = Agent(
    name="code_specialist", model="gemini-2.5-flash",
    description="Code generation/debugging", tools=[executor, linter]
)

research_agent = Agent(
    name="researcher", model="gemini-2.5-flash",
    description="Web search/analysis", tools=[search, scraper]
)

root = Agent(
    name="coordinator", model="gemini-2.5-flash",
    instruction="Route tasks to specialists.",
    sub_agents=[code_agent, research_agent]
)
```

## Coordinator Pattern

```python
coordinator = Agent(
    name="coordinator", model="gemini-2.5-flash",
    instruction="Delegate: code_specialist (programming), data_analyst (data), writer (docs)",
    sub_agents=[
        Agent(name="code_specialist", model="gemini-2.5-flash", tools=[code_tools]),
        Agent(name="data_analyst", model="gemini-2.5-flash", tools=[data_tools]),
        Agent(name="writer", model="gemini-2.5-flash", tools=[writing_tools])
    ]
)
```

## RemoteA2aAgent

```python
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent, AGENT_CARD_WELL_KNOWN_PATH

prime_checker = RemoteA2aAgent(
    name="prime", description="Check primes",
    agent_card=f"http://localhost:8001{AGENT_CARD_WELL_KNOWN_PATH}"
)

root = Agent(
    name="coordinator", model="gemini-2.5-flash",
    sub_agents=[prime_checker, Agent(name="calc", model="gemini-2.5-flash", tools=[calc])]
)
```

## Global Instruction

```python
root = Agent(
    name="customer_service", model="gemini-2.5-flash",
    instruction="Handle inquiries",
    global_instruction="Be polite, follow privacy policy, escalate if uncertain",
    sub_agents=[
        Agent(name="billing", model="gemini-2.5-flash", tools=[billing]),
        Agent(name="tech", model="gemini-2.5-flash", tools=[tech])
    ]
)
```

## Patterns

### Pipeline

```python
from google.adk.agents import SequentialAgent

pipeline = SequentialAgent(
    name="content",
    sub_agents=[
        Agent(name="researcher", model="gemini-2.5-flash", tools=[search]),
        Agent(name="writer", model="gemini-2.5-flash", tools=[write]),
        Agent(name="editor", model="gemini-2.5-flash", tools=[edit])
    ]
)
```

### Parallel

```python
from google.adk.agents import ParallelAgent

parallel = ParallelAgent(
    name="multi_source",
    sub_agents=[
        Agent(name="web", model="gemini-2.5-flash", tools=[web]),
        Agent(name="db", model="gemini-2.5-flash", tools=[db]),
        Agent(name="api", model="gemini-2.5-flash", tools=[api])
    ]
)
```

### Hierarchical

```python
backend = Agent(name="backend", model="gemini-2.5-flash",
    sub_agents=[Agent(name="api", tools=[api]), Agent(name="db", tools=[db])])
frontend = Agent(name="frontend", model="gemini-2.5-flash",
    sub_agents=[Agent(name="ui", tools=[ui]), Agent(name="ux", tools=[ux])])
root = Agent(name="root", model="gemini-2.5-flash", sub_agents=[backend, frontend])
```

### Iterative

```python
from google.adk.agents import LoopAgent

loop = LoopAgent(
    name="review",
    sub_agents=[
        Agent(name="generator", model="gemini-2.5-flash", tools=[gen]),
        Agent(name="reviewer", model="gemini-2.5-flash", tools=[lint])
    ],
    max_iterations=3
)
```

## A2A Protocol

```python
from google.adk.servers.a2a_server import create_a2a_server
app = create_a2a_server(root_agent)
# Run: uvicorn my_agent:app --host 0.0.0.0 --port 8000
```

Agent card: `/.well-known/agent.json`

Flow: 1) Client requests card 2) Card describes capabilities 3) Client sends task 4) Server streams events

## Best Practices

- Descriptive `description` for routing
- Focused coordinator instructions
- Combine local/remote agents
- Use `global_instruction` for cross-cutting concerns
- Apply workflow agents for orchestration
- Cache remote cards, handle failures


### sessions state memory artifacts

# Sessions, State, Memory, Artifacts

## ToolContext.state

Ephemeral dict persisting across tool calls within session.

```python
from google.adk.tools.tool_context import ToolContext

def save_user(user_id: str, name: str, tool_context: ToolContext) -> dict:
    if "users" not in tool_context.state:
        tool_context.state["users"] = {}
    tool_context.state["users"][user_id] = name
    return {"status": "saved"}

def get_user(user_id: str, tool_context: ToolContext) -> str:
    return tool_context.state.get("users", {}).get(user_id, "not_found")

def increment(tool_context: ToolContext) -> int:
    count = tool_context.state.get("counter", 0) + 1
    tool_context.state["counter"] = count
    return count
```

Lifecycle: Created per session, cleared on end, not shared.

## Artifacts

Versioned binary storage.

```python
from google.genai import types
from google.adk.tools.tool_context import ToolContext

async def save_text(name: str, content: str, tool_context: ToolContext) -> dict:
    part = types.Part(inline_data=types.Blob(mime_type="text/plain", data=content.encode()))
    version = await tool_context.save_artifact(name, part)
    return {"name": name, "version": version}

async def save_image(name: str, bytes: bytes, tool_context: ToolContext) -> dict:
    part = types.Part(inline_data=types.Blob(mime_type="image/png", data=bytes))
    version = await tool_context.save_artifact(name, part)
    return {"name": name, "version": version}

async def load_text(name: str, tool_context: ToolContext) -> str:
    artifact = await tool_context.load_artifact(name)
    return artifact.inline_data.data.decode() if artifact else None

async def load_version(name: str, version: int, tool_context: ToolContext) -> str:
    artifact = await tool_context.load_artifact(name, version=version)
    return artifact.inline_data.data.decode() if artifact else None
```

Versioning: Each save creates new version (1, 2, 3...), load without version returns latest.

## Session Services

```python
from google.adk.sessions.in_memory_session_service import InMemorySessionService
from google.adk.sessions.vertex_ai_session_service import VertexAiSessionService
from google.adk.sessions.spanner_session_service import SpannerSessionService
from google.adk.runners import Runner

# Dev
session_service = InMemorySessionService()

# Prod (Vertex)
session_service = VertexAiSessionService(project_id="my-project", location="us-central1")

# Prod (Spanner)
session_service = SpannerSessionService(
    project_id="my-project", instance_id="my-instance", database_id="sessions"
)

runner = Runner(agent=root_agent, session_service=session_service)
```

## Memory

Long-term recall across sessions.

```python
from google.adk.memory import MemoryService

memory_service = MemoryService(project_id="my-project", location="us-central1")
runner = Runner(agent=root_agent, session_service=session_service, memory_service=memory_service)
```

**Comparison:** State (ephemeral, dict), Artifacts (versioned binary, session), Memory (long-term, cross-session)

## Runner

```python
from google.adk.runners import Runner

runner = Runner(agent=root_agent, session_service=session_service)

# Production (streaming)
async def execute():
    async for event in runner.run_async("Query", session_id="user-123"):
        if event.text: print(event.text, end="")
        if event.tool_call: print(f"\nTool: {event.tool_call.name}")

# Bidi-streaming
async def live():
    async for event in runner.run_live(session_id="user-456"):
        if event.server_content: print(event.server_content)
        if user_has_input(): await event.send(get_user_input())

# Sync (debug)
result = runner.run("Query", session_id="debug")
```

## Invocation Lifecycle

1. Session retrieval 2. Context creation 3. Agent execution 4. Event streaming 5. Compaction

```python
runner = Runner(agent=root_agent, session_service=session_service, compaction_threshold=20)
await runner.compact_session("long-session")
```

## Best Practices

- State: temporary session data
- Artifacts: binary/large data
- Memory: long-term knowledge
- Session service by env (InMemory dev, Vertex/Spanner prod)
- Enable compaction for long conversations
- run_async for production, run_live for bidirectional, run for debug
- Clean old sessions, version artifacts


### tools and mcp integration

# Tools and MCP Integration

## Custom Tools

Python functions (sync/async) with optional `ToolContext`.

```python
def calculator(operation: str, a: float, b: float) -> float:
    """Perform math operations.
    Args: operation ('add'|'subtract'|'multiply'|'divide'), a, b
    Returns: Result
    """
    ops = {"add": a + b, "subtract": a - b, "multiply": a * b, "divide": a / b}
    return ops[operation]
```

**Async with ToolContext:**

```python
from google.adk.tools.tool_context import ToolContext

async def fetch(url: str, tool_context: ToolContext) -> dict:
    cache = tool_context.state.get("cache", {})
    if url in cache: return cache[url]
    data = await http_client.get(url)
    cache[url] = data
    tool_context.state["cache"] = cache
    return data
```

## ToolContext

Props: `state` (dict), `save_artifact()`, `load_artifact()`

```python
def store(key: str, value: str, tool_context: ToolContext) -> dict:
    tool_context.state[key] = value
    return {"status": "saved"}

from google.genai import types

async def save_doc(name: str, content: str, tool_context: ToolContext) -> dict:
    part = types.Part(inline_data=types.Blob(mime_type="text/plain", data=content.encode()))
    version = await tool_context.save_artifact(name, part)
    return {"name": name, "version": version}

async def load_doc(name: str, tool_context: ToolContext) -> str:
    artifact = await tool_context.load_artifact(name)
    return artifact.inline_data.data.decode() if artifact else None
```

## Built-in Tools

```python
from google.adk.tools import google_search, load_artifacts, BuiltInCodeExecutor

executor = BuiltInCodeExecutor()
agent = Agent(name="agent", model="gemini-2.5-flash", tools=[google_search, load_artifacts, executor])
```

## MCP Integration

```python
from google.adk.tools.mcp_tool import StdioConnectionParams
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from mcp import StdioServerParameters

filesystem_mcp = MCPToolset(
    connection_params=StdioConnectionParams(
        server_params=StdioServerParameters(
            command='npx',
            args=['-y', '@modelcontextprotocol/server-filesystem', '/home/user/docs']
        ),
        timeout=5
    ),
    tool_filter=['read_file', 'list_directory']
)

agent = Agent(name="agent", model="gemini-2.5-flash", tools=[filesystem_mcp])
```

**Multiple servers:**

```python
git_mcp = MCPToolset(
    connection_params=StdioConnectionParams(
        server_params=StdioServerParameters(command='npx', args=['-y', '@modelcontextprotocol/server-git']),
        timeout=10
    )
)

postgres_mcp = MCPToolset(
    connection_params=StdioConnectionParams(
        server_params=StdioServerParameters(
            command='npx', args=['-y', '@modelcontextprotocol/server-postgres', 'postgresql://localhost/db']
        ),
        timeout=15
    )
)

agent = Agent(name="agent", model="gemini-2.5-flash", tools=[filesystem_mcp, git_mcp, postgres_mcp])
```

## Tool Filtering

```python
# List
MCPToolset(connection_params=params, tool_filter=['read_file', 'write_file'])

# Lambda
MCPToolset(connection_params=params, tool_filter=lambda t: t.name.startswith('read_'))
```

## LongRunningFunctionTool

```python
from google.adk.tools.long_running_tool import LongRunningFunctionTool

async def approve(amount: float) -> dict:
    return {"approved": True}

tool = LongRunningFunctionTool(func=approve)
agent = Agent(name="agent", model="gemini-2.5-flash", tools=[tool])
```

## ExampleTool

```python
from google.adk.tools.example_tool import ExampleTool

examples = ExampleTool(examples=[
    {"input": "2+2?", "output": "4"},
    {"input": "Capital of France?", "output": "Paris"}
])

agent = Agent(name="agent", model="gemini-2.5-flash", tools=[examples])
```

## Best Practices

- Docstrings with Args/Returns for schema
- Async for I/O
- ToolContext.state for session data
- Artifacts for binary/large data
- Filter MCP tools to reduce context
- Validate inputs




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
