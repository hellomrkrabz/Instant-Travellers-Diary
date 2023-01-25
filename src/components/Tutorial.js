import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import './Tutorial.css'
import '../App.css'

function Tutorial() {
  return (
    <div>
      <Box className='tutorial-form'>
            <Typography className='typography' variant='h2'>Tutorial</Typography>
            <li>
            <i>What is Instant Traveller's Diary?</i> </li>
            <p>It's a website where you can document your journeys. </p>
            <li>How to start?</li>
            Start by register new user clicking on "Get started" on main page or on "Register" in the right top corner.
            After that, following will display:
            <img src="/images_tutorial\signup.png" alt="signup" width="200" class="center"></img>
            Then, you need to login:
            <img src="/images_tutorial\login.png" alt="login" width="200" class="center"></img>
            Now you can see your profile!
            <img src="/images_tutorial\profile.png" alt="profile" width="400" height = "242.927" class="center"></img>
            You can also edit your profile to your likes:
            <img src="/images_tutorial\profileedit.png" alt="profileedit" width="500" height = "299.427" class="center"></img>

            <li>Great! Let's start!</li>
            <p>Start from creating a journey:</p>
            <img src="/images_tutorial\addingjourney.png" alt="addingjourney" width="400" class="center"></img>
            You can add multiple journeys:
            <img src="/images_tutorial\journeyview.png" alt="journeyview" width="500" class="center"></img>
            And in each journey you can add stage to it:
            <img src="/images_tutorial\addingstage.png" alt="addingstage" width="400" class="center"></img>
            Now you can see each stage of your journey to remember it even better:
            <img src="/images_tutorial\stagesview.png" alt="stagesview" width="200" class="center"></img>
            What's more? You can add view to your stage to document it more accurately by adding exact place and expense of it:
            <img src="/images_tutorial\creatingview.png" alt="creatingview" width="500" class="center"></img>
            It looks very similar to other parts:
            <img src="/images_tutorial\eventview.png" alt="eventview" width="200" class="center"></img>
            To be more accurate, you can add site to your event and describe it however you like:
            <img src="/images_tutorial\site.png" alt="site" width="300" class="center"></img>
      </Box>
    </div>
  )
}

export default Tutorial