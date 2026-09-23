import type { LucideIcon } from 'lucide-react';
import { Atom, DollarSign, Globe, Rocket, Scale, Store } from 'lucide-react';

export type PersonaId = 'buffett' | 'wood' | 'dalio' | 'lynch' | 'simons' | 'templeton';

export interface Trait { label: string; pct: number }
export interface Holding { asset: string; weight: number; ticker: string; role: string; barColor: string }
export interface Persona {
  id: PersonaId;
  name: string;
  shortName: string;
  archetype: string;
  icon: LucideIcon;
  compatibility: number;
  charImage: string;
  headImage: string;
  resultCopy: string;
  traits: Trait[];
  portfolio: Holding[];
}
export interface Question { text: string; options: { persona: PersonaId; label: string }[] }

export const PERSONAS: Persona[] = [
  { id: 'buffett', name: 'Warren Buffett', shortName: 'Value Monk', archetype: 'The Value Monk', icon: DollarSign, compatibility: 88, charImage: '/personas/buffett.png', headImage: '/personas/buffett-head.png',
    resultCopy: "You view wealth creation as a marathon of patient compounding, not a sprint of speculation. Like Warren Buffett, you instinctively value durable competitive moats, cash-flow stability, and pricing power over short-term market trends. True financial freedom comes from holding great businesses at fair prices and letting time do the heavy lifting.",
    traits: [{label:'Patience Index',pct:95},{label:'Capital Discipline',pct:90},{label:'Moat Bias',pct:88}],
    portfolio: [
      {asset:'Quality Dividend Growth',weight:45,ticker:'SCHD',role:'High-ROE, dividend-growing US moat businesses',barColor:'var(--color-accent)'},
      {asset:'Total US Broad Market',weight:35,ticker:'VTI',role:'Low-cost coverage across all US market caps',barColor:'var(--color-neutral-500)'},
      {asset:'Short-Term Treasury Yield',weight:20,ticker:'SGOV',role:'Capital preservation and dry powder',barColor:'var(--color-neutral-300)'},
    ]},
  { id: 'wood', name: 'Cathie Wood', shortName: 'Disruption Prophet', archetype: 'The Disruption Prophet', icon: Rocket, compatibility: 93, charImage: '/personas/wood.png', headImage: '/personas/wood-head.png',
    resultCopy: "You see the financial world through the lens of exponential technology and future shifts. Like Cathie Wood, short-term paper volatility doesn't intimidate you if it buys early access to paradigm-shifting innovation — AI, robotics, genomics, and decentralized networks. You invest where the world is going, not where it has been.",
    traits: [{label:'Innovation Conviction',pct:98},{label:'High-Beta Tolerance',pct:90},{label:'Exponential Vision',pct:92}],
    portfolio: [
      {asset:'Large-Cap Tech & Innovation',weight:40,ticker:'QQQM',role:'Nasdaq-100 mega-cap AI and tech leaders',barColor:'var(--color-accent)'},
      {asset:'Disruptive Tech & Genomics',weight:25,ticker:'ARKK',role:'High-growth disruptive innovation themes',barColor:'var(--color-accent-700)'},
      {asset:'Semiconductors & Hardware',weight:20,ticker:'SMH',role:'Foundational hardware powering global tech',barColor:'var(--color-neutral-500)'},
      {asset:'Digital Store of Value',weight:15,ticker:'IBIT',role:'Direct spot exposure to digital asset networks',barColor:'var(--color-neutral-300)'},
    ]},
  { id: 'dalio', name: 'Ray Dalio', shortName: 'Macro Architect', archetype: 'The Macro Architect', icon: Scale, compatibility: 91, charImage: '/personas/dalio.png', headImage: '/personas/dalio-head.png',
    resultCopy: "You approach investing as a complex, interconnected machine governed by credit cycles, inflation shifts, and structural macro trends. Like Ray Dalio, your priority is risk parity and radical diversification — a balanced, All-Weather portfolio engineered to hold up across every stage of the economic cycle.",
    traits: [{label:'Structural Balance',pct:96},{label:'Macro Discipline',pct:91},{label:'Inflation Defense',pct:87}],
    portfolio: [
      {asset:'Global Total Equity Market',weight:30,ticker:'VT',role:'Complete global market-cap exposure',barColor:'var(--color-accent)'},
      {asset:'Intermediate Treasuries & Bonds',weight:35,ticker:'BND',role:'Fixed income ballast for market shocks',barColor:'var(--color-neutral-500)'},
      {asset:'Hard Assets & Gold',weight:20,ticker:'GLD',role:'Store of value and macro crisis hedge',barColor:'var(--color-neutral-300)'},
      {asset:'Inflation-Protected Securities',weight:15,ticker:'TIP',role:'Treasury inflation-indexed protection',barColor:'var(--color-neutral-200)'},
    ]},
  { id: 'lynch', name: 'Peter Lynch', shortName: 'Everyday Observer', archetype: 'The Everyday Observer', icon: Store, compatibility: 90, charImage: '/personas/lynch.png', headImage: '/personas/lynch-head.png',
    resultCopy: "You believe the best research doesn't happen in boardrooms, but in daily life. Like Peter Lynch, you spot consumer shifts and brand loyalty in the real world long before institutional analysts catch on — investing in what you understand, in scalable growth engines with room to multiply.",
    traits: [{label:'Practical Observation',pct:94},{label:'Mid-Cap Growth Bias',pct:89},{label:'Fundamental Clarity',pct:86}],
    portfolio: [
      {asset:'Consumer Discretionary Brands',weight:40,ticker:'XLY',role:'High-conviction consumer and retail leaders',barColor:'var(--color-accent)'},
      {asset:'US Mid-Cap Growth Equities',weight:30,ticker:'VO',role:'Mid-sized companies with long growth runways',barColor:'var(--color-neutral-500)'},
      {asset:'Broad Market Base',weight:20,ticker:'VTI',role:'Core diversified US equity exposure',barColor:'var(--color-neutral-300)'},
      {asset:'High-Yield Liquidity Buffer',weight:10,ticker:'SGOV',role:'Flexible cash reserve for opportunities',barColor:'var(--color-neutral-200)'},
    ]},
  { id: 'simons', name: 'Jim Simons', shortName: 'Quant Alchemist', archetype: 'The Quant Alchemist', icon: Atom, compatibility: 95, charImage: '/personas/simons.png', headImage: '/personas/simons-head.png',
    resultCopy: "You trust cold data and backtested models over gut feel or media narratives. Like Jim Simons, you view markets as a high-dimensional math problem best navigated by stripping emotion out of execution — systematic factor tilts and automated rebalancing that compound without hesitation.",
    traits: [{label:'Data Objectivity',pct:98},{label:'Factor Tilt Preference',pct:93},{label:'Systematic Execution',pct:95}],
    portfolio: [
      {asset:'US Quality Factor',weight:30,ticker:'QUAL',role:'High ROE, low-leverage balance sheet screen',barColor:'var(--color-accent)'},
      {asset:'Small-Cap Value Factor',weight:25,ticker:'AVUV',role:'Fama-French small-cap value premium',barColor:'var(--color-accent-700)'},
      {asset:'Momentum Factor',weight:25,ticker:'MTUM',role:'Systematic exposure to price momentum',barColor:'var(--color-neutral-500)'},
      {asset:'Managed Futures & Trend',weight:20,ticker:'DBMF',role:'Trend-following, uncorrelated alpha',barColor:'var(--color-neutral-300)'},
    ]},
  { id: 'templeton', name: 'Sir John Templeton', shortName: 'Global Contrarian', archetype: 'The Global Contrarian', icon: Globe, compatibility: 92, charImage: '/personas/templeton.png', headImage: '/personas/templeton-head.png',
    resultCopy: "You have the courage to buy when others are selling in panic, and to search where no one else is looking. Like Sir John Templeton, maximum pessimism creates maximum opportunity — hunting across borders and unloved sectors for deeply mispriced assets poised for mean reversion.",
    traits: [{label:'Contrarian Instincts',pct:96},{label:'Global Perspective',pct:92},{label:'Valuation Rigor',pct:88}],
    portfolio: [
      {asset:'International Total Market',weight:35,ticker:'VXUS',role:'Developed and emerging markets outside the US',barColor:'var(--color-accent)'},
      {asset:'Small-Cap International Value',weight:25,ticker:'VSS',role:'Undervalued global small-cap equities',barColor:'var(--color-accent-700)'},
      {asset:'US Deep Value Equities',weight:25,ticker:'VTV',role:'Low P/E, low price-to-book US value',barColor:'var(--color-neutral-500)'},
      {asset:'Global Debt & Liquidity',weight:15,ticker:'BNDX',role:'Investment-grade international bonds',barColor:'var(--color-neutral-300)'},
    ]},
];

export const QUESTIONS: Question[] = [
  { text: "How do you choose a restaurant in a new city?", options: [
    {persona:'buffett', label:"I go to the century-old local staple that's been packed every night for 40 years."},
    {persona:'wood', label:"I hunt down the hyper-experimental pop-up trending on social media right now."},
    {persona:'dalio', label:"I look for a balanced menu with options for everyone in my group, no exceptions."},
    {persona:'lynch', label:"I follow the line of locals queuing around the block before tourist blogs catch on."},
  ]},
  { text: "What's your relationship with your phone upgrade cycle?", options: [
    {persona:'templeton', label:"I keep the same phone until it dies — waiting for rock bottom is second nature."},
    {persona:'simons', label:"I pre-order the newest flagship the moment the specs justify it."},
    {persona:'dalio', label:"I get a reliable mid-tier phone on a structured contract — predictable, no surprises."},
    {persona:'lynch', label:"I hunt for a refurbished premium model — 90% of the features at half the price."},
  ]},
  { text: "You're planning a two-week vacation. What's your itinerary style?", options: [
    {persona:'simons', label:"A data-driven spreadsheet with contingencies for weather, traffic, and delays."},
    {persona:'templeton', label:"One-way ticket to a destination most people are too nervous to visit right now."},
    {persona:'buffett', label:"A quiet cabin, no cell service, a stack of books, and zero plans to change."},
    {persona:'wood', label:"A high-energy tour through tech hubs, galleries, and the next big cultural scene."},
  ]},
  { text: "A viral debate breaks out online. What do you do?", options: [
    {persona:'buffett', label:"Ignore it completely — most of it is noise designed to steal my attention."},
    {persona:'lynch', label:"Read every comment — there's a real shift happening under the surface."},
    {persona:'dalio', label:"Break down both sides objectively to find the incentives driving each camp."},
    {persona:'templeton', label:"Take the side everyone's dismissing, on principle."},
  ]},
  { text: "What's your real motivation for building wealth?", options: [
    {persona:'dalio', label:"Total independence — never having to answer to anyone, ever."},
    {persona:'wood', label:"Funding the future I actually want to live in."},
    {persona:'simons', label:"Solving the puzzle and optimizing my own performance score."},
    {persona:'lynch', label:"Spotting what everyone else missed, and being proven right."},
  ]},
  { text: "A rumor about a hot stock is everywhere. What's your move?", options: [
    {persona:'buffett', label:"I don't touch what I can't explain to a ten-year-old."},
    {persona:'wood', label:"I dig in obsessively — this could be the next paradigm shift."},
    {persona:'dalio', label:"I check it against my risk framework before I feel anything."},
    {persona:'simons', label:"I trust the data and the backtest, not the noise."},
  ]},
  { text: "Your ideal weekend project?", options: [
    {persona:'lynch', label:"Wandering a mall or market, noting which stores are always packed."},
    {persona:'templeton', label:"Researching a country or asset everyone else is avoiding."},
    {persona:'simons', label:"Building a spreadsheet model to optimize some part of my life."},
    {persona:'wood', label:"Falling down a rabbit hole on the newest AI or biotech breakthrough."},
  ]},
  { text: "When making a big decision, what matters most?", options: [
    {persona:'buffett', label:"Will I still be glad about this in ten years?"},
    {persona:'dalio', label:"Have I stress-tested every possible outcome?"},
    {persona:'templeton', label:"Is everyone avoiding this for the wrong reasons?"},
    {persona:'lynch', label:"Does this match what I'm already seeing with my own eyes?"},
  ]},
];
