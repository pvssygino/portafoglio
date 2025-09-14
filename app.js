// Portfolio Crypto Application - Versione con Due Tabelle (2024 e 2025)
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
        
        // Inizializza app quando DOM è pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeData2024() {
        // Dati 2024 esistenti
        return {
            "Marco": {"Gennaio": 800, "Febbraio": 750, "Marzo": 900, "Aprile": 650, "Maggio": 850, "Giugno": 700, "Luglio": 950, "Agosto": 800, "Settembre": 750, "Ottobre": 600, "Novembre": 750, "Dicembre": 900},
            "Luca": {"Gennaio": 750, "Febbraio": 700, "Marzo": 800, "Aprile": 600, "Maggio": 750, "Giugno": 650, "Luglio": 800, "Agosto": 750, "Settembre": 700, "Ottobre": 800, "Novembre": 700, "Dicembre": 650},
            "Sara": {"Gennaio": 650, "Febbraio": 800, "Marzo": 750, "Aprile": 700, "Maggio": 900, "Giugno": 600, "Luglio": 750, "Agosto": 700, "Settembre": 800, "Ottobre": 700, "Novembre": 800, "Dicembre": 750}
        };
    }

    initializeData2025() {
        // Dati 2025 inizializzati a zero
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
        console.log('Inizializzazione Crypto Portfolio App - Versione Due Tabelle...');
        this.renderTable2024();
        this.renderTable2025();
        this.renderParticipantsList();
        this.createResponsivePieChart();
        this.calculateAllTotals();
        this.updateSummary();
        this.setupEventListeners();
        this.setupResponsiveChart();
        console.log('App inizializzata con successo');
    }

    renderTable2024() {
        const tableBody = document.getElementById('tableBody2024');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        this.renderTableForYear(tableBody, this.portfolioData2024, '2024');
    }

    renderTable2025() {
        const tableBody = document.getElementById('tableBody2025');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        this.renderTableForYear(tableBody, this.portfolioData2025, '2025');
    }

    renderTableForYear(tableBody, portfolioData, year) {
        // Itera attraverso ogni trimestre
        Object.keys(this.quartersVertical).forEach((quarter, quarterIndex) => {
            const months = this.quartersVertical[quarter];
            
            // Aggiungi header del trimestre
            const quarterRow = document.createElement('tr');
            quarterRow.innerHTML = `
                <td class="quarter-separator ${quarter.toLowerCase()}" colspan="17">
                    ${quarter} - ${months.join(', ')}
                </td>
            `;
            tableBody.appendChild(quarterRow);
            
            // Aggiungi una riga per ogni mese del trimestre
            months.forEach((month, monthInQuarterIndex) => {
                const monthRow = document.createElement('tr');
                monthRow.innerHTML = this.generateMonthRowHTML(month, quarterIndex, monthInQuarterIndex, portfolioData, year);
                tableBody.appendChild(monthRow);
            });
        });
    }

    generateMonthRowHTML(month, quarterIndex, monthInQuarterIndex, portfolioData, year) {
        let html = `<td class="month-name">${month}</td>`;
        
        // Per ogni partecipante, aggiungi due colonne: % e €
        this.participants.forEach((participant, participantIndex) => {
            const deposit = portfolioData[participant] && portfolioData[participant][month] ? portfolioData[participant][month] : 0;
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
                    title="Clicca per modificare il deposito di ${participant} per ${month} ${year}">
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
            
            const total = this.calculateParticipantTotalCombined(participant);
            
            participantElement.innerHTML = `
                <div>
                    <div class="participant-name-text">${participant}</div>
                </div>
                <div class="participant-total-text">€${total.toLocaleString('it-IT')}</div>
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
            
            // Evidenzia colonne nella tabella
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
            // Evidenzia nelle tabelle 2024 e 2025
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
        
        // Event listeners per celle della tabella con miglior supporto touch
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('deposit-cell')) {
                console.log('Deposit cell clicked:', e.target);
                e.preventDefault();
                e.stopPropagation();
                this.editCell(e.target);
            } else if (e.target.closest('.participant-item')) {
                // Event listeners per partecipanti
                const participantItem = e.target.closest('.participant-item');
                const participant = participantItem.dataset.participant;
                if (participant) {
                    this.selectParticipant(participant);
                }
            }
        });

        // Supporto touch per dispositivi mobili
        let touchStartTime = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
        });

        document.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Se il touch è breve (tap), gestisci come click
            if (touchDuration < 300 && e.target.classList.contains('deposit-cell')) {
                e.preventDefault();
                e.stopPropagation();
                this.editCell(e.target);
            }
        });
        
        console.log('Event listeners set up successfully');
    }

    editCell(cell) {
        console.log('Edit cell called for:', cell);
        
        if (cell.querySelector('input') || cell.classList.contains('editing')) {
            console.log('Cell already being edited');
            return;
        }

        const participant = cell.dataset.participant;
        const month = cell.dataset.month;
        const year = cell.dataset.year;
        
        if (!participant || !month || !year) {
            console.error('Missing participant, month or year data:', participant, month, year);
            return;
        }
        
        const portfolioData = year === '2024' ? this.portfolioData2024 : this.portfolioData2025;
        const currentValue = portfolioData[participant] && portfolioData[participant][month] ? portfolioData[participant][month] : 0;
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

        // Sostituisci contenuto cella
        cell.innerHTML = '';
        cell.appendChild(input);
        cell.classList.add('editing');

        // Focus sull'input con delay per mobile
        setTimeout(() => {
            input.focus();
            input.select();
        }, window.innerWidth <= 767 ? 50 : 10);

        const finishEditing = () => {
            console.log('Finishing edit, input value:', input.value);
            const newValue = Math.max(0, parseInt(input.value) || 0);
            
            // Aggiorna i dati nella struttura corretta
            if (!portfolioData[participant]) {
                portfolioData[participant] = {};
            }
            portfolioData[participant][month] = newValue;
            
            // Ripristina contenuto cella
            cell.innerHTML = `€${newValue.toLocaleString('it-IT')}`;
            cell.classList.remove('editing');
            
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
        };

        // Gestione eventi input con supporto touch migliorato
        input.addEventListener('blur', (e) => {
            console.log('Input blur');
            setTimeout(() => finishEditing(), 100);
        });
        
        input.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key);
            e.stopPropagation();
            
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur(); // Su mobile forza il blur
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
    }

    calculateAllTotals() {
        // Calcola totali per ogni mese e percentuali per entrambe le tabelle
        ['2024', '2025'].forEach(year => {
            const portfolioData = year === '2024' ? this.portfolioData2024 : this.portfolioData2025;
            
            this.allMonths.forEach((month, monthIndex) => {
                const monthTotal = this.calculateMonthTotal(month, portfolioData);
                
                // Aggiorna percentuali per questo mese
                this.participants.forEach((participant, participantIndex) => {
                    const deposit = portfolioData[participant] && portfolioData[participant][month] ? portfolioData[participant][month] : 0;
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
            if (portfolioData[participant] && portfolioData[participant][month]) {
                total += portfolioData[participant][month];
            }
        });
        return total;
    }

    calculateParticipantTotal(participant, portfolioData) {
        let total = 0;
        if (portfolioData[participant]) {
            this.allMonths.forEach(month => {
                if (portfolioData[participant][month]) {
                    total += portfolioData[participant][month];
                }
            });
        }
        return total;
    }

    calculateParticipantTotalCombined(participant) {
        const total2024 = this.calculateParticipantTotal(participant, this.portfolioData2024);
        const total2025 = this.calculateParticipantTotal(participant, this.portfolioData2025);
        return total2024 + total2025;
    }

    calculateGrandTotal() {
        let grandTotal = 0;
        
        // Somma 2024
        this.participants.forEach(participant => {
            this.allMonths.forEach(month => {
                if (this.portfolioData2024[participant] && this.portfolioData2024[participant][month]) {
                    grandTotal += this.portfolioData2024[participant][month];
                }
            });
        });
        
        // Somma 2025
        this.participants.forEach(participant => {
            this.allMonths.forEach(month => {
                if (this.portfolioData2025[participant] && this.portfolioData2025[participant][month]) {
                    grandTotal += this.portfolioData2025[participant][month];
                }
            });
        });
        
        return grandTotal;
    }

    updateSummary() {
        const grandTotal = this.calculateGrandTotal();
        const avgMonthly = (this.allMonths.length * 2) > 0 ? grandTotal / (this.allMonths.length * 2) : 0; // 2 anni
        
        let activeParticipants = 0;
        this.participants.forEach(participant => {
            let hasDeposits = false;
            
            // Controlla 2024
            if (this.portfolioData2024[participant]) {
                this.allMonths.forEach(month => {
                    if (this.portfolioData2024[participant][month] > 0) {
                        hasDeposits = true;
                    }
                });
            }
            
            // Controlla 2025
            if (this.portfolioData2025[participant]) {
                this.allMonths.forEach(month => {
                    if (this.portfolioData2025[participant][month] > 0) {
                        hasDeposits = true;
                    }
                });
            }
            
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
                const total = this.calculateParticipantTotalCombined(participant);
                participantElement.textContent = `€${total.toLocaleString('it-IT')}`;
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
        
        // Rimuovi dopo 3 secondi (4s su mobile per maggior leggibilità)
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

    // Metodi di utilità per statistiche trimestrali combinate
    getQuarterStatsCombined() {
        const stats = {};
        Object.keys(this.quartersVertical).forEach(quarter => {
            const months = this.quartersVertical[quarter];
            let quarterTotal = 0;
            const participantTotals = {};
            
            this.participants.forEach(participant => {
                participantTotals[participant] = 0;
                months.forEach(month => {
                    // Somma 2024 e 2025
                    const amount2024 = this.portfolioData2024[participant] && this.portfolioData2024[participant][month] ? this.portfolioData2024[participant][month] : 0;
                    const amount2025 = this.portfolioData2025[participant] && this.portfolioData2025[participant][month] ? this.portfolioData2025[participant][month] : 0;
                    const totalAmount = amount2024 + amount2025;
                    
                    participantTotals[participant] += totalAmount;
                    quarterTotal += totalAmount;
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
            tablesData: {
                participants2024: Object.keys(this.portfolioData2024).length,
                participants2025: Object.keys(this.portfolioData2025).length,
                total2024: this.participants.reduce((sum, p) => sum + this.calculateParticipantTotal(p, this.portfolioData2024), 0),
                total2025: this.participants.reduce((sum, p) => sum + this.calculateParticipantTotal(p, this.portfolioData2025), 0)
            }
        };
    }
}

// Inizializza l'applicazione
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Avvio app con due tabelle 2024/2025...');
    const app = new CryptoPortfolioApp();
    
    // Rendi l'app disponibile globalmente per debugging
    window.cryptoPortfolioApp = app;
    
    console.log('Crypto Portfolio App (Due Tabelle 2024/2025) avviata con successo');
    
    // Log info mobile per debugging
    if (window.innerWidth <= 767) {
        console.log('Mobile device detected:', app.getMobileDebugInfo());
    }
});
