(function () {
  'use strict';
  var KEY = 'is-intro-ai-v1';
  var state = { answers: {}, notes: {} };
  try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === 'object') { state.answers = s.answers || {}; state.notes = s.notes || {}; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  var IO = ['In the loop', 'On the loop', 'Over the loop', 'Out of the loop'];
  var QC = {
    part1: [
      { q: 'Which statement best describes "human in the loop"?', o: ['A person must review, judge or approve an AI output or action before the process can be completed', 'A human designed the AI system at some point', 'The AI asks a person for data before it starts'], a: 0, fb: 'Human in the loop means human judgement is a required step before the process completes, not just that a person was involved somewhere.' },
      { q: 'True or false: adding a human reviewer to every AI decision always makes a process safer.', o: ['True', 'False'], a: 1, fb: 'False. Human review adds cost, can suffer from fatigue and inconsistency, and can expose sensitive data. The question is whether the right person is involved at the right point.' },
      { q: 'Which three words capture the core design questions for any AI workflow?', o: ['Speed, cost and accuracy', 'Autonomy, oversight and accountability', 'Data, model and interface'], a: 1, fb: 'Autonomy: what can the AI do by itself? Oversight: where are the humans? Accountability: who is responsible for the outcome?' },
      { q: 'What does meaningful human control require?', o: ['A person’s name on the process map', 'A yearly check of a random sample of decisions', 'A person with enough information, authority, competence and opportunity to intervene'], a: 2, fb: 'Being present is not enough. The person must be able to understand, question and change the outcome.' }
    ],
    part2: [
      { q: 'An AI resolves requests on its own while a staff member watches a live dashboard and can stop it at any time. Where is the human?', o: IO, a: 1, fb: 'On the loop: the AI acts autonomously while a person actively monitors and can intervene.' },
      { q: 'A committee sets the AI’s limits and audits it quarterly, but nobody watches individual decisions. Where is the human?', o: IO, a: 2, fb: 'Over the loop: people govern the system through rules, limits and audits rather than supervising each decision.' },
      { q: 'Your email service moves obvious spam to the junk folder without asking you. Where is the human?', o: IO, a: 3, fb: 'Out of the loop: the AI completes the task without routine human review or intervention.' },
      { q: 'In reinforcement learning from human feedback (RLHF), when are people involved?', o: ['At tuning time: they rank responses to align the model', 'At run time: they approve every answer', 'Only when writing the model’s code'], a: 0, fb: 'RLHF happens at tuning time. People’s preference rankings train a reward model that steers the AI to be helpful, harmless and honest.' }
    ],
    part3: [
      { q: 'A company uses AI to review employee expense claims. The AI recommends approve or reject, but a manager makes the final decision. Why is this "human in the loop"?', o: ['Because a human designed the AI system', 'Because the AI and the manager do exactly the same task', 'Because human judgement is a required step before the process can be completed', 'Because the AI cannot analyse the claim without help'], a: 2, fb: 'The manager’s decision is required before anything happens. If the AI could approve or reject claims itself without waiting, the human would no longer be in the loop.' },
      { q: 'An AI agent answers customer enquiries and can issue refunds of up to $50 without approval. A staff member monitors its activity and can intervene at any time. Where is the human?', o: IO, a: 1, fb: 'On the loop: the AI acts without prior approval, while a person monitors and can step in.' },
      { q: 'Now the AI only recommends a refund, and a staff member must approve every refund before it is issued. Where is the human now?', o: IO, a: 0, fb: 'In the loop: approval is now required before the action. That is the one thing that changed.' },
      { q: 'An AI scheduling agent arranges meetings by itself, but organisational policy stops it booking outside working hours or sharing confidential calendar details. Nobody reviews individual bookings. Where is the human?', o: IO, a: 2, fb: 'Over the loop: people set the rules and boundaries, and the AI acts within them without individual approval or live monitoring.' },
      { q: 'Your email provider moves obvious spam to the junk folder without asking. Where is the human?', o: IO, a: 3, fb: 'Out of the loop: no routine human review or intervention.' }
    ],
    part4: [
      { q: 'Which task most clearly justifies strong human involvement?', o: ['Rescheduling an internal team meeting', 'Rejecting a job applicant', 'Tagging incoming support tickets'], a: 1, fb: 'Rejecting an applicant has serious consequences for a person, is hard to reverse and raises fairness and legal issues. The others are low-risk and easy to fix.' },
      { q: 'At SwiftMart, refunds of $100 or less are issued automatically while a supervisor watches a live dashboard and can reverse them. Which model is this?', o: IO, a: 1, fb: 'On the loop. Remember the unit of analysis: the same process also has in, over and out arrangements for other decisions.' },
      { q: 'According to Atlassian’s guidance, where does a reliable guardrail for an AI agent live?', o: ['In a clear instruction inside the agent’s prompt', 'In the system the agent works in, so the unwanted action is not possible', 'In a weekly reminder email to staff'], a: 1, fb: 'Instructions can be forgotten, misread or overridden. Real guardrails sit in the environment, making the prohibited action structurally impossible.' },
      { q: 'An analyst must clear 60 AI-flagged fraud cases an hour. What is the main risk?', o: ['Too much cognitive friction', 'Rubber-stamping, driven by automation bias and speed-only KPIs', 'The AI becoming slower'], a: 1, fb: 'With one minute per case and a speed target, the reviewer is pushed to defer to the score and click approve. Oversight becomes a formality.' }
    ],
    part5: [
      { q: 'What does the "jagged technological frontier" describe?', o: ['AI getting steadily worse as tasks get harder', 'AI capability being uneven: it can help a lot on one task and hurt on a similar-looking one', 'AI only being useful for creative work'], a: 1, fb: 'The boundary of what AI does reliably is uneven, and you often can’t tell in advance which side of it a task is on.' },
      { q: 'On the deceptively tricky brand-strategy task, how did consultants using AI perform compared with those without AI?', o: ['They were more accurate', 'About the same', 'They were less likely to reach the correct answer'], a: 2, fb: 'Correct answers fell from 84.5% without AI to 70.6% with AI, and to about 60% with AI plus prompt guidance.' },
      { q: 'What is the typical failure mode of a cyborg workflow?', o: ['Cognitive drift: getting swept up in the back-and-forth and not checking the larger logic', 'Treating the AI’s finished deliverable as a trusted black box', 'Being too slow to be useful'], a: 0, fb: 'Cyborgs drift; centaurs fall into the black-box trap. Both fail when the human stops scrutinising.' },
      { q: 'Who gained the most in quality from using AI in the study?', o: ['The top-performing consultants', 'The lower-performing consultants', 'There was no difference'], a: 1, fb: 'The lower half of performers gained roughly 31% compared with about 11% for the top half: the skill-equalising effect.' }
    ],
    part7: [
      { q: 'What is the illusion of explanatory depth?', o: ['Believing we understand things much better than we can actually explain them', 'Forgetting facts over time', 'Disagreeing with expert explanations'], a: 0, fb: 'Seeing and using something feels like understanding it. Explaining it is the real test.' },
      { q: 'Why does AI make the illusion stronger?', o: ['It is usually wrong', 'It removes the struggle that normally signals the edge of your knowledge', 'It uses too many tokens'], a: 1, fb: 'Difficulty is a signal. Fluent, effortless answers delete it, so confidence rises faster than understanding.' },
      { q: 'Which prompt best protects your learning?', o: ['"Explain this to me in detail."', '"Write my answer for me."', '"Ask me questions about this. Do not explain it to me."'], a: 2, fb: 'Asking AI to test you makes you produce the explanation, which is where you find the gaps.' }
    ],
    part8: [
      { q: 'Roughly how many English words are 100 tokens?', o: ['About 75', 'About 100', 'About 1,000'], a: 0, fb: 'As a rough guide, 100 tokens is about 75 English words. Tokens can be whole words, parts of words, punctuation or spaces.' },
      { q: 'What is the key difference between a chat mode and an agent (work) mode?', o: ['Agent mode never needs reviewing', 'In agent mode you delegate more control over the intermediate steps', 'Agent mode is only for coding'], a: 1, fb: 'In chat you decide each next step; in agent mode the AI plans and carries out steps towards your goal. You remain responsible for reviewing the result.' },
      { q: 'In Australia, what does copyright protect?', o: ['The idea itself', 'Any fact once it is published', 'The original expression of an idea'], a: 2, fb: 'There is no copyright in an idea, fact or information itself, only in its original expression. Protection is automatic on creation.' },
      { q: 'A client has given you a confidential spreadsheet. What is the safest way to get AI help with it?', o: ['Paste it into any free chatbot', 'Upload it, then delete the chat afterwards', 'Don’t put it into a public tool: de-identify it, or use an approved organisational tool with the owner’s permission'], a: 2, fb: 'Sharing with a public AI tool is effectively sharing with an uncontrolled third party, and deleting a chat may not remove the data.' }
    ]
  };

  var TOTAL = 0; Object.keys(QC).forEach(function (k) { TOTAL += QC[k].length; });
  function updateProgress() {
    var n = 0;
    Object.keys(QC).forEach(function (k) { QC[k].forEach(function (q, i) { if (state.answers[k + '-' + i] === q.a) n++; }); });
    $('#progress-text').textContent = n + ' of ' + TOTAL + ' quick checks correct';
    $('#progress-fill').style.width = (n / TOTAL * 100) + '%';
  }

  $$('.qc[data-qc]').forEach(function (box) {
    var key = box.getAttribute('data-qc'), items = QC[key]; if (!items) return;
    var list = $('.qc-list', box), score = $('.qc-score', box);
    function upd() {
      var done = 0, right = 0;
      items.forEach(function (q, i) { var v = state.answers[key + '-' + i]; if (v !== undefined) { done++; if (v === q.a) right++; } });
      score.textContent = done + ' of ' + items.length + ' answered · ' + right + ' correct';
    }
    function render(i) {
      var q = items[i], v = state.answers[key + '-' + i], el = list.children[i];
      el.innerHTML = '<p class="qt"><span>' + (i + 1) + '</span>' + esc(q.q) + '</p><div class="opts">' +
        q.o.map(function (o, j) { return '<button type="button" data-j="' + j + '">' + esc(o) + '</button>'; }).join('') + '</div>';
      if (v !== undefined) {
        $$('button', el).forEach(function (b) { var j = +b.dataset.j; b.disabled = true; if (j === v && v === q.a) b.classList.add('right'); else if (j === v) b.classList.add('wrong'); });
        var ok = v === q.a, fb = document.createElement('p');
        fb.className = 'fb' + (ok ? '' : ' no'); fb.setAttribute('role', 'status');
        fb.textContent = ok ? 'Correct. ' + q.fb : 'Not quite. Think about it again, then try another answer.';
        el.appendChild(fb);
        if (!ok) { var r = document.createElement('button'); r.type = 'button'; r.className = 'btn small retry'; r.textContent = 'Try again'; r.addEventListener('click', function () { delete state.answers[key + '-' + i]; save(); render(i); upd(); updateProgress(); $('button[data-j]', list.children[i]).focus(); }); el.appendChild(r); }
      }
    }
    list.innerHTML = items.map(function () { return '<div class="q"></div>'; }).join('');
    items.forEach(function (q, i) { render(i); });
    list.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-j]'); if (!b || b.disabled) return;
      var i = Array.prototype.indexOf.call(list.children, b.closest('.q'));
      state.answers[key + '-' + i] = +b.dataset.j; save(); render(i); upd(); updateProgress();
    });
    upd();
  });
  updateProgress();

  // notes, ratings and design fields
  $$('[data-save]').forEach(function (f) {
    var k = f.getAttribute('data-save');
    if (state.notes[k] !== undefined) f.value = state.notes[k];
    f.addEventListener('input', function () { state.notes[k] = f.value; save(); if (k.indexOf('zip') === 0) zip(); });
    f.addEventListener('change', function () { state.notes[k] = f.value; save(); if (k.indexOf('zip') === 0) zip(); });
  });

  function zip() {
    var b = +$('#zip-before').value, a = +$('#zip-after').value, out = $('#zip-result');
    if (!b || !a) { out.textContent = ''; return; }
    if (a < b) out.textContent = 'Your rating dropped from ' + b + ' to ' + a + '. That drop is the illusion of explanatory depth, and it happens to most people.';
    else if (a === b) out.textContent = 'Your rating stayed at ' + b + '. Check your explanation against the one below: did you cover the hook, the hollow and the slider?';
    else out.textContent = 'Your rating rose from ' + b + ' to ' + a + '. Compare your explanation with the one below before deciding you have beaten the illusion.';
  }
  zip();

  // download design
  $('#download-design').addEventListener('click', function () {
    var labels = $$('#design-form label');
    var text = 'DESIGN THE LOOP: my human–AI arrangement\nIntroduction to AI for Business · Information Systems\n\n' + labels.map(function (l) {
      var t = $('textarea', l); return l.firstChild.textContent.trim() + '\n' + (t.value.trim() || '(not yet completed)') + '\n';
    }).join('\n');
    var u = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a'); a.href = u; a.download = 'design-the-loop.txt'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
  });

  // reset
  $('#reset').addEventListener('click', function () {
    if (!confirm('Clear all your quick-check answers and notes on this page?')) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  });
  $('#print').addEventListener('click', function () { $$('details').forEach(function (d) { d.open = true; }); window.print(); });

  // glossary
  var G = [
    ['Human in the loop (HITL)', 'An AI produces a recommendation or draft but cannot act until a person reviews and approves it.'],
    ['Human on the loop (HOTL)', 'The AI acts automatically within set boundaries while a person monitors live activity and can intervene or stop it.'],
    ['Human over the loop', 'People govern the AI system by setting rules, permissions, limits and escalation criteria, and by auditing it, rather than supervising each decision.'],
    ['Human out of the loop (HOOTL)', 'Full automation: the AI takes in data, decides and acts with no routine human review or intervention.'],
    ['Responsible AI', 'Developing and using AI to benefit people and society while minimising harm and unintended consequences.'],
    ['Knowledge cut-off', 'The date after which a model has no training data, so it is unaware of later events.'],
    ['Hallucination', 'False, fabricated or inaccurate content produced by an AI model.'],
    ['Meaningful human control', 'Human involvement with enough information, competence, authority, time and opportunity to question or change an AI-supported outcome.'],
    ['Augmentation vs automation', 'Whether AI supports human work or performs work that people used to do.'],
    ['AI autonomy', 'How far an AI system can pursue goals, make intermediate decisions and take actions without a human prompt at each step.'],
    ['Autonomous AI agent', 'AI software that breaks down goals, plans multi-step actions and interacts with systems independently, rather than just answering single prompts.'],
    ['Unit of analysis', 'The specific decision, action or level of control you are classifying. One process can use several loop arrangements at once.'],
    ['Guardrail', 'A constraint built into the software environment that makes a prohibited action impossible, rather than just asking the AI to behave.'],
    ['Approval gate', 'A hard checkpoint that halts a workflow until an authorised person signs off.'],
    ['Confidence threshold', 'A rule that sends low-certainty AI outputs to a person while high-confidence cases proceed automatically.'],
    ['Escalation queue', 'A path that automates routine cases end to end and routes complex or unusual ones to people.'],
    ['RLHF', 'Reinforcement learning from human feedback: people rank model responses to train it to be more helpful, harmless and honest.'],
    ['Consequence', 'The scale of potential harm (financial, legal, physical or reputational) if an automated action goes wrong.'],
    ['Reversibility', 'How easily, quickly and cheaply an action can be undone if the AI makes a mistake.'],
    ['Blast radius', 'The total scope of damage across an organisation or its customers when a failure occurs.'],
    ['Triage', 'Quickly sorting alerts or cases to set priority and the right response path.'],
    ['Telemetry', 'Continuous real-time operational data (logs, metrics, health signals) that people monitor in an on-the-loop arrangement.'],
    ['Automation bias', 'The tendency to trust and defer to automated outputs or scores over one’s own critical judgement.'],
    ['Rubber-stamping', 'Approving automated decisions without genuinely inspecting the evidence, often because of time pressure.'],
    ['KPI', 'Key performance indicator: a metric used to judge performance. Speed-only KPIs for reviewers encourage rubber-stamping.'],
    ['Cognitive friction', 'Deliberate design that makes people pause, think and check rather than click through.'],
    ['Field experiment', 'A study in a realistic setting, often with real workers and work-like tasks.'],
    ['Jagged technological frontier', 'The uneven boundary between tasks AI performs reliably and tasks where it produces plausible but unreliable results.'],
    ['Centaur workflow', 'Humans and AI perform different, clearly separated parts of a task.'],
    ['Cyborg workflow', 'Humans and AI work together continuously through rapid back-and-forth interaction and revision.'],
    ['Over-reliance', 'Depending on AI output more than the available evidence justifies.'],
    ['Skill-equalising effect', 'AI raising the performance of less skilled workers more than that of the most skilled.'],
    ['Illusion of explanatory depth', 'Believing we understand how something works far better than we can actually explain it.'],
    ['Intellectual humility', 'Accuracy about the edges of your own knowledge: knowing what you know, and what you don’t yet.'],
    ['Feynman technique', 'Explaining an idea simply in your own words without notes; where you get stuck shows what to study.'],
    ['Token', 'A small unit of text an AI model processes. About 100 tokens equals 75 English words.'],
    ['Acceptable use policy (AUP)', 'The rules you agree to when using an AI tool, describing what you may and may not do with it.'],
    ['Copyright', 'A right protecting the original expression of an idea (not the idea itself). In Australia it is free, automatic and needs no registration.']
  ];
  function renderGloss(f) {
    f = (f || '').toLowerCase();
    var hits = G.filter(function (g) { return !f || (g[0] + ' ' + g[1]).toLowerCase().indexOf(f) > -1; });
    $('#gloss-list').innerHTML = hits.map(function (g) { return '<div><dt>' + esc(g[0]) + '</dt><dd>' + esc(g[1]) + '</dd></div>'; }).join('');
    $('#gloss-empty').hidden = hits.length > 0;
  }
  renderGloss('');
  $('#gloss-search').addEventListener('input', function (e) { renderGloss(e.target.value); });

  // navigation: active section, reading progress, mobile menu
  var links = $$('.rail nav a'), sections = links.map(function (a) { return document.getElementById(a.hash.slice(1)); });
  var bar = $('#page-progress');
  function onScroll() {
    var y = window.scrollY + 140, cur = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    var h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
  var menu = $('#menu-btn'), rail = $('#rail');
  menu.addEventListener('click', function () { var o = rail.classList.toggle('open'); menu.setAttribute('aria-expanded', o ? 'true' : 'false'); menu.textContent = o ? 'Close' : 'Contents'; });
  links.forEach(function (a) { a.addEventListener('click', function () { if (rail.classList.contains('open')) menu.click(); }); });
})();
