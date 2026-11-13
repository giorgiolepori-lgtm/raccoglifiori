'use strict';
/* ===== Personaggi: dati, frasi, pose delle scene ===== */
const talk = (t, len = 70) => t < len ? (Math.sin(t * .55) * .5 + .5) * .55 : 0;
const L = (text, pose, o) => Object.assign({ text, pose }, o || {});
const CHARS = [
  { id: 'alex', name: 'Alex', style: 'std', styleName: 'Standard, calci da calciatore', kickMul: 1.3, voice: 112, arenas: ['capoterra'],
    motive: 'Odia tutti e vuole picchiarli. Il premio? Lo butterà nel cesso, tanto i soldi non gli importano.',
    ending: { title: 'Alex è il più strano', text: 'Alex prende il premio, entra in bagno e butta tutti i soldi nel cesso. Tira lo sciacquone senza pensarci due volte.', scene: 'toilet' },
    lines: { intro: L('Che cazzo vuoi?!', 'alexIntro'), vs: { zonco: L('O zonco pezze merda', 'alexIntro') }, win: L('Sei scarso, ritirati', 'alexWin'), lose: L('Sei togo vabbè non ha senso giocare così', 'alexLose') } },
  { id: 'bruno', name: 'Bruno', style: 'mma', styleName: 'MMA', voice: 118, arenas: ['porto', 'maracalagonis'],
    motive: 'Vuole i soldi per comprare latte e menta e per finanziare il suo Cammino di Santiago.',
    ending: { title: 'Bruno è il più strano', text: 'Con il premio Bruno compra latte e menta per un anno intero e parte per il Cammino di Santiago.', scene: 'santiago' },
    lines: { intro: L('Preferivo lo skate notturno', 'shrugTalk'), win: L('', 'brunoLaugh', { fx: 'AHAHAHAH!', len: 280, fxBang: true }), lose: L('Che palle! Vabbè dai andiamo a prendere un latte e menta', 'sadTalk', { len: 220 }) } },
  { id: 'edo', name: 'Edo', style: 'muay', styleName: 'Muay Thai', voice: 124, arenas: ['musicisti', 'padova'],
    motive: 'Vuole allenarsi nel Muay Thai e psicoanalizzare i suoi avversari. Con i soldi farà progetti con l\'intelligenza artificiale.',
    ending: { title: 'Edo è il più strano', text: 'Con il premio Edo finanzia i suoi progetti con l\'intelligenza artificiale. Intanto continua ad allenarsi e a psicoanalizzare chiunque incontri.', scene: 'ai' },
    lines: { intro: L('Fra sei troppo strano, combattiamo!', 'pointTalk'), win: L('Dai fra sarà per la prossima volta', 'calmTalk'), lose: L('Cazzo fra ma sei gigante', 'lookUp') } },
  { id: 'pet', name: 'Pet', style: 'bjj', styleName: 'Brazilian Jiu Jitsu', voice: 110, arenas: ['banari'],
    motive: 'Vuole allenarsi nel jiu-jitsu e farsi una chillata. Con i soldi si comprerà dei campi.',
    ending: { title: 'Pet è il più strano', text: 'Pet si compra dei campi, si sdraia sull\'erba e finalmente si fa una bella chillata.', scene: 'fields' },
    lines: { intro: L('Fra Jujitsiamo', 'beckon'), win: L('Fra non eri abbastanza concentrato', 'fingerTemple'), lose: L('Sono entrato in vagotonia', 'dizzy') } },
  { id: 'zonco', name: 'Zonco', style: 'std', styleName: 'Standard, calci da calciatore', kickMul: 1.3, voice: 128, arenas: ['quartello'],
    motive: 'Al 98% non voleva partecipare, ma partecipa lo stesso. Con i soldi investirà sui social per dimostrare che Gio è più strano di lui.',
    ending: { title: 'Zonco è il più strano', text: 'Zonco investe tutto il premio sui social. Ora ha il video virale che lo dimostra: Gio è più strano di lui. Al 98%.', scene: 'social' },
    lines: { intro: L('Fra... c\'è il 98% di possibilità...', 'zoncoIntro', { len: 200 }), win: L('FAI SO', 'zoncoWin', { big: true }), lose: L('', 'zoncoPray', { len: 190 }) } },
  { id: 'josto', name: 'Josto', style: 'mma', styleName: 'MMA', voice: 120, arenas: ['colombo'],
    motive: 'Vuole usare il torneo per farsi promozione sui social e vincere i soldi per comprarsi attrezzatura video nuova. E poi lo trova divertente.',
    ending: { title: 'Josto è il più strano', text: 'Josto si compra tutta l\'attrezzatura video nuova. Il video del torneo è già il suo più visto.', scene: 'camera' },
    lines: { intro: L(op => 'Sei ' + op.def.name, 'pointTalk'), win: L('Hai perso', 'armsCross'), lose: L('Bravo fra vorrei capire', 'shrugTalk') } },
  { id: 'davidino', name: 'Davidino', style: 'kick', styleName: 'Kickboxing', voice: 106, arenas: ['niucrobu'],
    motive: 'Vuole allenarsi e usare i soldi per comprare attrezzi da palestra.',
    ending: { title: 'Davidino è il più strano', text: 'Davidino spende tutto il premio in attrezzi da palestra e torna subito ad allenarsi.', scene: 'gym' },
    lines: { intro: L('Vai Fra!', 'fistPump'), vs: { pet: L('Fra puoi smetterla di starnutire per un secondo?', 'shrugTalk'), josto: L('Fra perché conti così strano?', 'shrugTalk') },
      win: L('Fra devi migliorare nel polso', 'wristShow'), lose: L('Bravo fra si vede che ti sei allenato', 'clap') } },
  { id: 'gio', name: 'Gio', style: 'karate', styleName: 'Karate Shotokan', voice: 126, arenas: ['pitzeserra'],
    motive: 'Lo fa per ridere. Investirà tutti i soldi in slot machine, gratta e vinci ed ETF.',
    ending: { title: 'Gio è il più strano', text: 'Gio investe tutto il premio tra slot machine, gratta e vinci ed ETF. L\'ha fatto solo per ridere.', scene: 'slot' },
    lines: { intro: L('Dat', 'mogIntro', { delay: 200, len: 290 }), win: L('', 'mog', { fx: 'AURA +999999999', music: 'aura', len: 330 }), lose: L('Pesbi', 'shrugTalk') } },
];
for (const c of CHARS) { c.ready = true; c.costumes = AUS.meta[c.id].costumes; }
const CHAR = Object.fromEntries(CHARS.map(c => [c.id, c]));
const READY = CHARS.filter(c => c.ready);

/* pose delle scene (introduzione, vittoria, sconfitta, mosse speciali) */
function OVERRIDE_POSES(name, f, M) {
  const t = f.t, tt = t + M.acc / DT;
  switch (name) {
    case 'intro': return clonePose(GUARD);
    case 'idleWin': return P({ hip: [0, -.02, 0], yaw: .1, cy: 0, lh: [-.24, 1.0, .1], rh: [.24, 1.0, .1], le: [-.5, -1, -.2], re: [.5, -1, -.2], fist: .5, lf: [-.12, .1, .08], rf: [.14, .1, -.1], rfd: [.3, -.05, 1], hp: Math.sin(tt * .04) * .05 });
    case 'alexIntro': { const k = Math.sin(tt * .12); return P({ yaw: .05, cy: 0, cp: .12, hp: -.2 + k * .04, hy: k * .08, lh: [-.42, 1.22 + k * .04, .38], rh: [.42, 1.2 - k * .04, .38], le: [-1, -.4, -.3], re: [1, -.4, -.3], fist: 0, lho: [0, 1, 0], rho: [0, 1, 0], jaw: talk(t), lf: [-.12, .1, .14], rf: [.14, .1, -.14], hip: [0, -.04, .04] }); }
    case 'alexWin': return P({ yaw: 0, cy: 0, hp: -.18, hy: Math.sin(tt * .05) * .1, lh: [.1, 1.28, .22], rh: [-.1, 1.3, .24], le: [-.6, -.6, .4], re: [.6, -.6, .4], fist: .6, jaw: talk(t, 60), lf: [-.13, .1, .05], rf: [.14, .1, -.05], hip: [0, -.01, 0] });
    case 'alexLose': { const k = Math.sin(tt * .1); return P({ yaw: 0, cy: 0, cp: .05, hp: .15, hy: k * .25, lh: [-.42, 1.18, .3], rh: [.42, 1.18, .3], le: [-1, -.5, -.3], re: [1, -.5, -.3], fist: 0, lho: [0, 1, 0], rho: [0, 1, 0], jaw: talk(t, 90), lf: [-.12, .1, .06], rf: [.14, .1, -.06], hip: [0, -.02, 0] }); }
    case 'alexWhistle': return P({ yaw: .1, cy: 0, hp: -.15, rh: [-.02, 1.6, .14], re: [.6, -.5, .2], lh: [-.35, 1.5, .55], le: [-.6, -.5, -.3], fist: .7, jaw: .2, hip: [0, -.03, 0] });
    case 'alexPoint': return P({ yaw: -.1, cy: 0, cp: -.08, hp: -.1, rh: [-.05, 1.45, .62], re: [.5, -.6, -.2], lh: [-.2, 1.0, .12], fist: .65, jaw: (Math.sin(tt * .5) * .5 + .5) * .5, hip: [0, -.03, 0] });
    case 'zoncoIntro': return P({ yaw: .1, cy: 0, hp: .12 + Math.sin(tt * .03) * .04, hy: .25, rh: [.0, 1.56, .16], re: [.3, -1, .1], lh: [.05, 1.22, .16], le: [-.4, -1, .1], fist: .55, jaw: talk(t, 90), lf: [-.12, .1, .08], rf: [.14, .1, -.08], hip: [0, -.02, 0] });
    case 'zoncoWin': return P({ yaw: 0, cy: -.1, cp: -.1, hp: -.1, rh: [.0, 1.48, .72], re: [.4, -.4, -.4], lh: [-.25, 1.02, .1], fist: .7, jaw: t < 30 ? .6 : 0, lf: [-.12, .1, .14], rf: [.14, .1, -.12], hip: [0, -.04, .03] });
    case 'zoncoPray': { const b = smooth(clamp((t - 35) / 28, 0, 1)) * (1 - smooth(clamp((t - 120) / 30, 0, 1))); return P({ yaw: 0, cy: 0, hy: 0, hr: 0, cp: .04 + b * .1, hp: .08 + b * .3, lh: [-.035, 1.3, .27], rh: [.035, 1.3, .27], le: [-1, -.7, -.1], re: [1, -.7, -.1], fist: 0, lho: [0, 1, .15, 0, 0, -1], rho: [0, 1, .15, 0, 0, -1], lf: [-.11, .1, .05], rf: [.12, .1, -.04], lfd: [-.1, -.05, 1], rfd: [.15, -.05, 1], hip: [0, -.01, 0] }); }
    case 'zoncoVape': { const up = t < 34 ? smooth(clamp(t / 20, 0, 1)) : 1 - smooth(clamp((t - 40) / 20, 0, 1)); return P({ yaw: .1, cy: 0, hp: -.05 - up * .1, rh: [lerp(.2, .02, up), lerp(1.15, 1.6, up), lerp(.25, .14, up)], re: [.5, -1, 0], lh: [-.22, 1.02, .1], fist: .8, jaw: t > 36 && t < 48 ? .35 : 0, hip: [0, -.02, 0] }); }
    case 'zoncoVape2': return P({ yaw: .1, cy: 0, hp: -.15, rh: [.02, 1.58, .15], re: [.5, -1, 0], lh: [-.22, 1.02, .1], fist: .8, jaw: t < 12 ? .3 : 0 });
    case 'zoncoKick': return STYLES.std.volley.track(clamp((tt - 17) * 17 / 17 + 0, 0, 46));
    case 'dazed': return P({ hip: [0, -.1, 0], yaw: .1, hp: .25, hr: Math.sin(tt * .09) * .18, cr: Math.sin(tt * .07) * .08, lh: [-.25, 1.05, .15], rh: [.25, 1.05, .1], le: [-.5, -1, 0], re: [.5, -1, 0], fist: .3, jaw: .3 });
    case 'flying': { const p = clonePose(AIRBORNE); p.brx = -(f.spin || 0) * .6 - .6; p.brz = Math.sin((f.spin || 0)) * .5; return p; }
    case 'lying': return clonePose(LYING);
    case 'ballHit': return FALL(tt * .9);
    case 'thrown': { const L = f.throwLift || 0, S = f.throwSlam || 0; const p = P({ yaw: 0, cy: 0, cp: .35 - S * .3, hp: -.35 + S * .5, hr: .1, jaw: .5, fist: .4, hip: [0, -.12, 0],
      lh: [-.2, 1.38 + L * .1, .35], rh: [.2, 1.38 + L * .1, .35], le: [-1, -.5, .2], re: [1, -.5, .2], lho: [0, 1, 0], rho: [0, 1, 0],
      lf: [-.12, .1 + L * .2, .05 + L * .1], rf: [.13, .1 + L * .3, -.05], lk: [-.2, .2, 1], rk: [.2, .3, 1], lfdFree: 1, rfdFree: 1 });
      if (S > 0) { p.lh = [-.55, 1.45, -.05]; p.rh = [.55, 1.45, -.05]; p.le = [-1, 0, 0]; p.re = [1, 0, 0]; }
      p.brx = -(L * .08 + S * 1.49); p.by = .13 * S; return p; }
    case 'idleSad': return P({ yaw: 0, cy: 0, cp: .12, hp: .3, lh: [-.24, .98, .06], rh: [.24, .98, .06], le: [-.5, -1, -.2], re: [.5, -1, -.2], fist: .3, lho: [0, 1, 0], rho: [0, 1, 0], lf: [-.12, .1, .05], rf: [.14, .1, -.06], hip: [0, -.01, 0] });
    case 'shrugTalk': { const k = Math.sin(tt * .1); return P({ yaw: 0, cy: 0, hp: -.05, hr: .12 + k * .05, lh: [-.42, 1.1, .3], rh: [.42, 1.12 + k * .03, .3], le: [-1, -.5, -.2], re: [1, -.5, -.2], lho: [-.3, .2, 1, 0, 1, 0], rho: [.3, .2, 1, 0, 1, 0], fist: .1, lsh: -.1, rsh: -.1, jaw: talk(t, 110), lf: [-.12, .1, .06], rf: [.14, .1, -.06], hip: [0, -.01, 0] }); }
    case 'sadTalk': return P({ yaw: 0, cy: 0, cp: .1, hp: .25 + Math.sin(tt * .05) * .05, hy: Math.sin(tt * .04) * .15, lh: [-.3, 1.0, -.02], rh: [.3, 1.0, -.02], le: [-1, 0, -.3], re: [1, 0, -.3], fist: .2, lho: [0, -1, 0], rho: [0, -1, 0], jaw: talk(t, 150), lf: [-.12, .1, .06], rf: [.14, .1, -.06], hip: [0, -.01, 0] });
    case 'pointTalk': { const k = Math.sin(tt * .25) * .02; return P({ yaw: -.1, cy: -.15, hp: -.1, rh: [-.05, 1.45 + k, .62], re: [.5, -.6, -.2], rho: [0, 0, 1, -1, 0, 0], rpt: 1, fist: 1, lh: [-.22, 1.0, .12], le: [-.5, -1, -.2], lho: [0, 1, 0], jaw: talk(t, 90), lf: [-.12, .1, .14], rf: [.14, .1, -.12], hip: [0, -.04, .03] }); }
    case 'calmTalk': { const k = Math.sin(tt * .08); return P({ yaw: 0, cy: 0, hp: .05, hr: .08, lh: [-.25, 1.08, .3], rh: [.2, 1.12 + k * .04, .32], le: [-.8, -.6, -.2], re: [.8, -.6, -.2], lho: [.2, .4, 1, 0, 1, 0], rho: [-.3, .5, 1, 0, 1, 0], fist: .2, jaw: talk(t, 110), lf: [-.12, .1, .06], rf: [.14, .1, -.06], hip: [0, -.01, 0] }); }
    case 'lookUp': return P({ yaw: 0, cy: 0, cp: -.12, hp: -.45, lh: [-.24, .98, .08], rh: [.24, .98, .08], le: [-.5, -1, -.2], re: [.5, -1, -.2], lho: [0, 1, 0], rho: [0, 1, 0], fist: .3, jaw: .25 + talk(t, 80) * .5, lf: [-.12, .1, -.04], rf: [.14, .1, -.16], hip: [0, -.01, -.03] });
    case 'beckon': { const k = (Math.sin(tt * .22) * .5 + .5); return P({ yaw: .2, cy: 0, hp: .05, rh: [.05, 1.25, .55], re: [.6, -.7, -.2], rho: [0, .3, 1, 0, -1, 0], fist: k * .9, lh: [-.15, 1.35, .38], lho: [-1, 0, 0], jaw: talk(t, 60), hip: [0, -.14, 0], cp: .1, lf: [-.13, .1, .2], rf: [.18, .1, -.2] }); }
    case 'fingerTemple': return P({ yaw: 0, cy: 0, hp: .05, hr: -.1, rh: [.11, 1.67, .06], re: [1, -.2, -.2], rho: [0, 1, 0, 0, 0, 1], rpt: 1, fist: 1, lh: [-.22, 1.0, .08], lho: [0, 1, 0], jaw: talk(t, 90), lf: [-.12, .1, .06], rf: [.14, .1, -.06], hip: [0, -.01, 0] });
    case 'dizzy': { const k = Math.sin(tt * .07); return P({ yaw: 0, cy: 0, cr: k * .1, hr: k * .2, hp: .1, lh: [-.06, 1.68, .1], le: [-1, 0, 0], lho: [0, 0, 1, 1, 0, 0], fist: .1, rh: [.3, .95, .05], rho: [0, 1, 0], jaw: talk(t, 90), hip: [k * .03, -.16, 0], lf: [-.14, .1, .05], rf: [.16, .1, -.05] }); }
    case 'armsCross': return P({ yaw: 0, cy: 0, hp: -.12, lh: [.14, 1.27, .17], rh: [-.14, 1.3, .2], le: [-.9, -.6, .3], re: [.9, -.6, .3], lho: [1, .2, 0, 0, 1, 0], rho: [-1, .2, 0, 0, 1, 0], fist: .7, jaw: talk(t, 50), lf: [-.13, .1, .04], rf: [.15, .1, -.05], hip: [0, -.01, 0] });
    case 'fistPump': { const k = Math.abs(Math.sin(tt * .16)); return P({ yaw: .1, cy: 0, hp: -.15, rh: [.18, 1.55 + k * .35, .2], re: [1, -.3, 0], lh: [-.2, 1.15, .25], fist: 1, jaw: talk(t, 50), hip: [0, -.06, 0], lf: [-.13, .1, .12], rf: [.16, .1, -.12] }); }
    case 'wristShow': return P({ yaw: 0, cy: 0, hp: .1, rh: [.02, 1.3, .38], re: [.8, -.8, -.1], rho: [0, 1, .3, -1, 0, 0], fist: .9, lh: [-.02, 1.2, .33], le: [-.8, -.6, -.1], lho: [1, .5, .3, 0, 1, 0], jaw: talk(t, 90), lf: [-.12, .1, .06], rf: [.14, .1, -.06], hip: [0, -.01, 0] });
    case 'clap': { const k = Math.abs(Math.sin(tt * .2)); if (f.state === 'outro' && t % 16 === 8 && f._sfxT !== t) { f._sfxT = t; AU.sfx('clap'); } return P({ yaw: 0, cy: 0, hp: .05, lh: [-.03 - k * .1, 1.28, .32], rh: [.03 + k * .1, 1.28, .32], le: [-1, -.6, -.1], re: [1, -.6, -.1], lho: [0, 1, .3, 0, 0, -1], rho: [0, 1, .3, 0, 0, -1], fist: 0, jaw: talk(t, 110), lf: [-.12, .1, .06], rf: [.14, .1, -.06], hip: [0, -.01, 0] }); }
    case 'mogIntro': {
      const sh = t < 95, ph = clamp((t - 100) / 20, 0, 1), chin = t > 190 ? 1 : 0;
      const p = P({ yaw: 0, cy: 0, hp: sh ? .05 : -.18 * ph - .12 * chin, hy: sh ? 0 : .25 * ph, lh: [-.24, .98, .06], le: [-.5, -1, -.2], lho: [0, 1, 0], fist: 1, lf: [-.12, .1, .06], rf: [.14, .1, -.06], hip: [0, -.01, 0], jaw: t > 200 && t < 220 ? .3 : 0 });
      if (sh) { p.rh = [.0, 1.6, .17]; p.re = [.8, -.8, 0]; p.rho = [0, 1, .1, 1, 0, 0]; p.rpt = 1; }
      else { p.rh = [-.07, 1.55, .12]; p.re = [1, -.5, 0]; p.rho = [-1, .3, .2, 0, 1, 0]; p.rpt = 1; }
      return p; }
    case 'mog': { const k = Math.sin(tt * .03); return P({ yaw: 0, cy: 0, hp: -.22, hy: k * .35, rh: [-.06, 1.55, .12], re: [1, -.5, 0], rho: [-1, .3, .2, 0, 1, 0], rpt: 1, fist: 1, lh: [-.24, .98, .06], le: [-.5, -1, -.2], lho: [0, 1, 0], lf: [-.13, .1, .08], rf: [.15, .1, -.08], hip: [0, -.01, 0] }); }
    case 'brunoLaugh': {
      const bang = (t % 26) / 26, down = bang < .25 ? smooth(bang / .25) : 1 - smooth((bang - .25) / .75);
      if (f.state === 'outro' && t % 26 === 6 && f._sfxT !== t) { f._sfxT = t; AU.sfx('table'); M.shake = Math.max(M.shake, .18); HUD.pulseFx && HUD.pulseFx(); }
      return P({ yaw: .2, cy: -.3, cp: .25 + down * .15, hp: -.45 + down * .3, hr: Math.sin(tt * .9) * .05, rh: [.52, 1.06 - down * .2, .3], re: [1, .3, -.2], rho: [.3, -.2, 1, 0, -1, 0], fist: 1, lh: [-.12, 1.1, .2], le: [-.8, -.8, 0], lho: [1, 0, 0], jaw: .45 + Math.abs(Math.sin(tt * .7)) * .35, hip: [0, -.1 - Math.abs(Math.sin(tt * .9)) * .02, 0], lf: [-.14, .1, .1], rf: [.18, .1, -.12] }); }
    case 'pointSky': return P({ yaw: 0, cy: 0, hp: -.5, rh: [.12, 1.95, .25], re: [1, -.2, 0], rho: [0, 1, .2, -1, 0, 0], rpt: 1, fist: 1, lh: [-.24, 1.0, .1], lho: [0, 1, 0], jaw: .3, hip: [0, -.02, 0], lf: [-.12, .1, .06], rf: [.14, .1, -.06] });
    case 'lookUpScared': return P({ yaw: 0, cy: 0, cp: -.15, hp: -.6, lh: [-.25, 1.62, .25], rh: [.25, 1.62, .25], le: [-1, -.3, 0], re: [1, -.3, 0], lho: [0, 1, .3, 1, 0, 0], rho: [0, 1, .3, -1, 0, 0], fist: .1, jaw: .6, hip: [0, -.12, -.05] });
    case 'edoKick': { const ph = ((t - 20) % 18) / 18, act = t > 20 && t < 150; const k = act ? Math.sin(Math.min(1, ph * 1.6) * Math.PI) : 0;
      return P({ yaw: .5 + k * .5, cy: -.1, hp: .2, lh: [-.15, 1.42, .38], rh: [.08, 1.4, .26], lho: [-1, 0, 0], rho: [1, 0, 0], hip: [0, -.12, 0], lf: [-.12, .1, .2],
        rf: [lerp(.17, -.25, k), lerp(.1, .22, k), lerp(-.2, .75, k)], rk: [.6, .3, .6], rfd: [1, -.1, .5], lsh: .1 }); }
    case 'ankleHit': { const k = Math.max(0, 1 - t / 14); return P({ hip: [0, -.18 - k * .08, 0], cp: .2 + k * .2, hp: .3, cr: Math.sin(t * .4) * .1, lh: [-.3, 1.05, .2], rh: [.3, 1.05, .2], lho: [0, 1, 0], rho: [0, 1, 0], lf: [-.14, .1 + k * .1, .1], rf: [.16, .1, -.1], fist: .3, jaw: .5 }); }
    case 'petTele': return P({ yaw: 0, cy: 0, hp: .15, lh: [-.07, 1.7, .12], rh: [.07, 1.7, .12], le: [-1, -.2, 0], re: [1, -.2, 0], lho: [.3, 1, .2, 0, 0, 1], rho: [-.3, 1, .2, 0, 0, 1], lpt: 2, rpt: 2, fist: 1, hip: [0, -.06, 0], lf: [-.14, .1, .1], rf: [.16, .1, -.1] });
    case 'teleHit': { const k = Math.sin(tt * .5) * .1; return P({ yaw: 0, cy: k, cp: .1, hp: -.2 + k, lh: [-.12, 1.72, .05], rh: [.12, 1.72, .05], le: [-1, 0, 0], re: [1, 0, 0], lho: [0, 1, 0], rho: [0, 1, 0], fist: .2, jaw: .7, lf: [-.12, .15, .05], rf: [.12, .2, -.05], lfdFree: 1, rfdFree: 1 }); }
    case 'jostoFilm': return P({ yaw: 0, cy: 0, hp: .05, hy: -.1, rh: [.14, 1.55, .12], re: [1, -.4, 0], rho: [0, 0, 1, -1, 0, 0], fist: .7, lh: [-.02, 1.52, .32], le: [-1, -.6, 0], lho: [0, 0, 1, 1, 0, 0], hip: [0, -.12, 0], lf: [-.14, .1, .15], rf: [.17, .1, -.15] });
    case 'jostoFilmEnd': return P({ yaw: 0, cy: 0, hp: -.1, rh: [.14, 1.55, .12], re: [1, -.4, 0], rho: [0, 0, 1, -1, 0, 0], fist: .7, lh: [-.25, 1.0, .1], lho: [0, 1, 0], jaw: talk(t, 40), hip: [0, -.02, 0] });
    case 'armWrestleA': case 'armWrestleB': { const w = f.wrestle || 0, A = name === 'armWrestleA', lean = A ? w * .25 : -w * .4;
      const hand = [.02, 1.3 + (A ? 0 : 0), .36]; const tilt = A ? w * .2 : -w * .2;
      return P({ yaw: -.1, cy: -.25, cp: .15 + lean, hp: .1, rh: [hand[0] - tilt, hand[1] - Math.max(0, w) * (A ? .1 : -.1), hand[2]], re: [1, -.6, 0], rho: [0, 1, .4, -1, 0, 0], fist: .7, lh: [-.3, 1.05, .1], le: [-.8, -1, 0], lho: [0, 1, 0], jaw: .3, hip: [0, -.14, 0], lf: [-.16, .1, .25], rf: [.18, .1, -.25] }); }
    case 'gioSpray': return P({ yaw: -.1, cy: -.2, hp: -.1, rh: [-.02, 1.5, .62], re: [.4, -.6, -.2], rho: [0, .1, 1, 0, 1, 0], fist: 1, lh: [-.22, 1.0, .1], lho: [0, 1, 0], hip: [0, -.04, .03], lf: [-.12, .1, .14], rf: [.14, .1, -.12] });
    case 'eyesCovered': { const k = Math.sin(tt * .15); return P({ yaw: 0, cy: 0, cp: .35 + Math.abs(k) * .15, hp: .4, hr: k * .2, lh: [-.05, 1.6, .17], rh: [.05, 1.6, .17], le: [-1, -.3, 0], re: [1, -.3, 0], lho: [0, 1, .2, 0, 0, -1], rho: [0, 1, .2, 0, 0, -1], fist: .2, jaw: .5, hip: [k * .05, -.14, -.05], lf: [-.14, .1, .05], rf: [.16, .1, -.05] }); }
    case 'clinched': { const k = f.t; return P({ yaw: 0, cy: 0, cp: .55, hp: .45, hip: [0, -.2, -.1], lh: [-.15, 1.2, .3], rh: [.15, 1.2, .3], le: [-1, -.4, 0], re: [1, -.4, 0], lho: [0, 1, 0], rho: [0, 1, 0], fist: .4, jaw: .5, lf: [-.13, .1, .02], rf: [.15, .1, -.12] }); }
    case 'outro': return clonePose(GUARD);
  }
  return clonePose(GUARD);
}

/* oggetti delle scene di vittoria */
const WIN_SCENES = {
  brunoLaugh(M, W) {   // tavolino accanto a Bruno su cui batte il pugno
    const g = new THREE.Group(), wood = std(0x6a4a30, .7), F = W.fwd, R = new V3(-F.z, 0, F.x);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .04, 28), wood); top.position.y = .82; g.add(top);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(.04, .05, .8, 10), std(0x2b2b2b, .4, .6)); leg.position.y = .41; g.add(leg);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.22, .25, .03, 20), std(0x2b2b2b, .4, .6)); base.position.y = .015; g.add(base);
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.position.copy(W.pos).addScaledVector(F, .3).addScaledVector(R, .55); scene.add(g); return g;
  },
};
/* inquadrature delle scene: la scritta grande in alto non copre il personaggio */
const CAM_FOCUS = {
  brunoLaugh: f => { const F = f.fwd, R = new V3(-F.z, 0, F.x); return { pos: f.pos.clone().addScaledVector(F, 2.5).addScaledVector(R, -1.0).setY(1.55), look: f.pos.clone().addScaledVector(F, .2).addScaledVector(R, .3).setY(1.42) }; },
  mog: f => { const F = f.fwd; return { pos: f.pos.clone().addScaledVector(F, 1.9).setY(1.6), look: f.pos.clone().setY(1.62) }; },
};
