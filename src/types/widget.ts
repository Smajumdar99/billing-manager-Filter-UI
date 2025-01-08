export interface WidgetLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
}

export interface Layouts {
  lg: WidgetLayout[]
  md: WidgetLayout[]
  sm: WidgetLayout[]
} 