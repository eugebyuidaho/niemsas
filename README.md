# Sitio web de Grupo NIEM S.A.S.

Sitio estático (HTML, CSS, JavaScript y JSON) publicado en https://gruponiemsas.online, alojado en DonWeb (panel Ferozo) y desplegado con Git.

## Estructura

```
index.html          Página principal
css/styles.css      Estilos (colores y fuentes en :root, al principio)
js/main.js          Carga el contenido desde /data, menú móvil y formulario
data/servicios.json Servicios que se muestran en la página
data/empresa.json   Correo, WhatsApp, zonas de cobertura y eventos
img/                Fotos, logo y favicon
robots.txt          Reglas para buscadores
sitemap.xml         Mapa del sitio para Google
.htaccess           Configuración del servidor Apache
```

## Cómo editar el contenido

La mayoría de los cambios se hacen en los archivos de `data/`, sin tocar el HTML.

- **Agregar o cambiar un servicio:** editar `data/servicios.json`. Cada servicio tiene `id`, `nombre`, `resumen` e `incluye` (lista). El formulario de contacto toma los servicios de este mismo archivo.
- **WhatsApp:** en `data/empresa.json`, `whatsappPrincipal` es el número que recibe los mensajes del formulario y del botón flotante. Formato internacional sin `+` ni espacios (`549` + característica + número).
- **Socios, beneficios y sectores:** listas `socios`, `beneficios` y `sectores` en `data/empresa.json`.
- **Cambiar una foto:** reemplazar el archivo en `img/` con el mismo nombre, o cambiar la ruta en el JSON. Si una foto no existe, el sitio muestra las rayas de la marca en su lugar.
- **Agregar un evento a Trayectoria:** sumar un objeto `{ "nombre": "...", "lugar": "..." }` en `eventos`.
- **Cambiar zonas:** editar la lista `zonas`.

Revisar siempre que el JSON sea válido (comas y comillas). Un error de sintaxis hace que esa sección no cargue.

## Probar en la computadora

`fetch()` no funciona abriendo `index.html` con doble clic. Usar la extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*).

## Flujo de trabajo con Git

```bash
git add .
git commit -m "Describe el cambio"
git push
```

Después, en Ferozo → **Mi Sitio Web → GIT**, usar la opción de desplegar (o activar la implementación automática) para que el hosting tome los cambios.

## Tamaños de pantalla

Estilos mobile-first en `css/styles.css`: celulares (base), tablets (`min-width: 600px`) y computadoras (`min-width: 1024px`).

## Pendientes

- [ ] `img/mantenimiento.jpg`: foto de mantenimiento (aire acondicionado, electricidad o pintura)
- [ ] `img/bienal.jpg`: foto propia de la Bienal del Chaco
- [ ] Confirmar qué socio corresponde a `socio-1.jpg` y `socio-2.jpg`
- [ ] Confirmar que alguien revise contacto@gruponiemsas.online (o reenviarlo al Gmail)
- [ ] Activar la redirección a HTTPS en `.htaccess` cuando el SSL esté funcionando
- [ ] Dar de alta el sitio en Google Search Console y enviar `sitemap.xml`
