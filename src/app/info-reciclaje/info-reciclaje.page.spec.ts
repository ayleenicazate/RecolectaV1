import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoReciclajePage } from './info-reciclaje.page';

describe('InfoReciclajePage', () => {
  let component: InfoReciclajePage;
  let fixture: ComponentFixture<InfoReciclajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoReciclajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
