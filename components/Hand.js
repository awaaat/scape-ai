import { Building2, UserRound, Compass, Code2, ClipboardCheck, Database, Plug, LineChart, Users, Server, ShieldCheck, Bot } from 'lucide-react';
const teams = [[Compass,'Strategy'],[Code2,'Development'],[ClipboardCheck,'Evaluation'],[Database,'Data'],[Plug,'Integration'],[LineChart,'Analytics'],[Users,'Talent'],[Server,'Managed'],[ShieldCheck,'Governance']];
const P = ({ s = 22 }) => <span className="av" style={{ width: s, height: s }}><UserRound size={s * .6} /></span>;
export default function Hand() {
  return (<div className="hs">
    <div className="hs-top"><div className="hs-pill g">Your company</div><i className="hs-line" /><div className="hs-pill b"><b>Scape</b>.AI</div></div>
    <div className="hs-body">
      <div className="hs-col l"><div className="hs-box"><p>Scape forward-deployed engineers and integrators</p><div className="avs"><P s={26}/><P s={26}/><P s={26}/></div></div>
        <div className="org"><b>Your organization</b><Building2 size={64} strokeWidth={1} />{[0,1,2,3,4].map(i => <span key={i} className={`o o${i}`}><P s={22}/></span>)}</div></div>
      <div className="hs-col m"><h4>Scape workstation</h4><p>The control center for connecting and operating any mix of models, tools and platforms, whatever the vendor.</p>
        <div className="ws"><div className="wsb"><i/></div><div className="wsg"><span/><span className="h"/><span/><span/><span/></div><div className="wsr"><span/><span/><span/></div></div></div>
      <div className="hs-col m"><h4>Scape AI stack</h4><p>Eight service lines you can use together or separately, with one team accountable for the whole.</p>
        <div className="comp"><em>Components</em>{teams.slice(0, 9).map(([I, n]) => <span key={n}><I size={20} strokeWidth={1.5} />{n}</span>)}</div></div>
      <div className="hs-col r"><div className="cmd"><span className="av big"><Bot size={26}/></span><b>Delivery lead</b></div><h5>Specialist teams per category</h5>
        <div className="tg">{teams.map(([I, n], i) => <div className="tm" key={n} style={{ '--i': i }}><div className="th"><span>{n}<br/>team</span><I size={18} strokeWidth={1.5}/></div><div className="avs"><P/><P/><P/></div></div>)}</div></div>
    </div></div>);
}
