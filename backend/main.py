"""
CHAKRAFORGE Backend API Service
FastAPI simulation orchestrator, experiment persistence, and dataset exporter.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sqlite3
import json
import time

app = FastAPI(
    title="CHAKRAFORGE Research API",
    description="Multi-Agent Strategic Coordination Simulator Backend under Incomplete Information",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database for reproducible experiment archiving
def init_db():
    conn = sqlite3.connect("chakraforge_research.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS experiments (
            id TEXT PRIMARY KEY,
            strategy TEXT,
            information_level TEXT,
            communication_level TEXT,
            agent_count INTEGER,
            ring_count INTEGER,
            dynamics TEXT,
            trials_count INTEGER,
            success_rate REAL,
            mean_coordination_score REAL,
            mean_steps REAL,
            mean_collisions REAL,
            data_json TEXT,
            created_at REAL
        )
    """)
    conn.commit()
    conn.close()

init_db()

class ScenarioModel(BaseModel):
    seed: int = 1042
    agent_count: int = 5
    strategy: str = "COORDINATED"
    information_level: str = "PARTIAL"
    communication_level: str = "NORMAL"
    environment_dynamics: str = "DYNAMIC"
    formation_complexity: str = "MEDIUM"
    ring_count: int = 6
    max_steps: int = 350

class ExperimentArchiveModel(BaseModel):
    experiment_id: str
    strategy: str
    information_level: str
    communication_level: str
    agent_count: int
    ring_count: int
    dynamics: str
    trials_count: int
    success_rate: float
    mean_coordination_score: float
    mean_steps: float
    mean_collisions: float
    data: Dict[str, Any]

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "CHAKRAFORGE Multi-Agent Simulator Engine",
        "timestamp": time.time()
    }

@app.post("/api/experiments/save")
def save_experiment(exp: ExperimentArchiveModel):
    try:
        conn = sqlite3.connect("chakraforge_research.db")
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO experiments 
            (id, strategy, information_level, communication_level, agent_count, ring_count, dynamics, trials_count, success_rate, mean_coordination_score, mean_steps, mean_collisions, data_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            exp.experiment_id,
            exp.strategy,
            exp.information_level,
            exp.communication_level,
            exp.agent_count,
            exp.ring_count,
            exp.dynamics,
            exp.trials_count,
            exp.success_rate,
            exp.mean_coordination_score,
            exp.mean_steps,
            exp.mean_collisions,
            json.dumps(exp.data),
            time.time()
        ))
        conn.commit()
        conn.close()
        return {"status": "SAVED", "experiment_id": exp.experiment_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/experiments")
def list_experiments():
    conn = sqlite3.connect("chakraforge_research.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, strategy, information_level, communication_level, trials_count, success_rate, mean_coordination_score, created_at FROM experiments ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": r[0],
            "strategy": r[1],
            "information_level": r[2],
            "communication_level": r[3],
            "trials_count": r[4],
            "success_rate": r[5],
            "mean_coordination_score": r[6],
            "created_at": r[7]
        }
        for r in rows
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
