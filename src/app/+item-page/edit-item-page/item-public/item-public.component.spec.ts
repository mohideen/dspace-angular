import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Item } from '../../../core/shared/item.model';
import { RouterStub } from '../../../shared/testing/router-stub';
import { of as observableOf } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service-stub';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from '../../../core/data/item-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ItemPublicComponent } from './item-public.component';
import { RestResponse } from '../../../core/cache/response.models';
import { createSuccessfulRemoteDataObject } from '../../../shared/testing/utils';

let comp: ItemPublicComponent;
let fixture: ComponentFixture<ItemPublicComponent>;

let mockItem;
let itemPageUrl;
let routerStub;
let mockItemDataService: ItemDataService;
let routeStub;
let notificationsServiceStub;
let successfulRestResponse;
let failRestResponse;

describe('ItemPublicComponent', () => {
  beforeEach(async(() => {

    mockItem = Object.assign(new Item(), {
      id: 'fake-id',
      handle: 'fake/handle',
      lastModified: '2018',
      isWithdrawn: true
    });

    itemPageUrl = `fake-url/${mockItem.id}`;
    routerStub = Object.assign(new RouterStub(), {
      url: `${itemPageUrl}/edit`
    });

    mockItemDataService = jasmine.createSpyObj('mockItemDataService', {
      setDiscoverable: observableOf(new RestResponse(true, 200, 'OK'))
    });

    routeStub = {
      data: observableOf({
        item: createSuccessfulRemoteDataObject({
          id: 'fake-id'
        })
      })
    };

    notificationsServiceStub = new NotificationsServiceStub();

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [ItemPublicComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: ItemDataService, useValue: mockItemDataService },
        { provide: NotificationsService, useValue: notificationsServiceStub },
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    successfulRestResponse = new RestResponse(true, 200, 'OK');
    failRestResponse = new RestResponse(false, 500, 'Internal Server Error');

    fixture = TestBed.createComponent(ItemPublicComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a page with messages based on the \'public\' messageKey', () => {
    const header = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(header.innerHTML).toContain('item.edit.public.header');
    const description = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(description.innerHTML).toContain('item.edit.public.description');
    const confirmButton = fixture.debugElement.query(By.css('button.perform-action')).nativeElement;
    expect(confirmButton.innerHTML).toContain('item.edit.public.confirm');
    const cancelButton = fixture.debugElement.query(By.css('button.cancel')).nativeElement;
    expect(cancelButton.innerHTML).toContain('item.edit.public.cancel');
  });

  describe('performAction', () => {
    it('should call setDiscoverable function from the ItemDataService', () => {
      spyOn(comp, 'processRestResponse');
      comp.performAction();

      expect(mockItemDataService.setDiscoverable).toHaveBeenCalledWith(mockItem.id, true);
      expect(comp.processRestResponse).toHaveBeenCalled();
    });
  });
})
;
