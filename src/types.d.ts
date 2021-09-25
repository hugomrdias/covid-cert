export interface Cert {
  image: string
  data: Payload
}

export interface Payload {
  issuer: string
  issuedAt: Date
  expirationDate: Date
  dateOfBirth: string
  name: string
  schemaVersion: string
  vaccination?: VaccinationEntry
}

export interface VaccinationEntry {
  diseaseAgentTargeted: string
  vaccineProphylaxis: string
  vaccineMedicinalProduct: string
  manufacturer: string
  doseNumber: number
  totalDoses: number
  date: string
  country: string
  issuer: string
  certId: string
}

export interface VaccinationEntryRaw {
  tg: string
  vp: string
  mp: string
  ma: string
  dn: number
  sd: number
  dt: string
  co: string
  is: string
  ci: string
}
