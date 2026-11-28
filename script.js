(() => {
  let data = window.INVITATION || {};
  let slideshowTimer;
  const renderContent = () => {
    const setText = (key, value) => document.querySelectorAll(`[data-content="${key}"]`).forEach(el => { el.textContent = value ?? ""; });
    Object.entries(data).forEach(([key, value]) => { if (typeof value === "string") setText(key, value); });
    document.title = `Mis XV años · ${data.name || "Invitación"}`;
    document.querySelector('[data-map="ceremony"]').href = data.ceremonyMap || "#";
    document.querySelector('[data-map="reception"]').href = data.receptionMap || "#";
    document.querySelectorAll("[data-map]").forEach(link => { if (link.getAttribute("href") !== "#") { link.target = "_blank"; link.rel = "noreferrer"; } else { link.removeAttribute("target"); } });
    const formUrl = data.googleFormUrl || "";
    document.getElementById("google-form").src = formUrl.replace(/\/viewform(?:\?.*)?$/, "/viewform?embedded=true");
    const timeline = document.getElementById("timeline"); timeline.replaceChildren();
    (data.schedule || []).forEach((item, i) => {
      const row = document.createElement("article"); row.className = "timeline-item reveal is-visible";
      row.innerHTML = `<span class="timeline-no">0${i + 1}</span><span class="timeline-time"></span><span class="timeline-dot"></span><div><h3></h3><p></p></div>`;
      row.querySelector(".timeline-time").textContent = item.time;
      row.querySelector("h3").textContent = item.title;
      row.querySelector("p").textContent = item.detail;
      timeline.append(row);
    });
    const slideshow = document.getElementById("date-slideshow");
    if (slideshowTimer) clearInterval(slideshowTimer);
    slideshow.replaceChildren();
    const slideSources = (data.dateSlides || []).length ? data.dateSlides : [data.gallery?.[2]?.src].filter(Boolean);
    const datePhotos = slideSources.map(item => typeof item === "string" ? item : item.src).filter(Boolean);
    datePhotos.forEach((src, index) => {
      const slide = document.createElement("div");
      slide.className = `date-photo${index === 0 ? " is-active" : ""}`;
      slide.style.backgroundImage = `url("${src}")`;
      slideshow.append(slide);
    });
    if (datePhotos.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let activeSlide = 0;
      slideshowTimer = setInterval(() => {
        const slides = slideshow.querySelectorAll(".date-photo");
        slides[activeSlide].classList.remove("is-active");
        activeSlide = (activeSlide + 1) % slides.length;
        slides[activeSlide].classList.add("is-active");
      }, 6000);
    }
    if (data.gallery?.[0]?.src) document.querySelector(".hero-photo").style.backgroundImage = `url("${data.gallery[0].src}")`;
    if (data.gallery?.[1]?.src) document.querySelector(".schedule-photo").style.backgroundImage = `url("${data.gallery[1].src}")`;
    if (data.gallery?.[3]?.src || data.gallery?.[0]?.src) document.querySelector(".rsvp-photo").style.backgroundImage = `url("${(data.gallery[3] || data.gallery[0]).src}")`;
    const setPhotoPosition = (selector, area, defaultY) => {
      const pos = data.photoPositions?.[area] || {};
      document.querySelectorAll(selector).forEach(el => { el.style.backgroundPosition = `${pos.x ?? 50}% ${pos.y ?? defaultY}%`; });
    };
    setPhotoPosition(".hero-photo", "hero", 42);
    setPhotoPosition(".date-slideshow .date-photo", "date", 46);
    setPhotoPosition(".schedule-photo", "schedule", 50);
    setPhotoPosition(".rsvp-photo", "rsvp", 54);
    music.src = data.musicUrl || "";
    document.querySelector(".rsvp-panel > p strong").textContent = data.rsvpDeadline || "";
    tick();
  };
  window.applyInvitationPreview = next => { data = next; renderContent(); };
  window.addEventListener("message", event => {
    if (event.source === window.parent && event.data?.type === "invitation-preview-update") {
      window.applyInvitationPreview(event.data.content);
    }
  });

  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  window.addEventListener("load", () => setTimeout(() => document.querySelector(".loading-screen")?.classList.add("loaded"), 350));

  const tick = () => {
    const targetDate = new Date(data.date || "2027-11-27T17:00:00");
    let ms = Math.max(0, targetDate.getTime() - Date.now());
    const days = Math.floor(ms / 86400000); ms %= 86400000;
    const hours = Math.floor(ms / 3600000); ms %= 3600000;
    const minutes = Math.floor(ms / 60000); const seconds = Math.floor(ms % 60000 / 1000);
    document.querySelector('[data-count="days"]').textContent = String(days).padStart(3, "0");
    document.querySelector('[data-count="hours"]').textContent = String(hours).padStart(2, "0");
    document.querySelector('[data-count="minutes"]').textContent = String(minutes).padStart(2, "0");
    document.querySelector('[data-count="seconds"]').textContent = String(seconds).padStart(2, "0");
  };
  tick(); setInterval(tick, 1000);

  const music = document.getElementById("event-song");
  const musicButton = document.querySelector(".music-button");
  renderContent();
  musicButton.addEventListener("click", () => {
    if (!data.musicUrl) { musicButton.classList.add("needs-music"); musicButton.querySelector(".music-label").textContent = "Agrega tu canción en content.js"; return; }
    if (music.paused) music.play().then(() => { musicButton.setAttribute("aria-pressed", "true"); musicButton.querySelector(".music-label").textContent = "Pausar música"; }).catch(() => {});
    else { music.pause(); musicButton.setAttribute("aria-pressed", "false"); musicButton.querySelector(".music-label").textContent = "Escuchar música"; }
  });
  music.addEventListener("ended", () => { musicButton.setAttribute("aria-pressed", "false"); musicButton.querySelector(".music-label").textContent = "Escuchar música"; });
})();
