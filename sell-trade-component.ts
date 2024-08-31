// sell-trade.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TradeService } from './trade.service';
import { Instrument, Trade } from './models';

@Component({
  selector: 'app-sell-trade',
  templateUrl: './sell-trade.component.html',
  styleUrls: ['./sell-trade.component.css']
})
export class SellTradeComponent implements OnInit {
  sellForm: FormGroup;
  portfolioInstruments: Instrument[] = [];
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private tradeService: TradeService
  ) {
    this.sellForm = this.formBuilder.group({
      instrumentId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      targetPrice: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadPortfolioInstruments();
  }

  loadPortfolioInstruments() {
    this.tradeService.getPortfolioInstruments().subscribe(
      instruments => this.portfolioInstruments = instruments,
      error => this.errorMessage = 'Failed to load portfolio instruments'
    );
  }

  onSubmit() {
    if (this.sellForm.valid) {
      const sellTrade: Trade = {
        instrumentId: this.sellForm.get('instrumentId')?.value,
        quantity: this.sellForm.get('quantity')?.value,
        targetPrice: this.sellForm.get('targetPrice')?.value,
        direction: 'S',
        clientId: this.tradeService.getClientId(),
        portfolioId: this.tradeService.getPortfolioId()
      };

      this.tradeService.executeSellTrade(sellTrade).subscribe(
        result => {
          console.log('Trade executed successfully', result);
          this.sellForm.reset();
          this.loadPortfolioInstruments(); // Reload portfolio after successful trade
        },
        error => {
          this.errorMessage = error.message || 'Failed to execute sell trade';
        }
      );
    }
  }
}

// trade.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Instrument, Trade, TradeResult } from './models';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private mockPortfolio: Instrument[] = [
    { id: '1', name: 'AAPL', quantity: 100 },
    { id: '2', name: 'GOOGL', quantity: 50 },
    { id: '3', name: 'MSFT', quantity: 75 }
  ];

  getClientId(): string {
    return 'mock-client-id';
  }

  getPortfolioId(): string {
    return 'mock-portfolio-id';
  }

  getPortfolioInstruments(): Observable<Instrument[]> {
    return of(this.mockPortfolio);
  }

  executeSellTrade(trade: Trade): Observable<TradeResult> {
    const instrument = this.mockPortfolio.find(i => i.id === trade.instrumentId);
    
    if (!instrument) {
      return throwError(new Error('Instrument not found in portfolio'));
    }

    if (instrument.quantity < trade.quantity) {
      return throwError(new Error('Insufficient quantity to sell'));
    }

    // Mock successful trade
    const tradeResult: TradeResult = {
      tradeId: 'mock-trade-' + Date.now(),
      executionPrice: trade.targetPrice,
      cashValue: trade.quantity * trade.targetPrice
    };

    // Update mock portfolio
    instrument.quantity -= trade.quantity;

    return of(tradeResult);
  }
}

// models.ts
export interface Instrument {
  id: string;
  name: string;
  quantity: number;
}

export interface Trade {
  instrumentId: string;
  quantity: number;
  targetPrice: number;
  direction: 'B' | 'S';
  clientId: string;
  portfolioId: string;
}

export interface TradeResult {
  tradeId: string;
  executionPrice: number;
  cashValue: number;
}
