"use client"

import { useState, useMemo } from "react"
import { Search, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar, Activity, Heart, Thermometer, Pill, Clock, BarChart3, Users, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface PatientVitals {
  heartRate: number
  bloodPressure: string
  temperature: number
  oxygenSat: number
}

interface RiskFactor {
  factor: string
  contribution: number
  type: "positive" | "negative"
}

interface Patient {
  id: string
  name: string
  age: number
  riskScore: number
  riskLevel: string
  riskFactors: RiskFactor[]
  vitals: PatientVitals
  medications: string[]
  lastVisit: string
  avatar: string
}

interface RiskFactorBarProps {
  factor: string
  contribution: number
  type: "positive" | "negative"
}

const patientDataString = `a72f495b-dfd7-71aa-5e77-efd884256012	34.87	Medium Risk
dfd43c45-3f68-67c0-a83a-f67c31a8980f	18.01	Low Risk
f6af3b5f-ed6c-8b97-3b89-15503778a530	7.79	Low Risk
3f039709-4a77-c479-cb57-d1dcfee29bd8	18	Low Risk
2d05f567-eafd-94e0-9fed-8ecf367775bc	30.94	Medium Risk
dd569279-46a2-bf99-b248-76fa16ab3124	14.95	Low Risk
ba3a914f-b285-cd48-935b-f725be310572	14.81	Low Risk
c5417e90-01e4-d088-dad9-53526e73fdd9	12.07	Low Risk
30a613e5-6f36-e89c-005c-fcba823d75b7	12.07	Low Risk
2df9ad01-fed2-b29a-e286-ca18e3143d24	29.71	Medium Risk
51575101-59d0-da7f-8a6b-a95fa3f6af11	11.81	Low Risk
d8093acd-15af-0072-bb64-3ef87276e8ce	18.29	Low Risk
79e287e5-d908-89be-8b5e-c46435d7ddf9	10.12	Low Risk
c39924aa-31ba-acc8-31bf-68acc8937231	13.95	Low Risk
34f0967a-ffc4-1cac-369b-4ac0e6ed9fd6	13.95	Low Risk
d3d0c5a6-d0fc-dbe7-2cae-b72bd5b36cf1	28.74	Medium Risk
a6895408-303a-6a03-a202-e2e828467d62	40.92	Medium Risk
164d4d72-709c-9a01-78ae-b63c06b45ed7	51.28	High Risk
4e7e0a10-634c-8d82-a874-8ae111c2ca9b	12.28	Low Risk`

const parsedPatients: Patient[] = patientDataString
  .split("\n")
  .map((line) => line.trim().split("\t"))
  .filter((parts) => parts.length === 3 && !parts[0].includes("Patient ID"))
  .map((parts, index) => {
    const [id, riskScoreStr, riskLevel] = parts
    const riskScore = Math.round(Number.parseFloat(riskScoreStr))

    const fullNames = [
      "Emma Johnson",
      "Liam Williams",
      "Olivia Brown",
      "Noah Jones",
      "Ava Garcia",
      "Ethan Miller",
      "Sophia Davis",
      "Mason Rodriguez",
      "Isabella Martinez",
      "William Hernandez",
      "Mia Lopez",
      "James Gonzalez",
      "Charlotte Wilson",
      "Benjamin Anderson",
      "Amelia Thomas",
      "Lucas Taylor",
      "Harper Moore",
      "Henry Jackson",
      "Evelyn Martin",
      "Alexander Thompson",
      "Abigail White",
      "Michael Harris",
      "Emily Clark",
      "Daniel Lewis",
      "Elizabeth Robinson",
    ]

    const fullName = fullNames[index % fullNames.length]
    const age = 25 + ((index * 3) % 50)

    let riskFactors: RiskFactor[] = []
    let vitals: PatientVitals
    let medications: string[] = []
    let lastVisit = ""

    if (riskLevel === "High Risk") {
      riskFactors = [
        { factor: "Abnormal Vital Signs Pattern", contribution: 25, type: "negative" },
        { factor: "Poor Medication Adherence", contribution: 20, type: "negative" },
        { factor: "Recent Hospitalization", contribution: 15, type: "negative" },
      ]
      vitals = { heartRate: 95, bloodPressure: "145/92", temperature: 99.2, oxygenSat: 94 }
      medications = ["Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg"]
      lastVisit = "2 days ago"
    } else if (riskLevel === "Medium Risk") {
      riskFactors = [
        { factor: "Inconsistent Lab Results", contribution: 18, type: "negative" },
        { factor: "Lifestyle Choices", contribution: 12, type: "negative" },
        { factor: "Stable Vitals", contribution: 10, type: "positive" },
      ]
      vitals = { heartRate: 78, bloodPressure: "128/82", temperature: 98.6, oxygenSat: 97 }
      medications = ["Amlodipine 5mg", "Simvastatin 20mg"]
      lastVisit = "1 week ago"
    } else {
      riskFactors = [
        { factor: "High Medication Adherence", contribution: 15, type: "positive" },
        { factor: "Consistent Vitals", contribution: 10, type: "positive" },
        { factor: "No recent adverse events", contribution: 8, type: "positive" },
      ]
      vitals = { heartRate: 72, bloodPressure: "118/76", temperature: 98.4, oxygenSat: 99 }
      medications = ["Multivitamin", "Vitamin D3"]
      lastVisit = "2 weeks ago"
    }

    return {
      id: id,
      name: fullName,
      age,
      riskScore: riskScore,
      riskLevel: riskLevel.replace(" Risk", ""),
      riskFactors: riskFactors,
      vitals,
      medications,
      lastVisit,
      avatar: `/placeholder.svg?height=40&width=40&query=${fullName.replace(" ", "+")}+patient+photo`,
    }
  })

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient>(parsedPatients[0])
  const [riskFilter, setRiskFilter] = useState("All")

  const filteredPatients = useMemo(() => {
    let filtered = parsedPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (riskFilter !== "All") {
      filtered = filtered.filter((p) => p.riskLevel === riskFilter)
    }

    return filtered
  }, [searchTerm, riskFilter])

  const dashboardStats = useMemo(() => {
    const total = parsedPatients.length
    const highRisk = parsedPatients.filter((p) => p.riskLevel === "High").length
    const mediumRisk = parsedPatients.filter((p) => p.riskLevel === "Medium").length
    const lowRisk = parsedPatients.filter((p) => p.riskLevel === "Low").length
    const avgRiskScore = Math.round(parsedPatients.reduce((sum, p) => sum + p.riskScore, 0) / total)

    return { total, highRisk, mediumRisk, lowRisk, avgRiskScore }
  }, [])

  const getRiskVariant = (level: string) => {
    if (level === "High") return "destructive"
    if (level === "Medium") return "default"
    return "default"
  }

  const getRiskColorClass = (level: string) => {
    if (level === "High") return "bg-red-600 hover:bg-red-700 border-red-800 text-white"
    if (level === "Medium") return "bg-amber-600 hover:bg-amber-700 border-amber-800 text-white"
    return "bg-green-600 hover:bg-green-700 border-green-800 text-white"
  }

  const getRiskBarColor = (level: string) => {
    if (level === "High") return "bg-red-600"
    if (level === "Medium") return "bg-amber-600"
    return "bg-green-600"
  }

  const RiskFactorBar = ({ factor, contribution, type }: RiskFactorBarProps) => (
    <div className="flex items-center space-x-3 text-sm p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      {type === "negative" ? (
        <TrendingUp className="h-5 w-5 text-red-500 flex-shrink-0" />
      ) : (
        <TrendingDown className="h-5 w-5 text-green-500 flex-shrink-0" />
      )}
      <span className="flex-1 text-muted-foreground">{factor}</span>
      <span
        className={`font-semibold ${type === "negative" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
      >
        {type === "negative" ? "+" : "-"}
        {contribution}%
      </span>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/20 text-foreground font-sans">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-md px-4 md:px-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6 text-primary"
            >
              <path d="M3.85 8.62a4 4 0 0 1 6.3 -1.8L12 8.4l1.85-1.58a4 4 0 0 1 6.3 1.8" />
              <path d="M4 14.5a4 4 0 0 0 6.32 1.85L12 14.8l1.68 1.55a4 4 0 0 0 6.32-1.85" />
              <line x1="12" x2="12" y1="2" y2="22" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Care<span className="text-primary">Sentinel</span>
            </h1>
            <p className="text-xs text-muted-foreground">Patient Risk Management System</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{dashboardStats.total}</span>
              <span className="text-muted-foreground">Patients</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-medium text-red-600 dark:text-red-400">{dashboardStats.highRisk}</span>
              <span className="text-muted-foreground">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{dashboardStats.avgRiskScore}%</span>
              <span className="text-muted-foreground">Avg Risk</span>
            </div>
          </div>
          <ThemeToggle />
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>
      </header>

      <main className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 md:p-6 h-[calc(100vh-64px)]">
        <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col gap-4 h-full">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">{dashboardStats.highRisk}</div>
                  <div className="text-xs text-muted-foreground">High</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-600">{dashboardStats.mediumRisk}</div>
                  <div className="text-xs text-muted-foreground">Medium</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{dashboardStats.lowRisk}</div>
                  <div className="text-xs text-muted-foreground">Low</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Patient Cohort</CardTitle>
              <CardDescription>Select a patient to view details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-1">
                {["All", "High", "Medium", "Low"].map((filter) => (
                  <Button
                    key={filter}
                    variant={riskFilter === filter ? "default" : "outline"}
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setRiskFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex-grow overflow-y-auto space-y-2 pr-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 border hover:shadow-md ${
                  selectedPatient?.id === patient.id
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-md"
                    : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <Avatar className="h-12 w-12 mr-3 border-2 border-background shadow-sm">
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-sm text-black dark:text-white truncate">{patient.name}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-200">
                    Age {patient.age} • {patient.lastVisit}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <p className="font-bold text-lg text-black dark:text-white">
                    {patient.riskScore}
                    <span className="text-black dark:text-white">%</span>
                  </p>
                  <Badge
                    variant={getRiskVariant(patient.riskLevel)}
                    className={`text-xs ${getRiskColorClass(patient.riskLevel)}`}
                  >
                    {patient.riskLevel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 h-full overflow-y-auto pr-2">
          {selectedPatient ? (
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-card to-muted/20 border-primary/20">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                      <AvatarImage src={selectedPatient.avatar || "/placeholder.svg"} alt={selectedPatient.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {selectedPatient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{selectedPatient.name}</CardTitle>
                      <CardDescription className="text-base">
                        Age {selectedPatient.age} • ID: {selectedPatient.id.substring(0, 8)}...
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Last visit: {selectedPatient.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`mt-2 md:mt-0 px-6 py-3 text-base font-semibold border-2 ${getRiskColorClass(selectedPatient.riskLevel)}`}
                  >
                    <AlertTriangle className="inline-block h-5 w-5 mr-2" />
                    {selectedPatient.riskLevel.toUpperCase()} RISK
                  </Badge>
                </CardHeader>
              </Card>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="vitals" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Vitals
                  </TabsTrigger>
                  <TabsTrigger value="medications" className="flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Medications
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        90-Day Deterioration Risk
                      </CardTitle>
                      <CardDescription>Probability of adverse event within the next 90 days</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="relative h-48 w-48 flex-shrink-0">
                        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-muted stroke-current"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`${getRiskBarColor(selectedPatient.riskLevel).replace("bg-", "text-")} stroke-current`}
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={`${selectedPatient.riskScore}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-bold text-foreground">{selectedPatient.riskScore}%</span>
                          <span className="text-sm text-muted-foreground">Risk Score</span>
                        </div>
                      </div>
                      <div className="flex-1 w-full space-y-4">
                        <h4 className="font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-primary" />
                          Key Risk Drivers
                        </h4>
                        {selectedPatient.riskFactors.map((factor, i) => (
                          <RiskFactorBar key={i} {...factor} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vitals" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
                      <CardContent className="p-6 text-center">
                        <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                          {selectedPatient.vitals.heartRate}
                        </div>
                        <div className="text-sm text-red-600 dark:text-red-500">BPM</div>
                        <div className="text-xs text-muted-foreground mt-1">Heart Rate</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                      <CardContent className="p-6 text-center">
                        <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                          {selectedPatient.vitals.bloodPressure}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-500">mmHg</div>
                        <div className="text-xs text-muted-foreground mt-1">Blood Pressure</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
                      <CardContent className="p-6 text-center">
                        <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                          {selectedPatient.vitals.temperature}°
                        </div>
                        <div className="text-sm text-orange-600 dark:text-orange-500">Fahrenheit</div>
                        <div className="text-xs text-muted-foreground mt-1">Temperature</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
                      <CardContent className="p-6 text-center">
                        <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                          {selectedPatient.vitals.oxygenSat}%
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-500">SpO2</div>
                        <div className="text-xs text-muted-foreground mt-1">Oxygen Saturation</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="medications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        Current Medications
                      </CardTitle>
                      <CardDescription>Active prescriptions and supplements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPatient.medications.map((medication, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <Pill className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{medication}</div>
                                <div className="text-sm text-muted-foreground">Daily</div>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Patient care timeline and events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Routine Check-up</div>
                            <div className="text-sm text-muted-foreground">{selectedPatient.lastVisit}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Vitals recorded, medication review completed
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Lab Results Reviewed</div>
                            <div className="text-sm text-muted-foreground">3 weeks ago</div>
                            <div className="text-sm text-muted-foreground mt-1">All values within normal range</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Risk Assessment Updated</div>
                            <div className="text-sm text-muted-foreground">1 month ago</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Risk level adjusted based on recent trends
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="flex items-center justify-center h-full bg-gradient-to-br from-muted/20 to-muted/40">
              <CardContent className="text-center text-muted-foreground p-10">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">Select a Patient</h3>
                <p>Choose a patient from the list to view their detailed information and risk assessment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
