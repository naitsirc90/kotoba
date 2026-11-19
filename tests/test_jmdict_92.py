import pathlib
import sqlite3
import tempfile
import unittest
import sys
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/"scripts"))
from review_jmdict_92 import audit, stable_ids, classify, source_risk_bucket

class TestJMdictReview(unittest.TestCase):
    def test_id_does_not_infer_mutable_index(self):
        self.assertEqual(stable_ids({"ent_seq":1001,"sense_index":2}), [])
        self.assertEqual(stable_ids({"canonical_id":"jmdict-1001-2","new_index":3}),["jmdict-1001-2"])
    def test_classify_is_diagnostic(self):
        self.assertEqual(classify({"category":"index_moved"}), "INDEX_MOVED")
        self.assertEqual(classify({"category":"index_missing"}), "INDEX_MISSING")
        self.assertEqual(classify({"category":"gloss_changed"}), "CONTENT_CHANGE")
    def test_explicit_source_status_and_safe_triage(self):
        self.assertEqual(classify({"comparison_status":"CONTENT_CHANGE","changed_fields_json":'["gloss"]'}), "CONTENT_CHANGE")
        self.assertEqual(classify({"comparison_status":"INDEX_UNAVAILABLE","changed_fields_json":'["index_changed"]'}), "INDEX_UNAVAILABLE")
        self.assertEqual(source_risk_bucket({"comparison_status":"INDEX_MOVED","changed_fields_json":'["index_changed"]'}), "IDENTITY_INDEX_MAPPING_REVIEW")
        self.assertEqual(source_risk_bucket({"comparison_status":"CONTENT_CHANGE","changed_fields_json":'["gloss"]'}), "ITALIAN_GLOSS_SEMANTIC_REVIEW")
        self.assertEqual(source_risk_bucket({"comparison_status":"CONTENT_CHANGE","changed_fields_json":'["stagr"]'}), "READING_OR_WRITING_SCOPE_REVIEW")
        self.assertEqual(source_risk_bucket({"comparison_status":"CONTENT_CHANGE","changed_fields_json":'["xref"]'}), "SOURCE_METADATA_ONLY_CANDIDATE")
        self.assertEqual(source_risk_bucket({"comparison_status":"CONTENT_CHANGE","changed_fields_json":'["lsource"]'}), "SOURCE_METADATA_ONLY_CANDIDATE")
        self.assertEqual(source_risk_bucket({"comparison_status":"CONTENT_CHANGE","changed_fields_json":'["pos"]'}), "POS_REGISTER_DOMAIN_OR_USAGE_REVIEW")
    def test_exact_rows_and_preservation(self):
        with tempfile.TemporaryDirectory() as tmp:
            f=pathlib.Path(tmp)/"canon.sqlite"
            with sqlite3.connect(f) as c:
                c.execute("CREATE TABLE k_jmdict_change(canonical_id TEXT PRIMARY KEY, change_kind TEXT, source_payload TEXT)")
                c.execute("CREATE TABLE k_jmdict_current_sense(canonical_id TEXT PRIMARY KEY, gloss TEXT)")
                c.execute("CREATE TABLE k_sense(id TEXT PRIMARY KEY, studyEnabled INT, italian TEXT)")
                c.execute("CREATE TABLE senses(id TEXT PRIMARY KEY, italian_json TEXT)")
                c.execute("CREATE TABLE decisions(id TEXT PRIMARY KEY, decision_json TEXT)")
                for i in range(3):
                    uid=f"jmdict-100{i}-1"
                    c.execute("INSERT INTO k_jmdict_change VALUES(?,?,?)",(uid,"gloss_changed",'{"gloss":"test"}'))
                    c.execute("INSERT INTO k_jmdict_current_sense VALUES(?,?)",(uid,"test"))
                    c.execute("INSERT INTO k_sense VALUES(?,?,?)",(uid,1,"traduzione conservata"))
                    c.execute("INSERT INTO senses VALUES(?,?)",(uid,'["traduzione conservata"]'))
                    c.execute("INSERT INTO decisions VALUES(?,?)",(uid,'{"status":"PRESERVED"}'))
            b=f.read_bytes()
            output=audit(str(f),expected=3)
            self.assertEqual(len(output["cases"]),3)
            self.assertEqual(output["cases"][0]["canonical_id"],"jmdict-1000-1")
            self.assertEqual(output["cases"][0]["review_status"],"REVIEW_REQUIRED")
            self.assertEqual(output["cases"][0]["study_gate"],"CURRENTLY_ENABLED_PRESERVE_NOT_REVALIDATED")
            detailed=audit(str(f),expected=3,include_editorial=True)
            self.assertTrue(detailed["editorial_context_included"])
            self.assertEqual(detailed["cases"][0]["canonical_context"]["senses"][0]["italian_json"],["traduzione conservata"])
            self.assertEqual(detailed["cases"][0]["canonical_context"]["decisions"][0]["decision_json"]["status"],"PRESERVED")
            self.assertEqual(f.read_bytes(), b, "Audit must be byte-for-byte read only")
            with self.assertRaisesRegex(RuntimeError,"!= expected"):
                audit(str(f),expected=92)
if __name__=="__main__":
    unittest.main()
