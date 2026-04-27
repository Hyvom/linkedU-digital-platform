import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlModel } from './ml-model';

describe('MlModel', () => {
  let component: MlModel;
  let fixture: ComponentFixture<MlModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlModel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
