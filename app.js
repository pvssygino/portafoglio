// Portfolio Crypto Application - Versione Mobile Ottimizzata con Due Tabelle
class CryptoPortfolioApp {
    constructor() {
        this.participants = ["Marco", "Luca", "Sara", "Giovanni", "Anna", "Paolo", "Elena", "Roberto"];
        
        // Organizzazione trimestrale verticale
        this.quartersVertical = {
            "Q1": ["Gennaio", "Febbraio", "Marzo"],
            "Q2": ["Aprile", "Maggio", "Giugno"], 
            "Q3": ["Luglio", "Agosto", "Settembre"],
            "Q4": ["Ottobre", "Novembre", "Dicembre"]
        };
        
        this.allMonths = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
                         "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
        
        // Dati crypto allocation
        this.cryptoAllocation = {
            "Bitcoin": 45,
            "Ethereum": 25,
            "Solana": 15,
            "Cardano": 10,
            "Others": 5
        };
        
        // Colori per il grafico
        this.chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        
        // Inizializza dati portfolio separati per 2024 e 2025
        this.portfolioData2024 = this.initializeData2024();
        this.portfolioData2025 = this.initializeData2025();
        
        // Partecipante selezionato
        this.selectedParticipant = null;
        
        // Chart instance
        this.pieChart = null;
        
        // Flag per gestire l'editing
        this.isEditing = false;
        
        // Inizializza app quando DOM è pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeData2024() {
        // Dati 2024 dal JSON fornito
        return {
            "Marco": {"Gennaio": 800, "Febbraio": 750, "Marzo": 900, "Aprile": 650, "Maggio": 850, "Giugno": 700, "Luglio": 950, "Agosto": 800, "Settembre": 750, "Ottobre": 600, "Novembre": 750, "Dicembre": 900},
            "Luca": {"Gennaio": 750, "Febbraio": 700, "Marzo": 800, "Aprile": 600, "Maggio": 750, "Giugno": 650, "Luglio": 800, "Agosto": 750, "Settembre": 700, "Ottobre": 800, "Novembre": 700, "Dicembre": 650},
            "Sara": {"Gennaio": 650, "Febbraio": 800, "Marzo": 750, "Aprile": 700, "Maggio": 900, "Giugno": 600, "Luglio": 750, "Agosto": 700, "Settembre": 800, "Ottobre": 700, "Novembre": 800, "Dicembre": 750},
            "Giovanni": {"Gennaio": 500, "Febbraio": 550, "Marzo": 600, "Aprile": 580, "Maggio": 520, "Giugno": 600, "Luglio": 550, "Agosto": 580, "Settembre": 500, "Ottobre": 550, "Novembre": 600, "Dicembre": 580},
            "Anna": {"Gennaio": 650, "Febbraio": 700, "Marzo": 600, "Aprile": 650, "Maggio": 700, "Giugno": 600, "Luglio": 650, "Agosto": 700, "Settembre": 650, "Ottobre": 600, "Novembre": 650, "Dicembre": 700},
            "Paolo": {"Gennaio": 480, "Febbraio": 520, "Marzo": 500, "Aprile": 580, "Maggio": 600, "Giugno": 550, "Luglio": 580, "Agosto": 520, "Settembre": 480, "Ottobre": 520, "Novembre": 580, "Dicembre": 600},
            "Elena": {"Gennaio": 550, "Febbraio": 600, "Marzo": 580, "Aprile": 520, "Maggio": 620, "Giugno": 580, "Luglio": 550, "Agosto": 600, "Settembre": 550, "Ottobre": 580, "Novembre": 520, "Dicembre": 620},
            "Roberto": {"Gennaio": 500, "Febbraio": 480, "Marzo": 520, "Aprile": 550, "Maggio": 500, "Giugno": 480, "Luglio": 520, "Agosto": 500, "Settembre": 520, "Ottobre": 500, "Novembre": 480, "Dicembre": 550}
        };
    }

    initializeData2025() {
        // Dati 2025 inizialmente vuoti (dal JSON fornito)
        const data = {};
        this.participants.forEach(participant => {
            data[participant] = {};
            this.allMonths.forEach(month => {
                data[participant][month] = 0;
            });
        });
        return data;
    }

    initializeApp() {
        console.log('Inizializzazione Crypto Portfolio App - Versione Mobile Ottimizzata con Due Tabelle...');
        this.renderVerticalTable('2024', this.portfolioData2024, 'tableBody2024');
        this.renderVerticalTable('2025', this.portfolioData2025, 'tableBody2025');
        this.renderParticipantsList();
        this.createResponsivePieChart();
        this.calculateAllTotals();
        this.updateSummary();
        this.setupEventListeners();
        this.setupActionButtons();
        this.setupResponsiveChart();
        console.log('App inizializzata con successo');
    }

    setupActionButtons() {
        const depositBtn = document.getElementById('depositBtn');
        const withdrawBtn = document.getElementById('withdrawBtn');
        
        if (depositBtn) {
            depositBtn.addEventListener('click', () => {
                this.showNotification('💰 Funzione Deposita in arrivo!', 'info');
            });
        }
        
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => {
                this.showNotification('💸 Funzione Preleva in arrivo!', 'info');
            });
        }
    }

    renderVerticalTable(year, portfolioData, tableBodyId) {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return;
        
        tableBody.innerHTML = '';

        // Itera attraverso ogni trimestre
        Object.keys(this.quartersVertical).forEach((quarter, quarterIndex) => {
            const months = this.quartersVertical[quarter];
            
            // Aggiungi header del trimestre
            const quarterRow = document.createElement('tr');
            quarterRow.innerHTML = `
                <td class="quarter-separator ${quarter.toLowerCase()}" colspan="17">
                    ${quarter} ${year} - ${months.join(', ')}
                </td>
            `;
            tableBody.appendChild(quarterRow);
            
            // Aggiungi una riga per ogni mese del trimestre
            months.forEach((month, monthInQuarterIndex) => {
                const monthRow = document.createElement('tr');
                monthRow.innerHTML = this.generateMonthRowHTML(month, quarterIndex, monthInQuarterIndex, year, portfolioData);
                tableBody.appendChild(monthRow);
            });
        });
    }

    generateMonthRowHTML(month, quarterIndex, monthInQuarterIndex, year, portfolioData) {
        let html = `<td class="month-name">${month}</td>`;
        
        // Per ogni partecipante, aggiungi due colonne: % e €
        this.participants.forEach((participant, participantIndex) => {
            const deposit = portfolioData[participant][month] || 0;
            const monthIndex = this.allMonths.indexOf(month);
            
            html += `
                <td class="percent-cell" id="percent-${year}-${participantIndex}-${monthIndex}">
                    0%
                </td>
                <td class="deposit-cell" 
                    data-participant="${participant}" 
                    data-month="${month}"
                    data-year="${year}"
                    data-participant-index="${participantIndex}"
                    data-month-index="${monthIndex}"
                    title="Clicca per modificare il deposito di ${participant} per ${month} ${year}"
                    role="button"
                    tabindex="0">
                    €${deposit.toLocaleString('it-IT')}
                </td>
            `;
        });
        
        return html;
    }

    renderParticipantsList() {
        const listContainer = document.getElementById('participantsList');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        this.participants.forEach((participant) => {
            const participantElement = document.createElement('div');
            participantElement.className = 'participant-item';
            participantElement.dataset.participant = participant;
            
            const total2024 = this.calculateParticipantTotal(participant, this.portfolioData2024);
            const total2025 = this.calculateParticipantTotal(participant, this.portfolioData2025);
            const totalOverall = total2024 + total2025;
            
            participantElement.innerHTML = `
                <div>
                    <div class="participant-name-text">${participant}</div>
                </div>
                <div class="participant-total-text">€${totalOverall.toLocaleString('it-IT')}</div>
            `;
            
            listContainer.appendChild(participantElement);
        });
    }

    selectParticipant(participant) {
        // Rimuovi selezione precedente
        document.querySelectorAll('.participant-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Seleziona nuovo partecipante
        const participantElement = document.querySelector(`[data-participant="${participant}"]`);
        if (participantElement && participantElement.classList.contains('participant-item')) {
            participantElement.classList.add('selected');
            this.selectedParticipant = participant;
            
            // Evidenzia colonne nelle tabelle
            this.highlightParticipantInTable(participant);
            
            this.showNotification(`Selezionato: ${participant}`, 'info');
        }
    }

    highlightParticipantInTable(participant) {
        // Rimuovi evidenziazione precedente
        document.querySelectorAll('.portfolio-table-vertical td').forEach(cell => {
            cell.style.background = '';
        });
        
        // Evidenzia colonne del partecipante selezionato in entrambe le tabelle
        const participantIndex = this.participants.indexOf(participant);
        if (participantIndex >= 0) {
            ['2024', '2025'].forEach(year => {
                this.allMonths.forEach((month, monthIndex) => {
                    const percentCell = document.getElementById(`percent-${year}-${participantIndex}-${monthIndex}`);
                    const depositCell = document.querySelector(`[data-participant="${participant}"][data-month="${month}"][data-year="${year}"]`);
                    
                    if (percentCell) {
                        percentCell.style.background = 'rgba(33, 128, 141, 0.15)';
                    }
                    if (depositCell) {
                        depositCell.style.background = 'rgba(33, 128, 141, 0.15)';
                    }
                });
            });
        }
    }

    createResponsivePieChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;

        const labels = Object.keys(this.cryptoAllocation);
        const data = Object.values(this.cryptoAllocation);

        // Configurazione responsive per mobile
        const isMobile = window.innerWidth <= 767;
        
        this.pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: this.chartColors,
                    borderWidth: isMobile ? 1 : 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Usiamo la nostra legenda personalizzata
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        },
                        titleFont: {
                            size: isMobile ? 12 : 14
                        },
                        bodyFont: {
                            size: isMobile ? 11 : 13
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: isMobile ? 1 : 2
                    }
                }
            }
        });

        this.renderChartLegend();
    }

    renderChartLegend() {
        const legendContainer = document.getElementById('chartLegend');
        if (!legendContainer) return;

        legendContainer.innerHTML = '';

        Object.keys(this.cryptoAllocation).forEach((crypto, index) => {
            const percentage = this.cryptoAllocation[crypto];
            const color = this.chartColors[index];
            
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${color};"></div>
                <div class="legend-text">${crypto}</div>
                <div class="legend-percentage">${percentage}%</div>
            `;
            
            legendContainer.appendChild(legendItem);
        });
    }

    setupResponsiveChart() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.pieChart) {
                    const isMobile = window.innerWidth <= 767;
                    
                    // Aggiorna opzioni del grafico per mobile
                    this.pieChart.options.plugins.tooltip.titleFont.size = isMobile ? 12 : 14;
                    this.pieChart.options.plugins.tooltip.bodyFont.size = isMobile ? 11 : 13;
                    this.pieChart.options.elements.arc.borderWidth = isMobile ? 1 : 2;
                    
                    // Aggiorna dataset
                    this.pieChart.data.datasets[0].borderWidth = isMobile ? 1 : 2;
                    
                    this.pieChart.update();
                }
            }, 250);
        });
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Event delegation per celle deposito - Più robusto
        document.addEventListener('click', (e) => {
            console.log('Click event:', e.target, e.target.classList);
            
            // Verifica se è una deposit-cell o se si trova all'interno di una
            const depositCell = e.target.closest('.deposit-cell');
            if (depositCell) {
                console.log('Deposit cell found:', depositCell);
                e.preventDefault();
                e.stopPropagation();
                this.handleCellClick(depositCell);
                return;
            }
            
            // Verifica click su partecipant item
            const participantItem = e.target.closest('.participant-item');
            if (participantItem) {
                const participant = participantItem.dataset.participant;
                if (participant) {
                    this.selectParticipant(participant);
                }
                return;
            }
        });

        // Event delegation per touchend su mobile
        document.addEventListener('touchend', (e) => {
            console.log('Touch end event:', e.target);
            
            const depositCell = e.target.closest('.deposit-cell');
            if (depositCell) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Touch on deposit cell:', depositCell);
                this.handleCellClick(depositCell);
                return;
            }
        });

        // Previeni il default touch behavior sui deposit cells
        document.addEventListener('touchstart', (e) => {
            const depositCell = e.target.closest('.deposit-cell');
            if (depositCell) {
                e.preventDefault();
            }
        });
        
        console.log('Event listeners set up successfully');
    }

    handleCellClick(cell) {
        if (this.isEditing) {
            console.log('Already editing a cell');
            return;
        }
        
        console.log('Handling cell click:', cell);
        this.editCell(cell);
    }

    editCell(cell) {
        console.log('Edit cell called for:', cell);
        
        if (cell.querySelector('input') || cell.classList.contains('editing') || this.isEditing) {
            console.log('Cell already being edited or editing in progress');
            return;
        }

        const participant = cell.dataset.participant;
        const month = cell.dataset.month;
        const year = cell.dataset.year;
        
        if (!participant || !month || !year) {
            console.error('Missing participant, month or year data:', participant, month, year);
            return;
        }
        
        this.isEditing = true;
        
        // Seleziona il dataset corretto
        const portfolioData = year === '2024' ? this.portfolioData2024 : this.portfolioData2025;
        const currentValue = portfolioData[participant][month] || 0;
        console.log(`Editing ${participant} - ${month} ${year}: current value = ${currentValue}`);

        // Salva contenuto originale
        const originalContent = cell.innerHTML;

        // Crea input ottimizzato per mobile
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'table-input';
        input.value = currentValue;
        input.min = '0';
        input.step = '50';
        input.style.width = '100%';
        input.style.height = '100%';
        input.style.minWidth = window.innerWidth <= 767 ? '50px' : '60px';
        
        // Attributi per mobile
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '[0-9]*');
        input.setAttribute('autocomplete', 'off');

        // Sostituisci contenuto cella
        cell.innerHTML = '';
        cell.appendChild(input);
        cell.classList.add('editing');

        // Focus sull'input con delay per mobile
        setTimeout(() => {
            input.focus();
            if (window.innerWidth > 767) {
                input.select();
            }
        }, window.innerWidth <= 767 ? 100 : 10);

        const finishEditing = () => {
            console.log('Finishing edit, input value:', input.value);
            const newValue = Math.max(0, parseInt(input.value) || 0);
            portfolioData[participant][month] = newValue;
            
            // Ripristina contenuto cella
            cell.innerHTML = `€${newValue.toLocaleString('it-IT')}`;
            cell.classList.remove('editing');
            
            this.isEditing = false;
            
            // Aggiorna calcoli
            this.calculateAllTotals();
            this.updateSummary();
            this.updateParticipantsList();
            
            this.showNotification(`✅ ${participant} ${month} ${year}: €${newValue.toLocaleString('it-IT')}`, 'success');
        };

        const cancelEditing = () => {
            console.log('Cancelling edit');
            cell.innerHTML = originalContent;
            cell.classList.remove('editing');
            this.isEditing = false;
        };

        // Gestione eventi input
        input.addEventListener('blur', (e) => {
            console.log('Input blur');
            setTimeout(() => finishEditing(), 150);
        });
        
        input.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key);
            e.stopPropagation();
            
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
                finishEditing();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEditing();
            }
        });

        // Previeni propagazione eventi
        input.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        input.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });

        input.addEventListener('touchend', (e) => {
            e.stopPropagation();
        });
    }

    calculateAllTotals() {
        // Calcola totali per ogni mese e percentuali per entrambi gli anni
        ['2024', '2025'].forEach(year => {
            const portfolioData = year === '2024' ? this.portfolioData2024 : this.portfolioData2025;
            
            this.allMonths.forEach((month, monthIndex) => {
                const monthTotal = this.calculateMonthTotal(month, portfolioData);
                
                // Aggiorna percentuali per questo mese
                this.participants.forEach((participant, participantIndex) => {
                    const deposit = portfolioData[participant][month] || 0;
                    const percentage = monthTotal > 0 ? ((deposit / monthTotal) * 100) : 0;
                    
                    const percentElement = document.getElementById(`percent-${year}-${participantIndex}-${monthIndex}`);
                    if (percentElement) {
                        percentElement.textContent = `${percentage.toFixed(1)}%`;
                    }
                });
            });
        });
    }

    calculateMonthTotal(month, portfolioData) {
        let total = 0;
        this.participants.forEach(participant => {
            total += portfolioData[participant][month] || 0;
        });
        return total;
    }

    calculateParticipantTotal(participant, portfolioData) {
        let total = 0;
        this.allMonths.forEach(month => {
            total += portfolioData[participant][month] || 0;
        });
        return total;
    }

    calculateGrandTotal() {
        let grandTotal = 0;
        
        // Somma entrambi gli anni
        this.participants.forEach(participant => {
            this.allMonths.forEach(month => {
                grandTotal += this.portfolioData2024[participant][month] || 0;
                grandTotal += this.portfolioData2025[participant][month] || 0;
            });
        });
        
        return grandTotal;
    }

    updateSummary() {
        const grandTotal = this.calculateGrandTotal();
        const totalMonths = this.allMonths.length * 2; // 2024 + 2025
        const avgMonthly = totalMonths > 0 ? grandTotal / totalMonths : 0;
        
        let activeParticipants = 0;
        this.participants.forEach(participant => {
            let hasDeposits = false;
            this.allMonths.forEach(month => {
                if ((this.portfolioData2024[participant][month] > 0) || 
                    (this.portfolioData2025[participant][month] > 0)) {
                    hasDeposits = true;
                }
            });
            if (hasDeposits) activeParticipants++;
        });

        const totalEl = document.getElementById('totalPortfolio');
        const avgEl = document.getElementById('avgDeposit');
        const activeEl = document.getElementById('activeParticipants');

        if (totalEl) totalEl.textContent = `€${grandTotal.toLocaleString('it-IT')}`;
        if (avgEl) avgEl.textContent = `€${Math.round(avgMonthly).toLocaleString('it-IT')}`;
        if (activeEl) activeEl.textContent = activeParticipants.toString();
    }

    updateParticipantsList() {
        this.participants.forEach((participant) => {
            const participantElement = document.querySelector(`[data-participant="${participant}"] .participant-total-text`);
            if (participantElement) {
                const total2024 = this.calculateParticipantTotal(participant, this.portfolioData2024);
                const total2025 = this.calculateParticipantTotal(participant, this.portfolioData2025);
                const totalOverall = total2024 + total2025;
                participantElement.textContent = `€${totalOverall.toLocaleString('it-IT')}`;
            }
        });
    }

    showNotification(message, type = 'info') {
        console.log('Showing notification:', message, type);
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Anima in entrata
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Rimuovi dopo tempo appropriato
        const displayTime = window.innerWidth <= 767 ? 4000 : 3000;
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, displayTime);
    }

    // Metodi di utilità per statistiche
    getYearStats(year) {
        const portfolioData = year === '2024' ? this.portfolioData2024 : this.portfolioData2025;
        const stats = {};
        
        Object.keys(this.quartersVertical).forEach(quarter => {
            const months = this.quartersVertical[quarter];
            let quarterTotal = 0;
            const participantTotals = {};
            
            this.participants.forEach(participant => {
                participantTotals[participant] = 0;
                months.forEach(month => {
                    const amount = portfolioData[participant][month] || 0;
                    participantTotals[participant] += amount;
                    quarterTotal += amount;
                });
            });
            
            stats[quarter] = {
                total: quarterTotal,
                participants: participantTotals,
                avgPerMonth: quarterTotal / 3,
                months: months
            };
        });
        
        return stats;
    }

    // Metodo per debugging su mobile
    getMobileDebugInfo() {
        return {
            isMobile: window.innerWidth <= 767,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            userAgent: navigator.userAgent,
            isEditing: this.isEditing,
            totalData2024: this.calculateParticipantTotal('Marco', this.portfolioData2024),
            totalData2025: this.calculateParticipantTotal('Marco', this.portfolioData2025)
        };
    }
}

// Inizializza l'applicazione
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Avvio app mobile ottimizzata con due tabelle...');
    const app = new CryptoPortfolioApp();
    
    // Rendi l'app disponibile globalmente per debugging
    window.cryptoPortfolioApp = app;
    
    console.log('Crypto Portfolio App (Mobile Ottimizzata) avviata con successo');
    
    // Log info mobile per debugging
    if (window.innerWidth <= 767) {
        console.log('Mobile device detected:', app.getMobileDebugInfo());
    }
});
