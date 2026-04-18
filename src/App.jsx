import { useState } from "react";

const S = {
  usage: ["Bureaux","Logements collectifs","Hôtel","Centre commercial / Retail","Enseignement / Université","Hospitalier / Santé","Industriel / Entrepôt","Mixte bureaux + logements","Parking couvert","Équipement sportif"],
  ss: ["Aucun","1 sous-sol","2 sous-sols","3 sous-sols"],
  etages: ["RDC seul","RDC + R+1","RDC + R+1 + R+2","R+3","R+4","R+5","R+6","R+7","R+8","R+9","R+10","R+12","R+14","R+16"],
  toiture: ["Terrasse inaccessible","Terrasse accessible","Terrasse technique","Combles non aménagés"],
  forme: ["Rectangulaire régulière","Carrée","En L","En U","Complexe / Irrégulière"],
  trameX: [4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,10,11,12,14],
  trameY: [4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,10,11,12,14],
  regularite: ["Régulière","Légèrement irrégulière","Irrégulière"],
  qExpl: [
    {v:"1.5",l:"1.5 — Logements"},
    {v:"2.0",l:"2.0 — Logements charges élevées"},
    {v:"2.5",l:"2.5 — Bureaux légers"},
    {v:"3.0",l:"3.0 — Bureaux standard"},
    {v:"3.5",l:"3.5 — Bureaux lourds"},
    {v:"4.0",l:"4.0 — Salles réunion / ERP"},
    {v:"5.0",l:"5.0 — Salles polyvalentes"},
    {v:"6.0",l:"6.0 — Commerces RDC"},
    {v:"7.5",l:"7.5 — Industriel léger"},
    {v:"10.0",l:"10.0 — Stockage / Entrepôt"},
  ],
  qToit: [
    {v:"0",l:"0 — Inaccessible"},
    {v:"1.0",l:"1.0 — Entretien seul"},
    {v:"2.5",l:"2.5 — Terrasse accessible"},
    {v:"3.5",l:"3.5 — Jardin / charges lourdes"},
  ],
  surcharge: ["Aucune","Cloisons mobiles +1.2 kN/m²","Faux plancher +0.5 kN/m²","Archives lourdes +4 kN/m²","Groupes froids toiture","Panneaux solaires toiture"],
  hauteur: [2.5,2.7,2.8,3.0,3.2,3.5,4.0,4.5,5.0,6.0],
  intrados: ["Lisse (dalle plate)","Retombées acceptées","Retombées partielles"],
  console: [
    {v:"0",l:"Sans console"},
    {v:"0.8",l:"0.80 m"},
    {v:"1.0",l:"1.00 m"},
    {v:"1.2",l:"1.20 m"},
    {v:"1.5",l:"1.50 m"},
    {v:"2.0",l:"2.00 m"},
    {v:"2.5",l:"2.50 m"},
    {v:"3.0",l:"3.00 m"},
    {v:"4.0",l:"4.00 m"},
    {v:"5.0",l:"5.00 m"},
  ],
  petitCote: ["20 cm","25 cm","30 cm","35 cm","40 cm","Libre (pas de contrainte)"],
  formePoteau: ["Carré","Rectangulaire","Circulaire","Voile acceptable si surdimensionné"],
  contrainteArchi: ["Non","Oui — intégration mobilier","Oui — façade","Oui — flux / circulation"],
  sol: [
    {v:"Bon sol — portance >300 kPa",l:"Bon sol — portance >300 kPa"},
    {v:"Sol moyen — portance 150-300 kPa",l:"Sol moyen — 150–300 kPa"},
    {v:"Sol médiocre — portance 80-150 kPa",l:"Sol médiocre — 80–150 kPa"},
    {v:"Sol mauvais — portance <80 kPa",l:"Sol mauvais — <80 kPa"},
  ],
  nappe: ["Éloignée (>5 m)","À 2–5 m","Proche (<2 m)"],
  norme: ["Eurocodes EC0/1/2/7","BAEL91 + EC charges","ACI 318"],
  sismicite: ["Zone non sismique","Faible ag=0.05g","Modérée ag=0.1g","Élevée ag>0.15g"],
};

const DEFAULTS = {
  usage:"Bureaux", ss:"Aucun", etages:"RDC + R+1 + R+2", toiture:"Terrasse inaccessible",
  surface:"500", forme:"Rectangulaire régulière",
  trameX:"6", trameY:"6", regularite:"Régulière",
  qExpl:"2.5", qToit:"1.0", surcharge:"Aucune",
  hauteur:"2.8", intrados:"Lisse (dalle plate)", console:"0",
  petitCote:"25 cm", formePoteau:"Rectangulaire", contrainteArchi:"Non",
  sol:"Sol moyen — portance 150-300 kPa", nappe:"Éloignée (>5 m)", norme:"Eurocodes EC0/1/2/7", sismicite:"Zone non sismique",
};

function Sel({ id, opts, value, onChange, subLabel }) {
  const options = Array.isArray(opts)
    ? opts.map(o => typeof o === "object" ? o : { v: String(o), l: String(o) })
    : opts.map(o => ({ v: o.v, l: o.l }));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      {subLabel && <span style={{ fontFamily:"monospace", fontSize:"0.68rem", color:"#7a7068", letterSpacing:"0.04em", textTransform:"uppercase" }}>{subLabel}</span>}
      <div style={{ position:"relative" }}>
        <select value={value} onChange={e => onChange(id, e.target.value)}
          style={{ width:"100%", padding:"9px 32px 9px 11px", background:"#f5f2eb", border:"1.5px solid #d0c9bc", color:"#0d0d0d", fontFamily:"monospace", fontSize:"0.82rem", appearance:"none", cursor:"pointer", borderRadius:0 }}>
          {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#9a9088" }}>▾</span>
      </div>
    </div>
  );
}

function Block({ num, title, children }) {
  return (
    <div style={{ background:"#fff", border:"1.5px solid #d0c9bc", padding:"20px 20px 18px", position:"relative" }}>
      <div style={{ position:"absolute", top:-1, left:-1, background:"#1a4fc8", color:"#fff", fontFamily:"monospace", fontSize:"0.65rem", padding:"2px 9px", letterSpacing:"0.05em" }}>{num.toString().padStart(2,"0")}</div>
      <div style={{ fontWeight:800, fontSize:"0.8rem", textTransform:"uppercase", letterSpacing:"0.07em", margin:"18px 0 14px", color:"#0d0d0d" }}>{title}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:12 }}>{children}</div>
    </div>
  );
}

function etagesCount(e) {
  const m = {"RDC seul":1,"RDC + R+1":2,"RDC + R+1 + R+2":3,"R+3":4,"R+4":5,"R+5":6,"R+6":7,"R+7":8,"R+8":9,"R+9":10,"R+10":11,"R+12":13,"R+14":15,"R+16":17};
  return m[e]||3;
}

function buildPrompt(d) {
  const nb = etagesCount(d.etages);
  const tx = parseFloat(d.trameX), ty = parseFloat(d.trameY);
  return `PROJET STRUX — ANALYSE COMPLÈTE
DONNÉES :
- Usage : ${d.usage}
- Niveaux : ${d.ss} + ${d.etages} + Toiture : ${d.toiture} (~${nb} niveaux porteurs)
- Surface / niveau : ${d.surface} m² | Forme : ${d.forme}
- Trame : ${tx}×${ty} m (S_trib=${(tx*ty).toFixed(1)} m²) | Régularité : ${d.regularite}
- Q courant : ${d.qExpl} kN/m² | Q toiture : ${d.qToit} kN/m² | Surcharge : ${d.surcharge}
- Hauteur libre : ${d.hauteur} m | Intrados : ${d.intrados} | Console : ${d.console} m
- Poteau petit côté max : ${d.petitCote} | Forme : ${d.formePoteau} | Contrainte archi : ${d.contrainteArchi}
- Sol : ${d.sol} | Nappe : ${d.nappe} | Norme : ${d.norme} | Sismicité : ${d.sismicite}

HYPOTHÈSES FIXES :
- G_rev = 2.0 kN/m² (revêtements + cloisons + faux plafond)
- Béton C25/30 (fcd=16.7 MPa), acier FeE500 (fyd=435 MPa), ρ=1.5%
- Sol portance 150-200 kPa si non précisé

SÉQUENCE :
ÉTAPE 1 — CHARGES : G_tot = PP(h×25)+2.0 | q_Ed = 1.35×G + 1.5×Q
ÉTAPE 2 — DALLE :
  INTRADOS IMPOSÉ = "${d.intrados}"
  → Si "Lisse (dalle plate)" : dalle plate OBLIGATOIRE. Interdiction surépaisseur/retombée.
    Solutions si sous-dimensionnée : capitels, précontrainte, voile intermédiaire, augmentation section poteau.
    Épaisseur L/d=26 (BA) ou 30 (PT). Console L_c/d=8 (BA)/12 (PT).
  → Si retombées acceptées : poutre-dalle ou nervurée selon portée.
  Recalcul PP si écart>5%. Vérifier poinçonnement EC2§6.4.
ÉTAPE 3 — POTEAUX :
  N_Ed = q_Ed×${(tx*ty).toFixed(1)}×${nb}+200 kN
  Grand côté b = N_Ed/(0.8×a×(fcd+ρ×fyd))
  Petit côté a = ${d.petitCote}
  RÈGLE ABSOLUE : b≤4×a
  → Si b>4×a : Option1=augmenter a (si archi=${d.contrainteArchi} le permet) | Option2=voile BA (si archi forte). Justifier le choix.
  Vérifier élancement EC2§5.8 (hauteur libre=${d.hauteur}m).
ÉTAPE 4 — FONDATIONS :
  Emprise=${d.surface}m². Sol=${d.sol}. Nappe=${d.nappe}.
  1) Semelle isolée → si dim>0.5×trame : inadapté
  2) Radier → q_moy=charges/emprise vs portance
  3) Pieux uniquement si sol<80kPa ou nappe proche ou soutènement

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{"hypotheses":["..."],"resultats":[{"element":"...","systeme":"...","params":"...","statut":"ok|warn|alt"}],"vigilance":[{"titre":"...","detail":"..."}]}
Maximum 3 vigilances.`;
}

function StatusBadge({ s }) {
  const cfg = {
    ok: { bg:"#e6f4ec", color:"#1a7a3c", border:"#b2ddc2", label:"✓ OK" },
    warn: { bg:"#fff3e0", color:"#b85c00", border:"#ffd090", label:"⚠ ATT." },
    alt: { bg:"#eef2ff", color:"#1a4fc8", border:"#c0cdf8", label:"↳ ALT" },
  }[s] || { bg:"#f0f0f0", color:"#666", border:"#ccc", label:s };
  return <span style={{ display:"inline-block", fontFamily:"monospace", fontSize:"0.65rem", padding:"2px 8px", background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, marginLeft:6, verticalAlign:"middle" }}>{cfg.label}</span>;
}

export default function STRUX() {
  const [form, setForm] = useState(DEFAULTS);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function launch() {
    if (!form.usage) { alert("Sélectionner l'usage."); return; }
    setStatus("loading"); setResult(null); setErrMsg("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: "Tu es STRUX, ingénieur structures senior. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après.",
          messages: [{ role: "user", content: buildPrompt(form) }]
        })
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      const raw = json.content.map(b => b.text || "").join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
      setStatus("done");
    } catch (e) {
      setErrMsg(e.message);
      setStatus("error");
    }
  }

  const inp = { borderRadius:0, border:"1.5px solid #d0c9bc", padding:"9px 11px", fontFamily:"monospace", fontSize:"0.82rem", width:"100%", background:"#f5f2eb" };

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", background:"#f5f2eb", minHeight:"100vh" }}>
      <div style={{ background:"#0d0d0d", color:"#fff", padding:"24px 32px 18px", borderBottom:"3px solid #c8401a", display:"flex", alignItems:"baseline", gap:18 }}>
        <div style={{ fontSize:"2.2rem", fontWeight:900, letterSpacing:"-0.03em" }}>STR<span style={{color:"#c8401a"}}>U</span>X</div>
        <div style={{ fontFamily:"monospace", fontSize:"0.72rem", color:"#aaa", letterSpacing:"0.08em" }}>AGENT CONCEPTION STRUCTURELLE — APS/APD — EUROCODES</div>
      </div>
      <div style={{ maxWidth:1020, margin:"0 auto", padding:"32px 20px 60px" }}>
        <div style={{ display:"inline-block", background:"#c8401a", color:"#fff", fontFamily:"monospace", fontSize:"0.72rem", letterSpacing:"0.1em", padding:"5px 20px 5px 14px", marginBottom:28, clipPath:"polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)" }}>⬡ PHASE APS / APD</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
          <Block num={1} title="Usage du bâtiment">
            <Sel id="usage" subLabel="Usage" opts={S.usage} value={form.usage} onChange={set}/>
          </Block>
          <Block num={2} title="Composition verticale">
            <Sel id="ss" subLabel="Sous-sols" opts={S.ss} value={form.ss} onChange={set}/>
            <Sel id="etages" subLabel="Niveaux courants" opts={S.etages} value={form.etages} onChange={set}/>
            <Sel id="toiture" subLabel="Toiture" opts={S.toiture} value={form.toiture} onChange={set}/>
          </Block>
          <Block num={3} title="Surface & forme">
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <span style={{fontFamily:"monospace",fontSize:"0.68rem",color:"#7a7068",textTransform:"uppercase",letterSpacing:"0.04em"}}>Surface / niveau (m²)</span>
              <input type="number" value={form.surface} min={50} max={10000} step={50} onChange={e=>set("surface",e.target.value)} style={inp}/>
            </div>
            <Sel id="forme" subLabel="Forme en plan" opts={S.forme} value={form.forme} onChange={set}/>
          </Block>
          <Block num={4} title="Trame structurelle">
            <Sel id="trameX" subLabel="Trame X (m)" opts={S.trameX} value={form.trameX} onChange={set}/>
            <Sel id="trameY" subLabel="Trame Y (m)" opts={S.trameY} value={form.trameY} onChange={set}/>
            <Sel id="regularite" subLabel="Régularité" opts={S.regularite} value={form.regularite} onChange={set}/>
          </Block>
          <Block num={5} title="Charges d'exploitation">
            <Sel id="qExpl" subLabel="Q courant (kN/m²)" opts={S.qExpl} value={form.qExpl} onChange={set}/>
            <Sel id="qToit" subLabel="Q toiture (kN/m²)" opts={S.qToit} value={form.qToit} onChange={set}/>
            <Sel id="surcharge" subLabel="Surcharge spécifique" opts={S.surcharge} value={form.surcharge} onChange={set}/>
          </Block>
          <Block num={6} title="Hauteurs & intrados">
            <Sel id="hauteur" subLabel="Hauteur libre (m)" opts={S.hauteur} value={form.hauteur} onChange={set}/>
            <Sel id="intrados" subLabel="Intrados dalle" opts={S.intrados} value={form.intrados} onChange={set}/>
            <Sel id="console" subLabel="Console max (m)" opts={S.console} value={form.console} onChange={set}/>
          </Block>
          <Block num={7} title="Poteaux — contraintes archi">
            <Sel id="petitCote" subLabel="Petit côté max" opts={S.petitCote} value={form.petitCote} onChange={set}/>
            <Sel id="formePoteau" subLabel="Forme" opts={S.formePoteau} value={form.formePoteau} onChange={set}/>
            <Sel id="contrainteArchi" subLabel="Contrainte archi" opts={S.contrainteArchi} value={form.contrainteArchi} onChange={set}/>
          </Block>
          <Block num={8} title="Géotechnique & norme">
            <Sel id="sol" subLabel="Qualité sol" opts={S.sol} value={form.sol} onChange={set}/>
            <Sel id="nappe" subLabel="Nappe phréatique" opts={S.nappe} value={form.nappe} onChange={set}/>
            <Sel id="norme" subLabel="Norme" opts={S.norme} value={form.norme} onChange={set}/>
            <Sel id="sismicite" subLabel="Sismicité" opts={S.sismicite} value={form.sismicite} onChange={set}/>
          </Block>
        </div>
        <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={launch} disabled={status==="loading"} style={{ background:status==="loading"?"#888":"#c8401a", color:"#fff", fontWeight:800, fontSize:"1rem", letterSpacing:"0.04em", border:"none", padding:"15px 40px", cursor:status==="loading"?"not-allowed":"pointer", textTransform:"uppercase", clipPath:"polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)" }}>
            {status==="loading" ? "⏳ Calcul…" : "⬡ Lancer l'analyse STRUX"}
          </button>
          <button onClick={()=>{setForm(DEFAULTS);setStatus("idle");setResult(null);}} style={{ background:"none", border:"1.5px solid #d0c9bc", color:"#7a7068", fontFamily:"monospace", fontSize:"0.75rem", padding:"10px 20px", cursor:"pointer", letterSpacing:"0.06em" }}>↺ Réinitialiser</button>
        </div>
        {status==="error" && (
          <div style={{ marginTop:20, background:"#fff0ee", border:"1.5px solid #f5b0a0", borderLeft:"4px solid #c8401a", padding:"14px 18px", fontFamily:"monospace", fontSize:"0.8rem", color:"#c8401a" }}>
            Erreur : {errMsg}
          </div>
        )}
        {status==="done" && result && (
          <div style={{ marginTop:32 }}>
            <div style={{ background:"#0d0d0d", color:"#fff", padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
              <span style={{ fontWeight:800, fontSize:"0.95rem", letterSpacing:"0.07em", textTransform:"uppercase" }}>Résultats STRUX — {form.usage}</span>
              <span style={{ fontFamily:"monospace", fontSize:"0.68rem", color:"#aaa" }}>{form.trameX}×{form.trameY} m · {form.etages} · {form.surface} m²</span>
            </div>
            {result.hypotheses?.length > 0 && (
              <div style={{ background:"#fff8f0", border:"1.5px solid #e8c8a0", borderLeft:"4px solid #b85c00", padding:"14px 20px" }}>
                <div style={{ fontFamily:"monospace", fontSize:"0.7rem", letterSpacing:"0.1em", color:"#b85c00", marginBottom:8, textTransform:"uppercase" }}>Hypothèses retenues</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {result.hypotheses.map((h,i) => (
                    <span key={i} style={{ background:"#fff", border:"1px solid #e8c8a0", fontFamily:"monospace", fontSize:"0.72rem", padding:"4px 10px", color:"#b85c00" }}>{h}</span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.83rem", background:"#fff" }}>
                <thead>
                  <tr style={{ background:"#1a1a1a", color:"#fff" }}>
                    {["Élément","Système retenu","Paramètres clés"].map(h => (
                      <th key={h} style={{ fontFamily:"monospace", fontSize:"0.68rem", letterSpacing:"0.08em", padding:"12px 16px", textAlign:"left", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(result.resultats||[]).map((r,i) => (
                    <tr key={i} style={{ background:i%2===0?"#fff":"#faf9f6" }}>
                      <td style={{ padding:"11px 16px", fontFamily:"monospace", fontWeight:500, fontSize:"0.8rem", color:"#1a4fc8", whiteSpace:"nowrap", verticalAlign:"top", borderBottom:"1px solid #e8e4dc" }}>{r.element}</td>
                      <td style={{ padding:"11px 16px", fontWeight:700, verticalAlign:"top", borderBottom:"1px solid #e8e4dc" }}>{r.systeme}<StatusBadge s={r.statut}/></td>
                      <td style={{ padding:"11px 16px", fontFamily:"monospace", fontSize:"0.76rem", color:"#6b6560", verticalAlign:"top", borderBottom:"1px solid #e8e4dc", whiteSpace:"pre-wrap" }}>{r.params}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(result.vigilance||[]).length > 0 && (
              <div style={{ border:"1.5px solid #d0c9bc", background:"#fff" }}>
                <div style={{ background:"#c8401a", color:"#fff", fontFamily:"monospace", fontSize:"0.72rem", letterSpacing:"0.1em", padding:"10px 16px", textTransform:"uppercase" }}>Points de vigilance EXE</div>
                {result.vigilance.map((v,i) => (
                  <div key={i} style={{ display:"flex", gap:14, padding:"14px 20px", borderBottom:i<result.vigilance.length-1?"1px solid #e8e4dc":"none", alignItems:"flex-start" }}>
                    <div style={{ fontFamily:"monospace", fontWeight:700, fontSize:"1.1rem", color:"#c8401a", minWidth:28, lineHeight:1 }}>{i+1}</div>
                    <div style={{ fontSize:"0.84rem", lineHeight:1.6 }}><strong style={{color:"#c8401a"}}>{v.titre}</strong><br/>{v.detail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
