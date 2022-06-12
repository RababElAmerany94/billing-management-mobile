import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { IMenuItem, MenuConfig } from '../helpers/menu-config';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private isOpened = false;

  public menuConfig: IMenuItem[];
  private onConfigUpdated$ = new BehaviorSubject<IMenuItem[]>(null);
  menuConfigState = this.onConfigUpdated$.asObservable();

  constructor(
    private menu: MenuController,
  ) { }

  /**
   * Toggles the sidebar menu
   */
  async toggleMenu() {
    this.loadMenu(MenuConfig.getListPages());
  }

  /**
   * Closes the sidebar menu
   */
  closeMenu(): void {
    this.menu.close();
    this.isOpened = false;
  }

  /**
   * Checks if the sidebar menu is opened or not
   */
  isMenuOpened(): boolean {
    return this.isOpened;
  }

  /**
   * Load menu
   */
  loadMenu(menuItem: IMenuItem[]) {
    this.menuConfig = menuItem;
    this.onConfigUpdated$.next(menuItem);
  }
}
