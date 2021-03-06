const express = require('express')
const app = express()
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')
const { response } = require('express')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'sheyiladzee',
    database : 'smart-brain'
  }
})


app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send(database.users)
})
 
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if (isValid) {
                db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(() => res.status(400).json('unable to get user'))
            } else {res.status(400).json('credentials invalid')}
        })
        .catch( () => { res.status(400).json('wrong credential')})
    
})
app.post('/register', (req, res) => {
    const { email, name, password } = req.body
    const hash = bcrypt.hashSync(password)
    
    db.transaction(trx => {
        trx.insert({
            hash,
            email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.status(200).json(user[0])
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
        
    }).catch(() => res.status(400).json('unable to register'))
        
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    db.select('*').from('users').where({id})
        .then( users => {
            if( users.length){
                res.status(200).json(users[0])
            } else {
                res.status(400).json("not found")
            }
        })
        .catch(() => {
            res.status(400).json('error getting user')
        })
})

app.put('/image', (req, res) => {
    const { id } = req.body
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {res.json(entries[0])})
    .catch(err => {res.status(400).json('error getting user')})
})





app.listen(3001, ()=>{
    console.log('app is running on port 3001')
})