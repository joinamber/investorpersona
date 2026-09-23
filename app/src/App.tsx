import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toBlob, toPng } from 'html-to-image';
import { PERSONAS, QUESTIONS, type Persona, type PersonaId } from './data';

type Screen = 'intro' | 'quiz' | 'loading' | 'result' | 'portfolio' | 'share';
type Scores = Partial<Record<PersonaId, number>>;

const SHARE_URL = 'https://hyperpersona.cc/';
const ANSWER_DELAY_MS = 420;
const LOADING_MS = 2000;
const TICKER_MS = 260;
// The story card renders at 288px wide; export it at Instagram Story resolution (1080×1920).
const STORY_PIXEL_RATIO = 1080 / 288;

// Phones (no hover, coarse pointer) can't save an <a download> image to Photos, so they use the share sheet.
const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// Render the card to a PNG File. iOS WebKit often drops images and fonts from the first
// foreignObject render, so render once to warm it up and keep the second result.
async function renderStoryFile(node: HTMLElement, name: string): Promise<File> {
  await document.fonts.ready;
  await Promise.all([...node.querySelectorAll('img')].map((img) => img.decode().catch(() => {})));
  const opts = { pixelRatio: STORY_PIXEL_RATIO, cacheBust: true };
  await toBlob(node, opts);
  const blob = await toBlob(node, opts);
  if (!blob) throw new Error('Empty render');
  return new File([blob], name, { type: 'image/png' });
}

// Highest score wins; ties go to whichever persona is listed first.
function computeMatch(scores: Scores): PersonaId {
  let best = PERSONAS[0].id;
  let bestCount = -1;
  for (const p of PERSONAS) {
    const c = scores[p.id] ?? 0;
    if (c > bestCount) { bestCount = c; best = p.id; }
  }
  return best;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState<Scores>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [matchId, setMatchId] = useState<PersonaId | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => { clearTimeout(id); clearInterval(id); });
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => { window.scrollTo(0, 0); }, [screen, qIndex]);

  const match = PERSONAS.find((p) => p.id === matchId) ?? PERSONAS[0];

  const start = () => {
    setScores({}); setQIndex(0); setSelected(null); setScreen('quiz');
  };

  const runLoading = (finalScores: Scores) => {
    setScreen('loading');
    timers.current.push(window.setInterval(() => setTickerIndex((i) => (i + 1) % PERSONAS.length), TICKER_MS));
    timers.current.push(window.setTimeout(() => {
      clearTimers();
      setMatchId(computeMatch(finalScores));
      setScreen('result');
    }, LOADING_MS));
  };

  const selectAnswer = (optionIndex: number) => {
    if (selected !== null) return;
    const personaId = QUESTIONS[qIndex].options[optionIndex].persona;
    const nextScores = { ...scores, [personaId]: (scores[personaId] ?? 0) + 1 };
    setScores(nextScores);
    setSelected(optionIndex);
    timers.current.push(window.setTimeout(() => {
      setSelected(null);
      const next = qIndex + 1;
      if (next >= QUESTIONS.length) runLoading(nextScores);
      else setQIndex(next);
    }, ANSWER_DELAY_MS));
  };

  const retake = () => {
    clearTimers();
    setScreen('intro'); setQIndex(0); setScores({}); setSelected(null);
    setMatchId(null); setTickerIndex(0); setDialogOpen(false);
  };

  const isQuiz = screen === 'quiz';

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">HYPERPERSONA</div>
        {isQuiz && <div className="q-counter">Question {qIndex + 1} / {QUESTIONS.length}</div>}
      </header>

      {isQuiz && (
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={qIndex}>
          <div className="progress-fill" style={{ width: `${Math.round((qIndex / QUESTIONS.length) * 100)}%` }} />
        </div>
      )}

      {screen === 'intro' && <Intro onStart={start} />}

      {isQuiz && (
        <main className="screen screen-centered" key={qIndex}>
          <h2 className="question">{QUESTIONS[qIndex].text}</h2>
          <div className="stack">
            {QUESTIONS[qIndex].options.map((opt, i) => (
              <button
                key={i}
                className={`option${selected === i ? ' is-selected' : ''}`}
                onClick={() => selectAnswer(i)}
                disabled={selected !== null}
              >
                <span className="option-letter">{'ABCD'[i]}</span>
                <span className="option-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {screen === 'loading' && (
        <main className="loading" aria-live="polite">
          <div className="spinner" />
          <div className="loading-title">Finding your match…</div>
          <div className="loading-sub">Comparing you to {PERSONAS[tickerIndex].name}</div>
        </main>
      )}

      {screen === 'result' && (
        <Result match={match} onPortfolio={() => setScreen('portfolio')} onShare={() => setScreen('share')} onRetake={retake} />
      )}

      {screen === 'portfolio' && (
        <Portfolio match={match} onBack={() => setScreen('result')} onAdopt={() => setDialogOpen(true)} onShare={() => setScreen('share')} />
      )}

      {screen === 'share' && <Share match={match} onBack={() => setScreen('result')} />}

      {dialogOpen && <AdoptDialog match={match} onClose={() => setDialogOpen(false)} />}
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="screen screen-centered">
      <div className="eyebrow">A Compatibility Test For Your Money</div>
      <h1 className="hero-title">Who is your<br />investor <em>soulmate?</em></h1>
      <p className="hero-lede">
        Answer {QUESTIONS.length} lifestyle questions. We'll match you with the legendary investor whose philosophy mirrors yours — and hand you their portfolio.
      </p>

      <div className="persona-strip">
        {PERSONAS.map(({ id, icon: Icon, shortName }) => (
          <div className="persona-cell" key={id}>
            <Icon aria-hidden />
            <span>{shortName}</span>
          </div>
        ))}
      </div>

      <div>
        <button className="btn btn-primary btn-block btn-start" onClick={onStart}>Take the Quiz →</button>
        <div className="fine-print">2 minutes · {QUESTIONS.length} questions · no signup required</div>
      </div>
    </main>
  );
}

function Result({ match, onPortfolio, onShare, onRetake }: {
  match: Persona; onPortfolio: () => void; onShare: () => void; onRetake: () => void;
}) {
  return (
    <main className="screen fade-up-slow">
      <div className="match-head">
        <img className="match-portrait" src={match.headImage} alt={match.name} />
        <div>
          <div className="match-kicker">It's a match</div>
          <h1 className="match-name">{match.name}</h1>
          <div className="match-archetype">{match.archetype}</div>
        </div>
      </div>

      <div className="compat">
        <span className="compat-num">{match.compatibility}%</span>
        <span className="compat-label">compatible</span>
      </div>

      <p className="result-copy">{match.resultCopy}</p>

      <section className="traits">
        <div className="traits-title">Shared Traits</div>
        <div className="traits-list">
          {match.traits.map((t) => (
            <div key={t.label}>
              <div className="trait-row"><span>{t.label}</span><span>{t.pct}%</span></div>
              <div className="trait-track"><div className="trait-fill" style={{ width: `${t.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <div className="stack">
        <button className="btn btn-primary btn-lg" onClick={onPortfolio}>See My {match.name}-Inspired Portfolio →</button>
        <button className="btn btn-ghost btn-lg" onClick={onShare}>Share My Match</button>
        <button className="retake" onClick={onRetake}>Retake the quiz</button>
      </div>
    </main>
  );
}

function BackToResult({ onClick }: { onClick: () => void }) {
  return (
    <button className="back-link" onClick={onClick}>
      <ArrowLeft size={16} aria-hidden /> Back to result
    </button>
  );
}

function Portfolio({ match, onBack, onAdopt, onShare }: {
  match: Persona; onBack: () => void; onAdopt: () => void; onShare: () => void;
}) {
  return (
    <main className="screen portfolio fade-up">
      <BackToResult onClick={onBack} />
      <h1 className="portfolio-title">Your {match.name}-inspired portfolio</h1>

      <div className="alloc-bar" role="img" aria-label={match.portfolio.map((r) => `${r.ticker} ${r.weight}%`).join(', ')}>
        {match.portfolio.map((r) => (
          <div key={r.ticker} className="alloc-seg" style={{ width: `${r.weight}%`, background: r.barColor }} />
        ))}
      </div>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr><th>Asset Class</th><th>Weight</th><th>Ticker</th><th>Role</th></tr>
          </thead>
          <tbody>
            {match.portfolio.map((r) => (
              <tr key={r.ticker}>
                <td>{r.asset}</td>
                <td className="weight-cell">{r.weight}%</td>
                <td><span className="tag tag-outline">{r.ticker}</span></td>
                <td className="role-cell">{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stack">
        <button className="btn btn-primary btn-lg" onClick={onAdopt}>Adopt This Strategy &amp; Link Bank</button>
        <button className="btn btn-ghost btn-lg" onClick={onShare}>Share My Match</button>
      </div>
    </main>
  );
}

function Share({ match, onBack }: { match: Persona; onBack: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touch] = useState(isTouchDevice);
  // Mobile: pre-render as soon as the card is on screen, so the tap can open the share sheet
  // immediately (iOS blocks navigator.share once the tap's user activation has expired).
  const storyFile = useRef<Promise<File> | null>(null);
  const [saveUrl, setSaveUrl] = useState<string | null>(null);
  const fileName = `hyperpersona-${match.id}.png`;

  useEffect(() => {
    if (!touch || !cardRef.current) return;
    const pending = renderStoryFile(cardRef.current, fileName);
    pending.catch(() => {});
    storyFile.current = pending;
  }, [touch, fileName]);

  useEffect(() => () => { if (saveUrl) URL.revokeObjectURL(saveUrl); }, [saveUrl]);

  const downloadDesktop = async () => {
    if (!cardRef.current) return;
    setBusy(true); setError(null);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: STORY_PIXEL_RATIO, cacheBust: true });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fileName;
      a.click();
    } catch {
      setError("Couldn't create the image. Try a screenshot instead.");
    } finally {
      setBusy(false);
    }
  };

  const downloadMobile = async () => {
    setError(null);
    if (!storyFile.current && cardRef.current) storyFile.current = renderStoryFile(cardRef.current, fileName);
    let file: File;
    setBusy(true);
    try {
      file = await storyFile.current!;
    } catch {
      storyFile.current = null;
      setError("Couldn't create the image. Try a screenshot instead.");
      return;
    } finally {
      setBusy(false);
    }
    // Files only (no text/url): with extra fields iOS drops "Save Image" from the share sheet.
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') return; // user closed the sheet
      }
    }
    // No file sharing (or activation expired): show the full-size image to press-and-hold save.
    setSaveUrl(URL.createObjectURL(file));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(`Couldn't copy. The link is ${SHARE_URL}`);
    }
  };

  return (
    <main className="share fade-up">
      <BackToResult onClick={onBack} />

      <div className="story-card" ref={cardRef}>
        <div className="story-brand">HYPERPERSONA · Investor Match</div>
        <div className="story-center">
          <div className="story-frame">
            <img src={match.charImage} alt={match.name} />
          </div>
          <div className="story-name-block">
            <div className="story-name">{match.name}</div>
            <div className="story-archetype">{match.archetype}</div>
          </div>
          <div className="story-compat">{match.compatibility}%</div>
        </div>
        <div className="story-footer">Find your investor soulmate → {SHARE_URL}</div>
      </div>

      <div className="stack share-actions">
        <button className="btn btn-primary btn-lg" onClick={touch ? downloadMobile : downloadDesktop} disabled={busy}>
          {busy ? 'Preparing image…' : 'Download for Instagram Story'}
        </button>
        <button className="btn btn-secondary btn-lg" onClick={copyLink}>{copied ? 'Link copied' : 'Copy Link'}</button>
        {error && <p className="share-error" role="alert">{error}</p>}
      </div>

      {saveUrl && (
        <div className="dialog-backdrop save-sheet" onClick={() => setSaveUrl(null)}>
          <div className="save-sheet-body" onClick={(e) => e.stopPropagation()}>
            <img src={saveUrl} alt={`${match.name} match card`} />
            <p>Press and hold the image, then tap <strong>Save to Photos</strong>.</p>
            <button className="btn btn-secondary btn-lg" onClick={() => setSaveUrl(null)}>Done</button>
          </div>
        </div>
      )}
    </main>
  );
}

function AdoptDialog({ match, onClose }: { match: Persona; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="adopt-title" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title" id="adopt-title">Strategy queued</div>
        <div className="dialog-body">
          This is a prototype — in the live app, adopting {match.name}'s strategy connects you with a preferred wealth manager to start investing.
        </div>
        <div className="dialog-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onClose} autoFocus>Got it</button>
        </div>
      </div>
    </div>
  );
}
