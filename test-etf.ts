it('should load all ETFs on init', () => {
  const mockEtfs = [
    { Ticker: 'GLD', Fund_Name: 'SPDR Gold Trust', Issuer: 'State Street', AUM_bil: 58.76, Expense_Ratio: 0.004, ThreeMoTR: 0.0784, Segment: 'Commodities: Precious Metals Gold' }
  ];

  etfService.getAllEtfs.and.returnValue(of(mockEtfs));

  fixture.detectChanges(); // triggers ngOnInit

  expect(component.etfs).toEqual(mockEtfs);
  expect(etfService.getAllEtfs).toHaveBeenCalled();
});
it('should set errorMessage when loadAllEtfs fails', () => {
  const error = 'Failed to load ETFs';

  etfService.getAllEtfs.and.returnValue(throwError(() => new Error(error)));

  fixture.detectChanges();

  expect(component.errorMessage).toBe(error);
  expect(component.etfs).toEqual([]);
});
it('should load ER ETFs when the ER button is clicked', () => {
  const mockEtfs = [
    { Ticker: 'GLD', Fund_Name: 'SPDR Gold Trust', Issuer: 'State Street', AUM_bil: 58.76, Expense_Ratio: 0.004, ThreeMoTR: 0.0784, Segment: 'Commodities: Precious Metals Gold' }
  ];

  etfService.getEREtfs.and.returnValue(of(mockEtfs));

  const button = fixture.debugElement.query(By.css('button:nth-child(2)')).nativeElement;
  button.click();

  expect(component.etfs).toEqual(mockEtfs);
  expect(etfService.getEREtfs).toHaveBeenCalled();
});
it('should display ETFs in the table', () => {
  const mockEtfs = [
    { Ticker: 'GLD', Fund_Name: 'SPDR Gold Trust', Issuer: 'State Street', AUM_bil: 58.76, Expense_Ratio: 0.004, ThreeMoTR: 0.0784, Segment: 'Commodities: Precious Metals Gold' }
  ];

  etfService.getAllEtfs.and.returnValue(of(mockEtfs));

  fixture.detectChanges(); // Trigger change detection

  const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));

  expect(tableRows.length).toBe(1);
  expect(tableRows[0].nativeElement.textContent).toContain('GLD');
  expect(tableRows[0].nativeElement.textContent).toContain('SPDR Gold Trust');
  expect(tableRows[0].nativeElement.textContent).toContain('State Street');
  expect(tableRows[0].nativeElement.textContent).toContain('58.76');
  expect(tableRows[0].nativeElement.textContent).toContain('0.004');
  expect(tableRows[0].nativeElement.textContent).toContain('0.0784');
  expect(tableRows[0].nativeElement.textContent).toContain('Commodities: Precious Metals Gold');
});

