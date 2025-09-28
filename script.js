document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN ---
    // Recuerda reemplazar esto con tu URL de n8n si es diferente
    const WEBHOOK_URL = 'https://n8n.apps1.astraera.space/webhook/opemip';

    // --- ELEMENTOS DEL DOM ---
    const form = document.getElementById('reporteForm');
    const supervisorSelect = document.getElementById('supervisor');
    const supervisorOtroInput = document.getElementById('supervisorOtro');
    const tipoActividadPrincipal = document.getElementById('tipoActividadPrincipal');
    const subActividadContainer = document.getElementById('subActividadContainer');
    const tipoSubActividad = document.getElementById('tipoSubActividad');
    const dynamicFormsContainer = document.getElementById('dynamic-forms-container');
    const soporteSwitch = document.getElementById('soporteSwitch');
    const dynamicSoporteContainer = document.getElementById('dynamic-soporte-container');
    const equiposContainer = document.getElementById('equipos-utilizados-container');
    const addEquipoBtn = document.getElementById('add-equipo-btn');
    const restriccionesSwitch = document.getElementById('restricciones-switch');
    const restriccionesTextoContainer = document.getElementById('restricciones-texto-container');

    // --- TEMPLATES ---
    const templateContenidoGeneral = document.getElementById('template-contenido-general');
    const templateLimpieza = document.getElementById('template-limpieza');
    const templateSoporteActividad = document.getElementById('template-soporte-actividad');
    const templateMaquinariaFila = document.getElementById('template-maquinaria-fila');
    const templateEquipoFila = document.getElementById('template-equipo-fila');

    const subActividades = {
        colocacionRelleno: [ { value: 'filetes', text: 'Caso 1.1 Filetes' }, { value: 'sector', text: 'Caso 1.2 Sector' } ]
    };

    // --- MANEJO DE EVENTOS ---

    supervisorSelect.addEventListener('change', () => supervisorOtroInput.classList.toggle('hidden', supervisorSelect.value !== 'Otro'));

    tipoActividadPrincipal.addEventListener('change', () => {
        const selection = tipoActividadPrincipal.value;
        dynamicFormsContainer.innerHTML = '';
        subActividadContainer.classList.add('hidden');
        if (subActividades[selection]) {
            populateSubActividad(subActividades[selection]);
            subActividadContainer.classList.remove('hidden');
        } else if (selection === 'limpieza') {
            addLimpiezaCard();
        } else if (selection === "excavacion") {
            alert('Este caso se desarrollará posteriormente.');
        }
    });

    tipoSubActividad.addEventListener('change', () => {
        dynamicFormsContainer.innerHTML = '';
        if (tipoSubActividad.value) addActivityCard(tipoSubActividad.value);
    });

    dynamicFormsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) e.target.closest('.activity-card').remove();
        if (e.target.classList.contains('clone-btn')) {
            const originalCard = e.target.closest('.activity-card');
            originalCard.after(originalCard.cloneNode(true));
        }
    });

    dynamicFormsContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('volume-input')) calculateVolume(e.target.closest('.activity-card'));
    });

    soporteSwitch.addEventListener('change', () => {
        if (soporteSwitch.value === 'SI' && dynamicSoporteContainer.children.length === 0) {
            addSoporteCard();
        } else if (soporteSwitch.value === 'NO') {
            dynamicSoporteContainer.innerHTML = '';
        }
    });

    dynamicSoporteContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) e.target.closest('.soporte-card').remove();
        if (e.target.closest('.clone-btn')) {
            const originalCard = e.target.closest('.soporte-card');
            originalCard.after(originalCard.cloneNode(true));
        }
        if (e.target.classList.contains('add-maquinaria-btn')) addMaquinariaRow(e.target.parentElement);
        if (e.target.classList.contains('remove-maquinaria-btn')) e.target.closest('.maquinaria-row').remove();
    });

    dynamicSoporteContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('maquinaria-switch')) {
            const card = e.target.closest('.soporte-card');
            card.querySelector('.maquinaria-container').classList.toggle('hidden', e.target.value === 'NO');
        }
    });

    addEquipoBtn.addEventListener('click', addEquipoRow);
    equiposContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-row-btn')) e.target.closest('.equipo-row').remove();
    });
    restriccionesSwitch.addEventListener('change', () => {
        restriccionesTextoContainer.classList.toggle('hidden', restriccionesSwitch.value === 'NO');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datosReporte = collectFormData();
        console.log("Enviando datos:", JSON.stringify(datosReporte, null, 2));
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosReporte),
            });
            if (response.ok) {
                alert('¡Reporte enviado con éxito!');
                location.reload();
            } else {
                alert(`Error al enviar el reporte: ${response.statusText}`);
            }
        } catch (error) {
            alert(`Error de conexión: ${error.message}`);
        }
    });

    // --- FUNCIONES AUXILIARES ---

    function populateSubActividad(options) {
        tipoSubActividad.innerHTML = '<option value="">Seleccione...</option>';
        options.forEach(opt => {
            const optionEl = document.createElement('option');
            optionEl.value = opt.value;
            optionEl.textContent = opt.text;
            tipoSubActividad.appendChild(optionEl);
        });
    }

    function addActivityCard(type) {
        const card = templateContenidoGeneral.content.cloneNode(true).querySelector('.activity-card');
        card.dataset.type = type;
        const placeholder = card.querySelector('[data-placeholder="identificador"]');
        if (type === 'filetes') {
            placeholder.innerHTML = `<label># Filete:</label><input type="number" name="identificador_valor" placeholder="0" required>`;
        } else if (type === 'sector') {
            placeholder.innerHTML = `<label>Sector:</label><input type="text" name="identificador_valor" placeholder="Ej: ABC" required>`;
        }
        dynamicFormsContainer.appendChild(card);
    }

    function addLimpiezaCard() {
        const card = templateLimpieza.content.cloneNode(true);
        card.querySelector('.activity-card').dataset.type = 'limpieza';
        dynamicFormsContainer.appendChild(card);
    }
    
    function addSoporteCard() {
        dynamicSoporteContainer.appendChild(templateSoporteActividad.content.cloneNode(true));
    }
    
    function addMaquinariaRow(container) {
        container.insertBefore(templateMaquinariaFila.content.cloneNode(true), container.querySelector('.add-maquinaria-btn'));
    }

    function addEquipoRow() {
        equiposContainer.appendChild(templateEquipoFila.content.cloneNode(true));
    }

    function calculateVolume(card) {
        const largo = parseFloat(card.querySelector('[name="vol_largo"]').value) || 0;
        const ancho = parseFloat(card.querySelector('[name="vol_ancho"]').value) || 0;
        const alto = parseFloat(card.querySelector('[name="vol_alto"]').value) || 0;
        card.querySelector('.calculated-volume').value = (largo * ancho * alto).toFixed(2);
    }

    function collectFormData() {
        const data = {
            fecha: document.getElementById('fecha').value,
            turno: document.getElementById('turno').value,
            ubicacion: document.getElementById('ubicacion').value,
            supervisor: supervisorSelect.value === 'Otro' ? supervisorOtroInput.value : supervisorSelect.value,
            actividades_principales: collectMainActivities(),
            actividades_soporte: collectSoporteActivities(),
            equipos_utilizados: [],
            restricciones: {
                hubo: restriccionesSwitch.value,
                descripcion: restriccionesSwitch.value === 'SI' ? document.getElementById('restricciones-texto').value : ''
            },
            pendientes: document.getElementById('pendientes-texto').value
        };

        equiposContainer.querySelectorAll('.equipo-row').forEach(row => {
            data.equipos_utilizados.push({
                cantidad: row.querySelector('[name="equipo_cantidad"]').value,
                equipo: row.querySelector('[name="equipo_nombre"]').value
            });
        });
        
        return data;
    }

    function collectMainActivities() {
        const activities = [];
        dynamicFormsContainer.querySelectorAll('.activity-card').forEach(card => {
            const cardData = { tipo_general: tipoActividadPrincipal.options[tipoActividadPrincipal.selectedIndex].text };
            const type = card.dataset.type;
            if (type === 'filetes' || type === 'sector') {
                cardData.tipo_especifico = tipoSubActividad.options[tipoSubActividad.selectedIndex].text;
                cardData.identificador_tipo = type === 'filetes' ? 'Filete' : 'Sector';
            }
            card.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.name) cardData[input.name] = input.value;
            });
            activities.push(cardData);
        });
        return activities;
    }

    function collectSoporteActivities() {
        const activities = [];
        if (soporteSwitch.value === 'SI') {
            dynamicSoporteContainer.querySelectorAll('.soporte-card').forEach(card => {
                const soporteData = {
                    descripcion: card.querySelector('[name="soporte_descripcion"]').value,
                    personal_civil: card.querySelector('[name="soporte_personal"]').value,
                    tiempo_hrs: card.querySelector('[name="soporte_tiempo"]').value,
                    uso_maquinaria: card.querySelector('.maquinaria-switch').value,
                    maquinas: []
                };
                if (soporteData.uso_maquinaria === 'SI') {
                    card.querySelectorAll('.maquinaria-row').forEach(row => {
                        soporteData.maquinas.push({
                            nombre: row.querySelector('[name="maquina_nombre"]').value,
                            operador: row.querySelector('[name="maquina_operador"]').value
                        });
                    });
                }
                activities.push(soporteData);
            });
        }
        return activities;
    }
});