export interface DevProfileFilter {
  passed: {
    passed: boolean
    notAssessed: boolean
    failed: boolean
  }
  challengePassed: {
    passed: boolean
    notPassed: boolean
    unknown: boolean
  }
}
