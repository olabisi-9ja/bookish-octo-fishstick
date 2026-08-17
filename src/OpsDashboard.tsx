import { useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck,
  Banknote, BarChart3, Bell, CarFront, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleDollarSign, Clock3, Command, CreditCard, FileCheck2, Gauge, Headphones, LayoutDashboard,
  MapPin, Menu, MessageSquare, MoreHorizontal, Route, Search, Settings, ShieldAlert, ShieldCheck,
  Siren, SlidersHorizontal, Star, UserCheck, Users, WalletCards, X, Zap,
} from 'lucide-react';
import Brand from './components/Brand';
import { Avatar, Toast } from './components/UI';

type Props = { onExit: () => void; onApp: () => void };

type OpsNavItem = { label: string; icon: typeof LayoutDashboard; active?: boolean; count?: string; danger?: boolean };

const nav: { group: string; items: OpsNavItem[] }[] = [
  { group: 'OVERVIEW', items: [{label:'Control centre',icon:LayoutDashboard,active:true},{label:'Live trips',icon:Route,count:'38'},{label:'Analytics',icon:BarChart3}]},
  { group: 'MARKETPLACE', items: [{label:'Users',icon:Users},{label:'Drivers',icon:CarFront},{label:'Communities',icon:UserCheck},{label:'Pricing',icon:CircleDollarSign}]},
  { group: 'OPERATIONS', items: [{label:'Verification',icon:FileCheck2,count:'12'},{label:'Safety',icon:ShieldAlert,count:'2',danger:true},{label:'Disputes',icon:MessageSquare,count:'5'}]},
  { group: 'FINANCE', items: [{label:'Payments',icon:CreditCard},{label:'Payouts',icon:WalletCards}]},
];

export default function OpsDashboard({ onExit, onApp }: Props) {
  const [menu,setMenu]=useState(false);
  const [toast,setToast]=useState('');
  const [incidentOpen,setIncidentOpen]=useState(true);
  const [period,setPeriod]=useState('Today');
  const notify=(s:string)=>{setToast(s);setTimeout(()=>setToast(''),2400)};
  return <div className="ops-app">
    <aside className={`ops-sidebar ${menu?'open':''}`}>
      <div className="ops-brand"><button onClick={onExit}><Brand inverse/></button><span>OPS</span><button className="ops-close" onClick={()=>setMenu(false)}><X/></button></div>
      <nav>{nav.map(g=><div className="ops-nav-group" key={g.group}><span>{g.group}</span>{g.items.map(({label,icon:Icon,active,count,danger})=><button key={label} className={`${active?'active':''} ${danger?'danger':''}`} onClick={()=>notify(`${label} module opened`)}><Icon size={17}/><em>{label}</em>{count&&<i>{count}</i>}</button>)}</div>)}</nav>
      <div className="ops-system"><div><span/><strong>All systems operational</strong></div><small>Last checked 10:42:08</small></div>
      <button className="ops-user"><Avatar initials="KA" color="#425c91" size={37}/><span><strong>Kemi A.</strong><small>Operations lead</small></span><MoreHorizontal/></button>
    </aside>
    {menu&&<div className="side-scrim" onClick={()=>setMenu(false)}/>}
    <section className="ops-workspace">
      <header className="ops-topbar"><div><button className="ops-menu" onClick={()=>setMenu(true)}><Menu/></button><span>Operations</span><ChevronRight/><strong>Control centre</strong></div><div><button className="ops-search"><Search/><span>Search users, trips, payments...</span><kbd>⌘ K</kbd></button><button className="ops-icon"><Bell/><i>3</i></button><button className="ops-icon"><Settings/></button><button className="view-product" onClick={onApp}>View product <ArrowRight/></button></div></header>
      <main className="ops-page">
        <div className="ops-page-head"><div><span>MONDAY · 17 AUGUST 2026 · 10:42 WAT</span><h1>Marketplace control centre</h1><p>Real-time health across PadiGo's Lagos corridors.</p></div><div className="ops-head-actions"><button className="period-button" onClick={()=>setPeriod(period==='Today'?'This week':'Today')}><Clock3/>{period}<ChevronDown/></button><button className="ops-primary" onClick={()=>notify('Daily report exported')}><BarChart3/>Export report</button></div></div>
        {incidentOpen&&<div className="incident-banner"><span className="incident-icon"><Siren/></span><div><span>ACTIVE SAFETY REVIEW</span><strong>Route deviation detected · Trip #PG-4902</strong><p>Driver deviated 2.4 km from expected corridor near Third Mainland Bridge. Rider responded “I’m okay.”</p></div><div><small>OPEN FOR</small><strong>03:18</strong></div><button onClick={()=>notify('Safety case opened')}>Open incident <ArrowRight/></button><button className="dismiss-incident" onClick={()=>setIncidentOpen(false)}><X/></button></div>}
        <div className="ops-stats">
          <Metric icon={<Route/>} label="ACTIVE TRIPS" value="38" sub="106 people moving" trend="+12%" good />
          <Metric icon={<Zap/>} label="COMPLETED TODAY" value="284" sub="74.2% seat fill" trend="+8.4%" good />
          <Metric icon={<Gauge/>} label="MATCH RATE" value="78.6%" sub="Search to match" trend="+2.1%" good />
          <Metric icon={<CircleDollarSign/>} label="TODAY'S GBV" value="₦684k" sub="₦68.4k revenue" trend="+14%" good />
          <Metric icon={<AlertTriangle/>} label="NEEDS ATTENTION" value="19" sub="12 checks · 5 disputes" trend="2 urgent" warning />
        </div>
        <div className="ops-main-grid">
          <section className="ops-panel live-panel"><PanelHead eyebrow="LIVE MARKETPLACE" title="Trips in progress" sub="38 active · Updated just now" action={<><span className="live-status"><i/>Live</span><button onClick={()=>notify('Live trips opened')}>View all <ArrowRight/></button></>}/><div className="ops-map"><OpsMap/><div className="map-cluster mc1">8</div><div className="map-cluster mc2">14</div><div className="map-cluster mc3">5</div><span className="trip-dot td1"/><span className="trip-dot td2"/><span className="trip-dot td3 warning"/><div className="ops-map-card"><div><span><i className="normal"/>IN PROGRESS</span><small>#PG-8321</small></div><strong>Ajah <ArrowRight/> Victoria Island</strong><p><Avatar initials="AB" color="#c87451" size={27}/> Ade B. · 3 riders</p><span>ETA · 18 MIN</span></div><div className="map-legend"><span><i/>Normal</span><span><i className="delayed"/>Delayed</span><span><i className="review"/>Review</span></div></div></section>
          <section className="ops-panel corridor-panel"><PanelHead eyebrow="MARKET LIQUIDITY" title="Corridor health" sub="Morning window · 6:00–10:00 AM" action={<button><SlidersHorizontal/></button>}/><div className="corridor-head"><span>CORRIDOR</span><span>DEMAND / SEATS</span><span>FILL</span><span>STATUS</span></div><Corridor name="Ajah → VI" demand={184} seats={126} fill={82} status="Supply gap" warn/><Corridor name="Ikeja → VI" demand={96} seats={104} fill={71} status="Balanced"/><Corridor name="Yaba → Lekki" demand={73} seats={68} fill={79} status="Healthy"/><Corridor name="Berger → VI" demand={88} seats={42} fill={91} status="Critical gap" danger/><Corridor name="Ikorodu → Ikeja" demand={51} seats={60} fill={64} status="Building"/><button className="panel-bottom-button">Open liquidity analytics <ArrowRight/></button></section>
        </div>
        <div className="ops-second-grid">
          <section className="ops-panel performance-panel"><PanelHead eyebrow="COMPLETION FUNNEL" title="Today's marketplace" sub="1,842 ride searches" action={<select><option>Today</option><option>This week</option></select>}/><div className="funnel"><div><span>SEARCHES</span><strong>1,842</strong><i><em style={{width:'100%'}}/></i><small>100%</small></div><ArrowDownRight/><div><span>MATCHED</span><strong>1,448</strong><i><em style={{width:'78.6%'}}/></i><small>78.6%</small></div><ArrowDownRight/><div><span>BOOKED</span><strong>522</strong><i><em style={{width:'54%'}}/></i><small>36.0%</small></div><ArrowDownRight/><div><span>COMPLETED</span><strong>284</strong><i><em style={{width:'34%'}}/></i><small>54.4%</small></div></div><div className="funnel-note"><TrendingBadge/> <span><strong>Booking conversion is up 4.2%</strong> after reducing Ajah pickup radius to 1.2 km.</span></div></section>
          <section className="ops-panel queue-panel"><PanelHead eyebrow="ACTION QUEUE" title="Needs your team" sub="19 open items" action={<button>View queue <ArrowRight/></button>}/><QueueRow icon={<ShieldAlert/>} color="red" title="Safety reviews" detail="1 urgent · 1 awaiting follow-up" count="2"/><QueueRow icon={<FileCheck2/>} color="amber" title="Driver verifications" detail="Oldest waiting 46 minutes" count="12"/><QueueRow icon={<MessageSquare/>} color="purple" title="Open disputes" detail="₦18,500 total at risk" count="5"/><QueueRow icon={<Banknote/>} color="blue" title="Payout exceptions" detail="All cleared" count="0" muted/></section>
        </div>
        <section className="ops-panel verification-table"><PanelHead eyebrow="VERIFICATION OPS" title="Recent driver applications" sub="12 waiting for review" action={<div className="table-actions"><button><SlidersHorizontal/>Filter</button><button onClick={()=>notify('Verification queue opened')}>Open full queue <ArrowRight/></button></div>}/><div className="ops-table"><div className="ops-tr th"><span>APPLICANT</span><span>VEHICLE</span><span>DOCUMENTS</span><span>RISK</span><span>WAITING</span><span>ACTION</span></div><Applicant initials="FE" color="#6b58a3" name="Femi Eze" phone="0803 ••• 8842" vehicle="Toyota Camry · LSR 204 FT" docs="5 of 6 checked" risk="Low" time="18 min" notify={notify}/><Applicant initials="BN" color="#bc7352" name="Bola Nwankwo" phone="0812 ••• 1409" vehicle="Honda Accord · KJA 918 GE" docs="4 of 6 checked" risk="Review" time="31 min" notify={notify}/><Applicant initials="ML" color="#34796a" name="Musa Lawal" phone="0706 ••• 2391" vehicle="Kia Rio · GGE 774 BX" docs="6 of 6 checked" risk="Low" time="46 min" notify={notify}/></div></section>
      </main>
    </section>
    <Toast visible={!!toast} message={toast}/>
  </div>
}

function Metric({icon,label,value,sub,trend,good,warning}:{icon:React.ReactNode;label:string;value:string;sub:string;trend:string;good?:boolean;warning?:boolean}){return <article className={`ops-metric ${warning?'warning':''}`}><div><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span></div><strong>{value}</strong><p>{sub}<span className={good?'good':warning?'warn':''}>{good?<ArrowUpRight/>:warning?<AlertTriangle/>:null}{trend}</span></p></article>}
function PanelHead({eyebrow,title,sub,action}:{eyebrow:string;title:string;sub:string;action:React.ReactNode}){return <div className="ops-panel-head"><div><span>{eyebrow}</span><h2>{title}</h2><p>{sub}</p></div><div>{action}</div></div>}
function Corridor({name,demand,seats,fill,status,warn,danger}:{name:string;demand:number;seats:number;fill:number;status:string;warn?:boolean;danger?:boolean}){return <div className="corridor-row"><strong>{name}</strong><div><span><b>{demand}</b> / {seats}</span><i><em style={{width:`${Math.min(100,seats/demand*100)}%`}}/></i></div><strong>{fill}%</strong><span className={`corridor-status ${danger?'danger':warn?'warn':''}`}><i/>{status}</span></div>}
function QueueRow({icon,color,title,detail,count,muted}:{icon:React.ReactNode;color:string;title:string;detail:string;count:string;muted?:boolean}){return <button className={`queue-row ${muted?'muted':''}`}><span className={color}>{icon}</span><div><strong>{title}</strong><small>{detail}</small></div><b>{count}</b><ChevronRight/></button>}
function Applicant({initials,color,name,phone,vehicle,docs,risk,time,notify}:{initials:string;color:string;name:string;phone:string;vehicle:string;docs:string;risk:string;time:string;notify:(s:string)=>void}){return <div className="ops-tr"><span className="applicant"><Avatar initials={initials} color={color} size={35}/><em><strong>{name}</strong><small>{phone}</small></em></span><span><strong>{vehicle.split(' · ')[0]}</strong><small>{vehicle.split(' · ')[1]}</small></span><span className="doc-progress"><strong>{docs}</strong><i><em style={{width:docs.startsWith('6')?'100%':docs.startsWith('5')?'83%':'66%'}}/></i></span><span><i className={`risk-tag ${risk==='Review'?'review':''}`}><b/>{risk}</i></span><span><Clock3/>{time}</span><span><button onClick={()=>notify(`${name}'s application opened`)}>Review <ArrowRight/></button></span></div>}
function TrendingBadge(){return <span className="trending-badge"><ArrowUpRight/></span>}
function OpsMap(){return <><span className="om-water"/><span className="om-road r1"/><span className="om-road r2"/><span className="om-road r3"/><span className="om-road r4"/><span className="om-block b1"/><span className="om-block b2"/><span className="om-block b3"/><span className="om-label l1">AJAH</span><span className="om-label l2">VICTORIA ISLAND</span><span className="om-label l3">IKEJA</span><span className="om-label l4">YABA</span><svg viewBox="0 0 700 430"><path d="M620 370 C520 318 470 363 388 292 S270 205 172 217 S102 102 60 75"/><path d="M94 342 C181 275 235 315 312 245 S430 166 552 124"/></svg></>}
