import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

class CowinDashboard extends Component {
  state = {
    isLoading: true,
    error: false,
    barChartData: [],
    genderData: [],
    ageData: [],
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({isLoading: true})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      console.log('success')
      const data = await response.json()
      const formattedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      const {
        last7DaysVaccination,
        vaccinationByAge,
        vaccinationByGender,
      } = formattedData
      console.log(vaccinationByGender)
      console.log(vaccinationByAge)
      this.setState({
        isLoading: false,
        barChartData: last7DaysVaccination,
        genderData: vaccinationByGender,
        ageData: vaccinationByAge,
      })
    } else {
      console.log('failure')
      this.setState({isLoading: false, error: true})
    }
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderSuccessView = () => {
    const {barChartData, genderData, ageData} = this.state
    const formattedBarChartData = barChartData.map(each => ({
      vaccineDate: each.vaccine_date,
      dose1: each.dose_1,
      dose2: each.dose_2,
    }))

    return (
      <>
        <VaccinationCoverage formattedBarChartData={formattedBarChartData} />
        <VaccinationByGender vaccinationByGender={genderData} />
        <VaccinationByAge vaccinationByAge={ageData} />
      </>
    )
  }

  renderChartView = () => {
    const {error} = this.state
    if (error === true) {
      return this.renderFailureView()
    }
    return this.renderSuccessView()
  }

  render() {
    const {isLoading} = this.state

    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
        <p>Co-WIN</p>
        <h1>CoWIN Vaccination in India</h1>
        {isLoading ? (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#000000" height={80} width={80} />
          </div>
        ) : (
          this.renderChartView()
        )}
      </div>
    )
  }
}

export default CowinDashboard
