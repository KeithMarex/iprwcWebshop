import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlantenpaneelComponent } from './klantenpaneel.component';

describe('KlantenpaneelComponent', () => {
  let component: KlantenpaneelComponent;
  let fixture: ComponentFixture<KlantenpaneelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlantenpaneelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KlantenpaneelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
