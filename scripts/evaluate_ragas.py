"""
RAGAS 自动化评测脚本
评估 RAG 系统的专业指标：Context Precision, Faithfulness, Answer Relevancy
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Literal
from dotenv import load_dotenv

load_dotenv()

from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)

from app.rag import build_rag_chain as build_v1_chain
from app.rag_hybrid import build_hybrid_rag_chain as build_v2_chain


# 测试数据集（包含标准答案）
TEST_DATASET = [
    {
        "question": "图书馆的开放时间是什么？",
        "ground_truth": "主馆周一至周五07:30-22:30，周六至周日08:30-21:30，法定节假日09:00-17:00。自习室24小时开放。"
    },
    {
        "question": "如何办理图书借阅证？",
        "ground_truth": "携带学生证或工作证到图书馆一楼借阅服务台办理。"
    },
    {
        "question": "如何选课？",
        "ground_truth": "选课分为预选、正选、补退选三个阶段。本科生每学期最低12学分，最高32学分。"
    },
    {
        "question": "学校的地址在哪里？",
        "ground_truth": "学校位于北京市海淀区，具体地址请查看官网。"
    },
    {
        "question": "校园卡在哪里办理？",
        "ground_truth": "校园卡在校园卡服务中心办理，位于学生事务大厅。"
    },
]


def collect_rag_results(version: Literal["v1", "v2"]) -> dict:
    """
    运行 RAG 系统，收集结果
    """
    print(f"\n{'='*60}")
    print(f"收集 {version.upper()} 的评测数据")
    print(f"{'='*60}\n")

    if version == "v1":
        chain, retriever = build_v1_chain()
    else:
        chain, retriever = build_v2_chain()

    results = {
        "question": [],
        "answer": [],
        "contexts": [],
        "ground_truth": []
    }

    for i, test_case in enumerate(TEST_DATASET, 1):
        question = test_case["question"]
        print(f"[{i}/{len(TEST_DATASET)}] 处理问题: {question}")

        # 检索文档
        docs = retriever.invoke(question)
        contexts = [doc.page_content for doc in docs]

        # 生成答案
        answer = chain.invoke(question)

        results["question"].append(question)
        results["answer"].append(answer)
        results["contexts"].append(contexts)
        results["ground_truth"].append(test_case["ground_truth"])

    return results


def run_ragas_evaluation(version: Literal["v1", "v2"]) -> dict:
    """
    运行 RAGAS 评测
    """
    # 收集数据
    data = collect_rag_results(version)

    # 转换为 Dataset
    dataset = Dataset.from_dict(data)

    print(f"\n开始 RAGAS 评测...")

    # 运行评测
    result = evaluate(
        dataset,
        metrics=[
            faithfulness,           # 忠实度（反幻觉）
            answer_relevancy,       # 答案相关性
            context_precision,      # 上下文精度
            context_recall,         # 上下文召回
        ],
    )

    return result


def print_ragas_results(v1_result, v2_result):
    """打印 RAGAS 评测结果对比"""
    print("\n" + "="*60)
    print("📊 RAGAS 评测结果对比")
    print("="*60 + "\n")

    # 打印原始结果以便调试
    print("V1 结果类型:", type(v1_result))
    print("V1 结果:", v1_result)
    print("\nV2 结果类型:", type(v2_result))
    print("V2 结果:", v2_result)
    print("\n")

    metrics = [
        ("Faithfulness (忠实度)", "faithfulness"),
        ("Answer Relevancy (答案相关性)", "answer_relevancy"),
        ("Context Precision (上下文精度)", "context_precision"),
        ("Context Recall (上下文召回)", "context_recall"),
    ]

    print(f"{'指标':<35} {'V1.0':<15} {'V2.0':<15} {'提升':<15}")
    print("-" * 80)

    for name, key in metrics:
        # 使用字典访问方式
        v1_val = v1_result[key] if key in v1_result else None
        v2_val = v2_result[key] if key in v2_result else None

        # 处理 nan 值
        import math
        if v1_val is None or (isinstance(v1_val, float) and math.isnan(v1_val)):
            v1_avg = 0
        elif isinstance(v1_val, list):
            v1_avg = sum(v1_val) / len(v1_val) if v1_val else 0
        else:
            v1_avg = v1_val

        if v2_val is None or (isinstance(v2_val, float) and math.isnan(v2_val)):
            v2_avg = 0
        elif isinstance(v2_val, list):
            v2_avg = sum(v2_val) / len(v2_val) if v2_val else 0
        else:
            v2_avg = v2_val

        diff = v2_avg - v1_avg

        # 如果值为0（可能是nan），显示为 N/A
        if v1_avg == 0 and v2_avg == 0:
            v1_display = "N/A"
            v2_display = "N/A"
            diff_display = "N/A"
        else:
            v1_display = f"{v1_avg:.3f}"
            v2_display = f"{v2_avg:.3f}"
            diff_display = f"{'+' if diff > 0 else ''}{diff:.3f}"

        print(f"{name:<35} {v1_display:<15} {v2_display:<15} {diff_display:<15}")


def main():
    """主函数"""
    print("🚀 开始 RAGAS 自动化评测\n")

    # 评测 V1.0
    v1_result = run_ragas_evaluation("v1")

    # 评测 V2.0
    v2_result = run_ragas_evaluation("v2")

    # 打印对比
    print_ragas_results(v1_result, v2_result)

    # 保存结果
    output_dir = Path("evaluation_results")
    output_dir.mkdir(exist_ok=True)

    import time
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    output_file = output_dir / f"ragas_evaluation_{timestamp}.json"

    with output_file.open("w", encoding="utf-8") as f:
        json.dump({
            "v1": dict(v1_result),
            "v2": dict(v2_result)
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ RAGAS 评测结果已保存到: {output_file}")


if __name__ == "__main__":
    main()
