// sell-trade.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SellTradeComponent } from './sell-trade.component';
import { TradeService } from './trade.service';

describe('SellTradeComponent', () => {
  let component: SellTradeComponent;
  let fixture: ComponentFixture<SellTradeComponent>;
  let tradeServiceSpy: jasmine.SpyObj<TradeService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TradeService', ['getPortfolioInstruments', 'executeSellTrade', 'getClientId', 'getPortfolioId']);

    await TestBed.configureTestingModule({
      declarations: [ SellTradeComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: TradeService, useValue: spy }
      ]
    }).compileComponents();

    tradeServiceSpy = TestBed.inject(TradeService) as jasmine.SpyObj<TradeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellTradeComponent);
    component = fixture.componentInstance;
    tradeServiceSpy.getPortfolioInstruments.and.returnValue(of([
      { id: '1', name: 'AAPL', quantity: 100 },
      { id: '2', name: 'GOOGL', quantity: 50 }
    ]));
    tradeServiceSpy.getClientId.and.returnValue('mock-client-id');
    tradeServiceSpy.getPortfolioId.and.returnValue('mock-portfolio-id');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load portfolio instruments on init', () => {
    expect(component.portfolioInstruments.length).toBe(2);
    expect(component.portfolioInstruments[0].name).toBe('AAPL');
  });

  it('should execute sell trade successfully', () => {
    const mockTradeResult = { tradeId: 'mock-trade-1', executionPrice: 150, cashValue: 15000 };
    tradeServiceSpy.executeSellTrade.and.returnValue(of(mockTradeResult));

    component.sellForm.setValue({
      instrumentId: '1',
      quantity: 100,
      targetPrice: 150
    });

    component.onSubmit();

    expect(tradeServiceSpy.executeSellTrade).toHaveBeenCalledWith({
      instrumentId: '1',
      quantity: 100,
      targetPrice: 150,
      direction: 'S',
      clientId: 'mock-client-id',
      portfolioId: 'mock-portfolio-id'
    });
    expect(component.errorMessage).toBe('');
  });

  it('should handle error when trying to sell more than owned', () => {
    tradeServiceSpy.executeSellTrade.and.returnValue(throwError({ message: 'Insufficient quantity to sell' }));

    component.sellForm.setValue({
      instrumentId: '1',
      quantity: 150,
      targetPrice: 150
    });

    component.onSubmit();

    expect(tradeServiceSpy.executeSellTrade).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Insufficient quantity to sell');
  });
});
