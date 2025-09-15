// Portfolio Crypto Application - Versione Completa con Due Tabelle Colorate
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
        
        // Inizializza dati portfolio 2024 e 2025
        this.portfolioData2024 = this.initializeData2024();
        this.portfolioData2025 = this.initializeData2025();
        
        // Partecipante selezionato
        this.selectedParticipant = null;
        
        // Chart instance
        this.pieChart = null;
        
        // Mese corrente per P&L intelligente
        this.currentMonth = "Settembre";
        this.currentYear = 2025;
        
        // Flag per editing in corso
        this.isEditing = false;
        
        // Inizializza app quando DOM è pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeData2024() {
        // Dati reali 2024 dal JSON
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
        // Dati vuoti 2025 dal JSON
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
        console.log('Inizializzazione Crypto Portfolio App - Versione Due Tabelle Colorate...');
        
        // Setup ticker loop continuo per mobile
        this.setupSeamlessTicker();
        
        // Render tabelle
        this.renderVerticalTable(2024);
        this.renderVerticalTable(2025);
        
        // Render sidebar
        this.renderParticipantsList();
        this.createResponsivePieChart();
        this.renderPnLSection();
        
        // Calcoli e aggiornamenti
        this.calculateAllTotals();
        this.updateSummary();
        
        // Setup event listeners
        this.setupEventListeners();
        this.setupActionButtons(); // SETUP TASTI DEPOSITA/PRELEVA
        this.setupResponsiveChart();
        
        console.log('App inizializzata con successo - Tabelle Colorate Attive');
    }

    setupActionButtons() {
        const depositBtn = document.getElementById('depositBtn');
        const withdrawBtn = document.getElementById('withdrawBtn');
        
        if (depositBtn) {
            depositBtn.addEventListener('click', () => {
                this.showNotification('🔵 Funzione Deposita attiva!', 'info');
            });
        }
        
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => {
                this.showNotification('🔴 Funzione Preleva attiva!', 'info');
            });
        }
    }

    setupSeamlessTicker() {
        // Triplica contenuto ticker per loop seamless mobile
        const tickerContent = document.getElementById('tickerContent');
        if (!tickerContent) return;
        
        const originalContent = tickerContent.innerHTML;
        
        // Su mobile triplica per loop continuo
        if (window.innerWidth <= 767) {
            tickerContent.innerHTML = originalContent + originalContent + originalContent;
        }
        
        // Aggiorna su resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const isMobile = window.innerWidth <= 767;
                if (isMobile && !tickerContent.innerHTML.includes('BTC')) {
                    // Ripristina se content è vuoto per qualche motivo
                    tickerContent.innerHTML = originalContent + originalContent + originalContent;
                } else if (!isMobile) {
                    // Su desktop usa contenuto singolo
                    tickerContent.innerHTML = originalContent;
                }
            }, 250);
        });
    }

    renderVerticalTable(year) {
        const tableBody = document.getElementById(`tableBody${year}`);
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        const portfolioData = year === 2024 ? this.portfolioData2024 : this.portfolioData2025;

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
                <td class="deposit-cell editable-cell" 
                    data-participant="${participant}" 
                    data-month="${month}"
                    data-year="${year}"
                    data-participant-index="${participantIndex}"
                    data-month-index="${monthIndex}"
                    title="Clicca per modificare: ${participant} - ${month} ${year}">
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
            
            const total2024 = this.calculateParticipantTotal(participant, 2024);
            const total2025 = this.calculateParticipantTotal(participant, 2025);
            const totalCombined = total2024 + total2025;
            
            participantElement.innerHTML = `
                <div>
                    <div class="participant-name-text">${participant}</div>
                </div>
                <div class="participant-total-text">€${totalCombined.toLocaleString('it-IT')}</div>
            `;
            
            listContainer.appendChild(participantElement);
        });
    }

    renderPnLSection() {
        const pnlTable = document.getElementById('pnlTable');
        if (!pnlTable) return;
        
        // Calcolo P&L intelligente: usa 2025 se disponibile, altrimenti 2024
        const currentYearData = this.currentYear === 2025 ? this.portfolioData2025 : this.portfolioData2024;
        const fallbackData = this.portfolioData2024;
        
        let html = '<div class="pnl-participants">';
        
        this.participants.forEach(participant => {
            const currentDeposit = currentYearData[participant][this.currentMonth] || fallbackData[participant][this.currentMonth] || 0;
            const percentage = this.calculateParticipantPercentageCurrentMonth(participant);
            
            if (currentDeposit > 0) {
                html += `
                    <div class="pnl-participant-row">
                        <span class="pnl-name">${participant}</span>
                        <span class="pnl-percent">${percentage.toFixed(1)}%</span>
                        <span class="pnl-amount">€${currentDeposit.toLocaleString('it-IT')}</span>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        pnlTable.innerHTML = html;
    }

    calculateParticipantPercentageCurrentMonth(participant) {
        const currentYearData = this.currentYear === 2025 ? this.portfolioData2025 : this.portfolioData2024;
        const fallbackData = this.portfolioData2024;
        
        let monthTotal = 0;
        let participantAmount = 0;
        
        this.participants.forEach(p => {
            const amount = currentYearData[p][this.currentMonth] || fallbackData[p][this.currentMonth] || 0;
            monthTotal += amount;
            if (p === participant) {
                participantAmount = amount;
            }
        });
        
        return monthTotal > 0 ? (participantAmount / monthTotal) * 100 : 0;
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
                            size: isMobile ? 10 : 14
                        },
                        bodyFont: {
                            size: isMobile ? 9 : 13
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
                    this.pieChart.options.plugins.tooltip.titleFont.size = isMobile ? 10 : 14;
                    this.pieChart.options.plugins.tooltip.bodyFont.size = isMobile ? 9 : 13;
                    this.pieChart.options.elements.arc.borderWidth = isMobile ? 1 : 2;
                    
                    // Aggiorna dataset
                    this.pieChart.data.datasets[0].borderWidth = isMobile ? 1 : 2;
                    
                    this.pieChart.update();
                }
            }, 250);
        });
    }

    setupEventListeners() {
        console.log('Setting up event listeners per due tabelle...');
        
        // Event delegation per celle editabili - approccio migliorato
        document.body.addEventListener('click', (e) => {
            console.log('Click detected on:', e.target);
            
            // Gestisci click su celle editabili
            if (e.target.classList.contains('editable-cell') || e.target.classList.contains('deposit-cell')) {
                console.log('Editable cell clicked:', e.target);
                e.preventDefault();
                e.stopPropagation();
                
                if (!this.isEditing) {
                    this.editCell(e.target);
                }
                return;
            }
            
            // Gestisci click su partecipanti
            const participantItem = e.target.closest('.participant-item');
            if (participantItem) {
                const participant = participantItem.dataset.participant;
                if (participant) {
                    this.selectParticipant(participant);
                }
                return;
            }
        });

        // Event delegation per supporto touch migliorato
        document.body.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('editable-cell') || e.target.classList.contains('deposit-cell')) {
                console.log('Touch end on editable cell:', e.target);
                e.preventDefault();
                e.stopPropagation();
                
                if (!this.isEditing) {
                    this.editCell(e.target);
                }
            }
        });

        console.log('Event listeners impostati con successo');
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
            
            // Evidenzia colonne nella tabella per entrambi gli anni
            this.highlightParticipantInTable(participant);
            
            this.showNotification(`Selezionato: ${participant}`, 'info');
        }
    }

    highlightParticipantInTable(participant) {
        // Rimuovi evidenziazione precedente
        document.querySelectorAll('.portfolio-table-vertical td').forEach(cell => {
            cell.style.background = '';
        });
        
        // Evidenzia colonne del partecipante selezionato per entrambi gli anni
        const participantIndex = this.participants.indexOf(participant);
        if (participantIndex >= 0) {
            [2024, 2025].forEach(year => {
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

    editCell(cell) {
        console.log('Edit cell chiamato per:', cell);
        
        // Previeni editing multiplo
        if (this.isEditing || cell.querySelector('input') || cell.classList.contains('editing')) {
            console.log('Editing già in corso');
            return;
        }

        const participant = cell.dataset.participant;
        const month = cell.dataset.month;
        const year = parseInt(cell.dataset.year);
        
        if (!participant || !month || !year) {
            console.error('Dati mancanti:', participant, month, year);
            return;
        }
        
        console.log(`Inizio editing: ${participant} - ${month} ${year}`);
        
        const portfolioData = year === 2024 ? this.portfolioData2024 : this.portfolioData2025;
        const currentValue = portfolioData[participant][month] || 0;
        
        // Imposta flag editing
        this.isEditing = true;

        // Salva contenuto originale
        const originalContent = cell.innerHTML;
        const originalStyle = cell.style.background;

        // Crea input ottimizzato per mobile
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'table-input';
        input.value = currentValue;
        input.min = '0';
        input.step = '50';
        
        // Stili specifici per mobile
        const isMobile = window.innerWidth <= 767;
        input.style.width = '100%';
        input.style.minWidth = isMobile ? '40px' : '60px';
        input.style.fontSize = isMobile ? '10px' : '14px';
        input.style.padding = isMobile ? '2px' : '4px';
        
        // Attributi per mobile
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '[0-9]*');

        // Sostituisci contenuto cella
        cell.innerHTML = '';
        cell.appendChild(input);
        cell.classList.add('editing');
        cell.style.background = '#fbbf24'; // Giallo per editing

        // Focus con delay per mobile
        setTimeout(() => {
            input.focus();
            if (!isMobile) {
                input.select();
            }
        }, isMobile ? 100 : 50);

        const finishEditing = () => {
            console.log('Completamento editing, valore input:', input.value);
            const newValue = Math.max(0, parseInt(input.value) || 0);
            portfolioData[participant][month] = newValue;
            
            // Ripristina contenuto cella
            cell.innerHTML = `€${newValue.toLocaleString('it-IT')}`;
            cell.classList.remove('editing');
            cell.style.background = originalStyle;
            
            // Reset flag editing
            this.isEditing = false;
            
            // Aggiorna calcoli per entrambe le tabelle
            this.calculateAllTotals();
            this.updateSummary();
            this.updateParticipantsList();
            this.renderPnLSection();
            
            this.showNotification(`✅ ${participant} ${month} ${year}: €${newValue.toLocaleString('it-IT')}`, 'success');
            
            console.log('Editing completato');
        };

        const cancelEditing = () => {
            console.log('Annullamento editing');
            cell.innerHTML = originalContent;
            cell.classList.remove('editing');
            cell.style.background = originalStyle;
            this.isEditing = false;
        };

        // Gestione eventi input migliorata
        input.addEventListener('blur', (e) => {
            console.log('Input blur');
            setTimeout(() => {
                if (document.activeElement !== input) {
                    finishEditing();
                }
            }, 150);
        });
        
        input.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key);
            e.stopPropagation();
            
            if (e.key === 'Enter') {
                e.preventDefault();
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
        // Calcola totali per ogni anno
        [2024, 2025].forEach(year => {
            const portfolioData = year === 2024 ? this.portfolioData2024 : this.portfolioData2025;
            
            this.allMonths.forEach((month, monthIndex) => {
                const monthTotal = this.calculateMonthTotal(month, year);
                
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

    calculateMonthTotal(month, year) {
        let total = 0;
        const portfolioData = year === 2024 ? this.portfolioData2024 : this.portfolioData2025;
        
        this.participants.forEach(participant => {
            total += portfolioData[participant][month] || 0;
        });
        return total;
    }

    calculateParticipantTotal(participant, year) {
        let total = 0;
        const portfolioData = year === 2024 ? this.portfolioData2024 : this.portfolioData2025;
        
        this.allMonths.forEach(month => {
            total += portfolioData[participant][month] || 0;
        });
        return total;
    }

    calculateGrandTotal(year) {
        let grandTotal = 0;
        const portfolioData = year === 2024 ? this.portfolioData2024 : this.portfolioData2025;
        
        this.participants.forEach(participant => {
            this.allMonths.forEach(month => {
                grandTotal += portfolioData[participant][month] || 0;
            });
        });
        return grandTotal;
    }

    updateSummary() {
        const grandTotal2024 = this.calculateGrandTotal(2024);
        const grandTotal2025 = this.calculateGrandTotal(2025);
        
        let activeParticipants = 0;
        this.participants.forEach(participant => {
            let hasDeposits = false;
            this.allMonths.forEach(month => {
                if ((this.portfolioData2024[participant][month] > 0) || (this.portfolioData2025[participant][month] > 0)) {
                    hasDeposits = true;
                }
            });
            if (hasDeposits) activeParticipants++;
        });

        const total2024El = document.getElementById('totalPortfolio2024');
        const total2025El = document.getElementById('totalPortfolio2025');
        const activeEl = document.getElementById('activeParticipants');

        if (total2024El) total2024El.textContent = `€${grandTotal2024.toLocaleString('it-IT')}`;
        if (total2025El) total2025El.textContent = `€${grandTotal2025.toLocaleString('it-IT')}`;
        if (activeEl) activeEl.textContent = activeParticipants.toString();
    }

    updateParticipantsList() {
        this.participants.forEach((participant) => {
            const participantElement = document.querySelector(`[data-participant="${participant}"] .participant-total-text`);
            if (participantElement) {
                const total2024 = this.calculateParticipantTotal(participant, 2024);
                const total2025 = this.calculateParticipantTotal(participant, 2025);
                const totalCombined = total2024 + total2025;
                participantElement.textContent = `€${totalCombined.toLocaleString('it-IT')}`;
            }
        });
    }

    showNotification(message, type = 'info') {
        console.log('Mostrando notifica:', message, type);
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Anima in entrata
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Rimuovi dopo tempo appropriato
        const displayTime = window.innerWidth <= 767 ? 3000 : 2500;
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, displayTime);
    }

    // Metodi utility per debugging
    getMobileDebugInfo() {
        return {
            isMobile: window.innerWidth <= 767,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            userAgent: navigator.userAgent,
            tablesLoaded: {
                table2024: !!document.getElementById('tableBody2024'),
                table2025: !!document.getElementById('tableBody2025')
            },
            isEditing: this.isEditing
        };
    }

    // Export dati per debugging
    exportData() {
        return {
            portfolioData2024: this.portfolioData2024,
            portfolioData2025: this.portfolioData2025,
            totals: {
                total2024: this.calculateGrandTotal(2024),
                total2025: this.calculateGrandTotal(2025)
            }
        };
    }
}

// Inizializza l'applicazione
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Avvio app Due Tabelle Colorate...');
    const app = new CryptoPortfolioApp();
    
    // Rendi l'app disponibile globalmente per debugging
    window.cryptoPortfolioApp = app;
    
    console.log('Crypto Portfolio App (Due Tabelle Colorate) avviata con successo');
    
    // Log info mobile per debugging
    if (window.innerWidth <= 767) {
        console.log('Mobile device detected:', app.getMobileDebugInfo());
    }
});
