// Crypto Portfolio Application
class CryptoPortfolio {
    constructor() {
        this.participants = ["Marco", "Luca", "Sara", "Giovanni", "Anna", "Paolo", "Elena", "Roberto"];
        this.months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
                      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
        this.monthAbbr = ["jan", "feb", "mar", "apr", "may", "jun", 
                         "jul", "aug", "sep", "oct", "nov", "dec"];
        
        // Data storage
        this.portfolioData = this.initializeData();
        
        // Wait for DOM to be ready
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
            this.months.forEach(month => {
                data[participant][month] = 0;
            });
        });

        // Load sample data
        const sampleData = {
            "Marco": {"Gennaio": 500, "Febbraio": 300, "Marzo": 400},
            "Luca": {"Gennaio": 600, "Febbraio": 400, "Marzo": 350},
            "Sara": {"Gennaio": 450, "Febbraio": 500, "Marzo": 300}
        };

        // Merge sample data
        Object.keys(sampleData).forEach(participant => {
            if (data[participant]) {
                Object.keys(sampleData[participant]).forEach(month => {
                    data[participant][month] = sampleData[participant][month];
                });
            }
        });

        return data;
    }

    initializeApp() {
        console.log('Initializing Crypto Portfolio App...');
        this.renderTable();
        this.calculateAllTotals();
        this.updateSummary();
        this.bindEvents();
        this.setupCellEditing();
        console.log('App initialized successfully');
    }

    renderTable() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) {
            console.error('Table body element not found');
            return;
        }
        
        tableBody.innerHTML = '';

        this.participants.forEach((participant, participantIndex) => {
            const row = document.createElement('tr');
            row.innerHTML = this.generateRowHTML(participant, participantIndex);
            tableBody.appendChild(row);
        });
    }

    generateRowHTML(participant, participantIndex) {
        let html = `<td class="participant-name">${participant}</td>`;
        
        this.months.forEach((month, monthIndex) => {
            const deposit = this.portfolioData[participant][month] || 0;
            
            html += `
                <td class="deposit-cell editable-cell" 
                    data-participant="${participant}" 
                    data-month="${month}"
                    title="Clicca per modificare">
                    €${deposit.toLocaleString('it-IT')}
                </td>
                <td class="percent-cell" id="percent-${participantIndex}-${monthIndex}">
                    0%
                </td>
            `;
        });

        // Add total column
        html += `<td class="participant-total" id="total-${participantIndex}">€0</td>`;
        
        return html;
    }

    setupCellEditing() {
        console.log('Setting up cell editing...');
        
        // Remove any existing event listeners to prevent duplicates
        const existingCells = document.querySelectorAll('.deposit-cell');
        existingCells.forEach(cell => {
            // Clone node to remove all event listeners
            const newCell = cell.cloneNode(true);
            cell.parentNode.replaceChild(newCell, cell);
        });

        // Add event listeners using event delegation
        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.addEventListener('click', (e) => {
                if (e.target.classList.contains('deposit-cell')) {
                    console.log('Deposit cell clicked:', e.target);
                    this.editCell(e.target);
                }
            });
            console.log('Cell editing event delegation set up');
        }
    }

    editCell(cell) {
        console.log('Edit cell called');
        
        // Prevent multiple editing
        if (cell.querySelector('input') || cell.classList.contains('editing')) {
            console.log('Already editing this cell');
            return;
        }

        const participant = cell.dataset.participant;
        const month = cell.dataset.month;
        const currentValue = this.portfolioData[participant][month] || 0;

        console.log(`Editing ${participant} - ${month}: ${currentValue}`);

        // Store original content
        const originalContent = cell.innerHTML;

        // Create input element
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'table-input';
        input.value = currentValue;
        input.min = '0';
        input.step = '1';
        input.style.width = '100%';
        input.style.border = '2px solid #c15be4';
        input.style.borderRadius = '4px';
        input.style.padding = '4px';
        input.style.textAlign = 'center';
        input.style.fontSize = 'inherit';

        // Replace cell content with input
        cell.innerHTML = '';
        cell.appendChild(input);
        cell.classList.add('editing');

        // Focus and select the input
        setTimeout(() => {
            input.focus();
            input.select();
        }, 50);

        const finishEditing = () => {
            console.log('Finishing edit');
            const newValue = Math.max(0, parseInt(input.value) || 0);
            this.portfolioData[participant][month] = newValue;
            
            // Restore cell content
            cell.innerHTML = `€${newValue.toLocaleString('it-IT')}`;
            cell.classList.remove('editing');
            
            // Update calculations
            this.calculateAllTotals();
            this.updateSummary();
            this.highlightValues();
            
            // Show notification
            this.showNotification(`✅ ${participant} ${month}: €${newValue.toLocaleString('it-IT')}`, 'success');
        };

        const cancelEditing = () => {
            console.log('Cancelling edit');
            cell.innerHTML = originalContent;
            cell.classList.remove('editing');
        };

        // Handle input events
        input.addEventListener('blur', (e) => {
            console.log('Input blur event');
            finishEditing();
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

        // Prevent event bubbling
        input.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    calculateAllTotals() {
        // Calculate participant totals and percentages
        this.participants.forEach((participant, participantIndex) => {
            let participantTotal = 0;
            
            this.months.forEach((month, monthIndex) => {
                const deposit = this.portfolioData[participant][month] || 0;
                participantTotal += deposit;
            });

            // Update participant total
            const totalElement = document.getElementById(`total-${participantIndex}`);
            if (totalElement) {
                totalElement.textContent = `€${participantTotal.toLocaleString('it-IT')}`;
            }

            // Calculate percentages for this participant
            this.months.forEach((month, monthIndex) => {
                const deposit = this.portfolioData[participant][month] || 0;
                const monthTotal = this.calculateMonthTotal(monthIndex);
                const percentage = monthTotal > 0 ? ((deposit / monthTotal) * 100) : 0;
                
                const percentElement = document.getElementById(`percent-${participantIndex}-${monthIndex}`);
                if (percentElement) {
                    percentElement.textContent = `${percentage.toFixed(1)}%`;
                }
            });
        });

        // Calculate month totals
        this.monthAbbr.forEach((monthAbbr, monthIndex) => {
            const monthTotal = this.calculateMonthTotal(monthIndex);
            const totalElement = document.getElementById(`total-${monthAbbr}-deposit`);
            if (totalElement) {
                totalElement.textContent = `€${monthTotal.toLocaleString('it-IT')}`;
            }
        });

        // Calculate grand total
        const grandTotal = this.calculateGrandTotal();
        const grandTotalElement = document.getElementById('grandTotal');
        if (grandTotalElement) {
            grandTotalElement.textContent = `€${grandTotal.toLocaleString('it-IT')}`;
        }
    }

    calculateMonthTotal(monthIndex) {
        const month = this.months[monthIndex];
        let total = 0;
        this.participants.forEach(participant => {
            total += this.portfolioData[participant][month] || 0;
        });
        return total;
    }

    calculateGrandTotal() {
        let grandTotal = 0;
        this.participants.forEach(participant => {
            this.months.forEach(month => {
                grandTotal += this.portfolioData[participant][month] || 0;
            });
        });
        return grandTotal;
    }

    updateSummary() {
        const grandTotal = this.calculateGrandTotal();
        const totalEntries = this.participants.length * this.months.length;
        const avgDeposit = totalEntries > 0 ? grandTotal / totalEntries : 0;
        
        let activeParticipants = 0;
        this.participants.forEach(participant => {
            let hasDeposits = false;
            this.months.forEach(month => {
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
        if (avgEl) avgEl.textContent = `€${Math.round(avgDeposit).toLocaleString('it-IT')}`;
        if (activeEl) activeEl.textContent = activeParticipants.toString();
    }

    highlightValues() {
        const allValues = [];
        this.participants.forEach(participant => {
            this.months.forEach(month => {
                const value = this.portfolioData[participant][month] || 0;
                if (value > 0) allValues.push(value);
            });
        });

        if (allValues.length === 0) return;

        allValues.sort((a, b) => b - a);
        const highest = allValues[0];
        const threshold = highest * 0.8;

        // Apply highlighting
        document.querySelectorAll('.deposit-cell').forEach(cell => {
            const participant = cell.dataset.participant;
            const month = cell.dataset.month;
            const value = this.portfolioData[participant][month] || 0;

            cell.classList.remove('high-value', 'low-value');
            
            if (value >= threshold && value > 0) {
                cell.classList.add('high-value');
            }
        });
    }

    exportToCSV() {
        console.log('Exporting CSV...');
        try {
            let csv = 'Partecipante';
            
            // Add month headers
            this.months.forEach(month => {
                csv += `,${month} Deposito,${month} %`;
            });
            csv += ',Totale\n';

            // Add participant data
            this.participants.forEach((participant) => {
                csv += participant;
                
                let participantTotal = 0;
                this.months.forEach((month, monthIndex) => {
                    const deposit = this.portfolioData[participant][month] || 0;
                    const monthTotal = this.calculateMonthTotal(monthIndex);
                    const percentage = monthTotal > 0 ? ((deposit / monthTotal) * 100) : 0;
                    
                    csv += `,${deposit},${percentage.toFixed(1)}`;
                    participantTotal += deposit;
                });
                
                csv += `,${participantTotal}\n`;
            });

            // Add totals row
            csv += 'Totali Mensili';
            this.months.forEach((month, monthIndex) => {
                const monthTotal = this.calculateMonthTotal(monthIndex);
                csv += `,${monthTotal},-`;
            });
            csv += `,${this.calculateGrandTotal()}\n`;

            // Create and download the file
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            const timestamp = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `portfolio-crypto-${timestamp}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            this.showNotification('📊 File CSV esportato con successo!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('❌ Errore durante l\'esportazione del CSV', 'error');
        }
    }

    resetData() {
        console.log('Reset data called');
        
        // Create custom confirmation dialog
        const confirmDialog = confirm(
            '⚠️  ATTENZIONE - Reset Dati  ⚠️\n\n' +
            'Sei sicuro di voler resettare tutti i dati?\n\n' +
            '• Tutti i depositi inseriti verranno cancellati\n' +
            '• I dati verranno ripristinati ai valori di esempio iniziali\n' +
            '• Questa azione non può essere annullata\n\n' +
            'Clicca OK per confermare il reset, o Annulla per mantenere i dati attuali.'
        );
        
        console.log('Confirmation result:', confirmDialog);
        
        if (confirmDialog) {
            console.log('Resetting data...');
            
            // Reset data to initial state
            this.portfolioData = {};
            this.participants.forEach(participant => {
                this.portfolioData[participant] = {};
                this.months.forEach(month => {
                    this.portfolioData[participant][month] = 0;
                });
            });

            // Re-add sample data
            const sampleData = {
                "Marco": {"Gennaio": 500, "Febbraio": 300, "Marzo": 400},
                "Luca": {"Gennaio": 600, "Febbraio": 400, "Marzo": 350},
                "Sara": {"Gennaio": 450, "Febbraio": 500, "Marzo": 300}
            };

            Object.keys(sampleData).forEach(participant => {
                if (this.portfolioData[participant]) {
                    Object.keys(sampleData[participant]).forEach(month => {
                        this.portfolioData[participant][month] = sampleData[participant][month];
                    });
                }
            });

            this.renderTable();
            this.setupCellEditing();
            this.calculateAllTotals();
            this.updateSummary();
            this.highlightValues();
            
            this.showNotification('🔄 Dati resettati ai valori iniziali!', 'success');
        } else {
            console.log('Reset cancelled by user');
            this.showNotification('ℹ️ Reset annullato', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#55b08c',
            error: '#ff5459',
            info: '#c15be4'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            backgroundColor: colors[type] || colors.info,
            color: 'white',
            borderRadius: '8px',
            zIndex: '1000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Export button clicked');
                this.exportToCSV();
            });
            console.log('Export button bound');
        }

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Reset button clicked');
                this.resetData();
            });
            console.log('Reset button bound');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting app...');
    const app = new CryptoPortfolio();
    
    // Make app available globally for debugging
    window.cryptoPortfolio = app;
    
    console.log('Crypto Portfolio App setup complete');
});