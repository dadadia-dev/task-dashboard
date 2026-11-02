"""業務棚卸し表（Excel）をダッシュボード用のJSONに変換する。

出力は2つ:
  src/data/tasks.local.json   実データ（Gitに入れない。自分のPCでの開発用）
  src/data/tasks.sample.json  ダミー（Gitに入れる。公開用）

実行方法（プロジェクトのフォルダで）:
  python scripts/convert_tasks.py
"""

import json
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
EXCEL_PATH = ROOT / "private" / "filled.xlsx"
RULES_PATH = ROOT / "private" / "dummy_rules.json"
OUT_DIR = ROOT / "src" / "data"

# Excelの列名 → JSONのキー名（コードで扱いやすいよう英語にする）
COLUMNS = {
    "ID": "id",
    "大分類": "category",
    "業務名": "name",
    "具体的な作業内容": "description",
    "対象（事業・拠点）": "target",
    "タイプ": "type",
    "頻度": "frequency",
    "月間回数": "monthlyCount",
    "1回の時間（分）": "minutesPerTime",
    "月間時間（h）": "monthlyHours",
    "依頼元": "requester",
    "属人度": "ownership",
    "使用ツール": "tools",
    "自動化・委任の余地": "automation",
    "深堀りポイント": "question",
    "回答メモ": "memo",
}

# ダミー版（公開用）には入れない項目
PRIVATE_KEYS = ["question", "memo"]


def read_tasks():
    """Excelの「業務一覧」シートを読み、1行＝1業務の辞書のリストにする。"""
    # data_only=True: 数式ではなく、計算済みの値を読む
    sheet = openpyxl.load_workbook(EXCEL_PATH, data_only=True)["業務一覧"]
    rows = sheet.iter_rows(values_only=True)
    header = next(rows)

    tasks = []
    for row in rows:
        if not row[0]:  # IDが空の行はスキップ
            continue
        task = {COLUMNS[col]: value for col, value in zip(header, row) if col in COLUMNS}
        tasks.append(clean(task))
    return tasks


def clean(task):
    """値の形をそろえる。"""
    # "B：教えれば引継ぎ可" → "B"（画面側で扱いやすくする）
    if task["ownership"]:
        task["ownership"] = task["ownership"][0]
    # "Illustrator／Photoshop" → ["Illustrator", "Photoshop"]
    tools = task["tools"] or ""
    task["tools"] = [t.strip() for t in tools.replace("/", "／").split("／") if t.strip()]
    # 数値は小数1桁に丸める（空欄は0）
    for key in ["monthlyCount", "minutesPerTime", "monthlyHours"]:
        task[key] = round(float(task[key] or 0), 1)
    return task


def make_dummy(tasks, rules):
    """公開用に、非公開の項目を外して固有名詞を置き換える。"""
    dummy = []
    for task in tasks:
        d = {k: v for k, v in task.items() if k not in PRIVATE_KEYS}
        for key, value in d.items():
            if isinstance(value, str):
                for before, after in rules["replacements"]:
                    value = value.replace(before, after)
                d[key] = value
        dummy.append(d)
    return dummy


def check_forbidden(dummy, rules):
    """ダミー版に禁止語が残っていないか確認する。残っていたら止める。"""
    text = json.dumps(dummy, ensure_ascii=False)
    found = [word for word in rules["forbidden"] if word in text]
    if found:
        sys.exit(f"中止: ダミー版に禁止語が残っています → {found}\n"
                 f"private/dummy_rules.json の replacements に置き換えを追加してください。")


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"書き出し: {path.relative_to(ROOT)}（{len(data)}件）")


def main():
    rules = json.loads(RULES_PATH.read_text(encoding="utf-8"))
    tasks = read_tasks()
    dummy = make_dummy(tasks, rules)
    check_forbidden(dummy, rules)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    write_json(OUT_DIR / "tasks.local.json", tasks)
    write_json(OUT_DIR / "tasks.sample.json", dummy)


if __name__ == "__main__":
    main()
