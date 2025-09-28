# Sistema de Reporte Diario de Avance en Obra

Este proyecto es una solución web moderna diseñada para reemplazar los métodos manuales y tradicionales de reporte de avance en proyectos de construcción. A través de un formulario web dinámico e interactivo, se estandariza la captura de datos desde el campo y se automatiza el flujo de información hacia la oficina, permitiendo una toma de decisiones ágil y basada en datos precisos.

## El Problema

Los métodos tradicionales de reporte (anotaciones, mensajes de texto, fotos por WhatsApp) generan problemas fundamentales que afectan la eficiencia de un proyecto:
- **Datos Inconsistentes:** Diferentes supervisores reportan en distintos formatos y unidades.
- **Proceso Manual y Lento:** El personal de oficina invierte horas en descifrar, consolidar y transcribir datos, un proceso propenso a errores.
- **Visibilidad Retrasada:** Las decisiones se vuelven reactivas, ya que los resúmenes y problemas se conocen demasiado tarde.

## La Solución: Un Flujo de Trabajo Digital

Este sistema implementa un flujo de trabajo digital que captura la información de manera estructurada desde su origen y la procesa automáticamente.

**Formulario Web (Frontend) → n8n (Backend/Automatización) → Google Sheets / Drive (Almacenamiento)**

El supervisor de campo utiliza el formulario web desde cualquier dispositivo (celular, tablet) para registrar todas las actividades del turno. Al enviar, los datos viajan en formato JSON a un webhook de **n8n**, que se encarga de procesar, calcular y archivar la información en una base de datos en **Google Sheets** y la evidencia fotográfica en **Google Drive**, creando una fuente única de verdad para el proyecto.

## ✨ Características del Formulario

- **Interfaz Dinámica:** El formulario muestra campos relevantes basados en las selecciones del usuario, manteniéndolo limpio e intuitivo.
- **Secciones Repetibles:** Permite registrar múltiples actividades, equipos o maquinarias sin recargar la página, gracias a la duplicación de secciones.
- **Lógica Condicional:** Campos y secciones enteras aparecen o desaparecen según las respuestas, como en el caso de "Actividades de Soporte" o "Restricciones".
- **Cálculos Automáticos:** Calcula en tiempo real métricas clave como el volumen de material movido (Largo x Ancho x Alto).
- **Diseño Responsivo:** Totalmente funcional en dispositivos móviles para facilitar su uso en campo.

## 🛠️ Stack Tecnológico

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (Vanilla)

- **Backend y Automatización:**
  - **n8n:** Como motor principal para recibir los datos (Webhook) y orquestar el flujo de trabajo.

- **Infraestructura de Despliegue:**
  - **Google Cloud Platform (GCP):** Hosting de la máquina virtual (VPS).
  - **Coolify:** Plataforma de auto-hosting para desplegar la aplicación estática y gestionar los certificados SSL.
  - **Cloudflare:** Gestión de DNS.

- **Almacenamiento de Datos:**
  - **Google Sheets:** Actúa como la base de datos centralizada para los reportes.
  - **Google Drive:** Almacena la evidencia fotográfica.

## 🚀 Próximos Pasos y Mejoras

- [ ] Integración del logo de la empresa.
- [ ] Implementación de un visor de plano interactivo para facilitar la ubicación de las actividades.
- [ ] Desarrollo de los "Casos de Excavación".
- [ ] Creación de un Dashboard en Looker Studio conectado a Google Sheets para la visualización de KPIs en tiempo real.
