# Gitatlas 🌌

> Understand how code evolves.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-61dafb.svg)](https://reactjs.org/)

---

## Overview

Gitatlas is a visual system for exploring GitHub repositories through their history.

It transforms commit logs into an interactive timeline, allowing developers to understand how a codebase evolved over time. Instead of scanning through a list of commits, users navigate a structured graph where each node represents a meaningful checkpoint in development.

---

## Core Concept

A repository is treated as a sequence of connected changes rather than isolated entries.

* Commits become checkpoints
* Relationships become paths
* Time becomes a navigable direction
* Contributions become visible patterns

This shifts the experience from reading logs to exploring evolution.

---

## ✨ Features

* **Visual Timeline**
  Commit history rendered as a flowing graph instead of a linear list

* **Commit Inspection**
  View metadata such as message, author, timestamp, and change stats

* **Interactive Exploration**
  Hover for quick details and click for deeper insights

* **Contextual Summaries 🧠**
  Concise explanations of commit intent

* **Contributor Visibility**
  Understand participation across time

* **Risk Detection ⚠️**
  Highlights potential issues such as exposed keys or configuration leaks

---

## Interaction Model

The interface is designed around lightweight interaction.

**Hover**

* Quick preview of commit message, author, and timestamp

**Click**

* Opens a detailed panel with:

  * summary
  * contributors
  * file changes
  * additions and deletions

This allows fast scanning without losing depth.

---

## 📊 Repository Insights

Gitatlas provides an overview of repository activity:

* total commits
* activity distribution over time
* contributor participation
* change volume trends

These insights are integrated into the visual flow rather than isolated dashboards.

---

## Analysis Capabilities

Commits are categorized to improve readability:

* **Feature** — new functionality
* **Fix** — bug resolution
* **Refactor** — structural improvements
* **Minor** — small or non-critical updates

The system also flags commits containing sensitive patterns such as:

* API keys
* `.env` files
* hardcoded credentials

---

## ⚙️ Architecture

The system is divided into clear layers:

* **Frontend**
  Handles visualization, interaction, and rendering

* **Backend**
  Fetches and processes commit data

* **Analysis Layer**
  Classifies commits and detects anomalies

* **Visualization Layer**
  Constructs and displays the graph

---

## 📖 Usage

1. Paste a GitHub repository URL
2. Trigger analysis
3. Explore the generated timeline
4. Inspect commits for detailed context

---

## 🎯 Use Cases

* onboarding into unfamiliar codebases
* understanding system evolution
* debugging historical changes
* reviewing contribution patterns

---

## Team

Built by:Abhinav and Neha


* [Abhinav Bombale]
* [Neha Lende]





