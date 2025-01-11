import * as React from "react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export interface MenubarProps {
  className?: string
}

export function MainMenubar({ className }: MenubarProps) {
  return (
    <Menubar className={`bg-white rounded-md ${className}`}>
      <MenubarMenu>
        <MenubarTrigger>Client Info</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Level of Care</MenubarItem>
          <MenubarItem>Reset Onsite Portal Credentials</MenubarItem>
          <MenubarItem>Admit / Pause / Discharge</MenubarItem>
          <MenubarItem>Facesheet</MenubarItem>
          <MenubarItem>Manage eSignature</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Clinical</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Coming Soon...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Documents</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Coming Soon...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Reports</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Coming Soon...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Other</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Coming Soon...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>EDI</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Coming Soon...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>External Links</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Coming Soon...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>More Options</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Coming Soon...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
} 