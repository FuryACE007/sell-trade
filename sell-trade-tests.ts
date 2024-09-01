import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { SellTradeComponent } from './sell-trade.component';
import { FmtsService } from '../services/fmts.service';
import { InstrumentService } from '../services/instrument.service';
import { ClientService } from '../services/client.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('SellTradeComponent', () => {
  let component: SellTradeComponent;
  let fixture: ComponentFixture<SellTradeComponent>;
  let fmtsServiceSpy: jasmine.SpyObj<FmtsService>;
  let instrumentServiceSpy: jasmine.SpyObj<InstrumentService>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const fmtsService = jasmine.createSpyObj('FmtsService', ['executeTrade']);
    const instrumentService = jasmine.createSpyObj('InstrumentService', ['getInstruments']);
    const clientService = jasmine.createSpyObj('ClientService', ['getClientData']);
    const snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ SellTradeComponent ],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        { provide: FmtsService, useValue: fmtsService },
        { provide: InstrumentService, useValue: instrumentService },
        { provide: ClientService, useValue: clientService },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();

    fmtsServiceSpy = TestBed.inject(FmtsService) as jasmine.SpyObj<FmtsService>;
    instrumentServiceSpy = TestBed.inject(InstrumentService) as jasmine.SpyObj<InstrumentService>;
    clientServiceSpy = TestBed.inject(ClientService) as jasmine.SpyObj<ClientService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellTradeComponent);
    component = fixture.componentInstance;
    
    clientServiceSpy.getClientData.and.returnValue(of({ id: '1', cash: 1000 }));
    instrumentServiceSpy.getInstruments.and.returnValue(of([
      { instrumentId: '1', description: 'Test Instrument' }
    ]));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load client data on init', () => {
    expect(clientServiceSpy.getClientData).toHaveBeenCalled();
    expect(component.client).toEqual({ id: '1', cash: 1000 });
  });

  it('should load portfolio instruments on init', () => {
    expect(instrumentServiceSpy.getInstruments).toHaveBeenCalled();
    expect(component.portfolioInstruments).toEqual([
      { instrumentId: '1', description: 'Test Instrument' }
    ]);
  });

  it('should execute trade when form is valid', () => {
    const trade = { cashValue: 100 };
    fmtsServiceSpy.executeTrade.and.returnValue(of(trade));

    component.sellForm.setValue({
      instrumentId: '1',
      quantity: 10,
      targetPrice: 50
    });

    component.onSubmit();

    expect(fmtsServiceSpy.executeTrade).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Trade executed successfully', 'Close', { duration: 3000 });
    expect(component.client?.cash).toBe(1100);
    expect(component.sellForm.value).toEqual({ instrumentId: null, quantity: null, targetPrice: null });
  });

  it('should show error when trade execution fails', () => {
    fmtsServiceSpy.executeTrade.and.returnValue(throwError('Error'));

    component.sellForm.setValue({
      instrumentId: '1',
      quantity: 10,
      targetPrice: 50
    });

    component.onSubmit();

    expect(fmtsServiceSpy.executeTrade).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Trade execution failed', 'Close', { duration: 3000 });
  });

  it('should not execute trade when form is invalid', () => {
    component.onSubmit();

    expect(fmtsServiceSpy.executeTrade).not.toHaveBeenCalled();
  });

  it('should reset form validation state after successful trade', () => {
    const trade = { cashValue: 100 };
    fmtsServiceSpy.executeTrade.and.returnValue(of(trade));

    component.sellForm.setValue({
      instrumentId: '1',
      quantity: 10,
      targetPrice: 50
    });

    component.onSubmit();

    expect(component.sellForm.get('instrumentId')?.errors).toBeNull();
    expect(component.sellForm.get('quantity')?.errors).toBeNull();
    expect(component.sellForm.get('targetPrice')?.errors).toBeNull();
  });
});