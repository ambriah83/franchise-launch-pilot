import { Project, ShipmentLog } from "../types"
import { v4 as uuidv4 } from 'uuid'

const generateId = (): string => {
  return uuidv4()
}

export const localStorageService = {
  getProjects: (): Project[] => {
    const data = localStorage.getItem('projects')
    if (!data) return []
    
    const projects = JSON.parse(data)
    // Convert date strings back to Date objects
    return projects.map((project: any) => ({
      ...project,
      targetOpeningDate: new Date(project.targetOpeningDate),
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt)
    }))
  },

  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const projects = localStorageService.getProjects()
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    projects.push(newProject)
    localStorage.setItem('projects', JSON.stringify(projects))
    return newProject
  },

  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const projects = localStorageService.getProjects()
    const index = projects.findIndex(p => p.id === id)
    
    if (index === -1) return null
    
    const updatedProject = {
      ...projects[index],
      ...updates,
      updatedAt: new Date()
    }
    
    projects[index] = updatedProject
    localStorage.setItem('projects', JSON.stringify(projects))
    return updatedProject
  },

  deleteProject: (id: string): boolean => {
    const projects = localStorageService.getProjects()
    const index = projects.findIndex(p => p.id === id)

    if (index === -1) return false

    projects.splice(index, 1)
    localStorage.setItem('projects', JSON.stringify(projects))
    return true
  },

  getShipmentLogs: (): ShipmentLog[] => {
    const data = localStorage.getItem('shipmentLogs')
    if (!data) return []
    
    const shipments = JSON.parse(data)
    // Convert date strings back to Date objects
    return shipments.map((shipment: any) => ({
      ...shipment,
      dateReceived: new Date(shipment.dateReceived),
      createdAt: new Date(shipment.createdAt),
      updatedAt: new Date(shipment.updatedAt)
    }))
  },

  createShipmentLog: (shipmentData: Omit<ShipmentLog, 'id' | 'createdAt' | 'updatedAt'>): ShipmentLog => {
    const shipments = localStorageService.getShipmentLogs()
    const newShipment: ShipmentLog = {
      ...shipmentData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    shipments.push(newShipment)
    localStorage.setItem('shipmentLogs', JSON.stringify(shipments))
    return newShipment
  },

  updateShipmentLog: (id: string, updates: Partial<ShipmentLog>): ShipmentLog | null => {
    const shipments = localStorageService.getShipmentLogs()
    const index = shipments.findIndex(s => s.id === id)
    
    if (index === -1) return null
    
    const updatedShipment = {
      ...shipments[index],
      ...updates,
      updatedAt: new Date()
    }
    
    shipments[index] = updatedShipment
    localStorage.setItem('shipmentLogs', JSON.stringify(shipments))
    return updatedShipment
  },

  deleteShipmentLog: (id: string): boolean => {
    const shipmentLogs = localStorageService.getShipmentLogs()
    const index = shipmentLogs.findIndex(s => s.id === id)

    if (index === -1) return false

    shipmentLogs.splice(index, 1)
    localStorage.setItem('shipmentLogs', JSON.stringify(shipmentLogs))
    return true
  },
}
