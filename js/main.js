/* =========================================================
   Grupo NIEM S.A.S. — lógica del sitio
   El contenido editable vive en /data:
     - servicios.json → servicios, fotos y opciones del formulario
     - empresa.json   → contacto, beneficios, sectores, zonas,
                        eventos y socios
   ========================================================= */

const RUTAS = {
  servicios: "data/servicios.json",
  empresa: "data/empresa.json",
};

let empresa = null;
let observador = null;

/* ---------- Utilidades ---------- */
async function cargarJSON(ruta) {
  const respuesta = await fetch(ruta, { cache: "no-cache" });
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${ruta} (${respuesta.status})`);
  return respuesta.json();
}

function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto) el.textContent = texto;
  return el;
}

/* Imagen con respaldo: si el archivo no existe, se muestran las rayas de la marca */
function crearFoto(clase, src, alt) {
  const figura = crear("figure", clase);
  const img = crear("img");
  img.src = src;
  img.alt = alt || "";
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("error", () => figura.classList.add("sin-foto"));
  figura.append(img);
  return figura;
}

/* Marca un elemento para que aparezca al hacer scroll */
function revelar(el, indice = 0) {
  el.setAttribute("data-revelar", "");
  el.style.setProperty("--retraso", `${Math.min(indice, 6) * 0.08}s`);
  if (observador) observador.observe(el);
  else el.classList.add("visible");
}

/* ---------- Servicios ---------- */
function mostrarServicios(servicios) {
  const lista = document.getElementById("lista-servicios");
  const select = document.getElementById("f-servicio");
  const opcionVarios = select.lastElementChild;
  lista.replaceChildren();

  servicios.forEach((s) => {
    const art = crear("article", "servicio");
    art.id = `servicio-${s.id}`;

    const texto = crear("div", "servicio__texto");
    texto.append(crear("h3", "servicio__nombre", s.nombre), crear("p", "servicio__resumen", s.resumen));

    const ul = crear("ul", "servicio__lista");
    s.incluye.forEach((item) => ul.append(crear("li", null, item)));
    texto.append(ul);

    art.append(crearFoto("servicio__foto", s.imagen, s.alt), texto);
    lista.append(art);
    revelar(art);

    const opcion = crear("option", null, s.nombre);
    opcion.value = s.nombre;
    select.insertBefore(opcion, opcionVarios);
  });
  select.selectedIndex = 0;
}

/* ---------- Datos de la empresa ---------- */
function mostrarEmpresa(d) {
  // Beneficios
  const beneficios = document.getElementById("lista-beneficios");
  d.beneficios.forEach((b, i) => {
    const li = crear("li", "beneficio");
    li.append(crear("h3", null, b.titulo), crear("p", null, b.texto));
    beneficios.append(li);
    revelar(li, i);
  });

  // Sectores
  const sectores = document.getElementById("lista-sectores");
  d.sectores.forEach((s, i) => {
    const li = crear("li", null, s);
    sectores.append(li);
    revelar(li, i);
  });

  // Socios
  const socios = document.getElementById("lista-socios");
  d.socios.forEach((p, i) => {
    const li = crear("li", "socio");
    const fig = crear("figure");
    const foto = crear("div", "socio__foto");
    const img = crear("img");
    img.src = p.foto;
    img.alt = p.nombre;
    img.loading = "lazy";
    foto.append(img);
    const cap = crear("figcaption");
    cap.append(crear("span", "socio__nombre", p.nombre), crear("span", "socio__cargo", p.cargo));
    fig.append(foto, cap);
    li.append(fig);
    socios.append(li);
    revelar(li, i + 1);
  });

  // Teléfonos
  const telefonos = document.getElementById("lista-telefonos");
  d.telefonos.forEach((t) => {
    const li = crear("li");
    const a = crear("a", "enlace-claro", t.mostrar);
    a.href = `https://wa.me/${t.whatsapp}`;
    a.target = "_blank";
    a.rel = "noopener";
    li.append(crear("span", "zona", t.zona), a);
    telefonos.append(li);
  });

  // Zonas
  const zonas = document.getElementById("lista-zonas");
  d.zonas.forEach((z) => zonas.append(crear("li", null, z)));

  // Correo, Instagram y WhatsApp flotante
  const email = document.getElementById("dato-email");
  email.href = `mailto:${d.email}`;
  email.textContent = d.email;

  const ig = document.getElementById("dato-instagram");
  ig.href = d.instagram.url;
  ig.textContent = d.instagram.usuario;

  document.getElementById("whatsapp-flotante").href = `https://wa.me/${d.whatsappPrincipal}`;
}

/* ---------- Formulario → WhatsApp ---------- */
function prepararFormulario() {
  const form = document.getElementById("formulario");
  const error = document.getElementById("f-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const servicio = form.servicio.value;
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !mensaje) {
      error.textContent = "Completá tu nombre y contanos qué necesitás.";
      error.hidden = false;
      (nombre ? form.mensaje : form.nombre).focus();
      return;
    }
    error.hidden = true;

    const texto = `Hola, soy ${nombre}. Quiero pedir presupuesto de: ${servicio}.\n\n${mensaje}`;
    const numero = empresa?.whatsappPrincipal || "5493625223732";
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });
}

/* ---------- Menú móvil ---------- */
function prepararMenu() {
  const boton = document.querySelector(".menu-boton");
  const menu = document.getElementById("menu");

  const cerrar = () => {
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
  };

  boton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", String(abierto));
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrar));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
}

/* ---------- Sombra de la cabecera al bajar ---------- */
function prepararCabecera() {
  const cabecera = document.getElementById("cabecera");
  const actualizar = () => cabecera.classList.toggle("con-sombra", window.scrollY > 10);
  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();
}

/* ---------- Animaciones al hacer scroll ---------- */
function prepararRevelado() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-revelar]").forEach((el) => el.classList.add("visible"));
    return;
  }
  observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll("[data-revelar]").forEach((el) => observador.observe(el));
}

/* ---------- Inicio ---------- */
document.getElementById("anio").textContent = new Date().getFullYear();
prepararRevelado();
prepararMenu();
prepararCabecera();
prepararFormulario();

cargarJSON(RUTAS.servicios)
  .then(mostrarServicios)
  .catch((err) => {
    console.error(err);
    document.getElementById("lista-servicios").replaceChildren(
      crear("p", "aviso", "No pudimos cargar los servicios. Escribinos y te contamos todo lo que hacemos.")
    );
  });

cargarJSON(RUTAS.empresa)
  .then((datos) => {
    empresa = datos;
    mostrarEmpresa(datos);
  })
  .catch((err) => console.error(err));
