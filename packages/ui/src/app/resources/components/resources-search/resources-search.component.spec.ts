import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResourcesSearchComponent } from './resources-search.component'

describe('ResourcesSearchComponent', () => {
  let component: ResourcesSearchComponent
  let fixture: ComponentFixture<ResourcesSearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourcesSearchComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ResourcesSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
