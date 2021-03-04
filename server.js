const express = require('express')
const app = express()
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

app.use(express.json())
app.use(cors())


const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com',
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})
 
app.post('/signin', (req, res) => {
    console.log(req.body, typeof req.body)
    // bcrypt.compare("sheyiladzee", "$2a$10$36fAZYgkNY4lX.bH0hQeaeomIo010kDfcFxHRFq.XNoUmDglCn8Wu", function(err, res) {
    //     console.log('the answer of hash comparing is ', res)
    // })
    // bcrypt.compare("veggies", "$2a$10$36fAZYgkNY4lX.bH0hQeaeomIo010kDfcFxHRFq.XNoUmDglCn8Wu", function(err, res) {
    //     console.log('this should throw error', res)
    // })
    
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0])
        } else {
            res.status(400).json('error login in')
        }
    
})
app.post('/register', (req, res) => {
    const { email, name, password } = req.body
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash)
    })

    database.users.push({
        ...{id: 125,
        name: 'John',
        email: 'john@gmail.com',
        entries: 0,
        joined: new Date()},
        email,
        name,
    }
        
    )
    res.status(200).json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    let found = false
    database.users.forEach( user => {
        if (Number(user.id) === Number(id)) {
            found = true
            return res.json(user)
        }
    })
    if (!found) {
        res.status(400).json('not found')
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body
    let found = false
    database.users.forEach( user => {
        if (user.id === id) {
            found = true
            user.entries ++
            return res.json(user.entries)
        }
    })
    if (!found) {
        res.status(400).json('not found')
    }
})








app.listen(3001, ()=>{
    console.log('app is running on port 3001')
})