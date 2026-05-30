import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import {
  contactLinks,
  experienceItems,
  projects,
  siteMeta,
} from "../data/siteContent";
import styles from "../styles/Terminal.module.css";

type Line = { id: number; node: ReactNode };

const PROMPT = "ala@portfolio:~$";

// Static intro — rendered identically on server and client so hydration
// matches and the terminal reads as a finished session without JS.
const INTRO: ReactNode[] = [
  <span key="b" className={styles.dim}>
    {siteMeta.name} — interactive shell. Type{" "}
    <span className={styles.accent}>help</span> and hit enter.
  </span>,
  <span key="w">
    <span className={styles.muted}>{PROMPT}</span> whoami
  </span>,
  <span key="o" className={styles.out}>
    {siteMeta.name} · Full-stack developer · {siteMeta.location}
  </span>,
];

const COMMANDS = [
  "help",
  "whoami",
  "ls",
  "projects",
  "cat",
  "open",
  "stack",
  "experience",
  "contact",
  "resume",
  "now",
  "neofetch",
  "echo",
  "date",
  "sudo",
  "clear",
] as const;

export function Terminal() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>(() =>
    INTRO.map((node, id) => ({ id, node })),
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const idRef = useRef(INTRO.length);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const slugs = useMemo(() => projects.map((p) => p.slug), []);

  const push = (nodes: ReactNode[]) =>
    setLines((prev) => [
      ...prev,
      ...nodes.map((node) => ({ id: idRef.current++, node })),
    ]);

  // Keep the latest output in view as the session grows.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function run(raw: string) {
    const input = raw.trim();
    const echo: ReactNode = (
      <span>
        <span className={styles.muted}>{PROMPT}</span> {input}
      </span>
    );
    if (!input) {
      push([echo]);
      return;
    }
    setHistory((h) => [...h, input]);

    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(" ");
    const out: ReactNode[] = [echo];

    switch (cmd.toLowerCase()) {
      case "help":
        out.push(
          <span className={styles.out}>Available commands:</span>,
          <CmdList />,
        );
        break;
      case "whoami":
        out.push(
          <span className={styles.out}>
            {siteMeta.name} — {siteMeta.title}
          </span>,
          <span className={styles.dim}>
            {siteMeta.location} · {siteMeta.availability}
          </span>,
        );
        break;
      case "ls":
      case "projects":
        out.push(
          ...projects.map((p) => (
            <button
              type="button"
              className={styles.fileRow}
              onClick={() => navigate(`/projects/${p.slug}`)}
            >
              <span className={styles.file}>{p.slug}.md</span>
              <span className={styles.dim}>{p.title}</span>
            </button>
          )),
        );
        break;
      case "cat": {
        const p = projects.find((x) => x.slug === arg);
        if (!p) {
          out.push(
            <span className={styles.err}>
              cat: {arg || "<slug>"}: no such project. try{" "}
              <span className={styles.accent}>ls</span>
            </span>,
          );
          break;
        }
        out.push(
          <span className={styles.accent}>
            # {p.title} · {p.status}
          </span>,
          <span className={styles.out}>{p.summary}</span>,
          <span className={styles.dim}>stack: {p.stack.join(", ")}</span>,
          <button
            type="button"
            className={styles.link}
            onClick={() => navigate(`/projects/${p.slug}`)}
          >
            → open project page
          </button>,
        );
        break;
      }
      case "open": {
        if (slugs.includes(arg)) {
          out.push(<span className={styles.out}>opening {arg}…</span>);
          navigate(`/projects/${arg}`);
        } else {
          out.push(
            <span className={styles.err}>open: unknown project "{arg}"</span>,
          );
        }
        break;
      }
      case "stack": {
        const all = [...new Set(projects.flatMap((p) => p.stack))].sort();
        out.push(<span className={styles.out}>{all.join("  ·  ")}</span>);
        break;
      }
      case "experience":
        out.push(
          ...experienceItems.map((e) => (
            <span className={styles.out}>
              <span className={styles.accent}>{e.years}</span> — {e.role} @{" "}
              {e.company}
            </span>
          )),
        );
        break;
      case "contact":
        out.push(
          ...contactLinks.map((c) => (
            <a
              className={styles.link}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              {c.label}: {c.href}
            </a>
          )),
        );
        break;
      case "resume":
        out.push(<span className={styles.out}>loading resume…</span>);
        navigate("/resume");
        break;
      case "now":
        out.push(<span className={styles.out}>loading /now…</span>);
        navigate("/now");
        break;
      case "neofetch":
        out.push(<Neofetch />);
        break;
      case "echo":
        out.push(<span className={styles.out}>{arg}</span>);
        break;
      case "date":
        out.push(<span className={styles.out}>{new Date().toString()}</span>);
        break;
      case "sudo":
        out.push(
          <span className={styles.err}>
            {siteMeta.name.split(" ")[0].toLowerCase()} is not in the sudoers
            file. This incident will be reported. 😏
          </span>,
        );
        break;
      case "clear":
        setLines([]);
        return;
      default:
        out.push(
          <span className={styles.err}>
            command not found: {cmd}. try{" "}
            <span className={styles.accent}>help</span>
          </span>,
        );
    }
    push(out);
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(value);
      setValue("");
      setHistIdx(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const i = histIdx + 1;
      if (i >= history.length) {
        setHistIdx(-1);
        setValue("");
      } else {
        setHistIdx(i);
        setValue(history[i]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = value.split(/\s+/);
      if (parts.length <= 1) {
        const m = COMMANDS.filter((c) => c.startsWith(parts[0]));
        if (m.length === 1) setValue(`${m[0]} `);
      } else if (parts[0] === "cat" || parts[0] === "open") {
        const m = slugs.filter((s) => s.startsWith(parts[1]));
        if (m.length === 1) setValue(`${parts[0]} ${m[0]}`);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div className={styles.window} onClick={() => inputRef.current?.focus()}>
      <div className={styles.bar}>
        <span className={styles.dots}>
          <i data-c="r" />
          <i data-c="y" />
          <i data-c="g" />
        </span>
        <span className={styles.title}>{PROMPT} — zsh</span>
        <span className={styles.barHint}>interactive</span>
      </div>
      <div className={styles.body} ref={bodyRef}>
        {lines.map((l) => (
          <div key={l.id} className={styles.line}>
            {l.node}
          </div>
        ))}
        <div className={styles.inputRow}>
          <span className={styles.muted}>{PROMPT}</span>
          <span className={styles.inputWrap}>
            <input
              ref={inputRef}
              className={styles.input}
              value={value}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal input"
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <span className={styles.ghost} aria-hidden="true">
              {value}
              <span className={styles.caret} />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function CmdList() {
  const items: [string, string][] = [
    ["help", "this list"],
    ["whoami", "who am i"],
    ["ls / projects", "list projects"],
    ["cat <slug>", "read a project"],
    ["open <slug>", "go to a project"],
    ["stack", "tech i use"],
    ["experience", "work history"],
    ["contact", "reach me"],
    ["resume / now", "other pages"],
    ["neofetch", "system info"],
    ["clear", "wipe the screen"],
  ];
  return (
    <span className={styles.cmdGrid}>
      {items.map(([c, d]) => (
        <span key={c} className={styles.cmdItem}>
          <span className={styles.accent}>{c}</span>
          <span className={styles.dim}>{d}</span>
        </span>
      ))}
    </span>
  );
}

function Neofetch() {
  const info: [string, string][] = [
    ["host", "portfolio.alaarab"],
    ["role", "Full-stack developer"],
    ["location", siteMeta.location],
    ["uptime", "13+ yrs shipping"],
    ["projects", `${projects.length} loaded`],
    ["shell", "react 19 · bun"],
    ["status", siteMeta.availability],
  ];
  return (
    <span className={styles.neofetch}>
      <span className={styles.logo}>{`  ___ _ ___ \n / _ \\ / |   \\\n| |_| | | |) |\n \\___/|_|___/`}</span>
      <span className={styles.info}>
        {info.map(([k, v]) => (
          <span key={k}>
            <span className={styles.accent}>{k}</span>
            <span className={styles.dim}> · </span>
            {v}
          </span>
        ))}
      </span>
    </span>
  );
}
