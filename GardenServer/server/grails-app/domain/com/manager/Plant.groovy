package com.manager

class Plant {
	String scientificName
	String commonName
	String cultivar
	String photo64
	
    static constraints = {
		cultivar nullable: true
		photo64 nullable: true
    }
	
	static mapping = {
		photo64 sqlType:'text'
	}
}
