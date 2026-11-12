'use strict';
/* ===== Personaggi: dati, frasi, pose delle scene ===== */
const talk = (t, len = 70) => t < len ? (Math.sin(t * .55) * .5 + .5) * .55 : 0;
const CHARS = [
  { id: 'alex', name: 'Alex', ready: true, style: 'std', styleName: 'Standard, calci da calciatore', kickMul: 1.3, voice: 112,
    costumes: [{ name: 'Camicia a righe', mesh: 'alex_1' }], arenas: ['capoterra'], color: '#3d7bd9',
    motive: 'Odia tutti e vuole picchiarli. Il premio? Lo butterà nel cesso, tanto i soldi non gli importano.',
    ending: { title: 'Alex è il più strano', text: 'Alex prende il premio, entra in bagno e butta tutti i soldi nel cesso. Tira lo sciacquone senza pensarci due volte.', scene: 'toilet' },
    lines: { intro: { text: 'Che cazzo vuoi?!', pose: 'alexIntro' }, vs: { zonco: { text: 'O zonco pezze merda', pose: 'alexIntro' } },
      win: { text: 'Sei scarso, ritirati', pose: 'alexWin' }, lose: { text: 'Sei togo vabbè non ha senso giocare così', pose: 'alexLose' } } },
  { id: 'bruno', name: 'Bruno', styleName: 'MMA' }, { id: 'edo', name: 'Edo', styleName: 'Muay Thai' }, { id: 'pet', name: 'Pet', styleName: 'Brazilian Jiu Jitsu' },
  { id: 'zonco', name: 'Zonco', ready: true, style: 'std', styleName: 'Standard, calci da calciatore', kickMul: 1.3, voice: 128,
    costumes: [{ name: 'Maglia bianconera', mesh: 'zonco_1' }], arenas: ['quartello'], color: '#d9a33d',
    motive: 'Al 98% non voleva partecipare, ma partecipa lo stesso. Con i soldi investirà sui social per dimostrare che Gio è più strano di lui.',
    ending: { title: 'Zonco è il più strano', text: 'Zonco investe tutto il premio sui social. Ora ha il video virale che lo dimostra: Gio è più strano di lui. Al 98%.', scene: 'social' },
    lines: { intro: { text: 'Fra... c\'è il 98% di possibilità...', pose: 'zoncoIntro', len: 200 },
      win: { text: 'FAI SO', big: true, pose: 'zoncoWin' }, lose: { text: '', pose: 'zoncoPray', len: 190 } } },
  { id: 'josto', name: 'Josto', styleName: 'MMA' }, { id: 'davidino', name: 'Davidino', styleName: 'Kickboxing' }, { id: 'gio', name: 'Gio', styleName: 'Karate Shotokan' },
];
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
    case 'thrown': { const p = clonePose(AIRBORNE); p.brx = -(f.throwK || 0) * 2.4 - .2; return p; }
    case 'outro': return clonePose(GUARD);
  }
  return clonePose(GUARD);
}
