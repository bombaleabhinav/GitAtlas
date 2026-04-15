# Gitatlas 🌌

> Visualising Github Repositories! Explore a galaxy of commits.



---

## Overview

Gitatlas is a web-based system for analyzing and visualizing GitHub repositories.
It transforms commit history into an navigable timeline, allowing users to study how a codebase evolves over time.

Instead of reading sequential logs, users interact with a structured graph of commits, where each node represents a checkpoint in the repository’s development.

---

## Core Concept

A repository is modeled as a directed timeline of changes:

| Concept          | Representation in Gitatlas          |
| ---------------- | ----------------------------------- |
| Repository       | Timeline / Graph structure          |
| Commit           | Node (checkpoint)                   |
| Commit relation  | Directed edge                       |
| Time progression | Top-left to bottom directional flow |
| Activity density | Node distribution and clustering    |

---

## ✨ Features

* **Timeline Visualization**
  Structured graph representation of commit history with directional flow

* **Commit Inspection**
  Detailed view of individual commits including metadata and changes

* **Repository Metrics**
  Aggregated statistics derived from commit data

* **Contributor Analysis**
  Visibility into contribution patterns across time

* **Contextual Summaries 🧠**
  Condensed explanations of commit intent and impact

---

## Interaction Model

### Timeline View

The primary interface renders commit history as a directed graph.

| Component | Description                               |
| --------- | ----------------------------------------- |
| Nodes     | Represent commits                         |
| Edges     | Represent parent-child relationships      |
| Layout    | Diagonal progression (top-left to bottom) |
| Rendering | Sequential to reflect temporal ordering   |

---

### Hover Interaction

Provides a quick summary without leaving the timeline.

| Field     | Description          |
| --------- | -------------------- |
| Message   | Commit message       |
| Author    | Contributor name     |
| Timestamp | Commit date and time |

---

### Commit Detail View

Selecting a node opens a detailed inspection panel.

| Section         | Description                         |
| --------------- | ----------------------------------- |
| Summary         | Condensed explanation of the commit |
| Contributors    | Associated authors                  |
| Timestamp       | Exact commit time                   |
| File Changes    | Files modified                      |
| Diff Statistics | Lines added and removed             |


---


## ⚙️ Architecture

| Layer         | Responsibility                                 |
| ------------- | ---------------------------------------------- |
| Data Fetch    | Retrieve commit data via GitHub APIs           |
| Processing    | Normalize commit structure and relationships   |
| Analysis      | Classification, aggregation, anomaly detection |
| Visualization | Graph generation and rendering                 |

---

## 📖 Usage

1. Provide a GitHub repository URL
2. Trigger analysis
3. Explore the generated timeline
4. Inspect commits for detailed information

---

## 🎯 Use Cases

| Scenario         | Outcome                               |
| ---------------- | ------------------------------------- |
| Onboarding       | Understand project evolution quickly  |
| Debugging        | Identify when changes were introduced |
| Code Review      | Examine changes with context          |
| Project Analysis | Evaluate development patterns         |

---

## Limitations

* Performance may degrade on very large repositories
* Commit classification is heuristic-based
* Visualization assumes primarily linear commit progression

---

## Team

Built by:
Abhinav Bombale
Neha Lende
