import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
//import { Button } from './Button'
import './Tutorial.css'
import '../App.css';


function Tutorial() {
  return (
    <div>
            <Box className='tutorial-form'>
                <Typography className='typography' variant='h2'>Tutorial</Typography>
                <li>
                <i>What is Instant Traveller's Diary?</i> </li>
                <p>It's a website where you can document your journeys. 
                <li>What is it about and how it works?</li>
                You can document your adventure by creating <i>journey</i>. You can add photo, mark time period and add description for your it.
                You can also edit and delete it if you like. 
                You can distinguish important parts of your journey by adding <i>stages</i> to it. You can name it however you like, 
                give it a time period, add photo and create description. 
                You can do even more! To document your journey better, you can also add multiple events to your stages.
                You can mark places of those events on map to remember important places and then see it in journey or stage. 
                <li>What's more?</li>
                For better experience, you can customize your profile to your likes! You can also share your journey with friends.
                Go check it out! 
                </p>
                <div>
            </div>
            </Box>
    </div>
  )
}

export default Tutorial