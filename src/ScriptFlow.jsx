import { useState } from "react";
import { DEFAULT_CARDS, uid } from "./defaultCards.js";

const STORAGE_KEY = "rigmarole_cards";

function hl(text) {
  return text.replace(
    /\{\{(\w+)\}\}/g,
    '<span style="color:#c4ff36;font-weight:600;background:rgba(196,255,54,0.07);padding:1px 4px;border-radius:3px;font-size:0.92em">{{$1}}</span>'
  );
}

/* ── Section Card ── */
function SectionCard({ card, index, onSwapVariant, onScore }) {
  const v = card.variants[card.activeVariant];
  const total = v.hits + v.misses + v.maybes;
  const rate = total > 0 ? Math.round((v.hits / total) * 100) : null;
  const hasMultiple = card.variants.length > 1;

  return (
    <div style={{ marginBottom: 2 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "#161616",
          borderTop: "1px solid #1e1e1e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "#333", fontFamily: "var(--mono)", fontWeight: 700 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 13, fontFamily: "var(--mono)", fontWeight: 700, color: "#c4ff36" }}>
            {card.name}
          </span>
        </div>
        {rate !== null && (
          <span
            style={{
              fontSize: 10,
              fontFamily: "var(--mono)",
              fontWeight: 700,
              color: rate >= 60 ? "#4ade80" : rate >= 40 ? "#facc15" : "#f87171",
              background:
                rate >= 60
                  ? "rgba(74,222,128,0.08)"
                  : rate >= 40
                  ? "rgba(250,204,21,0.08)"
                  : "rgba(248,113,113,0.08)",
              padding: "2px 7px",
              borderRadius: 4,
            }}
          >
            {rate}% · n={total}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "stretch", background: "#131313" }}>
        <button
          onClick={() => onSwapVariant(card.id, -1)}
          disabled={!hasMultiple}
          style={{
            width: 40,
            flexShrink: 0,
            background: "transparent",
            border: "none",
            borderRight: "1px solid #1a1a1a",
            color: hasMultiple ? "#555" : "#222",
            fontSize: 18,
            cursor: hasMultiple ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s",
          }}
          aria-label="Previous variant"
        >
          ‹
        </button>

        <div style={{ flex: 1, padding: "16px 18px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#888", fontWeight: 600 }}>
              {v.label}
            </span>
            {hasMultiple && (
              <div style={{ display: "flex", gap: 4 }}>
                {card.variants.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === card.activeVariant ? 14 : 5,
                      height: 5,
                      borderRadius: 3,
                      background: i === card.activeVariant ? "#c4ff36" : "#333",
                      transition: "all 0.25s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <p
            style={{
              margin: 0,
              color: "#c5c5c5",
              fontSize: 14,
              lineHeight: 1.75,
              fontFamily: "var(--body)",
            }}
            dangerouslySetInnerHTML={{ __html: hl(v.text) }}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => onScore(card.id, "misses")}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 8,
                border: "1px solid rgba(248,113,113,0.2)",
                background: "rgba(248,113,113,0.05)",
                color: "#f87171",
                fontSize: 13,
                fontFamily: "var(--mono)",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✗ <span style={{ fontSize: 11, opacity: 0.7 }}>{v.misses}</span>
            </button>
            <button
              onClick={() => onScore(card.id, "maybes")}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 8,
                border: "1px solid rgba(250,204,21,0.2)",
                background: "rgba(250,204,21,0.05)",
                color: "#facc15",
                fontSize: 13,
                fontFamily: "var(--mono)",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ? <span style={{ fontSize: 11, opacity: 0.7 }}>{v.maybes}</span>
            </button>
            <button
              onClick={() => onScore(card.id, "hits")}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 8,
                border: "1px solid rgba(74,222,128,0.2)",
                background: "rgba(74,222,128,0.05)",
                color: "#4ade80",
                fontSize: 13,
                fontFamily: "var(--mono)",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✓ <span style={{ fontSize: 11, opacity: 0.7 }}>{v.hits}</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => onSwapVariant(card.id, 1)}
          disabled={!hasMultiple}
          style={{
            width: 40,
            flexShrink: 0,
            background: "transparent",
            border: "none",
            borderLeft: "1px solid #1a1a1a",
            color: hasMultiple ? "#555" : "#222",
            fontSize: 18,
            cursor: hasMultiple ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s",
          }}
          aria-label="Next variant"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* ── Scores View ── */
function ScoresView({ cards }) {
  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: 14, color: "#c4ff36", margin: 0, letterSpacing: 1 }}>
          SCOREBOARD
        </h2>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#444", margin: "3px 0 0" }}>
          All variants ranked by hit rate
        </p>
      </div>
      {cards.map((card) => {
        const sorted = [...card.variants].sort((a, b) => {
          const tA = a.hits + a.misses + a.maybes;
          const tB = b.hits + b.misses + b.maybes;
          return (tB > 0 ? b.hits / tB : -1) - (tA > 0 ? a.hits / tA : -1);
        });
        return (
          <div key={card.id} style={{ marginBottom: 18 }}>
            <h3 style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#eee", margin: "0 0 8px", fontWeight: 700 }}>
              {card.name}
            </h3>
            {sorted.map((v, i) => {
              const total = v.hits + v.misses + v.maybes;
              const rate = total > 0 ? (v.hits / total) * 100 : 0;
              const lead = i === 0 && total > 0;
              return (
                <div
                  key={v.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                    padding: "8px 10px",
                    background: lead ? "rgba(196,255,54,0.03)" : "#151515",
                    border: lead ? "1px solid rgba(196,255,54,0.12)" : "1px solid #1a1a1a",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      width: 95,
                      flexShrink: 0,
                      fontSize: 11,
                      fontFamily: "var(--mono)",
                      color: lead ? "#c4ff36" : "#888",
                      fontWeight: lead ? 700 : 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lead && "★ "}
                    {v.label}
                  </span>
                  <div style={{ flex: 1, height: 6, background: "#222", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${rate}%`,
                        height: "100%",
                        background: lead ? "#c4ff36" : "#555",
                        borderRadius: 3,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--mono)",
                      fontWeight: 700,
                      color: lead ? "#c4ff36" : "#777",
                      minWidth: 32,
                      textAlign: "right",
                    }}
                  >
                    {total > 0 ? `${Math.round(rate)}%` : "—"}
                  </span>
                  <span style={{ fontSize: 9, fontFamily: "var(--mono)", color: "#444", minWidth: 60 }}>
                    {total > 0 ? `${v.hits}✓ ${v.maybes}? ${v.misses}✗` : "no data"}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ── Winner View ── */
function WinnerView({ cards }) {
  const winners = cards.map((card) => {
    const sorted = [...card.variants].sort((a, b) => {
      const tA = a.hits + a.misses + a.maybes;
      const tB = b.hits + b.misses + b.maybes;
      return (tB > 0 ? b.hits / tB : -1) - (tA > 0 ? a.hits / tA : -1);
    });
    const best = sorted[0];
    const total = best.hits + best.misses + best.maybes;
    const rate = total > 0 ? Math.round((best.hits / total) * 100) : null;
    return { card, v: best, rate, total };
  });

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: 14, color: "#c4ff36", margin: 0, letterSpacing: 1 }}>
          WINNING SCRIPT
        </h2>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#444", margin: "3px 0 0" }}>
          Best variant per section, compiled
        </p>
      </div>

      <div style={{ background: "#151515", border: "1px solid #1e1e1e", borderRadius: 14, overflow: "hidden" }}>
        {winners.map((w, i) => (
          <div
            key={w.card.id}
            style={{
              padding: "18px 18px",
              borderBottom: i < winners.length - 1 ? "1px solid #1a1a1a" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "#333", fontFamily: "var(--mono)", fontWeight: 700 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 12, fontFamily: "var(--mono)", fontWeight: 700, color: "#c4ff36" }}>
                  {w.card.name}
                </span>
              </div>
              <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "#555" }}>{w.v.label}</span>
            </div>
            <p
              style={{
                margin: 0,
                color: "#c5c5c5",
                fontSize: 14,
                lineHeight: 1.7,
                fontFamily: "var(--body)",
              }}
              dangerouslySetInnerHTML={{ __html: hl(w.v.text) }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              <div style={{ width: 50, height: 4, background: "#222", borderRadius: 2, overflow: "hidden" }}>
                <div
                  style={{
                    width: w.rate != null ? `${w.rate}%` : "0%",
                    height: "100%",
                    borderRadius: 2,
                    background:
                      w.rate >= 60
                        ? "#4ade80"
                        : w.rate >= 40
                        ? "#facc15"
                        : w.rate != null
                        ? "#f87171"
                        : "#333",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "var(--mono)",
                  fontWeight: 700,
                  color:
                    w.rate != null
                      ? w.rate >= 60
                        ? "#4ade80"
                        : w.rate >= 40
                        ? "#facc15"
                        : "#f87171"
                      : "#333",
                }}
              >
                {w.rate != null ? `${w.rate}% hit` : "no data"}
              </span>
              {w.total > 0 && (
                <span style={{ fontSize: 9, fontFamily: "var(--mono)", color: "#333" }}>n={w.total}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Edit View ── */
function EditView({ cards, onUpdate }) {
  const [editing, setEditing] = useState(null);
  const [eLabel, setELabel] = useState("");
  const [eText, setEText] = useState("");
  const [eName, setEName] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [newName, setNewName] = useState("");

  const startEdit = (cid, vid) => {
    const c = cards.find((x) => x.id === cid);
    const v = c.variants.find((x) => x.id === vid);
    setEditing({ cid, vid });
    setELabel(v.label);
    setEText(v.text);
  };

  const saveEdit = () => {
    onUpdate(
      cards.map((c) =>
        c.id === editing.cid
          ? {
              ...c,
              variants: c.variants.map((v) =>
                v.id === editing.vid ? { ...v, label: eLabel, text: eText } : v
              ),
            }
          : c
      )
    );
    setEditing(null);
  };

  const startEditSection = (cid) => {
    const c = cards.find((x) => x.id === cid);
    setEditingSection(cid);
    setEName(c.name);
  };

  const saveSection = () => {
    onUpdate(cards.map((c) => (c.id === editingSection ? { ...c, name: eName } : c)));
    setEditingSection(null);
  };

  const addVariant = (cid) => {
    onUpdate(
      cards.map((x) =>
        x.id === cid
          ? {
              ...x,
              variants: [
                ...x.variants,
                {
                  id: `${cid}-${uid()}`,
                  label: `Variant ${x.variants.length + 1}`,
                  text: "New text...",
                  hits: 0,
                  misses: 0,
                  maybes: 0,
                },
              ],
            }
          : x
      )
    );
  };

  const delVariant = (cid, vid) => {
    onUpdate(
      cards.map((c) =>
        c.id === cid
          ? {
              ...c,
              variants: c.variants.filter((v) => v.id !== vid),
              activeVariant: Math.min(c.activeVariant, c.variants.length - 2),
            }
          : c
      )
    );
  };

  const addSection = () => {
    const id = `s-${uid()}`;
    onUpdate([
      ...cards,
      {
        id,
        name: newName.trim() || "New Section",
        variants: [
          { id: `${id}-a`, label: "Variant A", text: "Script text...", hits: 0, misses: 0, maybes: 0 },
        ],
        activeVariant: 0,
      },
    ]);
    setNewName("");
  };

  const delSection = (cid) => {
    if (!window.confirm("Delete this section?")) return;
    onUpdate(cards.filter((c) => c.id !== cid));
  };

  const resetAll = () => {
    if (!window.confirm("Reset ALL scores?")) return;
    onUpdate(
      cards.map((c) => ({
        ...c,
        variants: c.variants.map((v) => ({ ...v, hits: 0, misses: 0, maybes: 0 })),
      }))
    );
  };

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "var(--mono)", fontSize: 14, color: "#c4ff36", margin: 0, letterSpacing: 1 }}>
            EDIT
          </h2>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#444", margin: "3px 0 0" }}>
            Manage sections &amp; variants
          </p>
        </div>
        <button
          onClick={resetAll}
          style={{
            background: "transparent",
            border: "1px solid #2a2a2a",
            borderRadius: 6,
            color: "#555",
            padding: "5px 10px",
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "var(--mono)",
          }}
        >
          Reset Stats
        </button>
      </div>

      {cards.map((c) => (
        <div
          key={c.id}
          style={{
            marginBottom: 12,
            background: "#151515",
            border: "1px solid #1a1a1a",
            borderRadius: 10,
            padding: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8 }}>
            {editingSection === c.id ? (
              <div style={{ display: "flex", gap: 6, flex: 1 }}>
                <input
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                  style={{
                    flex: 1,
                    background: "#111",
                    border: "1px solid #333",
                    borderRadius: 4,
                    color: "#eee",
                    padding: "4px 8px",
                    fontSize: 12,
                    fontFamily: "var(--mono)",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={saveSection}
                  style={{
                    background: "rgba(196,255,54,0.12)",
                    border: "1px solid rgba(196,255,54,0.25)",
                    borderRadius: 5,
                    color: "#c4ff36",
                    padding: "4px 10px",
                    fontSize: 11,
                    cursor: "pointer",
                    fontFamily: "var(--mono)",
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <span
                onClick={() => startEditSection(c.id)}
                style={{ fontFamily: "var(--mono)", fontSize: 13, color: "#eee", fontWeight: 700, cursor: "pointer" }}
                title="Click to rename"
              >
                {c.name}
              </span>
            )}
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => addVariant(c.id)}
                style={{
                  background: "rgba(196,255,54,0.08)",
                  border: "1px solid rgba(196,255,54,0.15)",
                  borderRadius: 5,
                  color: "#c4ff36",
                  padding: "3px 8px",
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: "var(--mono)",
                }}
              >
                + Variant
              </button>
              {cards.length > 1 && (
                <button
                  onClick={() => delSection(c.id)}
                  style={{
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    borderRadius: 5,
                    color: "#555",
                    padding: "3px 8px",
                    fontSize: 10,
                    cursor: "pointer",
                    fontFamily: "var(--mono)",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          {c.variants.map((v) => (
            <div key={v.id} style={{ borderTop: "1px solid #1e1e1e", padding: "8px 0" }}>
              {editing?.cid === c.id && editing?.vid === v.id ? (
                <div>
                  <input
                    value={eLabel}
                    onChange={(e) => setELabel(e.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      background: "#111",
                      border: "1px solid #333",
                      borderRadius: 4,
                      color: "#eee",
                      padding: "4px 8px",
                      fontSize: 12,
                      fontFamily: "var(--mono)",
                      marginBottom: 6,
                      boxSizing: "border-box",
                    }}
                  />
                  <textarea
                    value={eText}
                    onChange={(e) => setEText(e.target.value)}
                    rows={4}
                    style={{
                      display: "block",
                      width: "100%",
                      background: "#111",
                      border: "1px solid #333",
                      borderRadius: 4,
                      color: "#ccc",
                      padding: 8,
                      fontSize: 12,
                      fontFamily: "var(--body)",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={saveEdit}
                    style={{
                      marginTop: 6,
                      background: "rgba(196,255,54,0.12)",
                      border: "1px solid rgba(196,255,54,0.25)",
                      borderRadius: 5,
                      color: "#c4ff36",
                      padding: "4px 12px",
                      fontSize: 11,
                      cursor: "pointer",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "#aaa" }}>{v.label}</span>
                    <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "#444", marginLeft: 8 }}>
                      {v.hits}✓ {v.maybes}? {v.misses}✗
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={() => startEdit(c.id, v.id)}
                      style={{
                        background: "transparent",
                        border: "1px solid #2a2a2a",
                        borderRadius: 4,
                        color: "#777",
                        padding: "2px 7px",
                        fontSize: 10,
                        cursor: "pointer",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      Edit
                    </button>
                    {c.variants.length > 1 && (
                      <button
                        onClick={() => delVariant(c.id, v.id)}
                        style={{
                          background: "transparent",
                          border: "1px solid #2a2a2a",
                          borderRadius: 4,
                          color: "#444",
                          padding: "2px 7px",
                          fontSize: 10,
                          cursor: "pointer",
                          fontFamily: "var(--mono)",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Section name..."
          style={{
            flex: 1,
            background: "#151515",
            border: "1px solid #2a2a2a",
            borderRadius: 6,
            color: "#eee",
            padding: "8px 10px",
            fontSize: 12,
            fontFamily: "var(--mono)",
          }}
        />
        <button
          onClick={addSection}
          style={{
            background: "rgba(196,255,54,0.1)",
            border: "1px solid rgba(196,255,54,0.2)",
            borderRadius: 6,
            color: "#c4ff36",
            padding: "8px 14px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "var(--mono)",
            fontWeight: 600,
          }}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function ScriptFlow() {
  // Load saved cards from localStorage, falling back to the seed deck.
  const [cards, setCards] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {
      // Corrupt or unavailable storage — fall through to defaults.
    }
    return DEFAULT_CARDS;
  });
  const [view, setView] = useState("script");

  const update = (nc) => {
    setCards(nc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nc));
    } catch {
      // Ignore quota / private-mode write failures; state still updates.
    }
  };

  const swapVariant = (cardId, dir) => {
    update(
      cards.map((c) => {
        if (c.id !== cardId) return c;
        const next = (c.activeVariant + dir + c.variants.length) % c.variants.length;
        return { ...c, activeVariant: next };
      })
    );
  };

  const score = (cardId, field) => {
    update(
      cards.map((c) => {
        if (c.id !== cardId) return c;
        const v = c.variants[c.activeVariant];
        return {
          ...c,
          variants: c.variants.map((vv) =>
            vv.id === v.id ? { ...vv, [field]: vv[field] + 1 } : vv
          ),
        };
      })
    );
  };

  const tabs = [
    { id: "script", label: "Script" },
    { id: "scores", label: "Scores" },
    { id: "winner", label: "Winner" },
    { id: "edit", label: "Edit" },
  ];

  return (
    <div
      style={{
        background: "#111",
        color: "#eee",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #1e1e1e",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          background: "#111",
          zIndex: 10,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 15, fontFamily: "var(--mono)", fontWeight: 700, letterSpacing: 1 }}>
          <span style={{ color: "#c4ff36" }}>RIG</span>
          <span>MAROLE</span>
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 60 }}>
        {view === "script" &&
          cards.map((c, i) => (
            <SectionCard key={c.id} card={c} index={i} onSwapVariant={swapVariant} onScore={score} />
          ))}
        {view === "scores" && <ScoresView cards={cards} />}
        {view === "winner" && <WinnerView cards={cards} />}
        {view === "edit" && <EditView cards={cards} onUpdate={update} />}
      </div>

      <div
        style={{
          display: "flex",
          borderTop: "1px solid #1e1e1e",
          flexShrink: 0,
          position: "sticky",
          bottom: 0,
          background: "#111",
          zIndex: 10,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "transparent",
              border: "none",
              borderTop: view === t.id ? "2px solid #c4ff36" : "2px solid transparent",
              color: view === t.id ? "#c4ff36" : "#555",
              fontSize: 11,
              fontFamily: "var(--mono)",
              fontWeight: view === t.id ? 700 : 400,
              cursor: "pointer",
              letterSpacing: 0.5,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
