package com.manager

class Person {
	String personEmail
	String username
	String password
	
    static constraints = {
		personEmail unique: true
		personEmail email: true
		// five to fifteen characters, at least one letter and one number:
		//username matches: "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,15}$"
		username unique: true
		// five to eight characters, at least one uppercase letter, one lowercase letter and one number:
		//password matches: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,8}$"
    }
}
