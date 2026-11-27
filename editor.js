(() => {
  const original = structuredClone(window.INVITATION || {});
  let content = structuredClone(original);
  const frame = document.getElementById("invitation-preview");
  const fields = [...document.querySelectorAll("[data-key]")];
  const saveState = document.getElementById("save-state");
  const schedules = document.getElementById("schedule");
  const photos = document.getElementById("photos");
  const positionSliders = [...document.querySelectorAll("[data-position]")];
  const formatSchedule = items => (items || []).map(item => `${item.time} | ${item.title} | ${item.detail}`).join("\n");
  const parseSchedule = value => value.split("\n").map(line => line.split("|").map(part => part.trim())).filter(parts => parts[0] && parts[1]).map(([time, title, detail = ""]) => ({ time, title, detail }));
  const formatPhotos = items => (items || []).map(item => item.src).join("\n");
  const preview = () => frame.contentWindow?.postMessage({ type: "invitation-preview-update", content }, "*");
  const persist = () => {
    try { localStorage.setItem("quince-invitation-draft", JSON.stringify({ base: original, draft: content })); saveState.textContent = "Borrador guardado"; }
    catch { saveState.textContent = "Vista previa actualizada"; }
  };
  const populate = () => {
    fields.forEach(field => {
      const val = content[field.dataset.key] ?? "";
      field.value = field.type === "datetime-local" && val ? val.slice(0, 16) : val;
    });
    schedules.value = formatSchedule(content.schedule);
    photos.value = formatPhotos(content.gallery);
    positionSliders.forEach(slider => {
      const [area, axis] = slider.dataset.position.split("-");
      const value = content.photoPositions?.[area]?.[axis] ?? 50;
      slider.value = value;
      document.querySelector(`[data-position-value="${slider.dataset.position}"]`).value = `${value}%`;
    });
  };
  try {
    const saved = JSON.parse(localStorage.getItem("quince-invitation-draft") || "null");
    if (saved?.draft && JSON.stringify(saved.base) === JSON.stringify(original)) content = { ...content, ...saved.draft };
    else if (saved) saveState.textContent = "Se cargó la versión actual del proyecto";
  } catch {}
  populate();
  frame.addEventListener("load", preview);
  fields.forEach(field => field.addEventListener("input", () => {
    content[field.dataset.key] = field.type === "datetime-local" && field.value ? field.value : field.value;
    if (field.dataset.key === "date") {
      const date = new Date(field.value);
      if (!Number.isNaN(date.getTime())) {
        content.dateDay = new Intl.DateTimeFormat("es", { weekday: "long" }).format(date);
        content.dateMonth = new Intl.DateTimeFormat("es", { month: "short" }).format(date).replace(".", "").toUpperCase();
        content.dateNumber = String(date.getDate()).padStart(2, "0");
        content.dateYear = String(date.getFullYear());
        populate();
      }
    }
    preview(); persist(); saveState.textContent = "Borrador guardado";
  }));
  schedules.addEventListener("input", () => { content.schedule = parseSchedule(schedules.value); preview(); persist(); });
  photos.addEventListener("input", () => {
    content.gallery = photos.value.split("\n").map(src => src.trim()).filter(Boolean).map((src, i) => ({ src, alt: `Foto ${i + 1} de la quinceañera` }));
    preview(); persist();
  });
  positionSliders.forEach(slider => slider.addEventListener("input", () => {
    const [area, axis] = slider.dataset.position.split("-");
    content.photoPositions ||= {};
    content.photoPositions[area] ||= { x: 50, y: 50 };
    content.photoPositions[area][axis] = Number(slider.value);
    document.querySelector(`[data-position-value="${slider.dataset.position}"]`).value = `${slider.value}%`;
    preview(); persist();
  }));
  document.getElementById("reset").addEventListener("click", () => {
    if (!window.confirm("Esto borrará el borrador guardado en este navegador y lo reemplazará con los datos que se cargaron desde content.js. ¿Quieres continuar?")) return;
    content = structuredClone(original);
    try { localStorage.removeItem("quince-invitation-draft"); } catch {}
    populate(); preview(); saveState.textContent = "Restablecido al contenido original";
  });
  document.getElementById("download").addEventListener("click", () => {
    const file = `window.INVITATION = ${JSON.stringify(content, null, 2)};\n`;
    const url = URL.createObjectURL(new Blob([file], { type: "text/javascript" }));
    const link = document.createElement("a"); link.href = url; link.download = "content.js"; link.click(); URL.revokeObjectURL(url);
    saveState.textContent = "Archivo descargado";
  });
})();
