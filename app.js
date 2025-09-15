// Portfolio Crypto Application - Versione Finale con Tasti e P&L Separata
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
        
        // Mese e anno correnti
        this.currentMonth = "Settembre";
        this.currentYear = 2025;
        
        // Inizializza dati portfolio - include sia 2024 che 2025
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
        // Dati 2025 dal JSON fornito - attualmente tutti a 0
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
        console.log('Inizializzazione Crypto Portfolio App - Versione Finale...');
        this.renderVerticalTable('2024');
        this.renderVerticalTable('2025');
        this.renderParticipantsList();
        this.createResponsivePieChart();
        this.calculateAllTotals();
        this.updateSummary();
        this.renderPLTableSeparate(); // Nuova P&L separata
        this.setupEventListeners();
        this.setupResponsiveChart();
        this.setupActionButtons(); // Nuovi tasti Deposita/Preleva
        console.log('App inizializzata con successo');
    }

    // NUOVA FUNZIONE: Setup tasti Deposita e Preleva
    setupActionButtons() {
        const depositBtn = document.getElementById('depositBtn');
        const withdrawBtn = document.getElementById('withdrawBtn');
        
        if (depositBtn) {
            depositBtn.addEventListener('click', () => this.handleDeposit());
        }
        
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => this.handleWithdraw());
        }
        
        console.log('Tasti Deposita/Preleva configurati');
    }

    handleDeposit() {
        this.showNotification('💰 Funzione Deposita - Integrazione con sistema bancario', 'success');
        console.log('Deposit button clicked');
        // Qui si può implementare la logica per i depositi
    }

    handleWithdraw() {
        this.showNotification('💸 Funzione Preleva - Richiesta prelievo inoltrata', 'info');
        console.log('Withdraw button clicked');
        // Qui si può implementare la logica per i prelievi
    }

    // NUOVA FUNZIONE: Logica P&L Intelligente per sezione separata
    getCurrentMonthPLData() {
        const targetMonth = this.currentMonth;
        const targetYear = this.currentYear;
        
        // Prima prova con l'anno corrente (2025)
        let monthData = {};
        let hasData = false;
        let totalMonth = 0;
        
        this.participants.forEach(participant => {
            const value = this.portfolioData2025[participant] ? 
                         (this.portfolioData2025[participant][targetMonth] || 0) : 0;
            monthData[participant] = value;
            totalMonth += value;
            if (value > 0) hasData = true;
        });
        
        // Se non ci sono dati per il 2025, fallback al 2024
        if (!hasData || totalMonth === 0) {
            console.log('Fallback da 2025 a 2024 per P&L');
            monthData = {};
            totalMonth = 0;
            
            this.participants.forEach(participant => {
                const value = this.portfolioData2024[participant] ? 
                             (this.portfolioData2024[participant][targetMonth] || 0) : 0;
                monthData[participant] = value;
                totalMonth += value;
            });
            
            return {
                monthData: monthData,
                totalMonth: totalMonth,
                displayMonth: `${targetMonth} 2024`,
                year: 2024
            };
        }
        
        return {
            monthData: monthData,
            totalMonth: totalMonth,
            displayMonth: `${targetMonth} ${targetYear}`,
            year: targetYear
        };
    }

    // NUOVA FUNZIONE: Render Tabella P&L Separata
    renderPLTableSeparate() {
        const plData = this.getCurrentMonthPLData();
        const plTableBody = document.getElementById('plTableBody');
        const plMonthValue = document.getElementById('plMonthValue');
        
        if (!plTableBody || !plMonthValue) return;
        
        // Aggiorna il mese visualizzato
        plMonthValue.textContent = plData.displayMonth;
        
        // Pulisci tabella
        plTableBody.innerHTML = '';
        
        // Se non ci sono dati, mostra messaggio
        if (plData.totalMonth === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="3" style="text-align: center; color: var(--color-text-secondary); font-style: italic; padding: var(--space-16);">
                    Nessun dato disponibile per ${plData.displayMonth}
                </td>
            `;
            plTableBody.appendChild(emptyRow);
            return;
        }
        
        // Genera righe per ogni partecipante
        this.participants.forEach(participant => {
            const value = plData.monthData[participant] || 0;
            const percentage = plData.totalMonth > 0 ? ((value / plData.totalMonth) * 100) : 0;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="pl-participant-name">${participant}</td>
                <td class="pl-percentage">${percentage.toFixed(1)}%</td>
                <td class="pl-value">€${value.toLocaleString('it-IT')}</td>
            `;
            
            plTableBody.appendChild(row);
        });
        
        console.log(`P&L Table aggiornata per ${plData.displayMonth}`);
    }

    renderVerticalTable(year) {
        const tableId = year === '2024' ? 'tableBody' : 'tableBody2025';
        const tableBody = document.getElementById(tableId);
        if (!tableBody) return;
        
        const portfolioData = year === '2024' ? this.portfolioData2024 : this.portfolioData2025;
        
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
            
            const total = this.calculateParticipantTotal(participant);
            
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
            // Evidenzia per 2024
            this.allMonths.forEach((month, monthIndex) => {
                const percentCell2024 = document.getElementById(`percent-2024-${participantIndex}-${monthIndex}`);
                const depositCell2024 = document.querySelector(`[data-participant="${participant}"][data-month="${month}"][data-year="2024"]`);
                
                if (percentCell2024) {
                    percentCell2024.style.background = 'rgba(33, 128, 141, 0.15)';
                }
                if (depositCell2024) {
                    depositCell2024.style.background = 'rgba(33, 128, 141, 0.15)';
                }
            });
            
            // Evidenzia per 2025
            this.allMonths.forEach((month, monthIndex) => {
                const percentCell2025 = document.getElementById(`percent-2025-${participantIndex}-${monthIndex}`);
                const depositCell2025 = document.querySelector(`[data-participant="${participant}"][data-month="${month}"][data-year="2025"]`);
                
                if (percentCell2025) {
                    percentCell2025.style.background = 'rgba(33, 128, 141, 0.15)';
                }
                if (depositCell2025) {
                    depositCell2025.style.background = 'rgba(33, 128, 141, 0.15)';
                }
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
            portfolioData[participant][month] = newValue;
            
            // Ripristina contenuto cella
            cell.innerHTML = `€${newValue.toLocaleString('it-IT')}`;
            cell.classList.remove('editing');
            
            // Aggiorna calcoli
            this.calculateAllTotals();
            this.updateSummary();
            this.updateParticipantsList();
            this.renderPLTableSeparate(); // Aggiorna anche P&L separata
            
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
        
        // 2024
        this.allMonths.forEach((month, monthIndex) => {
            const monthTotal = this.calculateMonthTotal(month, '2024');
            
            // Aggiorna percentuali per questo mese
            this.participants.forEach((participant, participantIndex) => {
                const deposit = this.portfolioData2024[participant][month] || 0;
                const percentage = monthTotal > 0 ? ((deposit / monthTotal) * 100) : 0;
                
                const percentElement = document.getElementById(`percent-2024-${participantIndex}-${monthIndex}`);
                if (percentElement) {
                    percentElement.textContent = `${percentage.toFixed(1)}%`;
                }
            });
        });
        
        // 2025
        this.allMonths.forEach((month, monthIndex) => {
            const monthTotal = this.calculateMonthTotal(month, '2025');
            
            // Aggiorna percentuali per questo mese
            this.participants.forEach((participant, participantIndex) => {
                const deposit = this.portfolioData2025[participant][month] || 0;
                const percentage = monthTotal > 0 ? ((deposit / monthTotal) * 100) : 0;
                
                const percentElement = document.getElementById(`percent-2025-${participantIndex}-${monthIndex}`);
                if (percentElement) {
                    percentElement.textContent = `${percentage.toFixed(1)}%`;
                }
            });
        });
    }

    calculateMonthTotal(month, year) {
        let total = 0;
        const portfolioData = year === '2024' ? this.portfolioData2024 : this.portfolioData2025;
        this.participants.forEach(participant => {
            total += portfolioData[participant][month] || 0;
        });
        return total;
    }

    calculateParticipantTotal(participant) {
        let total = 0;
        // Somma entrambi gli anni
        this.allMonths.forEach(month => {
            total += this.portfolioData2024[participant][month] || 0;
            total += this.portfolioData2025[participant][month] || 0;
        });
        return total;
    }

    calculateGrandTotal() {
        let grandTotal = 0;
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
        const avgMonthly = (this.allMonths.length * 2) > 0 ? grandTotal / (this.allMonths.length * 2) : 0;
        
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
                const total = this.calculateParticipantTotal(participant);
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

    // Metodi di utilità per statistiche complete
    getFullStats() {
        return {
            participants: this.participants,
            totals2024: this.participants.map(p => ({
                participant: p,
                total: this.allMonths.reduce((sum, month) => sum + (this.portfolioData2024[p][month] || 0), 0)
            })),
            totals2025: this.participants.map(p => ({
                participant: p,
                total: this.allMonths.reduce((sum, month) => sum + (this.portfolioData2025[p][month] || 0), 0)
            })),
            grandTotal: this.calculateGrandTotal(),
            plData: this.getCurrentMonthPLData()
        };
    }

    // Metodo per debugging su mobile
    getMobileDebugInfo() {
        return {
            isMobile: window.innerWidth <= 767,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            userAgent: navigator.userAgent,
            currentMonth: this.currentMonth,
            currentYear: this.currentYear,
            fullStats: this.getFullStats()
        };
    }
}

// Inizializza l'applicazione
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Avvio app versione finale...');
    const app = new CryptoPortfolioApp();
    
    // Rendi l'app disponibile globalmente per debugging
    window.cryptoPortfolioApp = app;
    
    console.log('Crypto Portfolio App (Versione Finale) avviata con successo');
    
    // Log info mobile per debugging
    if (window.innerWidth <= 767) {
        console.log('Mobile device detected:', app.getMobileDebugInfo());
    }
    
    // Log statistiche complete per debugging
    console.log('Full Stats:', app.getFullStats());
});
