(() => {
  let data = window.INVITATION || {};
  const renderContent = () => {
    const setText = (key, value) => document.querySelectorAll(`[data-content="${key}"]`).forEach(el => { el.textContent = value ?? ""; });
    Object.entries(data).forEach(([key, value]) => { if (typeof value === "string") setText(key, value); });
    document.title = `Mis XV años · ${data.name || "Invitación"}`;
    document.querySelector('[data-map="ceremony"]').href = data.ceremonyMap || "#";
    document.querySelector('[data-map="reception"]').href = data.receptionMap || "#";
    document.querySelectorAll("[data-map]").forEach(link => { if (link.getAttribute("href") !== "#") { link.target = "_blank"; link.rel = "noreferrer"; } else { link.removeAttribute("target"); } });
    const timeline = document.getElementById("timeline"); timeline.replaceChildren();
    (data.schedule || []).forEach((item, i) => {
      const row = document.createElement("article"); row.className = "timeline-item reveal is-visible";
      row.innerHTML = `<span class="timeline-no">0${i + 1}</span><span class="timeline-time"></span><span class="timeline-dot"></span><div><h3></h3><p></p></div>`;
      row.querySelector(".timeline-time").textContent = item.time;
      row.querySelector("h3").textContent = item.title;
      row.querySelector("p").textContent = item.detail;
      timeline.append(row);
    });
    if (data.gallery?.[0]?.src) document.querySelector(".hero-photo").style.backgroundImage = `url("${data.gallery[0].src}")`;
    if (data.gallery?.[2]?.src) document.querySelector(".date-photo").style.backgroundImage = `url("${data.gallery[2].src}")`;
    if (data.gallery?.[1]?.src) document.querySelector(".schedule-photo").style.backgroundImage = `url("${data.gallery[1].src}")`;
    if (data.gallery?.[3]?.src) document.querySelector(".rsvp-photo").style.backgroundImage = `url("${data.gallery[3].src}")`;
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
  document.querySelector('[name="attendance"]').addEventListener("change", e => document.querySelector(".guest-count-wrap").hidden = e.target.value !== "yes");
  document.querySelector("#rsvp-form").addEventListener("submit", e => {
    e.preventDefault(); const form = new FormData(e.currentTarget);
    const record = { name: form.get("guest"), attendance: form.get("attendance"), guests: form.get("attendance") === "yes" ? form.get("guests") : 0, savedAt: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem("quince-rsvps") || "[]"); all.push(record); localStorage.setItem("quince-rsvps", JSON.stringify(all));
    e.currentTarget.hidden = true; document.querySelector(".rsvp-success").hidden = false;
  });
})();
