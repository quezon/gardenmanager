package com.manager

class GardenTool {
    String toolName
	String manufacturer
	String photo64
	Date dateAcquired
	Double cost
	Storage storage
	
    static constraints = {
    }
	
	static mapping = {
		photo64 sqlType:'text'
		dateAcquired defaultValue: "now()"
	}
}
