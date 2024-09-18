const express = require ('express');
const { userLogin, tokenVerificationMiddleware, getLoginData } = require('./controller');

const Login = new express.Router();

Login.post('/api/login', userLogin)
Login.post('/api/verify', tokenVerificationMiddleware, getLoginData)

module.exports = {Login}