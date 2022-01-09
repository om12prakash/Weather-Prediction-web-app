const path= require('path')
const express=require('express')
const hbs=require('hbs')
const geocode=require('./utils/geocode.js')
const forecast=require('./utils/forecast.js')
const { resolve } = require('url')

const app=express()
const port = process.env.PORT || 3000

//define paths for express config
const pubicDirectoryPath=path.join(__dirname, '../pubic')
const viewsPath= path.join(__dirname, '../templates/views')
const partialsPath= path.join(__dirname,'../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(path.join(__dirname,'../public')))

app.get('',(req,res)=>{
    res.render('index',{
        title:'Weather',
        name:'Om Prakash Yadav'
    })
})

app.get('/about', (req,res)=>{
    res.render('about',{
        title:'About me',
        name:'Om Prakash Yadav'
    })
})

app.get('/help', (req,res)=>{
    res.render('help',{
        title:'contact',
        name:'9838734589'
    })
})

app.get('/weather', (req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'You must provide a address.'
        })
    }
    command=req.query.address
    geocode(command, (error,data)=>{
        if(error){
            return res.send({
                error
            })
        }

        forecast(data.latitude, data.longitude, (error, forecastdata) => {
            if(error){
                return res.send({
                    error
                })
            }

            res.send({
                location:data.location,
                forecastdata:forecastdata
            })    
        })
          
    })   
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:'You must provide a search term.'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404',
        para:'help page not found',
        name:'Hrshit'
    })
} )

app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        para:'404 page not found',
        name:'Hrshit'
    })
} )

app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})
