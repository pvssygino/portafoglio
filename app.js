// Portfolio Crypto Application - Versione Trimestrale Verticale
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
        
        // Inizializza dati portfolio
        this.portfolioData = this.initializeData();
        
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

    initializeData() {
        const data = {};
        this.participants.forEach(participant => {
            data[participant] = {};
            this.allMonths.forEach(month => {
                data[participant][month] = 0;
            });
        });

        // Dati di esempio aggiornati
        data["Marco"] = {"Gennaio": 800, "Febbraio": 750, "Marzo": 900, "Aprile": 650, "Maggio": 850, "Giugno": 700, "Luglio": 950, "Agosto": 800, "Settembre": 750, "Ottobre": 600, "Novembre": 750, "Dicembre": 900};
        data["Luca"] = {"Gennaio": 750, "Febbraio": 700, "Marzo": 800, "Aprile": 600, "Maggio": 750, "Giugno": 650, "Luglio": 800, "Agosto": 750, "Settembre": 700, "Ottobre": 800, "Novembre": 700, "Dicembre": 650};
        data["Sara"] = {"Gennaio": 650, "Febbraio": 800, "Marzo": 750, "Aprile": 700, "Maggio": 900, "Giugno": 600, "Luglio": 750, "Agosto": 700, "Settembre": 800, "Ottobre": 700, "Novembre": 800, "Dicembre": 750};
        data["Giovanni"] = {"Gennaio": 500, "Febbraio": 550, "Marzo": 600, "Aprile": 580, "Maggio": 520, "Giugno": 600, "Luglio": 550, "Agosto": 580, "Settembre": 500, "Ottobre": 550, "Novembre": 600, "Dicembre": 580};
        data["Anna"] = {"Gennaio": 650, "Febbraio": 700, "Marzo": 600, "Aprile": 650, "Maggio": 700, "Giugno": 600, "Luglio": 650, "Agosto": 700, "Settembre": 650, "Ottobre": 600, "Novembre": 650, "Dicembre": 700};
        data["Paolo"] = {"Gennaio": 480, "Febbraio": 520, "Marzo": 500, "Aprile": 580, "Maggio": 600, "Giugno": 550, "Luglio": 580, "Agosto": 520, "Settembre": 480, "Ottobre": 520, "Novembre": 580, "Dicembre": 600};
        data["Elena"] = {"Gennaio": 550, "Febbraio": 600, "Marzo": 580, "Aprile": 520, "Maggio": 620, "Giugno": 580, "Luglio": 550, "Agosto": 600, "Settembre": 550, "Ottobre": 580, "Novembre": 520, "Dicembre": 620};
        data["Roberto"] = {"Gennaio": 500, "Febbraio": 480, "Marzo": 520, "Aprile": 550, "Maggio": 500, "Giugno": 480, "Luglio": 520, "Agosto": 500, "Settembre": 520, "Ottobre": 500, "Novembre": 480, "Dicembre": 550};

        return data;
    }

    initializeApp() {
        console.log('Inizializzazione Crypto Portfolio App - Versione Trimestrale Verticale...');
        this.renderVerticalTable();
        this.renderParticipantsList();
        this.createPieChart();
        this.calculateAllTotals();
        this.updateSummary();
        this.setupEventListeners();
        console.log('App inizializzata con successo');
    }

    renderVerticalTable() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';

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
                monthRow.innerHTML = this.generateMonthRowHTML(month, quarterIndex, monthInQuarterIndex);
                tableBody.appendChild(monthRow);
            });
        });
    }

    generateMonthRowHTML(month, quarterIndex, monthInQuarterIndex) {
        let html = `<td class="month-name">${month}</td>`;
        
        // Per ogni partecipante, aggiungi due colonne: % e €
        this.participants.forEach((participant, participantIndex) => {
            const deposit = this.portfolioData[participant][month] || 0;
            const monthIndex = this.allMonths.indexOf(month);
            
            html += `
                <td class="percent-cell" id="percent-${participantIndex}-${monthIndex}">
                    0%
                </td>
                <td class="deposit-cell" 
                    data-participant="${participant}" 
                    data-month="${month}"
                    data-participant-index="${participantIndex}"
                    data-month-index="${monthIndex}"
                    title="Clicca per modificare il deposito di ${participant} per ${month}">
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
        
        // Evidenzia colonne del partecipante selezionato
        const participantIndex = this.participants.indexOf(participant);
        if (participantIndex >= 0) {
            // Evidenzia tutte le celle per questo partecipante
            this.allMonths.forEach((month, monthIndex) => {
                const percentCell = document.getElementById(`percent-${participantIndex}-${monthIndex}`);
                const depositCell = document.querySelector(`[data-participant="${participant}"][data-month="${month}"]`);
                
                if (percentCell) {
                    percentCell.style.background = 'rgba(33, 128, 141, 0.15)';
                }
                if (depositCell) {
                    depositCell.style.background = 'rgba(33, 128, 141, 0.15)';
                }
            });
        }
    }

    createPieChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;

        const labels = Object.keys(this.cryptoAllocation);
        const data = Object.values(this.cryptoAllocation);

        this.pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: this.chartColors,
                    borderWidth: 2,
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
                        }
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

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Event listeners per celle della tabella
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
        
        if (!participant || !month) {
            console.error('Missing participant or month data:', participant, month);
            return;
        }
        
        const currentValue = this.portfolioData[participant][month] || 0;
        console.log(`Editing ${participant} - ${month}: current value = ${currentValue}`);

        // Salva contenuto originale
        const originalContent = cell.innerHTML;

        // Crea input
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'table-input';
        input.value = currentValue;
        input.min = '0';
        input.step = '50';
        input.style.width = '100%';
        input.style.height = '100%';
        input.style.minWidth = '60px';

        // Sostituisci contenuto cella
        cell.innerHTML = '';
        cell.appendChild(input);
        cell.classList.add('editing');

        // Focus sull'input
        setTimeout(() => {
            input.focus();
            input.select();
        }, 10);

        const finishEditing = () => {
            console.log('Finishing edit, input value:', input.value);
            const newValue = Math.max(0, parseInt(input.value) || 0);
            this.portfolioData[participant][month] = newValue;
            
            // Ripristina contenuto cella
            cell.innerHTML = `€${newValue.toLocaleString('it-IT')}`;
            cell.classList.remove('editing');
            
            // Aggiorna calcoli
            this.calculateAllTotals();
            this.updateSummary();
            this.updateParticipantsList();
            
            this.showNotification(`✅ ${participant} ${month}: €${newValue.toLocaleString('it-IT')}`, 'success');
        };

        const cancelEditing = () => {
            console.log('Cancelling edit');
            cell.innerHTML = originalContent;
            cell.classList.remove('editing');
        };

        // Gestione eventi input
        input.addEventListener('blur', (e) => {
            console.log('Input blur');
            setTimeout(() => finishEditing(), 100);
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
    }

    calculateAllTotals() {
        // Calcola totali per ogni mese e percentuali
        this.allMonths.forEach((month, monthIndex) => {
            const monthTotal = this.calculateMonthTotal(month);
            
            // Aggiorna percentuali per questo mese
            this.participants.forEach((participant, participantIndex) => {
                const deposit = this.portfolioData[participant][month] || 0;
                const percentage = monthTotal > 0 ? ((deposit / monthTotal) * 100) : 0;
                
                const percentElement = document.getElementById(`percent-${participantIndex}-${monthIndex}`);
                if (percentElement) {
                    percentElement.textContent = `${percentage.toFixed(1)}%`;
                }
            });
        });
    }

    calculateMonthTotal(month) {
        let total = 0;
        this.participants.forEach(participant => {
            total += this.portfolioData[participant][month] || 0;
        });
        return total;
    }

    calculateParticipantTotal(participant) {
        let total = 0;
        this.allMonths.forEach(month => {
            total += this.portfolioData[participant][month] || 0;
        });
        return total;
    }

    calculateGrandTotal() {
        let grandTotal = 0;
        this.participants.forEach(participant => {
            this.allMonths.forEach(month => {
                grandTotal += this.portfolioData[participant][month] || 0;
            });
        });
        return grandTotal;
    }

    calculateQuarterTotal(quarter) {
        let quarterTotal = 0;
        const months = this.quartersVertical[quarter];
        months.forEach(month => {
            quarterTotal += this.calculateMonthTotal(month);
        });
        return quarterTotal;
    }

    updateSummary() {
        const grandTotal = this.calculateGrandTotal();
        const avgMonthly = this.allMonths.length > 0 ? grandTotal / this.allMonths.length : 0;
        
        let activeParticipants = 0;
        this.participants.forEach(participant => {
            let hasDeposits = false;
            this.allMonths.forEach(month => {
                if (this.portfolioData[participant][month] > 0) {
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
        
        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Metodi di utilità per statistiche trimestrali
    getQuarterStats() {
        const stats = {};
        Object.keys(this.quartersVertical).forEach(quarter => {
            const months = this.quartersVertical[quarter];
            let quarterTotal = 0;
            const participantTotals = {};
            
            this.participants.forEach(participant => {
                participantTotals[participant] = 0;
                months.forEach(month => {
                    const amount = this.portfolioData[participant][month] || 0;
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
}

// Inizializza l'applicazione
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Avvio app trimestrale verticale...');
    const app = new CryptoPortfolioApp();
    
    // Rendi l'app disponibile globalmente per debugging
    window.cryptoPortfolioApp = app;
    
    console.log('Crypto Portfolio App (Trimestrale Verticale) avviata con successo');
});
