import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Eres Fabrizio Anavitarte, CEO y co-fundador de Peruvian Health (razón social: Peruvian's Cook SAC), una empresa peruana de productos naturales con ~10 años de operación. Generas alrededor de 400–500k soles/mes con ~50 clientes B2B activos.

IMPORTANTE: Eres un avatar de Fabrizio. Si alguien pregunta quién eres, di algo como: "Soy el avatar de Fabrizio — una versión de IA entrenada con su forma de pensar y liderar Peruvian Health. No soy él en persona, pero puedo ayudarte a tomar decisiones como él lo haría."

---

EQUIPO ACTUAL:
- Rodrigo Anavitarte: Co-director, Operaciones y Administración
- Lesly Garcia: Marketing & Ventas Manager
- Jackeline Maiguare: Producción
- Mónica: Cobranzas y Despacho
- Luis Durand: Transporte B2B
- Marjorie: Contenido (reemplaza a Melanie)
- Karen: Ejecutiva de ventas B2B
- Sofía y Xiomara: Atención al cliente
- Miguel Ángel: Ventas B2B

---

FILOSOFÍA Y VALORES DE MARCA:
- Peruvian Health es un aliado silencioso del bienestar — no activista, no dominante. Filosofía Taoísta/Zen: contribuir sin dominar.
- Valores innegociables: honestidad, integridad, calidad holística, responsabilidad ambiental.
- Acepta trade-offs pragmáticos (ej: empaques de plástico si es necesario).
- No acepta capital externo.
- Filosofía de ventas: "informas o transformas" — el vendedor como agente de cambio.
- Filosofía de equipo: el ego y la victimización son los principales obstáculos; el error es oportunidad; "siempre aprendiz, nunca maestro."
- Slow productivity: hacer menos pero mejor.
- Cultura de disrupción e innovación: "zero to one."

---

CONTEXTO COMERCIAL:
- Aceite de coco = ~80% de los ingresos.
- Línea de cosméticos (desodorantes naturales: jazmín, menta, lavanda, etc.) — mantenida pero no empujada activamente.
- Estrategia 2026: gomitas (apple cider vinegar, creatina, melatonina) en supermercados.
- InkaFarma es ~30% de las ventas. El cierre del deal de gomitas con InkaFarma es la prioridad #1 de los próximos 90 días.
- Prioridades 2026: tiempos de entrega de 3 días hábiles, lanzamiento de gomitas en supermercados, programa de afiliados TikTok.
- Competidor Somos Bio apareció en retail.

---

CÓMO RESPONDER:
- Habla como Fabrizio: directo, cálido, sin lenguaje corporativo. Usa el mismo tono informal pero reflexivo que él usa.
- Cuando la pregunta es filosófica o de manejo de personas, responde con profundidad humana.
- Cuando la pregunta es operativa, sé práctico y concreto.
- Usa español por defecto. Si alguien escribe en inglés, responde en inglés.
- Respuestas concisas pero completas. Sin paja.

---

CUÁNDO ESCALAR A FABRIZIO (el humano real):
Las siguientes situaciones SIEMPRE deben escalar a Fabrizio:
1. Decisiones con montos muy grandes o inversiones no presupuestadas
2. Contrataciones o desvinculaciones de personal
3. Nuevos productos o líneas de negocio
4. Alianzas estratégicas importantes
5. Temas legales o contractuales
6. Dirección de marca

PROTOCOLO DE ESCALADA: Si alguien trae una situación de alto nivel, antes de cerrar tu respuesta pregúntale: "¿Y qué vas a hacer exactamente?" Si la respuesta es vaga, sin fundamento o muestra poca claridad, dile: "Para esta decisión, te recomiendo consultarlo directamente con Fabrizio. Es del tipo de cosas que él prefiere manejar personalmente."

---

TEMAS FRECUENTES QUE PUEDES MANEJAR:
- Estrategia de marketing y contenido
- Cómo responder a clientes difíciles o con quejas
- Cómo innovar en producto o canales
- Cómo comunicar la marca
- Dudas sobre prioridades del equipo
- Cómo manejar situaciones con clientes B2B
- Filosofía de ventas y atención al cliente`;

const Avatar = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      });

      const data = await response.json();
      const reply = data.content?.map(b => b.text || "").join("") || "No pude generar una respuesta.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Hubo un error al conectar. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F0E8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Georgia', serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        width: "100%",
        background: "#1C2B1A",
        padding: "20px 24px 16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}>
        <div style={{
          width: 48, height: 48,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7AB648, #4A8A2C)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
          boxShadow: "0 0 0 3px rgba(122,182,72,0.25)",
        }}>
          🌿
        </div>
        <div>
          <div style={{ color: "#E8F0D8", fontSize: 17, fontWeight: "bold", letterSpacing: "0.02em" }}>
            Avatar de Fabrizio
          </div>
          <div style={{ color: "#8AAF72", fontSize: 12, marginTop: 2, fontStyle: "italic" }}>
            Peruvian Health · CEO & Co-fundador
          </div>
        </div>
        <div style={{
          marginLeft: "auto",
          width: 8, height: 8,
          borderRadius: "50%",
          background: "#7AB648",
          boxShadow: "0 0 6px #7AB648",
        }} />
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1,
        width: "100%",
        maxWidth: 680,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        overflowY: "auto",
        minHeight: "calc(100vh - 160px)",
      }}>
        {messages.length === 0 && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", flex: 1, gap: 16, marginTop: 60,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 48 }}>🌿</div>
            <div style={{ color: "#3D5A2C", fontSize: 18, fontWeight: "bold" }}>
              Hola, soy el avatar de Fabrizio
            </div>
            <div style={{ color: "#6B8050", fontSize: 14, maxWidth: 340, lineHeight: 1.6 }}>
              Puedo ayudarte con estrategia de marketing, clientes difíciles, innovación de producto y decisiones del día a día en Peruvian Health.
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8
            }}>
              {[
                "¿Cómo respondería Fabrizio a una queja de cliente?",
                "¿Qué innovación propondría para el canal B2B?",
                "¿Cuál es la prioridad de marketing este trimestre?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                  style={{
                    background: "white",
                    border: "1px solid #C8D8B0",
                    borderRadius: 20,
                    padding: "8px 14px",
                    fontSize: 12,
                    color: "#3D5A2C",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                    lineHeight: 1.4,
                    maxWidth: 220,
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.target.style.background = "#EEF5E4"}
                  onMouseLeave={e => e.target.style.background = "white"}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            alignItems: "flex-end",
            gap: 8,
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #7AB648, #4A8A2C)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>🌿</div>
            )}
            <div style={{
              maxWidth: "75%",
              background: msg.role === "user" ? "#1C2B1A" : "white",
              color: msg.role === "user" ? "#E8F0D8" : "#2A3D1C",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px",
              fontSize: 14,
              lineHeight: 1.65,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #7AB648, #4A8A2C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🌿</div>
            <div style={{
              background: "white", borderRadius: "18px 18px 18px 4px",
              padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(n => (
                <div key={n} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#7AB648",
                  animation: "pulse 1.2s ease-in-out infinite",
                  animationDelay: `${n * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        width: "100%",
        maxWidth: 680,
        padding: "12px 20px 20px",
        display: "flex",
        gap: 10,
        alignItems: "flex-end",
      }}>
        <div style={{
          flex: 1,
          background: "white",
          border: "1.5px solid #C8D8B0",
          borderRadius: 24,
          display: "flex",
          alignItems: "flex-end",
          padding: "10px 16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          transition: "border-color 0.2s",
        }}
          onFocus={() => {}}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); adjustHeight(); }}
            onKeyDown={handleKey}
            placeholder="Escríbele a Fabrizio..."
            rows={1}
            style={{
              flex: 1, border: "none", outline: "none", resize: "none",
              fontSize: 14, fontFamily: "Georgia, serif", color: "#2A3D1C",
              background: "transparent", lineHeight: 1.5, maxHeight: 120,
              overflowY: "auto",
            }}
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44,
            borderRadius: "50%",
            background: input.trim() && !loading ? "#1C2B1A" : "#C8D8B0",
            border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
            transition: "background 0.2s, transform 0.1s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={e => { if (input.trim() && !loading) e.target.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Avatar;
