(function () {
  const layer = document.getElementById("markersLayer");
  const tooltip = document.getElementById("tooltip");
  const container = document.getElementById("mapContainer");
  const countEl = document.getElementById("schoolCount");

  const SCHOOL_ICON_SVG = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 5.5 7.2 11.4 7.5 11.7.3.2.7.2 1 0C12.8 21.4 20 15.5 20 10c0-4.4-3.6-8-8-8z"
            fill="#c8362b" stroke="#fff" stroke-width="1.4"/>
      <g transform="translate(12 9.5)">
        <rect x="-4.2" y="-2.2" width="8.4" height="4.6" rx="0.5" fill="#fff"/>
        <polygon points="-4.6,-2.2 0,-4.6 4.6,-2.2" fill="#fff"/>
        <rect x="-0.8" y="-0.6" width="1.6" height="3" fill="#c8362b"/>
      </g>
    </svg>`;

  function googleMapsUrl(direccion) {
    const q = encodeURIComponent(`${direccion}, Región de La Araucanía, Chile`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  function showTooltip(school, marker) {
    tooltip.innerHTML = `
      <strong>${escapeHtml(school.nombre)}</strong>
      <span class="addr">${escapeHtml(school.direccion)}</span>
      <div class="hint">Clic para abrir en Google Maps</div>
    `;
    const containerRect = container.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const x = markerRect.left + markerRect.width / 2 - containerRect.left;
    const y = markerRect.top - containerRect.top;
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    tooltip.classList.add("visible");
  }

  function hideTooltip() {
    tooltip.classList.remove("visible");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function createMarker(school) {
    const el = document.createElement("a");
    el.className = "marker";
    el.href = googleMapsUrl(school.direccion);
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.style.left = school.x + "%";
    el.style.top = school.y + "%";
    el.setAttribute("aria-label", `${school.nombre} — ${school.direccion}`);
    el.innerHTML = SCHOOL_ICON_SVG;

    el.addEventListener("mouseenter", () => showTooltip(school, el));
    el.addEventListener("mouseleave", hideTooltip);
    el.addEventListener("focus", () => showTooltip(school, el));
    el.addEventListener("blur", hideTooltip);

    return el;
  }

  SCHOOLS.forEach((s) => layer.appendChild(createMarker(s)));
  countEl.textContent = `${SCHOOLS.length} colegios en el mapa`;

  window.addEventListener("scroll", hideTooltip, { passive: true });
  window.addEventListener("resize", hideTooltip);
})();
