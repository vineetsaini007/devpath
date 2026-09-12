"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Layers3,
  Map,
  Search,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import {
  resources,
  topics,
  template,
  validInput,
  validWeeks,
  type Input,
  type Plan,
  type Topic,
} from "../lib/planner";
const initial: Input = { topic: "JavaScript", level: "Beginner", hours: 5 };
export default function Home() {
  const [input, setInput] = useState<Input>(initial),
    [plan, setPlan] = useState<Plan | null>(null),
    [done, setDone] = useState<number[]>([]),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [query, setQuery] = useState(""),
    [topic, setTopic] = useState("All resources"),
    [level, setLevel] = useState("All levels"),
    [tab, setTab] = useState<"explore" | "plan">("explore");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("devpath:v1") || "null");
      if (
        saved &&
        validInput(saved.plan?.input) &&
        validWeeks(saved.plan?.weeks, saved.plan.input) &&
        ["ai", "fallback"].includes(saved.plan.source)
      ) {
        setPlan(saved.plan);
        setInput(saved.plan.input);
        setDone(
          Array.isArray(saved.done)
            ? [
                ...new Set<number>(
                  saved.done.filter(
                    (n: unknown) =>
                      Number.isInteger(n) && Number(n) >= 1 && Number(n) <= 4,
                  ),
                ),
              ]
            : [],
        );
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready && plan)
      try {
        localStorage.setItem("devpath:v1", JSON.stringify({ plan, done }));
      } catch {
        setNotice(
          "Browser storage is unavailable. Your plan works for this session.",
        );
      }
  }, [plan, done, ready]);
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (tool: unknown, options: unknown) => void;
        };
      }
    ).modelContext;
    if (!context) return;
    const controller = new AbortController();
    try {
      context.registerTool(
        {
          name: "filter_resources",
          description:
            "Filter the visible developer resource catalog by topic.",
          inputSchema: {
            type: "object",
            properties: {
              topic: { type: "string", enum: ["All resources", ...topics] },
            },
            required: ["topic"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false },
          execute: (value: { topic: string }) => {
            if (!["All resources", ...topics].includes(value.topic))
              throw new Error("Invalid topic");
            setTopic(value.topic);
            setTab("explore");
            return { topic: value.topic };
          },
        },
        { signal: controller.signal },
      );
    } catch {}
    return () => controller.abort();
  }, []);
  async function generate() {
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(32000),
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (
        !validInput(result.input) ||
        !validWeeks(result.weeks, result.input) ||
        !["ai", "fallback"].includes(result.source)
      )
        throw new Error();
      setPlan(result);
      setDone([]);
      setTab("plan");
      if (result.source === "fallback")
        setNotice("Template plan — AI is unavailable or not enabled.");
    } catch {
      setPlan(template(input));
      setDone([]);
      setTab("plan");
      setNotice("Template plan — AI could not be reached.");
    } finally {
      setBusy(false);
    }
  }
  function example() {
    setPlan(template(input));
    setDone([]);
    setTab("plan");
    setNotice("Example plan — built from our curated resources.");
  }
  const visible = resources.filter(
    (r) =>
      (topic === "All resources" || r.topic === topic) &&
      (level === "All levels" || r.level === level) &&
      `${r.title} ${r.author}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="app">
      <main>
        <header className="site-header">
          <a className="brand" href="/" aria-label="DevPath home">
            <span className="brand-mark">
              <Zap size={21} fill="currentColor" />
            </span>
            devpath<span className="brand-dot">.</span>
          </a>
          <nav aria-label="Main navigation">
            <button
              aria-pressed={tab === "explore"}
              className={tab === "explore" ? "nav-active" : ""}
              onClick={() => setTab("explore")}
            >
              <Layers3 size={17} />
              Explore resources
            </button>
            <button
              aria-pressed={tab === "plan"}
              className={tab === "plan" ? "nav-active" : ""}
              onClick={() => setTab("plan")}
            >
              <Map size={17} />
              My learning path{" "}
              {plan && <span className="nav-count">{done.length}/4</span>}
            </button>
          </nav>
          <span className="header-note">Made for the self-taught.</span>
        </header>
        <div className="content">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span />
                <span>YOUR NEXT CHAPTER STARTS HERE</span>
              </div>
              <h1 id="hero-title">
                Less collecting tabs.
                <br />
                <span>More building things.</span>
              </h1>
              <p>
                Turn your “I’ll learn that someday” into a clear four-week path.
                Great resources, a little AI, and a pace that’s yours.
              </p>
              <div className="hero-actions">
                <a className="primary" href="#planner">
                  Find my learning path
                  <ArrowRight size={18} />
                </a>
                <button
                  onClick={() => {
                    setTab("explore");
                    requestAnimationFrame(() =>
                      document
                        .getElementById("resources")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    );
                  }}
                >
                  Explore the library
                  <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="hero-facts">
                <span>
                  <BookOpen size={15} />
                  15 curated resources
                </span>
                <span>
                  <Check size={15} />
                  100% free to explore
                </span>
              </div>
            </div>
            <div
              className="hero-preview"
              aria-label="Four-week learning journey"
            >
              <div className="preview-top">
                <span>
                  <Terminal size={16} />
                  your-next-chapter
                </span>
                <span className="preview-dots">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="preview-content">
                <div className="preview-label">FROM CURIOUS TO CAPABLE</div>
                <h2>
                  One small step.
                  <br />
                  Every single week.
                </h2>
                <ol className="journey">
                  <li>
                    <span className="journey-number">
                      <Check size={15} />
                    </span>
                    <div>
                      <small>WEEK 01</small>
                      <strong>Find your foundations</strong>
                    </div>
                    <span className="journey-tag">Start here</span>
                  </li>
                  <li>
                    <span className="journey-number">02</span>
                    <div>
                      <small>WEEK 02</small>
                      <strong>Make it click</strong>
                    </div>
                  </li>
                  <li>
                    <span className="journey-number">03</span>
                    <div>
                      <small>WEEK 03</small>
                      <strong>Put it into practice</strong>
                    </div>
                  </li>
                  <li>
                    <span className="journey-number">04</span>
                    <div>
                      <small>WEEK 04</small>
                      <strong>Build something real</strong>
                    </div>
                    <Code2 size={21} />
                  </li>
                </ol>
                <div className="preview-bottom">
                  <Sparkles size={15} />
                  <span>A little structure. A lot of possibility.</span>
                </div>
              </div>
            </div>
          </section>
          <section className="planner" id="planner">
            <div className="planner-heading">
              <span className="spark-icon">
                <Sparkles size={21} />
              </span>
              <div>
                <h2>A learning path, just for you</h2>
                <p>
                  Pick your goal. We’ll turn it into four weeks of progress.
                </p>
              </div>
              <span className="ai-badge">AI ASSISTED</span>
            </div>
            <div className="planner-fields">
              <label>
                I want to learn
                <div className="select-wrap">
                  <Code2 size={17} />
                  <select
                    aria-label="Learning topic"
                    value={input.topic}
                    onChange={(e) =>
                      setInput({ ...input, topic: e.target.value as Topic })
                    }
                  >
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label>
                My experience
                <div className="select-wrap">
                  <Layers3 size={17} />
                  <select
                    aria-label="Experience level"
                    value={input.level}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        level: e.target.value as Input["level"],
                      })
                    }
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label>
                Time per week
                <div className="select-wrap">
                  <Clock3 size={17} />
                  <select
                    aria-label="Weekly hours"
                    value={input.hours}
                    onChange={(e) =>
                      setInput({ ...input, hours: Number(e.target.value) })
                    }
                  >
                    {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
                      <option key={n} value={n}>
                        {n} hours / week
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <button className="primary" onClick={generate} disabled={busy}>
                {busy ? (
                  <>
                    <span className="spinner" />
                    Building your path…
                  </>
                ) : (
                  <>
                    Build my path
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
            <div className="planner-footer">
              <span>
                <Check size={14} /> Free resources. No account needed.
              </span>
              <button onClick={example} disabled={busy}>
                Try an example <ArrowUpRight size={14} />
              </button>
            </div>
          </section>
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
          {tab === "explore" ? (
            <section className="catalog" id="resources">
              <div className="section-heading">
                <div>
                  <h2>Your next rabbit hole</h2>
                  <p>Handpicked resources. Actually worth your time.</p>
                </div>
                <span className="resource-count">
                  {resources.length} resources
                </span>
              </div>
              <div className="catalog-tools">
                <div className="tabs" aria-label="Filter by topic">
                  {["All resources", ...topics].map((t) => (
                    <button
                      aria-pressed={topic === t}
                      className={topic === t ? "selected" : ""}
                      key={t}
                      onClick={() => setTopic(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="search">
                  <Search size={17} />
                  <input
                    aria-label="Search resources"
                    placeholder="Find a resource…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  className="level-filter"
                  aria-label="Filter by level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option>All levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                </select>
              </div>
              <div className="resource-grid">
                {visible.map((r) => (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card"
                    key={r.id}
                  >
                    <div className="card-top">
                      <span className={`resource-symbol ${r.color}`}>
                        {r.topic === "JavaScript" ? (
                          <strong>JS</strong>
                        ) : r.topic === "React" ? (
                          <Layers3 size={25} />
                        ) : (
                          <Terminal size={25} />
                        )}
                      </span>
                      <span className="type-tag">{r.type}</span>
                      <ArrowUpRight size={17} className="card-arrow" />
                    </div>
                    <div className="resource-author">{r.author}</div>
                    <h3>{r.title}</h3>
                    <p>{r.description}</p>
                    <div className="card-bottom">
                      <span>
                        <span
                          className={`level-dot ${r.level === "Intermediate" ? "intermediate" : ""}`}
                        />
                        {r.level}
                      </span>
                      <span className="free">
                        Free access
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
              {!visible.length && (
                <div className="empty">
                  <Search size={30} />
                  <h3>No resources found</h3>
                  <p>Try another search or change your filters.</p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setTopic("All resources");
                      setLevel("All levels");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>
          ) : (
            <section className="path-section">
              <div className="section-heading">
                <div>
                  <h2>
                    {plan
                      ? `Your ${plan.input.topic} learning path`
                      : "Your next chapter starts here"}
                  </h2>
                  <p>
                    {plan
                      ? `${plan.input.level} · ${plan.input.hours} hours per week · ${plan.source === "ai" ? "AI-generated plan" : "Curated template plan"}`
                      : "Choose a goal above to create your first four-week plan."}
                  </p>
                </div>
                {plan && (
                  <span className="progress-pill">
                    {done.length} of 4 complete
                  </span>
                )}
              </div>
              {plan ? (
                <>
                  <div className="progress-track">
                    <div style={{ width: `${done.length * 25}%` }} />
                  </div>
                  <div className="week-list">
                    {plan.weeks.map((w) => (
                      <article
                        className={`week ${done.includes(w.week) ? "complete" : ""}`}
                        key={w.week}
                      >
                        <button
                          className="week-check"
                          aria-label={`Mark week ${w.week} ${done.includes(w.week) ? "incomplete" : "complete"}`}
                          aria-pressed={done.includes(w.week)}
                          onClick={() =>
                            setDone(
                              done.includes(w.week)
                                ? done.filter((n) => n !== w.week)
                                : [...done, w.week],
                            )
                          }
                        >
                          {done.includes(w.week) ? (
                            <Check size={20} />
                          ) : (
                            String(w.week).padStart(2, "0")
                          )}
                        </button>
                        <div className="week-body">
                          <span className="week-meta">
                            WEEK {String(w.week).padStart(2, "0")}{" "}
                            <span>
                              <Clock3 size={13} />
                              {w.estimatedHours} hours
                            </span>
                          </span>
                          <h3>{w.goal}</h3>
                          <p>{w.practiceTask}</p>
                          <div className="week-links">
                            {w.resourceIds.map((id) => {
                              const r = resources.find((r) => r.id === id)!;
                              return (
                                <a
                                  href={r.url}
                                  key={id}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <BookOpen size={14} />
                                  {r.title}
                                  <ArrowUpRight size={13} />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  {done.length === 4 && (
                    <div className="finish">
                      <Sparkles size={22} />
                      <div>
                        <h3>Four weeks. A new skill. Nicely done.</h3>
                        <p>Choose your next topic whenever you’re ready.</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty">
                  <Map size={36} />
                  <h3>A clear path beats an endless reading list.</h3>
                  <button className="primary" onClick={example}>
                    Explore an example
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </section>
          )}
          <footer>
            <span className="footer-brand">
              <Zap size={15} />
              devpath.
            </span>
            <span>Stay curious. Keep building.</span>
            <span>Independent learning project</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
