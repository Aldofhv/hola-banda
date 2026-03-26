# Mala Hierba Workshop — Guía de despliegue

## Estructura de archivos

```
mala-hierba/
├── index.html              ← Página principal
├── netlify.toml            ← Configuración de Netlify
├── admin/
│   ├── index.html          ← Panel de edición (Netlify CMS)
│   └── config.yml          ← Campos editables del CMS
├── content/
│   ├── site.json           ← Textos generales del sitio
│   ├── fondo.json          ← Datos del Fondo Mala Hierba
│   ├── escritores/         ← Un JSON por escritor
│   └── proyectos/          ← Un JSON por proyecto
├── images/
│   └── uploads/            ← Imágenes subidas desde el CMS
├── css/
│   └── style.css
└── js/
    └── main.js
```

---

## Cómo subir el sitio a Netlify (gratis)

### Paso 1 — Crear cuenta en GitHub
Ve a https://github.com y crea una cuenta gratuita si no tienes.

### Paso 2 — Crear repositorio
1. Haz clic en "New repository"
2. Nombre: `mala-hierba-workshop`
3. Selecciona "Private" (recomendado)
4. Haz clic en "Create repository"

### Paso 3 — Subir archivos
1. Arrastra toda esta carpeta al repositorio de GitHub, o usa GitHub Desktop (https://desktop.github.com)

### Paso 4 — Crear cuenta en Netlify
Ve a https://netlify.com y crea cuenta gratuita (puedes entrar con GitHub).

### Paso 5 — Conectar repositorio
1. En Netlify: "Add new site" → "Import an existing project"
2. Selecciona GitHub → elige `mala-hierba-workshop`
3. Build command: (dejar vacío)
4. Publish directory: `.` (punto)
5. Haz clic en "Deploy site"

En 2 minutos tu sitio estará en una URL tipo `random-name.netlify.app`.

### Paso 6 — Activar el CMS
1. En Netlify: Settings → Identity → Enable Identity
2. Settings → Identity → Registration → Invite only
3. Settings → Identity → Services → Enable Git Gateway
4. Identity → Invite users → ingresa tu correo
5. Revisa tu correo y acepta la invitación

Listo. Entra a `tusitio.netlify.app/admin` para editar sin código.

---

## Dominio propio (opcional, ~$12 USD/año)

1. Compra un dominio en https://namecheap.com o https://porkbun.com
2. En Netlify: Site settings → Domain management → Add custom domain
3. Sigue las instrucciones para apuntar los DNS

---

## Agregar imágenes a escritores y proyectos

Desde el panel de edición (`/admin`):
- **Escritores** → selecciona un escritor → campo "Foto de perfil" → sube la imagen
- **Proyectos** → selecciona un proyecto → campo "Imagen de portada" → sube la imagen

Recomendaciones:
- Foto de escritor: cuadrada, mínimo 400×400px, formato JPG o WebP
- Imagen de proyecto: 1200×800px (landscape), formato JPG o WebP

---

## Agregar un nuevo proyecto

1. Ve a `/admin`
2. Sección "Proyectos del catálogo" → "New Proyectos del catálogo"
3. Llena los campos y guarda
4. El sitio se actualiza automáticamente en ~1 minuto

---

## Editar textos sin tocar código

Todo el contenido editable está en:
- `/admin` → "Configuración general" → textos del hero, manifiesto, contacto
- `/admin` → "Escritores" → bio, foto, rol
- `/admin` → "Proyectos del catálogo" → sinopsis, precio, imagen
- `/admin` → "Fondo Mala Hierba" → precios y descripción

---

## Conectar Stripe (futuro)

Cuando quieras activar pagos reales, la forma más sencilla sin backend es:
1. Crear productos en https://stripe.com
2. Usar **Stripe Payment Links** — genera una URL de pago por proyecto
3. Sustituir el botón "Cotizar" por el link directo de Stripe

Alternativa con más control: integrar **Stripe Checkout** con Netlify Functions.
