package com.manager

class Plant {
	Integer plantId
	String scientificName
	String commonName
	String cultivar
	String photo64
	
    static constraints = {
    }
	
	static mapping = {
		photo64 sqlType:'text'
		id generator: 'sequence',
		   name: 'plantId'
	}
}
