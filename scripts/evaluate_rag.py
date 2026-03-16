"""
RAG系统评测脚本
用于对比不同检索方案的真实效果
"""
from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Literal
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

from app.rag import build_rag_chain as build_v1_chain
from app.rag_hybrid import build_hybrid_rag_chain as build_v2_chain


# 测试集：真实的校园问题
TEST_CASES = [
    {
        "question": "图书馆的开放时间是什么？",
        "expected_keywords": ["开放时间", "图书馆", "时间"],
        "category": "图书馆服务"
    },
    {
        "question": "如何办理图书借阅证？",
        "expected_keywords": ["借阅证", "办理", "图书"],
        "category": "图书馆服务"
    },
    {
        "question": "学校有哪些奖学金？",
        "expected_keywords": ["奖学金"],
        "category": "学生服务"
    },
    {
        "question": "如何申请助学金？",
        "expected_keywords": ["助学金", "申请"],
        "category": "学生服务"
    },
    {
        "question": "学校的地址在哪里？",
        "expected_keywords": ["地址", "位置"],
        "category": "学校信息"
    },
    {
        "question": "学校有多少个学院？",
        "expected_keywords": ["学院", "数量"],
        "category": "学校信息"
    },
    {
        "question": "计算机学院有哪些专业？",
        "expected_keywords": ["计算机", "专业"],
        "category": "院系专业"
    },
    {
        "question": "如何选课？",
        "expected_keywords": ["选课"],
        "category": "教务管理"
    },
    {
        "question": "校园卡在哪里办理？",
        "expected_keywords": ["校园卡", "办理"],
        "category": "学生服务"
    },
    {
        "question": "学校的交通方式有哪些？",
        "expected_keywords": ["交通", "公交", "地铁"],
        "category": "交通指南"
    },
]


def evaluate_retrieval(
    retriever,
    question: str,
    expected_keywords: list[str]
) -> dict:
    """
    评估检索质量
    返回：相关性分数、检索到的文档数量
    """
    start_time = time.time()
    docs = retriever.invoke(question)
    retrieval_time = time.time() - start_time

    # 计算关键词命中率
    retrieved_text = "\n".join([doc.page_content for doc in docs])
    keyword_hits = sum(1 for kw in expected_keywords if kw in retrieved_text)
    relevance_score = keyword_hits / len(expected_keywords) if expected_keywords else 0

    return {
        "retrieval_time": round(retrieval_time, 3),
        "num_docs": len(docs),
        "relevance_score": round(relevance_score, 2),
        "keyword_hits": keyword_hits,
        "total_keywords": len(expected_keywords)
    }


def evaluate_answer(
    chain,
    retriever,
    question: str,
    expected_keywords: list[str]
) -> dict:
    """
    评估完整问答质量
    """
    start_time = time.time()

    # 检索评估
    retrieval_result = evaluate_retrieval(retriever, question, expected_keywords)

    # 生成答案
    answer = chain.invoke(question)
    total_time = time.time() - start_time

    # 检查答案中是否包含关键词
    answer_keyword_hits = sum(1 for kw in expected_keywords if kw in answer)
    answer_relevance = answer_keyword_hits / len(expected_keywords) if expected_keywords else 0

    # 检查是否是"不知道"类型的回答
    unknown_phrases = ["没有找到", "暂时没有", "不清楚", "无法回答"]
    is_unknown = any(phrase in answer for phrase in unknown_phrases)

    return {
        "question": question,
        "answer": answer,
        "total_time": round(total_time, 3),
        "retrieval_time": retrieval_result["retrieval_time"],
        "generation_time": round(total_time - retrieval_result["retrieval_time"], 3),
        "retrieval_relevance": retrieval_result["relevance_score"],
        "answer_relevance": round(answer_relevance, 2),
        "is_unknown": is_unknown,
        "num_docs": retrieval_result["num_docs"]
    }


def run_evaluation(version: Literal["v1", "v2"]) -> dict:
    """
    运行完整评测
    """
    print(f"\n{'='*60}")
    print(f"开始评测 {version.upper()} ({'纯向量检索' if version == 'v1' else '混合检索'})")
    print(f"{'='*60}\n")

    # 构建RAG链
    if version == "v1":
        chain, retriever = build_v1_chain()
    else:
        chain, retriever = build_v2_chain()

    results = []

    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"[{i}/{len(TEST_CASES)}] 测试问题: {test_case['question']}")

        result = evaluate_answer(
            chain,
            retriever,
            test_case["question"],
            test_case["expected_keywords"]
        )
        result["category"] = test_case["category"]
        results.append(result)

        print(f"  ✓ 检索相关性: {result['retrieval_relevance']}")
        print(f"  ✓ 答案相关性: {result['answer_relevance']}")
        print(f"  ✓ 总耗时: {result['total_time']}s")
        print()

    # 计算统计指标
    stats = calculate_statistics(results)

    return {
        "version": version,
        "results": results,
        "statistics": stats
    }


def calculate_statistics(results: list[dict]) -> dict:
    """计算统计指标"""
    total = len(results)

    avg_retrieval_relevance = sum(r["retrieval_relevance"] for r in results) / total
    avg_answer_relevance = sum(r["answer_relevance"] for r in results) / total
    avg_total_time = sum(r["total_time"] for r in results) / total
    avg_retrieval_time = sum(r["retrieval_time"] for r in results) / total
    avg_generation_time = sum(r["generation_time"] for r in results) / total

    unknown_count = sum(1 for r in results if r["is_unknown"])
    unknown_rate = unknown_count / total

    # 定义"正确"的标准：答案相关性 >= 0.5 且不是"不知道"
    correct_count = sum(1 for r in results if r["answer_relevance"] >= 0.5 and not r["is_unknown"])
    accuracy = correct_count / total

    return {
        "total_questions": total,
        "avg_retrieval_relevance": round(avg_retrieval_relevance, 3),
        "avg_answer_relevance": round(avg_answer_relevance, 3),
        "accuracy": round(accuracy, 3),
        "unknown_rate": round(unknown_rate, 3),
        "avg_total_time": round(avg_total_time, 3),
        "avg_retrieval_time": round(avg_retrieval_time, 3),
        "avg_generation_time": round(avg_generation_time, 3)
    }


def print_comparison(v1_stats: dict, v2_stats: dict):
    """打印对比结果"""
    print("\n" + "="*60)
    print("📊 评测结果对比")
    print("="*60 + "\n")

    metrics = [
        ("检索相关性", "avg_retrieval_relevance", "%"),
        ("答案相关性", "avg_answer_relevance", "%"),
        ("准确率", "accuracy", "%"),
        ("未知回答率", "unknown_rate", "%"),
        ("平均总耗时", "avg_total_time", "s"),
        ("平均检索耗时", "avg_retrieval_time", "s"),
    ]

    print(f"{'指标':<20} {'V1.0 (纯向量)':<20} {'V2.0 (混合检索)':<20} {'提升':<15}")
    print("-" * 80)

    for name, key, unit in metrics:
        v1_val = v1_stats[key]
        v2_val = v2_stats[key]

        if unit == "%":
            v1_display = f"{v1_val*100:.1f}%"
            v2_display = f"{v2_val*100:.1f}%"
            diff = v2_val - v1_val
            diff_display = f"{'+' if diff > 0 else ''}{diff*100:.1f}%"
        else:
            v1_display = f"{v1_val:.3f}{unit}"
            v2_display = f"{v2_val:.3f}{unit}"
            diff = v2_val - v1_val
            diff_display = f"{'+' if diff > 0 else ''}{diff:.3f}{unit}"

        print(f"{name:<20} {v1_display:<20} {v2_display:<20} {diff_display:<15}")


def main():
    """主函数"""
    # 评测V1.0
    v1_result = run_evaluation("v1")

    # 评测V2.0
    v2_result = run_evaluation("v2")

    # 打印对比
    print_comparison(v1_result["statistics"], v2_result["statistics"])

    # 保存结果
    output_dir = Path("evaluation_results")
    output_dir.mkdir(exist_ok=True)

    timestamp = time.strftime("%Y%m%d_%H%M%S")
    output_file = output_dir / f"evaluation_{timestamp}.json"

    with output_file.open("w", encoding="utf-8") as f:
        json.dump({
            "v1": v1_result,
            "v2": v2_result
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 评测结果已保存到: {output_file}")


if __name__ == "__main__":
    main()
