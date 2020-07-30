package com.manager

class Storage {
	String description
	String photo64
	
    static constraints = {
		description blank: false
		photo64 blank: false
    }
	
	static mapping = {
		photo64 sqlType:'text'
	}
}
