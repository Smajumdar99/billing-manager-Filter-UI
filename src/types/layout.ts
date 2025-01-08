export interface WidgetLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  isResizable?: boolean
  isDraggable?: boolean
  static?: boolean
}

export interface Layouts {
  [key: string]: WidgetLayout[]
} 