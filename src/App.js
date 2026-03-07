import { useEffect, useState } from "react";

const plasticItems = [
  { id: "bottle", name: "페트병 (생수/음료)", icon: "🍶", weight: 25, unit: "개" },
  { id: "bag", name: "비닐봉지", icon: "🛍️", weight: 8, unit: "개" },
  { id: "straw", name: "플라스틱 빨대", icon: "🥤", weight: 0.4, unit: "개" },
  { id: "cup", name: "일회용 컵", icon: "☕", weight: 5, unit: "개" },
  { id: "container", name: "플라스틱 용기 (도시락 등)", icon: "📦", weight: 30, unit: "개" },
  { id: "wrap", name: "랩/포장재", icon: "🎁", weight: 2, unit: "g" },
  { id: "utensil", name: "일회용 수저/포크", icon: "🥄", weight: 3, unit: "개" },
  { id: "toothbrush", name: "칫솔", icon: "🪥", weight: 18, unit: "개" },
];

const microplasticData = {
  low: { weekly: 0.3, monthly: 1.2, yearly: 14.4, riskLevel: 1 },
  medium: { weekly: 1.5, monthly: 6, yearly: 72, riskLevel: 2 },
  high: { weekly: 5, monthly: 20, yearly: 240, riskLevel: 3 },
  extreme: { weekly: 12, monthly: 48, yearly: 576, riskLevel: 4 },
};

function getRiskLevel(totalGrams) {
  if (totalGrams < 20) return "low";
  if (totalGrams < 80) return "medium";
  if (totalGrams < 200) return "high";
  return "extreme";
}

const riskInfo = {
  low: {
    label: "낮음",
    color: "#4ade80",
    bodyEffects: [
      "미세플라스틱 혈중 농도 - 평균 이하",
      "내분비계 영향 - 미미한 수준",
      "장내 미생물 영향 - 거의 없음",
    ],
    envEffects: [
      "연간 약 5.2kg 플라스틱 배출",
      "해양 미세플라스틱 기여 - 최소",
      "탄소 발자국 - 연간 약 26kg CO₂",
    ],
    bodyScore: 15,
    envScore: 10,
  },
  medium: {
    label: "보통",
    color: "#facc15",
    bodyEffects: [
      "미세플라스틱 혈중 검출 가능성 증가",
      "호르몬 교란 물질 축적 시작",
      "소화계 경미한 염증 반응 가능",
    ],
    envEffects: [
      "연간 약 29kg 플라스틱 배출",
      "해양 플라스틱 오염에 기여",
      "탄소 발자국 - 연간 약 145kg CO₂",
    ],
    bodyScore: 42,
    envScore: 38,
  },
  high: {
    label: "높음",
    color: "#fb923c",
    bodyEffects: [
      "미세플라스틱 주요 장기(간, 폐) 내 축적",
      "내분비계 교란 - 호르몬 불균형 위험",
      "면역 반응 약화 및 만성 염증 가능",
    ],
    envEffects: [
      "연간 약 73kg 플라스틱 배출",
      "토양·수질 오염 심각하게 기여",
      "탄소 발자국 - 연간 약 365kg CO₂",
    ],
    bodyScore: 70,
    envScore: 72,
  },
  extreme: {
    label: "매우 높음",
    color: "#f87171",
    bodyEffects: [
      "미세플라스틱 혈액·뇌 장벽 통과 가능",
      "심혈관계 및 신경계 영향 연구됨",
      "발암성 물질(BPA 등) 노출 위험 심각",
    ],
    envEffects: [
      "연간 약 175kg 이상 플라스틱 배출",
      "해양 생태계 파괴에 직접적 기여",
      "탄소 발자국 - 연간 약 875kg CO₂",
    ],
    bodyScore: 92,
    envScore: 95,
  },
};

function AnimatedBar({ value, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 200 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 10, overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${width}%`,
        background: `linear-gradient(90deg, ${color}88, ${color})`,
        borderRadius: 999,
        transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: `0 0 12px ${color}66`,
      }} />
    </div>
  );
}

function CircleGauge({ score, color, label }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnim(score), 300);
    return () => clearTimeout(t);
  }, [score]);
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (anim / 100) * circ;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle cx={55} cy={55} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle
          cx={55} cy={55} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)", filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x={55} y={52} textAnchor="middle" fill="white" fontSize={20} fontWeight="700" fontFamily="'Noto Sans KR', sans-serif">{anim}</text>
        <text x={55} y={68} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={10} fontFamily="'Noto Sans KR', sans-serif">/ 100</text>
      </svg>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4, fontFamily: "'Noto Sans KR', sans-serif" }}>{label}</div>
    </div>
  );
}

export default function PlasticTracker() {
  const [quantities, setQuantities] = useState({});
  const [result, setResult] = useState(null);
  const [animIn, setAnimIn] = useState(false);

  const totalGrams = plasticItems.reduce((sum, item) => {
    return sum + (quantities[item.id] || 0) * item.weight;
  }, 0);

  const handleAnalyze = () => {
    if (totalGrams === 0) return;
    const level = getRiskLevel(totalGrams);
    setResult({ level, totalGrams, info: riskInfo[level], mp: microplasticData[level] });
    setAnimIn(false);
    setTimeout(() => setAnimIn(true), 50);
  };

  const handleReset = () => {
    setQuantities({});
    setResult(null);
    setAnimIn(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f0a 0%, #0d1a10 40%, #081410 100%)",
      fontFamily: "'Noto Sans KR', 'Pretendard', sans-serif",
      color: "white",
      padding: "0 0 60px",
    }}>
      {/* BG texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `radial-gradient(ellipse at 20% 20%, rgba(34,197,94,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 60%)`,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "0 20px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "52px 0 36px" }}>
          <div style={{
            display: "inline-block", fontSize: 44, marginBottom: 12,
            filter: "drop-shadow(0 0 20px rgba(34,197,94,0.4))",
          }}>♻️</div>
          <h1 style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 800,
            margin: "0 0 10px",
            background: "linear-gradient(135deg, #4ade80, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}>
            나의 하루 플라스틱 영향 분석
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            오늘 사용한 플라스틱을 입력하면<br />신체와 환경에 미치는 영향을 분석해드립니다
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "28px 24px",
          marginBottom: 20,
          backdropFilter: "blur(10px)",
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#4ade80", margin: "0 0 20px", letterSpacing: 1, textTransform: "uppercase" }}>
            📋 오늘 사용한 플라스틱
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {plasticItems.map((item) => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "12px 16px",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                    {item.weight}g/{item.unit}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => setQuantities(q => ({ ...q, [item.id]: Math.max(0, (q[item.id] || 0) - 1) }))}
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white", fontSize: 16, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>−</button>
                  <span style={{ width: 28, textAlign: "center", fontSize: 15, fontWeight: 700, color: quantities[item.id] ? "#4ade80" : "rgba(255,255,255,0.3)" }}>
                    {quantities[item.id] || 0}
                  </span>
                  <button onClick={() => setQuantities(q => ({ ...q, [item.id]: (q[item.id] || 0) + 1 }))}
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: "rgba(74,222,128,0.15)",
                      border: "1px solid rgba(74,222,128,0.3)",
                      color: "#4ade80", fontSize: 16, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            marginTop: 20,
            background: "rgba(74,222,128,0.06)",
            border: "1px solid rgba(74,222,128,0.15)",
            borderRadius: 12,
            padding: "14px 18px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>총 플라스틱 사용량</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#4ade80" }}>{totalGrams.toFixed(1)}g</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <button onClick={handleAnalyze} disabled={totalGrams === 0}
            style={{
              flex: 1, padding: "16px",
              background: totalGrams > 0 ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.06)",
              border: "none", borderRadius: 14, color: "white",
              fontSize: 15, fontWeight: 700, cursor: totalGrams > 0 ? "pointer" : "not-allowed",
              fontFamily: "'Noto Sans KR', sans-serif",
              transition: "all 0.2s",
              boxShadow: totalGrams > 0 ? "0 4px 24px rgba(34,197,94,0.35)" : "none",
            }}>
            🔬 영향 분석하기
          </button>
          <button onClick={handleReset}
            style={{
              padding: "16px 20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14, color: "rgba(255,255,255,0.6)",
              fontSize: 14, cursor: "pointer",
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>
            초기화
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{
            opacity: animIn ? 1 : 0,
            transform: animIn ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Risk Badge */}
            <div style={{
              textAlign: "center", marginBottom: 24,
              background: `linear-gradient(135deg, ${result.info.color}18, ${result.info.color}08)`,
              border: `1px solid ${result.info.color}33`,
              borderRadius: 20, padding: "24px",
            }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>
                위험 등급
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: result.info.color, letterSpacing: "-1px" }}>
                {result.info.label}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
                하루 <strong style={{ color: "white" }}>{result.totalGrams.toFixed(1)}g</strong> 플라스틱 사용
              </div>
            </div>

            {/* Gauge Row */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 40,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "28px 24px",
              marginBottom: 16,
            }}>
              <CircleGauge score={result.info.bodyScore} color={result.info.color} label="신체 위험도" />
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <CircleGauge score={result.info.envScore} color="#38bdf8" label="환경 위험도" />
            </div>

            {/* Body Effects */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "24px",
              marginBottom: 16,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: result.info.color, margin: "0 0 16px", letterSpacing: 0.5 }}>
                🫀 신체에 미치는 영향
              </h3>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                  <span>신체 위험 지수</span><span>{result.info.bodyScore}/100</span>
                </div>
                <AnimatedBar value={result.info.bodyScore} color={result.info.color} delay={0} />
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {result.info.bodyEffects.map((e, i) => (
                  <li key={i} style={{
                    padding: "10px 14px",
                    background: `${result.info.color}0d`,
                    border: `1px solid ${result.info.color}22`,
                    borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.5,
                  }}>
                    {e}
                  </li>
                ))}
              </ul>

              {/* Microplastic intake */}
              <div style={{
                marginTop: 16, padding: "14px", borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, textAlign: "center",
              }}>
                {[
                  { label: "주간 섭취", val: `${result.mp.weekly}mg` },
                  { label: "월간 섭취", val: `${result.mp.monthly}mg` },
                  { label: "연간 섭취", val: `${result.mp.yearly}mg` },
                ].map((d, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: result.info.color }}>{d.val}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>미세플라스틱 {d.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Env Effects */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "24px",
              marginBottom: 16,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#38bdf8", margin: "0 0 16px", letterSpacing: 0.5 }}>
                🌍 환경에 미치는 영향
              </h3>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                  <span>환경 위험 지수</span><span>{result.info.envScore}/100</span>
                </div>
                <AnimatedBar value={result.info.envScore} color="#38bdf8" delay={200} />
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {result.info.envEffects.map((e, i) => (
                  <li key={i} style={{
                    padding: "10px 14px",
                    background: "rgba(56,189,248,0.06)",
                    border: "1px solid rgba(56,189,248,0.15)",
                    borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.5,
                  }}>
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip */}
            <div style={{
              background: "rgba(74,222,128,0.05)",
              border: "1px solid rgba(74,222,128,0.15)",
              borderRadius: 16, padding: "18px 20px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>💡 줄이는 방법</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
                텀블러·장바구니 사용, 리필 스테이션 이용, 포장재 없는 제품 선택으로
                <strong style={{ color: "white" }}> 하루 플라스틱을 최대 70% 줄일 수</strong> 있습니다.
                작은 실천이 연간 수십 kg의 플라스틱을 줄입니다.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 48, color: "rgba(255,255,255,0.15)", fontSize: 12 }}>
        데이터는 WHO, UNEP 연구 자료 기반 추정치입니다
      </div>
    </div>
  );
}
