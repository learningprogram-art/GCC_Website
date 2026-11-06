export interface HomeStat {
  value: string
  label: string
  description?: string
}

export interface BuildingStructure {
  id: string
  title: string
  description: string
  image?: string
}

export interface ConstructionStep {
  step: number
  title: string
  description: string
}
