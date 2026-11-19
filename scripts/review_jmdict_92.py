#!/usr/bin/env python3
"""Kotoba: audited, READ-ONLY export of the 92 JMdict alignment cases.
Safe by construction: never changes IDs, study flags, translations or source rows.
Run against the *verified, extracted* canonical SQLite (not the public PWA JSON).
"""
from __future__ import annotations
import argparse
import collections
import datetime
import hashlib
import json
import pathlib
import re
import sqlite3
import sys

ID_RE = re.compile(r"jmdict-\d+-\d+")
ID_KEYS = ("canonical_id", "kotoba_id", "stable_id", "sense_id", "identity_id", "id")
CONTEXT_TABLES = ("k_jmdict_current_sense", "k_sense",
                  "op5c_coverage", "m3_operational_eligibility")
ALLOWED_CLASSES = ("CONTENT_CHANGE", "INDEX_MOVED", "INDEX_MISSING", "UNCLASSIFIED")

def quote_identifier(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'

def columns(connection: sqlite3.Connection, table: str) -> list[str]:
    return [r[1] for r in connection.execute("PRAGMA table_info(" + quote_identifier(table) + ")")]

def maybe_json(value):
    if isinstance(value, bytes):
        return {"sha256": hashlib.sha256(value).hexdigest(), "bytes": len(value)}
    if isinstance(value, str) and value.lstrip().startswith(("{", "[")):
        try:
            return json.loads(value)
        except (json.JSONDecodeError, UnicodeError):
            pass
    return value

def stable_ids(row: dict) -> list[str]:
    # Never manufacture an ID by combining ent_seq and a mutable source index.
    direct = [row[k] for k in ID_KEYS if k in row
              and isinstance(row[k], str) and ID_RE.fullmatch(row[k])]
    if direct:
        return sorted(set(direct))
    raw = json.dumps(row, ensure_ascii=False, default=str)
    return sorted(set(ID_RE.findall(raw)))

def classify(row: dict) -> str:
    # Diagnostic only. Classification does not authorize any editorial changes.
    candidates = " ".join(str(row.get(k, "")) for k in
        ("change_type", "change_kind", "status", "category", "reason", "kind", "classification")).lower()
    if any(x in candidates for x in ("index_missing", "missing_index", "source_index_missing",
                                     "sense_removed", "index_absent", "no_longer_exists")):
        return "INDEX_MISSING"
    if any(x in candidates for x in ("moved", "shift", "reindexed", "index_changed", "index_moved")):
        return "INDEX_MOVED"
    if any(x in candidates for x in ("content", "gloss_changed", "semantic", "meaning_changed",
                                     "source_changed", "modified")):
        return "CONTENT_CHANGE"
    return "UNCLASSIFIED"

def source_context(connection: sqlite3.Connection, table: str, stable_id: str):
    if not stable_id:
        return []
    cs = columns(connection, table)
    for key in ID_KEYS:
        if key in cs:
            query = f"SELECT * FROM {quote_identifier(table)} WHERE {quote_identifier(key)}=? LIMIT 3"
            rows = connection.execute(query, (stable_id,)).fetchall()
            if rows:
                return [{k: maybe_json(r[k]) for k in r.keys()} for r in rows]
    return []

def audit(db_path: str, *, expected=92, source_sha=None) -> dict:
    con = sqlite3.connect(f"file:{pathlib.Path(db_path).resolve()}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    try:
        con.execute("PRAGMA query_only=ON")
        if con.execute("PRAGMA quick_check").fetchone()[0] != "ok":
            raise RuntimeError("Canonical SQLite quick_check failed")
        if con.execute("PRAGMA foreign_key_check").fetchone():
            raise RuntimeError("Canonical SQLite foreign key check failed")
        names = {r[0] for r in con.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        needed = {"k_jmdict_change", "k_jmdict_current_sense"}
        if not needed <= names:
            raise RuntimeError(f"JMdict alignment tables not found: {sorted(needed-names)}")
        rows = [dict(r) for r in con.execute("SELECT * FROM k_jmdict_change")]
        if len(rows) != expected:
            raise RuntimeError(f"JMdict change rows {len(rows)} != expected {expected}; verify source snapshot")
        counters = collections.Counter()
        cases = []
        for no, row in enumerate(rows, 1):
            ids = stable_ids(row)
            cid = ids[0] if len(ids)==1 else None
            status = "ID_UNIQUE" if len(ids)==1 else ("ID_MISSING" if not ids else "ID_AMBIGUOUS")
            change_class = classify(row)
            counters[(status, change_class)] += 1
            context = {}
            if cid:
                for table in CONTEXT_TABLES:
                    if table in names:
                        context[table] = source_context(con, table, cid)
            cases.append({
                "case_no": no,
                "canonical_id": cid,
                "id_candidates": ids,
                "identity_status": status,
                "change_class_hint": change_class,
                "review_status": "REVIEW_REQUIRED",
                "study_gate": "NOT_EVALUATED",
                "source_row": {k: maybe_json(v) for k,v in row.items()},
                "canonical_context": context,
                "safety_note": "Do not automatically relabel, enable HOLD, change translation or renumber ID."
            })
        return {
            "schema": "KOTOBA_JMDICT_92_REVIEW_V1",
            "generated_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "expected_cases": expected,
            "actual_cases": len(rows),
            "source_sha256": source_sha,
            "mode": "READ_ONLY_REVIEW_NOT_APPLIED",
            "source_columns": columns(con, "k_jmdict_change"),
            "context_tables": {t: columns(con, t) for t in CONTEXT_TABLES if t in names},
            "status_counts": {f"{a}:{b}":n for (a,b),n in sorted(counters.items())},
            "cases": cases,
            "release_gate": "Mapping source is not study activation; each sense requires existing M2/M3/OP5C eligibility plus editorial validation."
        }
    finally:
        con.close()

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--db",required=True,help="Canonical SQLite extracted from verified ZIP")
    p.add_argument("--out",help="Local report path (no persistent backup created unless requested)")
    p.add_argument("--expected",type=int,default=92)
    p.add_argument("--source-sha",help="Expected XML SHA-256 of frozen source")
    args=p.parse_args()
    report=audit(args.db,expected=args.expected,source_sha=args.source_sha)
    out=json.dumps(report,ensure_ascii=False,indent=2,default=str)
    if args.out:
        pathlib.Path(args.out).write_text(out,encoding="utf-8")
        print(json.dumps({"status":report["mode"],"cases":report["actual_cases"],
                          "classes":report["status_counts"],"report":args.out},
                         ensure_ascii=False))
    else:
        print(out)
    return 0
if __name__ == "__main__":
    sys.exit(main())
