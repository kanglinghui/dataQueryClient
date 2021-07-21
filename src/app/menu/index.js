import { Menu } from 'electron'
const MenuList = []
export default function createMenu () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(MenuList))
}
