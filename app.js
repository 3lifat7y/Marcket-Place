// ========================================================
// Marketplace Presentation Deck - Application Engine
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
  const deck = window.PRESENTATION_DECK;
  if (!deck || !deck.slides) {
    console.error("Presentation deck data not loaded!");
    return;
  }

  // Presentation State
  const state = {
    currentSlide: 0,
    totalSlides: deck.slides.length,
    viewMode: "slide", // 'slide' or 'scroll'
    theme: localStorage.getItem("deck_theme") || "dark"
  };

  // Init Theme
  applyTheme(state.theme);

  // Cache Elements
  const slideCanvas = document.getElementById("slide-canvas");
  const slideCounter = document.getElementById("slide-counter");
  const slideProgressBar = document.getElementById("slide-progress-bar");
  const prevBtn = document.getElementById("btn-prev-slide");
  const nextBtn = document.getElementById("btn-next-slide");
  const slidePillsContainer = document.getElementById("slide-pills-container");
  const scrollContainer = document.getElementById("scroll-mode-container");

  // Render Slide Navigation Pills
  renderSlidePills();

  // Render Initial Slide
  renderCurrentSlide();

  // Setup Event Listeners
  setupNavigationEvents();

  // ========================================================
  // RENDER SLIDE ENGINE
  // ========================================================

  function renderCurrentSlide() {
    if (state.viewMode === "scroll") return;

    const slide = deck.slides[state.currentSlide];
    if (!slide) return;

    // Update Progress and Counter
    const progressPercent = Math.round(((state.currentSlide + 1) / state.totalSlides) * 100);
    if (slideProgressBar) slideProgressBar.style.width = `${progressPercent}%`;
    if (slideCounter) {
      slideCounter.innerHTML = `
        <span class="font-en font-black text-blue-400 text-sm">0${state.currentSlide + 1}</span>
        <span class="text-slate-500 font-en text-xs">/ 0${state.totalSlides}</span>
      `;
    }

    // Update Prev/Next Buttons Disabled State
    if (prevBtn) prevBtn.disabled = state.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = state.currentSlide === state.totalSlides - 1;

    // Update Slide Pills Active Class
    updateSlidePillsActive();

    // Render Slide Content based on Type
    slideCanvas.innerHTML = `
      <div class="slide-fade-in w-full h-full flex flex-col justify-between">
        
        <!-- Top Slide Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between gap-4 mb-2">
            <span class="px-3.5 py-1 rounded-full text-xs font-bold font-en bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ${slide.badge}
            </span>
            <span class="text-xs text-slate-400 font-en font-bold">SLIDE 0${slide.slideNumber}</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">${slide.title}</h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-4xl">${slide.subtitle}</p>
        </div>

        <!-- Center Slide Body Content -->
        <div class="flex-1 my-2">
          ${getSlideBodyHTML(slide)}
        </div>

        <!-- Slide Footer Brand Note -->
        <div class="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 mt-6">
          <div class="flex items-center space-x-2 space-x-reverse">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span class="font-bold text-slate-400">سوق بلس | Marketplace PRD v1.0</span>
          </div>
          <span class="hidden sm:inline">استخدم أسهم لوحة المفاتيح ← و → للتنقل السريع بين الشرائح</span>
        </div>

      </div>
    `;

    // Refresh Lucide Icons
    if (window.lucide) window.lucide.createIcons();
  }

  // Slide Body HTML Generators
  function getSlideBodyHTML(slide) {
    switch (slide.type) {
      case "cover":
        return generateCoverHTML(slide);
      case "pillars":
        return generatePillarsHTML(slide);
      case "two-column":
        return generateTwoColumnHTML(slide);
      case "role-breakdown":
        return generateRoleBreakdownHTML(slide);
      case "workflow-visual":
        return generateWorkflowVisualHTML(slide);
      case "workflow-and-verification":
        return generateWorkflowAndVerificationHTML(slide);
      case "three-cards":
        return generateThreeCardsHTML(slide);
      case "monetization-deck":
        return generateMonetizationDeckHTML(slide);
      case "mvp-deck":
        return generateMvpDeckHTML(slide);
      default:
        return `<div class="text-slate-300">محتوى الشريحة</div>`;
    }
  }

  // 1. Cover Slide
  function generateCoverHTML(slide) {
    return `
      <div class="py-6 flex flex-col justify-center h-full">
        <!-- Callout Banner -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 mb-8">
          <p class="text-base sm:text-xl font-bold text-slate-100 leading-relaxed text-center">
            "${slide.callout}"
          </p>
        </div>

        <!-- 4 Big Metric Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${slide.metrics.map(m => `
            <div class="deck-card text-center p-6 border border-white/5">
              <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <i data-lucide="${m.icon}" class="w-6 h-6"></i>
              </div>
              <div class="text-xl sm:text-2xl font-black text-white mb-1 font-en">${m.value}</div>
              <div class="text-xs sm:text-sm font-bold text-slate-300">${m.label}</div>
              <div class="text-[11px] text-slate-400 mt-1">${m.sub}</div>
            </div>
          `).join("")}
        </div>

        <!-- CTA Trigger -->
        <div class="mt-8 text-center">
          <button onclick="window.goToSlide(1)" class="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 inline-flex items-center space-x-2 space-x-reverse transition-all hover:scale-105">
            <span>ابدأ استعراض العرض التقديمي</span>
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }

  // 2. Pillars Slide (What Does It Do?)
  function generatePillarsHTML(slide) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 py-4 h-full items-stretch">
        ${slide.pillars.map(p => `
          <div class="deck-card flex flex-col justify-between p-6">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="w-12 h-12 rounded-2xl bg-${p.color}-500/10 text-${p.color}-400 border border-${p.color}-500/20 flex items-center justify-center font-black font-en text-lg">
                  ${p.num}
                </span>
                <i data-lucide="${p.icon}" class="w-6 h-6 text-${p.color}-400"></i>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white mb-3">${p.title}</h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${p.desc}</p>
            </div>
            <div class="mt-6 pt-3 border-t border-white/5 text-[11px] text-slate-500 font-semibold flex items-center space-x-1 space-x-reverse">
              <i data-lucide="check" class="w-3.5 h-3.5 text-${p.color}-400"></i>
              <span>ميزة بنيوية أساسية في المنظومة</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // 3. Two Column Slide (Beneficiaries & Target Profiles)
  function generateTwoColumnHTML(slide) {
    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
        <!-- Left: Value for Stakeholders -->
        <div class="lg:col-span-6 space-y-3">
          <h3 class="text-base font-bold text-blue-400 mb-2 flex items-center space-x-2 space-x-reverse">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
            <span>${slide.leftTitle}</span>
          </h3>
          ${slide.leftItems.map(item => `
            <div class="deck-card p-4">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-white text-sm flex items-center space-x-2 space-x-reverse">
                  <i data-lucide="${item.icon}" class="w-4 h-4 text-blue-400"></i>
                  <span>${item.title}</span>
                </h4>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">${item.badge}</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">${item.desc}</p>
            </div>
          `).join("")}
        </div>

        <!-- Right: Target Seller Profiles -->
        <div class="lg:col-span-6 space-y-2">
          <h3 class="text-base font-bold text-emerald-400 mb-2 flex items-center space-x-2 space-x-reverse">
            <i data-lucide="store" class="w-4 h-4"></i>
            <span>${slide.rightTitle}</span>
          </h3>
          ${slide.rightProfiles.map(p => `
            <div class="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-white block">${p.ar}</span>
                <span class="text-[11px] text-slate-400">${p.desc}</span>
              </div>
              <span class="text-[10px] font-en font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0 mr-2">${p.name}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // 4. Role Breakdown & User Stories (Customer, Seller, Admin)
  function generateRoleBreakdownHTML(slide) {
    const rd = slide.roleDetails;
    return `
      <div class="space-y-6 py-2">
        <!-- Top Role Profile Bar (What Does, Responsible For, Can Do) -->
        <div class="deck-card p-5 border-r-4 border-r-${rd.color}-500">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            
            <div class="md:col-span-3 border-l border-white/10 pl-4">
              <div class="flex items-center space-x-3 space-x-reverse mb-2">
                <div class="w-10 h-10 rounded-xl bg-${rd.color}-500/20 text-${rd.color}-400 flex items-center justify-center">
                  <i data-lucide="${rd.icon}" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="font-black text-lg text-white">${rd.roleName}</h4>
                  <span class="text-[11px] text-slate-400">ملف الدور والصلاحيات</span>
                </div>
              </div>
              <div class="text-xs text-slate-300 mt-2">
                <span class="font-bold text-${rd.color}-400 block mb-0.5">بيعمل إيه؟</span>
                ${rd.whatDoes}
              </div>
            </div>

            <div class="md:col-span-4 border-l border-white/10 pl-4 text-xs text-slate-300">
              <span class="font-bold text-amber-400 block mb-1">مسؤول عن إيه؟ (Responsibilities)</span>
              <p class="leading-relaxed">${rd.responsibleFor}</p>
            </div>

            <div class="md:col-span-5 text-xs text-slate-300">
              <span class="font-bold text-emerald-400 block mb-1">بإمكانه يعمل إيه؟ (الصلاحيات والميزات)</span>
              <ul class="space-y-1 list-disc list-inside text-slate-300">
                ${rd.canDo.slice(0, 4).map(c => `<li>${c}</li>`).join("")}
              </ul>
            </div>

          </div>
        </div>

        <!-- Featured User Stories Section (Big, Clean, Formatted) -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-bold text-sm text-slate-200 flex items-center space-x-2 space-x-reverse">
              <i data-lucide="check-circle" class="w-4 h-4 text-blue-400"></i>
              <span>أهم قصص المستخدم لهذا الدور (User Stories):</span>
            </h4>
            <span class="text-xs text-slate-400 font-en">FORMAT: AS A / I WANT / SO THAT</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${slide.featuredStories.map(st => `
              <div class="deck-card p-4 border border-white/5 hover:border-blue-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-en text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">${st.id}</span>
                    <span class="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">بصفتي: ${st.asA}</span>
                  </div>
                  
                  <div class="space-y-2 mt-3">
                    <div class="text-xs text-slate-200">
                      <span class="font-bold text-slate-400 ml-1">أريد أن:</span>
                      <span class="font-semibold text-white">${st.iWant}</span>
                    </div>
                    <div class="text-xs text-slate-300">
                      <span class="font-bold text-slate-400 ml-1">حتى أتمكن من:</span>
                      <span class="text-blue-300 font-medium">${st.soThat}</span>
                    </div>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

      </div>
    `;
  }

  // 5. Workflow Visual (Customer & Admin)
  function generateWorkflowVisualHTML(slide) {
    return `
      <div class="py-4 space-y-6">
        <!-- 5 Steps Flow Horizontal -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          ${slide.flowSteps.map(st => `
            <div class="workflow-step deck-card p-5 text-center flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto mb-3 font-black font-en text-base">
                  ${st.step}
                </div>
                <h4 class="font-bold text-sm text-white mb-1">${st.title}</h4>
                <span class="text-[10px] font-en text-blue-400 font-bold block mb-2">${st.en}</span>
                <p class="text-xs text-slate-300 leading-relaxed">${st.desc}</p>
              </div>
              <div class="mt-4 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-semibold">
                ${st.rule}
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Flow Summary Box -->
        <div class="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/20 text-center">
          <p class="text-xs text-slate-300">
            <span class="font-bold text-blue-400">ملاحظة التدفق:</span> ${slide.flowSummary}
          </p>
        </div>
      </div>
    `;
  }

  // 6. Seller Workflow & Hybrid Verification
  function generateWorkflowAndVerificationHTML(slide) {
    const hv = slide.hybridVerification;
    return `
      <div class="space-y-6 py-2">
        <!-- Seller 5 Steps Flow -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          ${slide.flowSteps.map(st => `
            <div class="workflow-step deck-card p-4 text-center">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 font-black font-en text-sm">
                ${st.step}
              </div>
              <h4 class="font-bold text-xs sm:text-sm text-white mb-1">${st.title}</h4>
              <p class="text-[11px] text-slate-300 leading-relaxed">${st.desc}</p>
            </div>
          `).join("")}
        </div>

        <!-- Hybrid Verification Engine Box -->
        <div class="deck-card p-5 border border-emerald-500/30">
          <div class="mb-4">
            <h4 class="font-bold text-base text-white flex items-center space-x-2 space-x-reverse">
              <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400"></i>
              <span>${hv.title}</span>
            </h4>
            <p class="text-xs text-slate-300 mt-1">${hv.concept}</p>
          </div>

          <!-- 3 Tiers Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${hv.tiers.map(t => `
              <div class="p-4 rounded-xl bg-slate-900/90 border border-white/5">
                <span class="text-xs font-bold text-white block mb-1">${t.tier}</span>
                <span class="text-xs font-bold text-emerald-400 block mb-2 font-en">${t.action}</span>
                <p class="text-xs text-slate-300 leading-relaxed">${t.desc}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // 7. Three Cards Slide (Support & Infrastructure)
  function generateThreeCardsHTML(slide) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 py-4">
        ${slide.roles.map(r => `
          <div class="deck-card p-6 flex flex-col justify-between border-t-4 border-t-${r.color}-500">
            <div>
              <div class="flex items-center space-x-3 space-x-reverse mb-3">
                <div class="w-10 h-10 rounded-xl bg-${r.color}-500/10 text-${r.color}-400 flex items-center justify-center shrink-0">
                  <i data-lucide="${r.icon}" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="font-bold text-sm text-white">${r.roleName}</h4>
                  <span class="text-[10px] text-slate-400 font-en font-bold">${r.tag}</span>
                </div>
              </div>

              <p class="text-xs text-slate-300 leading-relaxed mb-4">${r.desc}</p>

              <div>
                <span class="text-xs font-bold text-white block mb-2">المسؤوليات الأساسية:</span>
                <ul class="space-y-1.5 text-xs text-slate-300 pr-4 list-disc list-outside">
                  ${r.responsibilities.map(res => `<li>${res}</li>`).join("")}
                </ul>
              </div>
            </div>

            <div class="mt-5 pt-3 border-t border-white/5 text-[11px] text-slate-400">
              طرف مساند أساسي لاستقرار المنصة
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // 8. Monetization & Flywheel
  function generateMonetizationDeckHTML(slide) {
    return `
      <div class="space-y-6 py-2">
        <!-- 5 Revenue Channels -->
        <div>
          <h4 class="font-bold text-sm text-slate-200 mb-3 flex items-center space-x-2 space-x-reverse">
            <i data-lucide="dollar-sign" class="w-4 h-4 text-emerald-400"></i>
            <span>مصادر الإيرادات الخمسة للمنصة (5 Revenue Streams):</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            ${slide.streams.map(st => `
              <div class="deck-card p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-en text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">${st.num}</span>
                  <span class="text-xs font-bold text-slate-300 font-en">${st.rate}</span>
                </div>
                <h5 class="font-bold text-xs text-white mb-1">${st.title}</h5>
                <p class="text-[11px] text-slate-400 leading-snug">${st.desc}</p>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Flywheel Growth Engine -->
        <div class="deck-card p-5 border border-blue-500/30">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-bold text-sm text-white flex items-center space-x-2 space-x-reverse">
              <i data-lucide="refresh-cw" class="w-4 h-4 text-blue-400"></i>
              <span>دولاب النمو الذاتي للمنصة (Business Growth Flywheel)</span>
            </h4>
            <span class="text-xs text-slate-400">كل خطوة تغذي التالية تلقائياً</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
            ${slide.flywheelSteps.map((step, idx) => `
              <div class="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col justify-center">
                <span class="font-bold text-blue-400 block">${step.label}</span>
                <span class="text-[11px] text-slate-400 mt-1">${step.sub}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // 9. MVP Deck & Roadmap
  function generateMvpDeckHTML(slide) {
    return `
      <div class="space-y-6 py-2">
        <!-- 3 Columns for MVP -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          ${slide.mvpColumns.map(col => `
            <div class="deck-card p-5">
              <div class="flex items-center space-x-3 space-x-reverse mb-4 pb-2 border-b border-white/10">
                <div class="w-9 h-9 rounded-xl bg-${col.color}-500/10 text-${col.color}-400 flex items-center justify-center">
                  <i data-lucide="${col.icon}" class="w-4 h-4"></i>
                </div>
                <h4 class="font-bold text-sm text-white">${col.title}</h4>
              </div>

              <ul class="space-y-2 text-xs text-slate-300 pr-4 list-disc list-outside">
                ${col.items.map(item => `<li>${item}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
        </div>

        <!-- Future Vision Callout -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border border-blue-500/40 text-center">
          <p class="text-xs sm:text-sm font-bold text-white leading-relaxed">
            "${slide.futureVision}"
          </p>
        </div>
      </div>
    `;
  }

  // ========================================================
  // NAVIGATION & CONTROLS
  // ========================================================

  function renderSlidePills() {
    if (!slidePillsContainer) return;
    slidePillsContainer.innerHTML = deck.slides.map((s, idx) => `
      <button class="shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${idx === state.currentSlide ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'}"
              onclick="window.goToSlide(${idx})">
        <span class="font-en ml-1">0${s.slideNumber}</span>
        <span>${getShortSlideName(s.id)}</span>
      </button>
    `).join("");
  }

  function getShortSlideName(id) {
    const map = {
      cover: "الغلاف",
      overview: "المنصة بتعمل إيه؟",
      beneficiaries: "المستفيدون والجمهور",
      "customer-role": "دور العميل",
      "customer-workflow": "مسار العميل",
      "seller-role": "دور البائع",
      "seller-workflow": "مسار البائع والتوثيق",
      "admin-role": "دور الإدارة",
      "admin-workflow": "مسار الإدارة",
      "support-and-providers": "الأدوار المساندة",
      "monetization-flywheel": "الأرباح ودولاب النمو",
      "mvp-roadmap": "نطاق الـ MVP"
    };
    return map[id] || id;
  }

  function updateSlidePillsActive() {
    if (!slidePillsContainer) return;
    slidePillsContainer.querySelectorAll("button").forEach((btn, idx) => {
      if (idx === state.currentSlide) {
        btn.className = "shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-lg transition-all";
      } else {
        btn.className = "shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all";
      }
    });
  }

  window.goToSlide = function(slideIndex) {
    if (slideIndex >= 0 && slideIndex < state.totalSlides) {
      state.currentSlide = slideIndex;
      renderCurrentSlide();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function setupNavigationEvents() {
    // Next / Prev Buttons
    prevBtn?.addEventListener("click", () => {
      if (state.currentSlide > 0) {
        state.currentSlide--;
        renderCurrentSlide();
      }
    });

    nextBtn?.addEventListener("click", () => {
      if (state.currentSlide < state.totalSlides - 1) {
        state.currentSlide++;
        renderCurrentSlide();
      }
    });

    // Keyboard Arrow Keys (RTL Aware: Left = Next, Right = Prev)
    window.addEventListener("keydown", (e) => {
      if (state.viewMode === "scroll") return;

      if (e.key === "ArrowLeft" || e.key === "PageDown" || e.key === " ") {
        if (state.currentSlide < state.totalSlides - 1) {
          state.currentSlide++;
          renderCurrentSlide();
        }
      } else if (e.key === "ArrowRight" || e.key === "PageUp") {
        if (state.currentSlide > 0) {
          state.currentSlide--;
          renderCurrentSlide();
        }
      } else if (e.key === "Home") {
        state.currentSlide = 0;
        renderCurrentSlide();
      } else if (e.key === "End") {
        state.currentSlide = state.totalSlides - 1;
        renderCurrentSlide();
      }
    });

    // Fullscreen Toggle
    document.getElementById("btn-fullscreen")?.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen().catch(err => console.log(err));
      }
    });

    // Theme Toggle
    document.getElementById("btn-theme-toggle")?.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme(state.theme);
    });

    // View Mode Toggle (Slide Mode vs Scroll Mode)
    document.getElementById("btn-view-mode")?.addEventListener("click", () => {
      state.viewMode = state.viewMode === "slide" ? "scroll" : "slide";
      toggleViewMode();
    });

    // Print / PDF Button
    document.getElementById("btn-print-deck")?.addEventListener("click", () => {
      if (state.viewMode === "slide") {
        state.viewMode = "scroll";
        toggleViewMode();
        setTimeout(() => window.print(), 300);
      } else {
        window.print();
      }
    });

    // Share / Copy Link Button
    document.getElementById("btn-share-link")?.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ رابط العرض التقديمي بنجاح!");
    });
  }

  function toggleViewMode() {
    const slideWrapper = document.getElementById("slide-wrapper");
    const scrollWrapper = document.getElementById("scroll-mode-wrapper");
    const modeBtnText = document.getElementById("view-mode-btn-text");

    if (state.viewMode === "scroll") {
      slideWrapper.classList.add("hidden");
      scrollWrapper.classList.remove("hidden");
      if (modeBtnText) modeBtnText.textContent = "عرض كشرائح (Slide Mode)";
      renderScrollMode();
    } else {
      slideWrapper.classList.remove("hidden");
      scrollWrapper.classList.add("hidden");
      if (modeBtnText) modeBtnText.textContent = "عرض متتالي (Scroll Mode)";
      renderCurrentSlide();
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function renderScrollMode() {
    const container = document.getElementById("scroll-mode-container");
    if (!container) return;

    container.innerHTML = deck.slides.map(slide => `
      <div class="slide-container mb-12" id="scroll-slide-${slide.slideNumber}">
        <div class="mb-6">
          <div class="flex items-center justify-between gap-4 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold font-en bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ${slide.badge}
            </span>
            <span class="text-xs text-slate-400 font-en font-bold">SLIDE 0${slide.slideNumber}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white">${slide.title}</h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">${slide.subtitle}</p>
        </div>

        <div class="my-4">
          ${getSlideBodyHTML(slide)}
        </div>

        <div class="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 mt-6">
          <span class="font-bold text-slate-400">سوق بلس | Marketplace PRD v1.0</span>
          <span>شريحة 0${slide.slideNumber} من 0${deck.slides.length}</span>
        </div>
      </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-mode");
      localStorage.setItem("deck_theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("deck_theme", "dark");
    }
  }
});
