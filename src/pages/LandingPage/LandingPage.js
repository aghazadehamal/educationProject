import React from 'react'
import Navbar from './NavBar/Navbar'
import CampaignSection from './CampaignSection/CampaignSection'
import WhyUsSection from './WhyUsSection/WhyUsSection'

import CourseModulesSection from './CourseModulesSection/CourseModulesSection'

import Footer from './Footer/Footer'
import FaqSection from './FaqSection/FaqSection'
import AboutAs from './AboutAs/AboutAs'

const LandingPage = () => {
  return (
    <div>
        <Navbar/>
        <CampaignSection/>
        <WhyUsSection/>
       <AboutAs/>
        <CourseModulesSection/>
      <FaqSection/>
       <Footer/>
      
    </div>
  )
}

export default LandingPage
