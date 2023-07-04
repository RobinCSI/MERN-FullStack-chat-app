const jwt=require('jsonwebtoken')

const generateToken=(id)=>{
    return jwt.sign({id}, 'robin', {
        expiresIn: '30d'
    })   
}

module.exports=generateToken