const express = require('express')
const app = express()
const path = require('path')
require("dotenv").config()
const cors = require("cors")

const{ ROLLBARTOKEN } = process.env


app.use(express.json())
app.use(cors())

const pokemon = ['Rayqauza', 'Totodile', 'Charizard']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/pokemon', (req, res) => {
    res.status(200).send(pokemon)
})

app.post('/api/pokemon', (req, res) => {
   let {name} = req.body
   rollbar.log(name)

   const index = pokemon.findIndex(pokemon => {
       return pokemon === name
   })

   try {
       if (index === -1 && name !== '') {
           pokemon.push(name)
           res.status(200).send(pokemon)
       } else if (name === ''){
           res.status(400).send('You must enter a name.')
           rollbar.error('user needs to enter pokemon name')
       } else {
           res.status(400).send('That pokemon already exists.')
           rollbar.info('pokemon already exists')
       }
   } catch (err) {
       console.log(err)
       rollbar.error('error 501')
   }
})

app.delete('/api/pokemon/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    pokemon.splice(targetIndex, 1)
    res.status(200).send(pokemon)
    rollbar.info('success')
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
rollbar.warning('website is up')

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: ROLLBARTOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')
